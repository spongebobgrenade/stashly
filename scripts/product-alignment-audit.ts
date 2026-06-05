import fs from "fs";
import path from "path";

type Status = "PASS" | "FAIL";

type Category =
  | "FOUNDATIONAL_TRUTHS"
  | "MEMORY_REPRESENTATION"
  | "RETRIEVAL_ALIGNMENT"
  | "EXPERIENCE_ALIGNMENT"
  | "ARCHITECTURE_STATUS";

type DocumentKey =
  | "philosophy"
  | "prd"
  | "searchArchitecture"
  | "memoryArchitecture"
  | "memoryArchitectureV1"
  | "trd"
  | "experienceArchitecture"
  | "architectureStatus";

type AuditResult = {
  category: Category;
  status: Status;
  message: string;
};

type MarkdownDocument = {
  path: string;
  raw: string;
  normalizedText: string;
};

type AuditContext = {
  rootDir: string;
  docs: Partial<Record<DocumentKey, MarkdownDocument>>;
};

type AuditCheck = {
  id: string;
  category: Category;
  run: (context: AuditContext) => AuditResult;
};

const FILES: Record<DocumentKey, string> = {
  philosophy: "docs/product/Philosophy.md",
  prd: "docs/product/PRD.md",
  searchArchitecture: "docs/product/Search-Architecture.md",
  memoryArchitecture: "docs/product/Memory-Architecture.md",
  memoryArchitectureV1: "docs/product/Memory-Architecture-V1.md",
  trd: "docs/product/TRD.md",
  experienceArchitecture: "docs/product/Experience-Architecture.md",
  architectureStatus: "docs/product/ARCHITECTURE_STATUS.md",
};

const CATEGORY_ORDER: Category[] = [
  "FOUNDATIONAL_TRUTHS",
  "MEMORY_REPRESENTATION",
  "RETRIEVAL_ALIGNMENT",
  "EXPERIENCE_ALIGNMENT",
  "ARCHITECTURE_STATUS",
];

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function loadMarkdownDocument(absolutePath: string): MarkdownDocument {
  const raw = fs.readFileSync(absolutePath, "utf8");
  return {
    path: absolutePath,
    raw,
    normalizedText: normalizeText(raw),
  };
}

