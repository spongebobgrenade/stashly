import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".turbo",
  "dist",
  "build",
]);

const CODE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
];

type FileReport = {
  totalFiles: number;
  codeFiles: number;
  docFiles: number;
};

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  let results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(
      dir,
      entry.name
    );

    if (
      entry.isDirectory() &&
      IGNORE_DIRS.has(entry.name)
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      results.push(
        ...walk(fullPath)
      );
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

function auditFiles(
  files: string[]
): FileReport {
  const report: FileReport = {
    totalFiles: files.length,
    codeFiles: 0,
    docFiles: 0,
  };

  for (const file of files) {
    const ext =
      path.extname(file);

    if (
      CODE_EXTENSIONS.includes(
        ext
      )
    ) {
      report.codeFiles++;
    }

    if (
      ext === ".md" ||
      ext === ".json"
    ) {
      report.docFiles++;
    }
  }

  return report;
}

function findEmptyFiles(
  files: string[]
) {
  return files.filter(
    (file) =>
      fs.statSync(file).size === 0
  );
}

function findLargeFiles(
  files: string[]
) {
  return files.filter(
    (file) =>
      fs.statSync(file).size >
      100_000
  );
}

function findDuplicateNames(
  files: string[]
) {
  const map =
    new Map<
      string,
      string[]
    >();

  for (const file of files) {
    const name =
      path.basename(file);

    if (!map.has(name)) {
      map.set(name, []);
    }

    map.get(name)!.push(file);
  }

  return [...map.entries()]
    .filter(
      ([, paths]) =>
        paths.length > 1
    );
}

function findWorkerFiles(
  files: string[]
) {
  return files.filter(
    (file) =>
      file.includes(
        "/workers/"
      ) &&
      file.endsWith(".ts")
  );
}

function findScripts(
  files: string[]
) {
  return files.filter(
    (file) =>
      file.includes(
        "/scripts/"
      )
  );
}

function printSection(
  title: string
) {
  console.log(
    `\n========== ${title} ==========\n`
  );
}

function main() {
  const files = walk(ROOT);

  const report =
    auditFiles(files);

  printSection(
    "REPOSITORY SUMMARY"
  );

  console.log(
    "Total files:",
    report.totalFiles
  );

  console.log(
    "Code files:",
    report.codeFiles
  );

  console.log(
    "Documentation files:",
    report.docFiles
  );

  const emptyFiles =
    findEmptyFiles(files);

  printSection(
    "EMPTY FILES"
  );

  if (
    emptyFiles.length === 0
  ) {
    console.log(
      "None"
    );
  } else {
    emptyFiles.forEach(
      console.log
    );
  }

  const duplicates =
    findDuplicateNames(files);

  printSection(
    "DUPLICATE FILE NAMES"
  );

  if (
    duplicates.length === 0
  ) {
    console.log(
      "None"
    );
  } else {
    for (const [
      name,
      paths,
    ] of duplicates) {
      console.log(
        `\n${name}`
      );

      paths.forEach(
        console.log
      );
    }
  }

  const workers =
    findWorkerFiles(files);

  printSection(
    "WORKERS"
  );

  workers.forEach(
    console.log
  );

  const scripts =
    findScripts(files);

  printSection(
    "SCRIPTS"
  );

  scripts.forEach(
    console.log
  );

  const largeFiles =
    findLargeFiles(files);

  printSection(
    "LARGE FILES (>100KB)"
  );

  if (
    largeFiles.length === 0
  ) {
    console.log(
      "None"
    );
  } else {
    largeFiles.forEach(
      console.log
    );
  }

  printSection(
    "AUDIT COMPLETE"
  );
}

main();