import fs from "fs";
import path from "path";

type AuditCategory =
  | "FILES"
  | "HIERARCHY"
  | "VERSIONS"
  | "STATUS"
  | "RETRIEVAL";

type AuditStatus =
  | "PASS"
  | "FAIL"
  | "WARNING";

type DocumentKey =
  | "memoryArchitectureMarkdown"
  | "memoryArchitectureJson"
  | "architectureStatusMarkdown"
  | "trdMarkdown"
  | "trdJson";

type AuditResult = {
  category: AuditCategory;
  status: AuditStatus;
  message: string;
  file?: string;
  details?: string;
};

type Heading = {
  level: number;
  title: string;
  normalizedTitle: string;
  line: number;
};

type MarkdownDocument = {
  kind: "markdown";
  path: string;
  raw: string;
  trimmed: string;
  normalizedText: string;
  lines: string[];
  headings: Heading[];
};

type JsonDocument = {
  kind: "json";
  path: string;
  raw: string;
  trimmed: string;
  data: unknown;
};

type LoadedDocMap = {
  [K in DocumentKey]?: MarkdownDocument | JsonDocument;
};

type ParseFailureMap = Partial<
  Record<
    DocumentKey,
    {
      path: string;
      message: string;
    }
  >
>;

type AuditBaseline = {
  files: Record<DocumentKey, string>;
  versions: {
    memoryArchitectureJson: string;
  };
  status: {
    locked: string;
    memoryRepresentationSectionHeading: string;
  };
  headings: {
    trdRequired: string[];
    architectureStatusBuckets: string[];
  };
  jsonPaths: {
    trdRequired: string[];
  };
  jsonRootKeys: {
    memoryArchitecture: string[];
    trd: string[];
  };
  hierarchy: {
    trdMarkdownReference: string;
    trdJsonSourceOfTruth: string;
    architectureStatusReference: string;
  };
};

type AuditContext = {
  rootDir: string;
  baseline: AuditBaseline;
  docs: LoadedDocMap;
  missingFiles: Set<DocumentKey>;
  parseFailures: ParseFailureMap;
};

type AuditCheck = {
  id: string;
  category: AuditCategory;
  run: (context: AuditContext) => AuditResult[];
};

const BASELINE: AuditBaseline = {
  files: {
    memoryArchitectureMarkdown:
      "docs/product/Memory-Architecture-V1.md",
    memoryArchitectureJson:
      "docs/product/Memory-Architecture.json",
    architectureStatusMarkdown:
      "docs/product/ARCHITECTURE_STATUS.md",
    trdMarkdown:
      "docs/product/TRD.md",
    trdJson:
      "docs/product/TRD.json",
  },
  versions: {
    memoryArchitectureJson: "1.0",
  },
  status: {
    locked: "LOCKED",
    memoryRepresentationSectionHeading:
      "Memory Representation Architecture (V1)",
  },
  headings: {
    trdRequired: [
      "Retrieval Philosophy",
      "Current Runtime State",
      "Target Architecture State",
    ],
    architectureStatusBuckets: [
      "LOCKED",
      "OPERATIONAL",
      "IN PROGRESS",
      "PLANNED",
    ],
  },
  jsonPaths: {
    trdRequired: [
      "memory_architecture_dependency",
      "memory_representation_reference",
      "embedding_architecture.current_runtime_state",
      "embedding_architecture.target_architecture_state",
    ],
  },
  jsonRootKeys: {
    memoryArchitecture: [
      "metadata",
      "memory_layers",
      "retrieval_document_v1",
    ],
    trd: [
      "metadata",
      "embedding_architecture",
      "trd_status",
    ],
  },
  hierarchy: {
    trdMarkdownReference:
      "Memory Architecture V1",
    trdJsonSourceOfTruth:
      "Memory-Architecture-V1",
    architectureStatusReference:
      "Memory Representation Architecture (V1)",
  },
};

const CATEGORY_ORDER: AuditCategory[] = [
  "FILES",
  "HIERARCHY",
  "VERSIONS",
  "STATUS",
  "RETRIEVAL",
];

