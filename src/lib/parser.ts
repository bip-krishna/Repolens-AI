import type { RepoTreeItem, FileTreeNode, Framework, RepoStats } from "@/types";

/**
 * Build a hierarchical file tree from a flat list of GitHub tree items.
 */
export function buildFileTree(items: RepoTreeItem[]): FileTreeNode {
  const root: FileTreeNode = { name: "/", path: "", type: "directory", children: [] };

  for (const item of items) {
    const parts = item.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");

      if (isLast && item.type === "blob") {
        const ext = part.includes(".") ? part.split(".").pop() : undefined;
        current.children = current.children || [];
        current.children.push({
          name: part, path: currentPath, type: "file", size: item.size, extension: ext,
        });
      } else {
        current.children = current.children || [];
        let dir = current.children.find((c) => c.name === part && c.type === "directory");
        if (!dir) {
          dir = { name: part, path: currentPath, type: "directory", children: [] };
          current.children.push(dir);
        }
        current = dir;
      }
    }
  }

  // Sort: directories first, then alphabetically
  sortTree(root);
  return root;
}

function sortTree(node: FileTreeNode) {
  if (!node.children) return;
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  node.children.forEach(sortTree);
}

/**
 * Detect frameworks and tools based on file tree and config files.
 */
export function detectFrameworks(items: RepoTreeItem[], packageJson?: any): Framework[] {
  const frameworks: Framework[] = [];
  const paths = items.map((i) => i.path);
  const hasFile = (name: string) => paths.some((p) => p.endsWith(name));

  // Frontend
  if (hasFile("next.config.js") || hasFile("next.config.ts") || hasFile("next.config.mjs"))
    frameworks.push({ name: "Next.js", category: "frontend", confidence: 1 });
  else if (packageJson?.dependencies?.react)
    frameworks.push({ name: "React", category: "frontend", confidence: 0.9 });

  if (packageJson?.dependencies?.vue)
    frameworks.push({ name: "Vue.js", category: "frontend", confidence: 0.9 });
  if (packageJson?.dependencies?.svelte || hasFile("svelte.config.js"))
    frameworks.push({ name: "Svelte", category: "frontend", confidence: 0.9 });
  if (packageJson?.dependencies?.angular || hasFile("angular.json"))
    frameworks.push({ name: "Angular", category: "frontend", confidence: 0.9 });

  // Styling
  if (hasFile("tailwind.config.js") || hasFile("tailwind.config.ts") || packageJson?.devDependencies?.tailwindcss)
    frameworks.push({ name: "Tailwind CSS", category: "styling", confidence: 0.95 });
  if (packageJson?.dependencies?.["styled-components"])
    frameworks.push({ name: "Styled Components", category: "styling", confidence: 0.9 });

  // Backend
  if (packageJson?.dependencies?.express)
    frameworks.push({ name: "Express.js", category: "backend", confidence: 0.95 });
  if (hasFile("requirements.txt") || hasFile("pyproject.toml"))
    frameworks.push({ name: "Python", category: "backend", confidence: 0.8 });
  if (hasFile("Cargo.toml"))
    frameworks.push({ name: "Rust", category: "backend", confidence: 0.95 });
  if (hasFile("go.mod"))
    frameworks.push({ name: "Go", category: "backend", confidence: 0.95 });

  // Database
  if (packageJson?.dependencies?.prisma || hasFile("prisma/schema.prisma"))
    frameworks.push({ name: "Prisma", category: "database", confidence: 0.95 });
  if (packageJson?.dependencies?.mongoose)
    frameworks.push({ name: "MongoDB", category: "database", confidence: 0.9 });

  // Testing
  if (packageJson?.devDependencies?.jest)
    frameworks.push({ name: "Jest", category: "testing", confidence: 0.9 });
  if (packageJson?.devDependencies?.vitest)
    frameworks.push({ name: "Vitest", category: "testing", confidence: 0.9 });

  // DevOps
  if (hasFile("Dockerfile") || hasFile("docker-compose.yml"))
    frameworks.push({ name: "Docker", category: "devops", confidence: 0.95 });
  if (hasFile(".github/workflows"))
    frameworks.push({ name: "GitHub Actions", category: "devops", confidence: 0.95 });

  return frameworks;
}

/**
 * Compute repository statistics from tree items.
 */
export function computeStats(items: RepoTreeItem[]): RepoStats {
  const files = items.filter((i) => i.type === "blob");
  const dirs = items.filter((i) => i.type === "tree");
  const byExt: Record<string, number> = {};

  for (const f of files) {
    const ext = f.path.includes(".") ? `.${f.path.split(".").pop()}` : "no extension";
    byExt[ext] = (byExt[ext] || 0) + 1;
  }

  const largest = files
    .filter((f) => f.size !== undefined)
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 10)
    .map((f) => ({ path: f.path, size: f.size || 0 }));

  return {
    totalFiles: files.length,
    totalDirectories: dirs.length,
    totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
    filesByExtension: byExt,
    largestFiles: largest,
  };
}
