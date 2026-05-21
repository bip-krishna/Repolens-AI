import type { RepoMetadata, RepoTreeItem, LanguageBreakdown } from "@/types";

const GITHUB_API = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RepoLens-AI",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 300 }, // Cache for 5 min
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`GitHub API error ${res.status}: ${res.statusText}. ${errorBody}`);
  }
  return res.json();
}

export async function getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const data = await githubFetch<any>(`/repos/${owner}/${repo}`);
  return {
    owner: data.owner.login,
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    language: data.language,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    watchers: data.subscribers_count,
    defaultBranch: data.default_branch,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    topics: data.topics || [],
    license: data.license?.spdx_id || null,
    homepage: data.homepage || null,
    isArchived: data.archived,
    size: data.size,
  };
}

export async function getRepoTree(owner: string, repo: string, branch: string): Promise<RepoTreeItem[]> {
  const data = await githubFetch<any>(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  return (data.tree || []).map((item: any) => ({
    path: item.path,
    type: item.type,
    sha: item.sha,
    size: item.size,
    url: item.url,
  }));
}

export async function getFileContent(owner: string, repo: string, path: string): Promise<string> {
  const data = await githubFetch<any>(`/repos/${owner}/${repo}/contents/${path}`);
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return data.content || "";
}

export async function getLanguages(owner: string, repo: string): Promise<LanguageBreakdown> {
  return githubFetch<LanguageBreakdown>(`/repos/${owner}/${repo}/languages`);
}

export async function getReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const data = await githubFetch<any>(`/repos/${owner}/${repo}/readme`);
    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}