function normalizeWhitespace(
  value: string
): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeHeadingTitle(
  value: string
): string {
  return normalizeWhitespace(
    value
  ).toLowerCase();
}

function normalizeText(
  value: string
): string {
  return normalizeWhitespace(
    value
  ).toLowerCase();
}

function parseMarkdownHeadings(
  raw: string
): Heading[] {
  const lines =
    raw.split(/\r?\n/);
  const headings: Heading[] = [];

  lines.forEach(
    (line, index) => {
      const match =
        line.match(
          /^(#{1,6})\s+(.*?)\s*$/
        );

      if (!match) {
        return;
      }

      const title = match[2].trim();

      if (!title) {
        return;
      }

      headings.push({
        level:
          match[1].length,
        title,
        normalizedTitle:
          normalizeHeadingTitle(
            title
          ),
        line: index + 1,
      });
    }
  );

  return headings;
}

function loadMarkdownDocument(
  absolutePath: string
): MarkdownDocument {
  const raw =
    fs.readFileSync(
      absolutePath,
      "utf8"
    );

  return {
    kind: "markdown",
    path: absolutePath,
    raw,
    trimmed: raw.trim(),
    normalizedText:
      normalizeText(raw),
    lines: raw.split(
      /\r?\n/
    ),
    headings:
      parseMarkdownHeadings(raw),
  };
}

function loadJsonDocument(
  absolutePath: string
): JsonDocument {
  const raw =
    fs.readFileSync(
      absolutePath,
      "utf8"
    );

  return {
    kind: "json",
    path: absolutePath,
    raw,
    trimmed: raw.trim(),
    data: JSON.parse(raw),
  };
}

function createAuditContext(
  rootDir: string,
  baseline: AuditBaseline
): AuditContext {
  const docs: LoadedDocMap = {};
  const missingFiles =
    new Set<DocumentKey>();
  const parseFailures:
    ParseFailureMap = {};

  (
    Object.entries(
      baseline.files
    ) as Array<
      [DocumentKey, string]
    >
  ).forEach(
    ([key, relativePath]) => {
      const absolutePath =
        path.join(
          rootDir,
          relativePath
        );

      if (
        !fs.existsSync(
          absolutePath
        )
      ) {
        missingFiles.add(key);
        return;
      }

      try {
        docs[key] =
          absolutePath.endsWith(
            ".json"
          )
            ? loadJsonDocument(
                absolutePath
              )
            : loadMarkdownDocument(
                absolutePath
              );
      } catch (error) {
        parseFailures[key] = {
          path: absolutePath,
          message:
            error instanceof Error
              ? error.message
              : "Unknown parse error",
        };
      }
    }
  );

  return {
    rootDir,
    baseline,
    docs,
    missingFiles,
    parseFailures,
  };
}

function getMarkdownDoc(
  context: AuditContext,
  key: DocumentKey
): MarkdownDocument | undefined {
  const doc =
    context.docs[key];

  return doc?.kind ===
    "markdown"
    ? doc
    : undefined;
}

function getJsonDoc(
  context: AuditContext,
  key: DocumentKey
): JsonDocument | undefined {
  const doc =
    context.docs[key];

  return doc?.kind ===
    "json"
    ? doc
    : undefined;
}

function getObjectValue(
  input: unknown
): Record<string, unknown> | undefined {
  return input !== null &&
    typeof input === "object" &&
    !Array.isArray(input)
    ? (input as Record<
        string,
        unknown
      >)
    : undefined;
}

function getPathValue(
  input: unknown,
  dotPath: string
): unknown {
  return dotPath
    .split(".")
    .reduce<unknown>(
      (
        current,
        segment
      ) => {
        const objectValue =
          getObjectValue(
            current
          );

        if (
          !objectValue ||
          !Object.prototype.hasOwnProperty.call(
            objectValue,
            segment
          )
        ) {
          return undefined;
        }

        return objectValue[
          segment
        ];
      },
      input
    );
}

function hasMeaningfulValue(
  value: unknown
): boolean {
  if (
    value === undefined ||
    value === null
  ) {
    return false;
  }

  if (
    typeof value === "string"
  ) {
    return value.trim().length > 0;
  }

  if (
    Array.isArray(value)
  ) {
    return value.length > 0;
  }

  if (
    typeof value === "object"
  ) {
    return (
      Object.keys(
        value as Record<
          string,
          unknown
        >
      ).length > 0
    );
  }

  return true;
}

function extractMarkerValue(
  document: MarkdownDocument,
  label: string
): string | undefined {
  const escapedLabel =
    label.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const pattern =
    new RegExp(
      `^\\s*>?\\s*${escapedLabel}\\s*:\\s*(.+?)\\s*$`,
      "im"
    );
  const match =
    document.raw.match(
      pattern
    );

  return match?.[1]?.trim();
}

function findHeading(
  document: MarkdownDocument,
  title: string
): Heading | undefined {
  const normalized =
    normalizeHeadingTitle(
      title
    );

  return document.headings.find(
    (heading) =>
      heading.normalizedTitle ===
      normalized
  );
}

function getSectionText(
  document: MarkdownDocument,
  heading: Heading
): string {
  const startIndex =
    heading.line;
  let endIndex =
    document.lines.length;

  for (const candidate of document.headings) {
    if (
      candidate.line <=
        heading.line ||
      candidate.level >
        heading.level
    ) {
      continue;
    }

    endIndex =
      candidate.line - 1;
    break;
  }

  return document.lines
    .slice(
      startIndex,
      endIndex
    )
    .join("\n");
}

function containsNormalizedText(
  document: MarkdownDocument,
  expected: string
): boolean {
  return document.normalizedText.includes(
    normalizeText(expected)
  );
}

function formatLocation(
  filePath: string
): string {
  return path.relative(
    process.cwd(),
    filePath
  );
}

function createResult(
  category: AuditCategory,
  status: AuditStatus,
  message: string,
  file?: string,
  details?: string
): AuditResult {
  return {
    category,
    status,
    message,
    file,
    details,
  };
}

const CHECKS: AuditCheck[] = [
  {
    id: "files-required-exist",
    category: "FILES",
    run: (context) =>
      (
        Object.entries(
          context.baseline.files
        ) as Array<
          [DocumentKey, string]
        >
      ).map(
        ([key, relativePath]) => {
          const absolutePath =
            path.join(
              context.rootDir,
              relativePath
            );
          const exists =
            !context.missingFiles.has(
              key
            );

          return createResult(
            "FILES",
            exists
              ? "PASS"
              : "FAIL",
            exists
              ? `${path.basename(relativePath)} exists`
              : `${path.basename(relativePath)} is missing`,
            absolutePath
          );
        }
      ),
  },
  {
    id: "files-canonical-hierarchy-exists",
    category: "HIERARCHY",
    run: (context) => {
      const missing = (
        Object.entries(
          context.baseline.files
        ) as Array<
          [DocumentKey, string]
        >
      )
        .filter(([key]) =>
          context.missingFiles.has(
            key
          )
        )
        .map(
          ([, relativePath]) =>
            relativePath
        );

      return [
        createResult(
          "HIERARCHY",
          missing.length === 0
            ? "PASS"
            : "FAIL",
          missing.length === 0
            ? "Canonical architecture hierarchy exists"
            : "Canonical architecture hierarchy is incomplete",
          undefined,
          missing.length === 0
            ? undefined
            : `Missing: ${missing.join(", ")}`
        ),
      ];
    },
  },
  {
    id: "files-json-parses",
    category: "FILES",
    run: (context) => {
      const jsonKeys: DocumentKey[] = [
        "memoryArchitectureJson",
        "trdJson",
      ];

      return jsonKeys.map((key) => {
        const relativePath =
          context.baseline.files[
            key
          ];
        const absolutePath =
          path.join(
            context.rootDir,
            relativePath
          );

        if (
          context.missingFiles.has(
            key
          )
        ) {
          return createResult(
            "FILES",
            "FAIL",
            `${path.basename(relativePath)} could not be parsed because the file is missing`,
            absolutePath
          );
        }

        const failure =
          context.parseFailures[
            key
          ];

        if (failure) {
          return createResult(
            "FILES",
            "FAIL",
            `${path.basename(relativePath)} is not valid JSON`,
            absolutePath,
            failure.message
          );
        }

        const doc = getJsonDoc(
          context,
          key
        );
        const objectValue =
          getObjectValue(
            doc?.data
          );

        if (
          !doc ||
          !hasMeaningfulValue(
            objectValue
          )
        ) {
          return createResult(
            "FILES",
            "FAIL",
            `${path.basename(relativePath)} parsed but is effectively empty`,
            absolutePath
          );
        }

        return createResult(
          "FILES",
          "PASS",
          `${path.basename(relativePath)} parses as valid JSON`,
          absolutePath
        );
      });
    },
  },
  {
    id: "files-document-content",
    category: "FILES",
    run: (context) =>
      (
        Object.entries(
          context.baseline.files
        ) as Array<
          [DocumentKey, string]
        >
      ).map(
        ([key, relativePath]) => {
          const absolutePath =
            path.join(
              context.rootDir,
              relativePath
            );
          const doc =
            context.docs[key];
          const hasContent =
            !!doc &&
            doc.trimmed.length > 0;

          return createResult(
            "FILES",
            hasContent
              ? "PASS"
              : "FAIL",
            hasContent
              ? `${path.basename(relativePath)} contains auditable content`
              : `${path.basename(relativePath)} is effectively empty`,
            absolutePath
          );
        }
      ),
  },
  {
    id: "files-json-root-keys",
    category: "FILES",
    run: (context) => {
      const checks: Array<{
        key: DocumentKey;
        rootKeys: string[];
      }> = [
        {
          key: "memoryArchitectureJson",
          rootKeys:
            context.baseline
              .jsonRootKeys
              .memoryArchitecture,
        },
        {
          key: "trdJson",
          rootKeys:
            context.baseline
              .jsonRootKeys.trd,
        },
      ];

      return checks.flatMap(
        ({
          key,
          rootKeys,
        }) => {
          const doc =
            getJsonDoc(
              context,
              key
            );
          const relativePath =
            context.baseline.files[
              key
            ];
          const absolutePath =
            path.join(
              context.rootDir,
              relativePath
            );

          if (!doc) {
            return rootKeys.map(
              (rootKey) =>
                createResult(
                  "FILES",
                  "FAIL",
                  `${path.basename(relativePath)} missing required root key: ${rootKey}`,
                  absolutePath
                )
            );
          }

          return rootKeys.map(
            (rootKey) => {
              const value =
                getPathValue(
                  doc.data,
                  rootKey
                );

              return createResult(
                "FILES",
                hasMeaningfulValue(
                  value
                )
                  ? "PASS"
                  : "FAIL",
                hasMeaningfulValue(
                  value
                )
                  ? `${path.basename(relativePath)} contains root key: ${rootKey}`
                  : `${path.basename(relativePath)} missing required root key: ${rootKey}`,
                absolutePath
              );
            }
          );
        }
      );
    },
  },
  {
    id: "hierarchy-trd-md-reference",
    category: "HIERARCHY",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "trdMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdMarkdown
        );

      if (!doc) {
        return [
          createResult(
            "HIERARCHY",
            "FAIL",
            "TRD.md could not be checked for Memory Architecture V1 reference",
            filePath
          ),
        ];
      }

      return [
        createResult(
          "HIERARCHY",
          containsNormalizedText(
            doc,
            context.baseline
              .hierarchy
              .trdMarkdownReference
          )
            ? "PASS"
            : "FAIL",
          containsNormalizedText(
            doc,
            context.baseline
              .hierarchy
              .trdMarkdownReference
          )
            ? "TRD.md references Memory Architecture V1"
            : "TRD.md missing Memory Architecture V1 reference",
          filePath
        ),
      ];
    },
  },
  {
    id: "hierarchy-trd-json-reference",
    category: "HIERARCHY",
    run: (context) => {
      const doc =
        getJsonDoc(
          context,
          "trdJson"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdJson
        );
      const sourceOfTruth =
        getPathValue(
          doc?.data,
          "memory_architecture_dependency.source_of_truth"
        );
      const matches =
        typeof sourceOfTruth ===
          "string" &&
        sourceOfTruth.trim() ===
          context.baseline
            .hierarchy
            .trdJsonSourceOfTruth;

      return [
        createResult(
          "HIERARCHY",
          matches
            ? "PASS"
            : "FAIL",
          matches
            ? "TRD.json references Memory Architecture V1"
            : "TRD.json missing Memory Architecture V1 dependency reference",
          filePath
        ),
      ];
    },
  },
  {
    id: "hierarchy-architecture-status-reference",
    category: "HIERARCHY",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "architectureStatusMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .architectureStatusMarkdown
        );
      const heading =
        doc
          ? findHeading(
              doc,
              context.baseline
                .hierarchy
                .architectureStatusReference
            )
          : undefined;

      return [
        createResult(
          "HIERARCHY",
          heading
            ? "PASS"
            : "FAIL",
          heading
            ? "ARCHITECTURE_STATUS.md references Memory Representation Architecture (V1)"
            : "ARCHITECTURE_STATUS.md missing Memory Representation Architecture (V1) reference",
          filePath
        ),
      ];
    },
  },
  {
    id: "versions-memory-architecture-json",
    category: "VERSIONS",
    run: (context) => {
      const doc =
        getJsonDoc(
          context,
          "memoryArchitectureJson"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .memoryArchitectureJson
        );
      const version =
        getPathValue(
          doc?.data,
          "metadata.version"
        );
      const matches =
        typeof version ===
          "string" &&
        version.trim() ===
          context.baseline
            .versions
            .memoryArchitectureJson;

      return [
        createResult(
          "VERSIONS",
          matches
            ? "PASS"
            : "FAIL",
          matches
            ? `Memory-Architecture.json version is ${context.baseline.versions.memoryArchitectureJson}`
            : `Memory-Architecture.json version must be ${context.baseline.versions.memoryArchitectureJson}`,
          filePath
        ),
      ];
    },
  },
  {
    id: "versions-trd-md-exists",
    category: "VERSIONS",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "trdMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdMarkdown
        );
      const version =
        doc
          ? extractMarkerValue(
              doc,
              "Version"
            )
          : undefined;

      return [
        createResult(
          "VERSIONS",
          version
            ? "PASS"
            : "FAIL",
          version
            ? `TRD.md version exists (${version})`
            : "TRD.md version is missing",
          filePath
        ),
      ];
    },
  },
  {
    id: "versions-trd-json-exists",
    category: "VERSIONS",
    run: (context) => {
      const doc =
        getJsonDoc(
          context,
          "trdJson"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdJson
        );
      const version =
        getPathValue(
          doc?.data,
          "metadata.version"
        );
      const exists =
        typeof version ===
          "string" &&
        version.trim().length > 0;

      return [
        createResult(
          "VERSIONS",
          exists
            ? "PASS"
            : "FAIL",
          exists
            ? `TRD.json version exists (${version})`
            : "TRD.json version is missing",
          filePath
        ),
      ];
    },
  },
  {
    id: "versions-trd-match",
    category: "VERSIONS",
    run: (context) => {
      const trdMarkdown =
        getMarkdownDoc(
          context,
          "trdMarkdown"
        );
      const trdJson =
        getJsonDoc(
          context,
          "trdJson"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdMarkdown
        );
      const markdownVersion =
        trdMarkdown
          ? extractMarkerValue(
              trdMarkdown,
              "Version"
            )
          : undefined;
      const jsonVersion =
        getPathValue(
          trdJson?.data,
          "metadata.version"
        );
      const matches =
        typeof markdownVersion ===
          "string" &&
        typeof jsonVersion ===
          "string" &&
        markdownVersion ===
          jsonVersion;

      return [
        createResult(
          "VERSIONS",
          matches
            ? "PASS"
            : "FAIL",
          matches
            ? `TRD versions match (${markdownVersion})`
            : "TRD.md version does not match TRD.json version",
          filePath,
          `TRD.md=${markdownVersion ?? "missing"}, TRD.json=${typeof jsonVersion === "string" ? jsonVersion : "missing"}`
        ),
      ];
    },
  },
  {
    id: "status-memory-architecture-md-locked",
    category: "STATUS",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "memoryArchitectureMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .memoryArchitectureMarkdown
        );
      const status =
        doc
          ? extractMarkerValue(
              doc,
              "Status"
            )
          : undefined;
      const matches =
        typeof status ===
          "string" &&
        status.trim() ===
          context.baseline
            .status.locked;

      return [
        createResult(
          "STATUS",
          matches
            ? "PASS"
            : "FAIL",
          matches
            ? "Memory-Architecture-V1.md status is LOCKED"
            : "Memory-Architecture-V1.md status must be LOCKED",
          filePath
        ),
      ];
    },
  },
  {
    id: "status-memory-architecture-json-locked",
    category: "STATUS",
    run: (context) => {
      const doc =
        getJsonDoc(
          context,
          "memoryArchitectureJson"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .memoryArchitectureJson
        );
      const status =
        getPathValue(
          doc?.data,
          "metadata.status"
        );
      const matches =
        typeof status ===
          "string" &&
        status.trim() ===
          context.baseline
            .status.locked;

      return [
        createResult(
          "STATUS",
          matches
            ? "PASS"
            : "FAIL",
          matches
            ? "Memory-Architecture.json status is LOCKED"
            : "Memory-Architecture.json status must be LOCKED",
          filePath
        ),
      ];
    },
  },
  {
    id: "status-architecture-status-locked",
    category: "STATUS",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "architectureStatusMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .architectureStatusMarkdown
        );

      if (!doc) {
        return [
          createResult(
            "STATUS",
            "FAIL",
            "ARCHITECTURE_STATUS.md Memory Representation Architecture (V1) section could not be checked",
            filePath
          ),
        ];
      }

      const sectionHeading =
        findHeading(
          doc,
          context.baseline.status
            .memoryRepresentationSectionHeading
        );

      if (!sectionHeading) {
        return [
          createResult(
            "STATUS",
            "FAIL",
            "ARCHITECTURE_STATUS.md missing Memory Representation Architecture (V1) section",
            filePath
          ),
        ];
      }

      const sectionText =
        getSectionText(
          doc,
          sectionHeading
        );
      const match =
        sectionText.match(
          /^\s*Status\s*:\s*(.+?)\s*$/im
        );
      const status =
        match?.[1]?.trim();
      const isLocked =
        status ===
        context.baseline
          .status.locked;

      return [
        createResult(
          "STATUS",
          isLocked
            ? "PASS"
            : "FAIL",
          isLocked
            ? "ARCHITECTURE_STATUS.md Memory Representation Architecture (V1) status is LOCKED"
            : "ARCHITECTURE_STATUS.md Memory Representation Architecture (V1) status must be LOCKED",
          filePath
        ),
      ];
    },
  },
  {
    id: "retrieval-trd-memory-architecture-dependency",
    category: "RETRIEVAL",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "trdMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdMarkdown
        );
      const present =
        !!doc &&
        containsNormalizedText(
          doc,
          context.baseline
            .hierarchy
            .trdMarkdownReference
        );

      return [
        createResult(
          "RETRIEVAL",
          present
            ? "PASS"
            : "FAIL",
          present
            ? "TRD.md contains Memory Architecture dependency"
            : "TRD.md missing Memory Architecture dependency",
          filePath
        ),
      ];
    },
  },
  {
    id: "retrieval-trd-headings",
    category: "RETRIEVAL",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "trdMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdMarkdown
        );

      if (!doc) {
        return context.baseline.headings.trdRequired.map(
          (heading) =>
            createResult(
              "RETRIEVAL",
              "FAIL",
              `${heading} heading could not be checked`,
              filePath
            )
        );
      }

      return context.baseline.headings.trdRequired.map(
        (heading) => {
          const found =
            !!findHeading(
              doc,
              heading
            );

          return createResult(
            "RETRIEVAL",
            found
              ? "PASS"
              : "FAIL",
            found
              ? `${heading} heading found`
              : `${heading} heading missing`,
            filePath
          );
        }
      );
    },
  },
  {
    id: "retrieval-trd-json-paths",
    category: "RETRIEVAL",
    run: (context) => {
      const doc =
        getJsonDoc(
          context,
          "trdJson"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .trdJson
        );

      return context.baseline.jsonPaths.trdRequired.map(
        (dotPath) => {
          const value =
            getPathValue(
              doc?.data,
              dotPath
            );

          return createResult(
            "RETRIEVAL",
            hasMeaningfulValue(
              value
            )
              ? "PASS"
              : "FAIL",
            hasMeaningfulValue(
              value
            )
              ? `TRD.json contains required path: ${dotPath}`
              : `TRD.json missing required path: ${dotPath}`,
            filePath
          );
        }
      );
    },
  },
  {
    id: "retrieval-architecture-status-buckets",
    category: "RETRIEVAL",
    run: (context) => {
      const doc =
        getMarkdownDoc(
          context,
          "architectureStatusMarkdown"
        );
      const filePath =
        path.join(
          context.rootDir,
          context.baseline.files
            .architectureStatusMarkdown
        );

      if (!doc) {
        return context.baseline.headings.architectureStatusBuckets.map(
          (bucket) =>
            createResult(
              "RETRIEVAL",
              "FAIL",
              `ARCHITECTURE_STATUS.md missing required status bucket: ${bucket}`,
              filePath
            )
        );
      }

      return context.baseline.headings.architectureStatusBuckets.map(
        (bucket) => {
          const found =
            !!findHeading(
              doc,
              bucket
            );

          return createResult(
            "RETRIEVAL",
            found
              ? "PASS"
              : "FAIL",
            found
              ? `ARCHITECTURE_STATUS.md contains status bucket: ${bucket}`
              : `ARCHITECTURE_STATUS.md missing required status bucket: ${bucket}`,
            filePath
          );
        }
      );
    },
  },
];

