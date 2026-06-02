import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import postgres from "postgres";
import * as ts from "typescript";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

type Status = "PASS" | "FAIL";
type Category =
  | "PREREQUISITES"
  | "DATABASE_TYPES"
  | "DATABASE"
  | "TABLES"
  | "COLUMNS"
  | "MIGRATIONS";

type NormalizedTsType = "string" | "number" | "boolean" | "Json" | "unsupported";

interface AuditResult {
  category: Category;
  check: string;
  status: Status;
  message: string;
}

interface ExpectedColumn {
  name: string;
  tsTypeRaw: string;
  normalizedType: NormalizedTsType;
  nullable: boolean;
}

interface ExpectedTable {
  name: string;
  columns: Record<string, ExpectedColumn>;
}

interface ExpectedSchema {
  tables: Record<string, ExpectedTable>;
}

interface LiveColumn {
  tableName: string;
  columnName: string;
  dataType: string;
  udtName: string;
  isNullable: boolean;
}

interface LiveTable {
  name: string;
  columns: Record<string, LiveColumn>;
}

interface LiveSchema {
  tables: Record<string, LiveTable>;
}

interface MigrationState {
  localVersions: string[];
  appliedVersions: string[];
}

interface AuditContext {
  db: postgres.Sql<{}> | null;
  databaseTypesPath: string | null;
  expectedSchema: ExpectedSchema;
  liveSchema: LiveSchema;
  migrationState: MigrationState;
  results: AuditResult[];
}

const context: AuditContext = {
  db: null,
  databaseTypesPath: null,
  expectedSchema: { tables: {} },
  liveSchema: { tables: {} },
  migrationState: { localVersions: [], appliedVersions: [] },
  results: [],
};

function addResult(category: Category, check: string, status: Status, message: string) {
  context.results.push({ category, check, status, message });
}

function findDatabaseTypesPaths(dir: string): string[] {
  const discovered: string[] = [];
  const ignoredDirs = new Set([
    ".git",
    ".next",
    "node_modules",
    ".turbo",
    ".cache",
    "dist",
    "build",
    "coverage",
  ]);

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) {
          walk(fullPath);
        }
        continue;
      }

      if (entry.isFile() && entry.name === "database.types.ts") {
        discovered.push(fullPath);
      }
    }
  }

  walk(dir);
  return discovered.sort();
}

function chooseCanonicalDatabaseTypesPath(paths: string[]): string | null {
  if (paths.length === 0) {
    return null;
  }

  const srcCandidate = paths.find((candidate) =>
    candidate.split(path.sep).join("/").endsWith("src/types/database.types.ts")
  );

  return srcCandidate ?? paths[0];
}

function getPropertyName(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function findProperty(
  typeLiteral: ts.TypeLiteralNode,
  propertyName: string
): ts.PropertySignature | null {
  for (const member of typeLiteral.members) {
    if (!ts.isPropertySignature(member) || !member.name) {
      continue;
    }

    const candidateName = getPropertyName(member.name);
    if (candidateName === propertyName) {
      return member;
    }
  }

  return null;
}

function requireTypeLiteral(
  property: ts.PropertySignature | null,
  errorMessage: string
): ts.TypeLiteralNode {
  if (!property?.type || !ts.isTypeLiteralNode(property.type)) {
    throw new Error(errorMessage);
  }
  return property.type;
}

function getTypeNodeText(sourceFile: ts.SourceFile, node: ts.TypeNode): string {
  return node.getText(sourceFile).trim();
}

function isNullTypeNode(typeNode: ts.TypeNode): boolean {
  return (
    typeNode.kind === ts.SyntaxKind.NullKeyword ||
    (ts.isLiteralTypeNode(typeNode) && typeNode.literal.kind === ts.SyntaxKind.NullKeyword)
  );
}

function normalizeTypeNode(typeNode: ts.TypeNode): { normalizedType: NormalizedTsType; nullable: boolean } {
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return normalizeTypeNode(typeNode.type);
  }

  if (ts.isUnionTypeNode(typeNode)) {
    let nullable = false;
    const nonNullTypes = typeNode.types.filter((member) => {
      if (isNullTypeNode(member)) {
        nullable = true;
        return false;
      }
      return true;
    });

    if (nonNullTypes.length !== 1) {
      return { normalizedType: "unsupported", nullable };
    }

    const normalized = normalizeTypeNode(nonNullTypes[0]);
    return {
      normalizedType: normalized.normalizedType,
      nullable: nullable || normalized.nullable,
    };
  }

  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return { normalizedType: "string", nullable: false };
    case ts.SyntaxKind.NumberKeyword:
      return { normalizedType: "number", nullable: false };
    case ts.SyntaxKind.BooleanKeyword:
      return { normalizedType: "boolean", nullable: false };
    default:
      break;
  }

  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    if (typeNode.typeName.text === "Json") {
      return { normalizedType: "Json", nullable: false };
    }
  }

  return { normalizedType: "unsupported", nullable: false };
}