function getDocument(context: AuditContext, key: DocumentKey): MarkdownDocument | null {
  const relativePath = FILES[key];
  const absolutePath = path.join(context.rootDir, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  if (!context.docs[key]) {
    context.docs[key] = loadMarkdownDocument(absolutePath);
  }

  return context.docs[key] ?? null;
}

function hasAnyPhrase(doc: MarkdownDocument, phrases: string[]): boolean {
  return phrases.some((phrase) => doc.normalizedText.includes(normalizeText(phrase)));
}

function hasAllPhrases(doc: MarkdownDocument, phrases: string[]): boolean {
  return phrases.every((phrase) => doc.normalizedText.includes(normalizeText(phrase)));
}

function buildRequirementResult(
  category: Category,
  message: string,
  requirements: Array<{
    key: DocumentKey;
    phrases: string[];
  }>,
  context: AuditContext
): AuditResult {
  const failures: string[] = [];

  for (const requirement of requirements) {
    const doc = getDocument(context, requirement.key);
    if (!doc) {
      failures.push(`${FILES[requirement.key]} missing`);
      continue;
    }

    if (!hasAnyPhrase(doc, requirement.phrases)) {
      failures.push(`${FILES[requirement.key]} missing concept`);
    }
  }

  if (failures.length > 0) {
    return {
      category,
      status: "FAIL",
      message: `${message} (${failures.join("; ")})`,
    };
  }

  return {
    category,
    status: "PASS",
    message,
  };
}

function extractDocumentTitle(doc: MarkdownDocument): string | null {
  const match = doc.raw.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

function extractStatus(doc: MarkdownDocument): string | null {
  const match = doc.raw.match(/^(?:> \s*|\*\*)?Status(?:\*\*)?:\s*(.+?)\s*$/mi);
  return match ? match[1].trim() : null;
}

function isArchitectureDoc(title: string | null): boolean {
  return title !== null && title.toLowerCase().includes("architecture");
}

function isActiveStatus(status: string | null): boolean {
  if (!status) {
    return false;
  }
  const normalized = normalizeText(status);
  return normalized === "active" || normalized === "active source of truth";
}

function isLockedStatus(status: string | null): boolean {
  return status !== null && normalizeText(status) === "locked";
}

function collectArchitectureDocsByStatus(
  context: AuditContext,
  predicate: (status: string | null) => boolean
): string[] {
  return Object.entries(FILES)
    .filter(([key]) => key !== "architectureStatus")
    .flatMap(([key]) => {
      const doc = getDocument(context, key as DocumentKey);
      if (!doc) {
        return [];
      }

      const title = extractDocumentTitle(doc);
      const status = extractStatus(doc);
      if (!isArchitectureDoc(title) || !predicate(status)) {
        return [];
      }

      return [title as string];
    })
    .sort((a, b) => a.localeCompare(b));
}

const CHECKS: AuditCheck[] = [
  {
    id: "memory_is_canonical",
    category: "FOUNDATIONAL_TRUTHS",
    run: (context) =>
      buildRequirementResult(
        "FOUNDATIONAL_TRUTHS",
        "Memory is canonical",
        [
          { key: "philosophy", phrases: ["Memory remains canonical."] },
          { key: "prd", phrases: ["Memory remains canonical."] },
          { key: "memoryArchitecture", phrases: ["Memory remains canonical."] },
          { key: "trd", phrases: ["Memory remains canonical."] },
        ],
        context
      ),
  },
  {
    id: "retrieval_is_core_value",
    category: "FOUNDATIONAL_TRUTHS",
    run: (context) =>
      buildRequirementResult(
        "FOUNDATIONAL_TRUTHS",
        "Retrieval is core value",
        [
          { key: "philosophy", phrases: ["Retrieval is the core product value."] },
          { key: "prd", phrases: ["Retrieval quality is the primary product value.", "retrieval-first system"] },
          { key: "searchArchitecture", phrases: ["retrieval is the system capability underneath it.", "Retrieval is core product value."] },
        ],
        context
      ),
  },
  {
    id: "ai_retrieval_required_before_launch",
    category: "FOUNDATIONAL_TRUTHS",
    run: (context) =>
      buildRequirementResult(
        "FOUNDATIONAL_TRUTHS",
        "AI retrieval required before launch",
        [
          { key: "philosophy", phrases: ["AI-powered retrieval exists", "AI-powered retrieval"] },
          { key: "prd", phrases: ["Public launch requires AI-powered retrieval", "AI-powered retrieval must exist before public launch."] },
          { key: "searchArchitecture", phrases: ["AI-powered retrieval", "Public launch requires Retrieval V4 characteristics"] },
          { key: "trd", phrases: ["Public launch requires AI-powered retrieval.", "AI-powered retrieval must exist before public launch."] },
        ],
        context
      ),
  },
  {
    id: "memory_architecture_v1_exists",
    category: "MEMORY_REPRESENTATION",
    run: (context) => {
      const doc = getDocument(context, "memoryArchitectureV1");
      return {
        category: "MEMORY_REPRESENTATION",
        status: doc ? "PASS" : "FAIL",
        message: doc ? "Memory Architecture V1 exists" : `${FILES.memoryArchitectureV1} missing`,
      };
    },
  },
  {
    id: "memory_architecture_v1_locked",
    category: "MEMORY_REPRESENTATION",
    run: (context) => {
      const doc = getDocument(context, "memoryArchitectureV1");
      if (!doc) {
        return {
          category: "MEMORY_REPRESENTATION",
          status: "FAIL",
          message: `${FILES.memoryArchitectureV1} missing`,
        };
      }

      return {
        category: "MEMORY_REPRESENTATION",
        status: hasAnyPhrase(doc, ["Status: LOCKED"]) ? "PASS" : "FAIL",
        message: "Memory Architecture V1 status is LOCKED",
      };
    },
  },
  {
    id: "architecture_status_references_v1",
    category: "MEMORY_REPRESENTATION",
    run: (context) =>
      buildRequirementResult(
        "MEMORY_REPRESENTATION",
        "ARCHITECTURE_STATUS references Memory Representation Architecture V1",
        [
          {
            key: "architectureStatus",
            phrases: ["Memory Representation Architecture (V1)", "Memory Representation Architecture V1"],
          },
        ],
        context
      ),
  },
  {
    id: "trd_references_v1",
    category: "MEMORY_REPRESENTATION",
    run: (context) =>
      buildRequirementResult(
        "MEMORY_REPRESENTATION",
        "TRD references Memory Architecture V1",
        [
          { key: "trd", phrases: ["Memory Architecture V1", "Memory Representation Architecture V1"] },
        ],
        context
      ),
  },
  {
    id: "trd_target_retrieval_document_fields",
    category: "MEMORY_REPRESENTATION",
    run: (context) => {
      const doc = getDocument(context, "trd");
      if (!doc) {
        return {
          category: "MEMORY_REPRESENTATION",
          status: "FAIL",
          message: `${FILES.trd} missing`,
        };
      }

      const requiredFields = [
        "`summary`",
        "`topics`",
        "`entities`",
        "`key_insights`",
        "`creator_name`",
        "`user_notes`",
      ];

      return {
        category: "MEMORY_REPRESENTATION",
        status: hasAllPhrases(doc, requiredFields) ? "PASS" : "FAIL",
        message: "TRD target retrieval document contains summary, topics, entities, key_insights, creator_name, user_notes",
      };
    },
  },
  {
    id: "discovery_over_precision",
    category: "RETRIEVAL_ALIGNMENT",
    run: (context) =>
      buildRequirementResult(
        "RETRIEVAL_ALIGNMENT",
        "Discovery > Precision",
        [
          { key: "memoryArchitectureV1", phrases: ["Discovery > Precision"] },
          { key: "trd", phrases: ["Primary Goal: Discovery", "Secondary Goal: Precision"] },
        ],
        context
      ),
  },
  {
    id: "user_notes_participate_in_retrieval",
    category: "RETRIEVAL_ALIGNMENT",
    run: (context) =>
      buildRequirementResult(
        "RETRIEVAL_ALIGNMENT",
        "User Notes participate in retrieval",
        [
          { key: "memoryArchitectureV1", phrases: ["User Notes", "participate in retrieval"] },
          { key: "trd", phrases: ["User Notes participate in retrieval."] },
        ],
        context
      ),
  },
  {
    id: "key_insights_participate_in_retrieval",
    category: "RETRIEVAL_ALIGNMENT",
    run: (context) =>
      buildRequirementResult(
        "RETRIEVAL_ALIGNMENT",
        "Key Insights participate in retrieval",
        [
          { key: "memoryArchitectureV1", phrases: ["Key insights as a retrieval primitive", "Key Insights"] },
          { key: "trd", phrases: ["Key Insights participate in retrieval."] },
        ],
        context
      ),
  },
  {
    id: "not_a_bookmark_manager",
    category: "EXPERIENCE_ALIGNMENT",
    run: (context) =>
      buildRequirementResult(
        "EXPERIENCE_ALIGNMENT",
        "Not a bookmark manager",
        [
          { key: "philosophy", phrases: ["Stashly is not a bookmark manager."] },
          { key: "prd", phrases: ["a bookmark manager"] },
          { key: "experienceArchitecture", phrases: ["not a bookmark manager", "The experience is not a bookmark manager."] },
        ],
        context
      ),
  },
  {
    id: "intent_based_retrieval",
    category: "EXPERIENCE_ALIGNMENT",
    run: (context) =>
      buildRequirementResult(
        "EXPERIENCE_ALIGNMENT",
        "Intent-based retrieval",
        [
          { key: "philosophy", phrases: ["intent-based recovery"] },
          { key: "prd", phrases: ["remember intent", "Retrieve by intent later"] },
          { key: "searchArchitecture", phrases: ["intent-level recovery", "remember intent"] },
          { key: "experienceArchitecture", phrases: ["intent-based retrieval", "retrieve by intent"] },
        ],
        context
      ),
  },
  {
    id: "every_locked_architecture_represented",
    category: "ARCHITECTURE_STATUS",
    run: (context) => {
      const architectureStatus = getDocument(context, "architectureStatus");
      if (!architectureStatus) {
        return {
          category: "ARCHITECTURE_STATUS",
          status: "FAIL",
          message: `${FILES.architectureStatus} missing`,
        };
      }

      const lockedTitles = collectArchitectureDocsByStatus(context, isLockedStatus);
      const missing = lockedTitles.filter((title) => !hasAnyPhrase(architectureStatus, [title]));

      return {
        category: "ARCHITECTURE_STATUS",
        status: missing.length === 0 ? "PASS" : "FAIL",
        message:
          missing.length === 0
            ? "Every LOCKED architecture is represented in ARCHITECTURE_STATUS.md"
            : `Every LOCKED architecture is represented in ARCHITECTURE_STATUS.md (missing: ${missing.join(", ")})`,
      };
    },
  },
  {
    id: "every_active_architecture_represented",
    category: "ARCHITECTURE_STATUS",
    run: (context) => {
      const architectureStatus = getDocument(context, "architectureStatus");
      if (!architectureStatus) {
        return {
          category: "ARCHITECTURE_STATUS",
          status: "FAIL",
          message: `${FILES.architectureStatus} missing`,
        };
      }

      const activeTitles = collectArchitectureDocsByStatus(context, isActiveStatus);
      const missing = activeTitles.filter((title) => !hasAnyPhrase(architectureStatus, [title]));

      return {
        category: "ARCHITECTURE_STATUS",
        status: missing.length === 0 ? "PASS" : "FAIL",
        message:
          missing.length === 0
            ? "Every ACTIVE architecture is represented in ARCHITECTURE_STATUS.md"
            : `Every ACTIVE architecture is represented in ARCHITECTURE_STATUS.md (missing: ${missing.join(", ")})`,
      };
    },
  },
  {
    id: "no_archived_architecture_references",
    category: "ARCHITECTURE_STATUS",
    run: (context) => {
      const archivedReferences = Object.entries(FILES)
        .filter(([key]) => key !== "architectureStatus")
        .flatMap(([key, relativePath]) => {
          const doc = getDocument(context, key as DocumentKey);
          if (!doc) {
            return [];
          }

          return hasAnyPhrase(doc, ["archived architecture", "status: archived"]) ? [relativePath] : [];
        });

      return {
        category: "ARCHITECTURE_STATUS",
        status: archivedReferences.length === 0 ? "PASS" : "FAIL",
        message:
          archivedReferences.length === 0
            ? "No document references an archived architecture"
            : `No document references an archived architecture (found in: ${archivedReferences.join(", ")})`,
      };
    },
  },
];

function printReport(results: AuditResult[]) {
  for (const category of CATEGORY_ORDER) {
    const categoryResults = results.filter((result) => result.category === category);
    if (categoryResults.length === 0) {
      continue;
    }

    console.log(`\n[${category}]`);
    for (const result of categoryResults) {
      console.log(`${result.status} ${result.message}`);
    }
  }

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;

  console.log("\nSummary:");
  console.log(`${passCount} PASS`);
  console.log(`${failCount} FAIL`);
  console.log(`\nExit Code: ${failCount > 0 ? 1 : 0}`);
}

function main() {
  const context: AuditContext = {
    rootDir: process.cwd(),
    docs: {},
  };

  const results = CHECKS.map((check) => check.run(context));
  printReport(results);

  const hasFailures = results.some((result) => result.status === "FAIL");
  process.exit(hasFailures ? 1 : 0);
}

main();