function formatResult(
  result: AuditResult
): string {
  const prefix = `${result.status} ${result.message}`;

  if (
    !result.file &&
    !result.details
  ) {
    return prefix;
  }

  const parts: string[] = [
    prefix,
  ];

  if (result.file) {
    parts.push(
      `(${formatLocation(
        result.file
      )})`
    );
  }

  if (result.details) {
    parts.push(
      `- ${result.details}`
    );
  }

  return parts.join(" ");
}

function reportResults(
  results: AuditResult[]
): void {
  for (const category of CATEGORY_ORDER) {
    const categoryResults =
      results.filter(
        (result) =>
          result.category ===
          category
      );

    if (
      categoryResults.length === 0
    ) {
      continue;
    }

    console.log(
      `\n[${category}]`
    );

    for (const result of categoryResults) {
      console.log(
        formatResult(result)
      );
    }
  }

  const counts = {
    PASS: 0,
    FAIL: 0,
    WARNING: 0,
  };

  for (const result of results) {
    counts[
      result.status
    ] += 1;
  }

  const exitCode =
    counts.FAIL > 0 ? 1 : 0;

  console.log(
    `\nSummary: ${counts.PASS} PASS, ${counts.WARNING} WARNING, ${counts.FAIL} FAIL`
  );
  console.log(
    `Exit Code: ${exitCode}`
  );

  process.exit(exitCode);
}

function main(): void {
  const context =
    createAuditContext(
      process.cwd(),
      BASELINE
    );

  const results =
    CHECKS.flatMap((check) =>
      check.run(context)
    );

  reportResults(results);
}

main();