function parseExpectedSchema(typesPath: string): ExpectedSchema {
  const sourceText = fs.readFileSync(typesPath, "utf-8");
  const sourceFile = ts.createSourceFile(typesPath, sourceText, ts.ScriptTarget.Latest, true);

  let databaseTypeLiteral: ts.TypeLiteralNode | null = null;

  for (const statement of sourceFile.statements) {
    if (!ts.isTypeAliasDeclaration(statement) || statement.name.text !== "Database") {
      continue;
    }

    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      continue;
    }

    if (!ts.isTypeLiteralNode(statement.type)) {
      throw new Error("Database export exists but is not a type literal");
    }

    databaseTypeLiteral = statement.type;
    break;
  }

  if (!databaseTypeLiteral) {
    throw new Error("Database export missing in database.types.ts");
  }

  const publicProperty = findProperty(databaseTypeLiteral, "public");
  const publicTypeLiteral = requireTypeLiteral(publicProperty, "Database.public missing or not a type literal");

  const tablesProperty = findProperty(publicTypeLiteral, "Tables");
  const tablesTypeLiteral = requireTypeLiteral(tablesProperty, "Database.public.Tables missing or not a type literal");

  const tables: Record<string, ExpectedTable> = {};

  for (const member of tablesTypeLiteral.members) {
    if (!ts.isPropertySignature(member) || !member.name) {
      continue;
    }

    const tableName = getPropertyName(member.name);
    if (!tableName) {
      continue;
    }

    const tableTypeLiteral = requireTypeLiteral(member, `Table ${tableName} is not a type literal`);
    const rowProperty = findProperty(tableTypeLiteral, "Row");
    const rowTypeLiteral = requireTypeLiteral(rowProperty, `Table ${tableName} is missing Row definition`);
    const columns: Record<string, ExpectedColumn> = {};

    for (const rowMember of rowTypeLiteral.members) {
      if (!ts.isPropertySignature(rowMember) || !rowMember.name || !rowMember.type) {
        continue;
      }

      const columnName = getPropertyName(rowMember.name);
      if (!columnName) {
        continue;
      }

      const tsTypeRaw = getTypeNodeText(sourceFile, rowMember.type);
      const normalizedType = normalizeTypeNode(rowMember.type);

      columns[columnName] = {
        name: columnName,
        tsTypeRaw,
        normalizedType: normalizedType.normalizedType,
        nullable: normalizedType.nullable,
      };
    }

    tables[tableName] = {
      name: tableName,
      columns,
    };
  }

  return { tables };
}

function getTableNames(schema: ExpectedSchema | LiveSchema): string[] {
  return Object.keys(schema.tables).sort();
}

function expectedColumnsForTable(tableName: string): ExpectedColumn[] {
  const table = context.expectedSchema.tables[tableName];
  if (!table) {
    return [];
  }
  return Object.values(table.columns).sort((a, b) => a.name.localeCompare(b.name));
}

function matchesNormalizedType(normalizedType: NormalizedTsType, udtName: string, dataType: string): boolean {
  switch (normalizedType) {
    case "string":
      return [
        "bpchar",
        "char",
        "date",
        "text",
        "time",
        "timetz",
        "timestamp",
        "timestamptz",
        "uuid",
        "varchar",
        "vector",
      ].includes(udtName);
    case "number":
      return ["float4", "float8", "int2", "int4", "int8", "numeric"].includes(udtName);
    case "boolean":
      return udtName === "bool";
    case "Json":
      return ["json", "jsonb"].includes(udtName) || ["json", "jsonb"].includes(dataType);
    case "unsupported":
      return false;
  }
}

async function loadLiveSchema() {
  if (!context.db) {
    return;
  }

  const tableRows = await context.db`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name ASC
  `;

  const columnRows = await context.db`
    SELECT table_name, column_name, data_type, udt_name, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name ASC, ordinal_position ASC
  `;

  const tables: Record<string, LiveTable> = {};

  for (const row of tableRows) {
    tables[row.table_name] = {
      name: row.table_name,
      columns: {},
    };
  }

  for (const row of columnRows) {
    if (!tables[row.table_name]) {
      continue;
    }

    tables[row.table_name].columns[row.column_name] = {
      tableName: row.table_name,
      columnName: row.column_name,
      dataType: row.data_type,
      udtName: row.udt_name,
      isNullable: row.is_nullable === "YES",
    };
  }

  context.liveSchema = { tables };
}

function loadLocalMigrationVersions() {
  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    addResult("MIGRATIONS", "check_migration_drift", "FAIL", "supabase/migrations directory missing");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  const versions: string[] = [];
  for (const file of files) {
    const [version] = file.split("_");
    if (!version) {
      addResult("MIGRATIONS", "check_migration_drift", "FAIL", `Unable to extract migration version from ${file}`);
      continue;
    }
    versions.push(version);
  }

  context.migrationState.localVersions = versions;
}

async function loadAppliedMigrationVersions() {
  if (!context.db) {
    return;
  }

  const rows = await context.db`
    SELECT version
    FROM supabase_migrations.schema_migrations
    ORDER BY version ASC
  `;

  context.migrationState.appliedVersions = rows.map((row) => String(row.version));
}

async function auditPrerequisites() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    addResult("PREREQUISITES", "check_env_database_url", "PASS", "DATABASE_URL configured");
  } else {
    addResult("PREREQUISITES", "check_env_database_url", "FAIL", "DATABASE_URL missing");
    return;
  }

  try {
    context.db = postgres(dbUrl, { max: 1, idle_timeout: 1 });
    await context.db`SELECT 1`;
    addResult("PREREQUISITES", "check_connection", "PASS", "Database connection established");
  } catch (err: any) {
    addResult("PREREQUISITES", "check_connection", "FAIL", `Database connection failed: ${err.message}`);
  }
}

async function auditDatabaseTypes() {
  const discoveredPaths = findDatabaseTypesPaths(process.cwd());
  const canonicalPath = chooseCanonicalDatabaseTypesPath(discoveredPaths);

  if (!canonicalPath) {
    addResult("DATABASE_TYPES", "check_types_exist", "FAIL", "database.types.ts not found in repository");
    return;
  }

  context.databaseTypesPath = canonicalPath;
  addResult("DATABASE_TYPES", "check_types_exist", "PASS", `database.types.ts found at ${canonicalPath}`);

  try {
    context.expectedSchema = parseExpectedSchema(canonicalPath);
    const tableCount = getTableNames(context.expectedSchema).length;
    const columnCount = getTableNames(context.expectedSchema).reduce((count, tableName) => {
      return count + expectedColumnsForTable(tableName).length;
    }, 0);

    addResult(
      "DATABASE_TYPES",
      "check_types_sanity",
      "PASS",
      `AST parsed successfully (${tableCount} tables, ${columnCount} columns extracted)`
    );
  } catch (err: any) {
    addResult("DATABASE_TYPES", "check_types_sanity", "FAIL", err.message);
  }
}

async function auditDatabase() {
  if (!context.db) {
    return;
  }

  const schemas = await context.db`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name = 'public'
  `;

  if (schemas.length > 0) {
    addResult("DATABASE", "check_public_schema", "PASS", "public schema exists");
  } else {
    addResult("DATABASE", "check_public_schema", "FAIL", "public schema missing");
  }
}

async function auditTables() {
  for (const tableName of getTableNames(context.expectedSchema)) {
    if (context.liveSchema.tables[tableName]) {
      addResult("TABLES", "check_expected_tables", "PASS", `Table ${tableName} exists`);
    } else {
      addResult("TABLES", "check_expected_tables", "FAIL", `Table ${tableName} missing from public schema`);
    }
  }
}

async function auditColumns() {
  for (const tableName of getTableNames(context.expectedSchema)) {
    const liveTable = context.liveSchema.tables[tableName];
    if (!liveTable) {
      continue;
    }

    for (const expectedColumn of expectedColumnsForTable(tableName)) {
      const liveColumn = liveTable.columns[expectedColumn.name];
      if (!liveColumn) {
        addResult("COLUMNS", "check_expected_columns", "FAIL", `Column ${tableName}.${expectedColumn.name} missing`);
        continue;
      }

      addResult("COLUMNS", "check_expected_columns", "PASS", `Column ${tableName}.${expectedColumn.name} exists`);

      if (expectedColumn.normalizedType === "unsupported") {
        addResult(
          "COLUMNS",
          "check_type_alignment",
          "FAIL",
          `Column ${tableName}.${expectedColumn.name} uses unsupported TS type: ${expectedColumn.tsTypeRaw}`
        );
        continue;
      }

      if (matchesNormalizedType(expectedColumn.normalizedType, liveColumn.udtName, liveColumn.dataType)) {
        addResult(
          "COLUMNS",
          "check_type_alignment",
          "PASS",
          `Column ${tableName}.${expectedColumn.name} type matches (${expectedColumn.tsTypeRaw} <-> ${liveColumn.udtName})`
        );
      } else {
        addResult(
          "COLUMNS",
          "check_type_alignment",
          "FAIL",
          `Column ${tableName}.${expectedColumn.name} type mismatch (${expectedColumn.tsTypeRaw} <-> ${liveColumn.udtName})`
        );
      }
    }
  }
}

async function auditMigrations() {
  const existingMigrationFailures = context.results.some(
    (result) => result.category === "MIGRATIONS" && result.status === "FAIL"
  );
  if (existingMigrationFailures || !context.db) {
    return;
  }

  try {
    await loadAppliedMigrationVersions();
  } catch (err: any) {
    addResult("MIGRATIONS", "check_migration_drift", "FAIL", `Failed to read migration history: ${err.message}`);
    return;
  }

  const localVersions = new Set(context.migrationState.localVersions);
  const appliedVersions = new Set(context.migrationState.appliedVersions);
  let hasDrift = false;

  for (const version of context.migrationState.localVersions) {
    if (!appliedVersions.has(version)) {
      addResult("MIGRATIONS", "check_migration_drift", "FAIL", `Local migration ${version} is not applied to database`);
      hasDrift = true;
    }
  }

  for (const version of context.migrationState.appliedVersions) {
    if (!localVersions.has(version)) {
      addResult("MIGRATIONS", "check_migration_drift", "FAIL", `Applied migration ${version} is missing locally`);
      hasDrift = true;
    }
  }

  if (!hasDrift) {
    addResult("MIGRATIONS", "check_migration_drift", "PASS", "Local migrations match database migration history");
  }
}

function printReport() {
  const categories: Category[] = [
    "PREREQUISITES",
    "DATABASE_TYPES",
    "DATABASE",
    "TABLES",
    "COLUMNS",
    "MIGRATIONS",
  ];

  console.log("\nStarting Schema Audit V2.0...");

  for (const category of categories) {
    const categoryResults = context.results.filter((result) => result.category === category);
    if (categoryResults.length === 0) {
      continue;
    }

    console.log(`\n[${category}]`);
    for (const result of categoryResults) {
      console.log(`${result.status.padEnd(4)} ${result.check} ${result.message}`);
    }
  }

  const passCount = context.results.filter((result) => result.status === "PASS").length;
  const failCount = context.results.filter((result) => result.status === "FAIL").length;

  console.log("\nSummary:");
  console.log(`${passCount} PASS`);
  console.log(`${failCount} FAIL`);
}

async function main() {
  try {
    await auditPrerequisites();
    await auditDatabaseTypes();

    const prerequisiteFailed = context.results.some(
      (result) => result.category === "PREREQUISITES" && result.status === "FAIL"
    );

    if (!prerequisiteFailed) {
      await loadLiveSchema();
      loadLocalMigrationVersions();
      await auditDatabase();
      await auditTables();
      await auditColumns();
      await auditMigrations();
    }

    printReport();

    const hasFailures = context.results.some((result) => result.status === "FAIL");
    process.exit(hasFailures ? 1 : 0);
  } catch (error) {
    console.error("\nUnexpected schema audit failure:");
    console.error(error);
    process.exit(1);
  } finally {
    if (context.db) {
      await context.db.end();
    }
  }
}

main();
