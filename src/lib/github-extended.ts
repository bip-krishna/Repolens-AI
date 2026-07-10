import type { GitCommit, GitContributor, GitBranch, GitRelease, CommitActivity, IssueAnalytics, PRAnalytics } from "@/types";

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
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function getCommits(owner: string, repo: string, perPage = 30): Promise<GitCommit[]> {
  try {
    const data = await githubFetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);
    return data.map((c: any) => ({
      sha: c.sha,
      message: c.commit?.message || "",
      author: c.commit?.author?.name || c.author?.login || "Unknown",
      date: c.commit?.author?.date || "",
      avatar: c.author?.avatar_url,
    }));
  } catch {
    return [];
  }
}

export async function getContributors(owner: string, repo: string): Promise<GitContributor[]> {
  try {
    const data = await githubFetch<any[]>(`/repos/${owner}/${repo}/contributors?per_page=20`);
    const totalContributions = data.reduce((sum: number, c: any) => sum + (c.contributions || 0), 0);
    return data.map((c: any) => ({
      login: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
      ownership: totalContributions > 0 ? Math.round((c.contributions / totalContributions) * 100) : 0,
    }));
  } catch {
    return [];
  }
}

export async function getBranches(owner: string, repo: string): Promise<GitBranch[]> {
  try {
    const [branches, repoData] = await Promise.all([
      githubFetch<any[]>(`/repos/${owner}/${repo}/branches?per_page=30`),
      githubFetch<any>(`/repos/${owner}/${repo}`),
    ]);
    return branches.map((b: any) => ({
      name: b.name,
      isDefault: b.name === repoData.default_branch,
      isProtected: b.protected || false,
      lastCommitDate: b.commit?.commit?.author?.date,
    }));
  } catch {
    return [];
  }
}

export async function getReleases(owner: string, repo: string): Promise<GitRelease[]> {
  try {
    const data = await githubFetch<any[]>(`/repos/${owner}/${repo}/releases?per_page=20`);
    return data.map((r: any) => ({
      tagName: r.tag_name,
      name: r.name || r.tag_name,
      date: r.published_at || r.created_at,
      body: r.body || "",
      isPrerelease: r.prerelease,
    }));
  } catch {
    return [];
  }
}

export async function getCommitActivity(owner: string, repo: string): Promise<CommitActivity[]> {
  try {
    const data = await githubFetch<any[]>(`/repos/${owner}/${repo}/stats/commit_activity`);
    if (!Array.isArray(data)) return [];
    return data.map((week: any) => ({
      week: new Date(week.week * 1000).toISOString().split("T")[0],
      count: week.total,
    }));
  } catch {
    return [];
  }
}

export async function getIssueAnalytics(owner: string, repo: string): Promise<IssueAnalytics> {
  try {
    const [openIssues, closedIssues] = await Promise.all([
      githubFetch<any[]>(`/repos/${owner}/${repo}/issues?state=open&per_page=100`),
      githubFetch<any[]>(`/repos/${owner}/${repo}/issues?state=closed&per_page=100`),
    ]);

    // Filter out pull requests (GitHub API includes PRs in issues)
    const open = openIssues.filter((i: any) => !i.pull_request);
    const closed = closedIssues.filter((i: any) => !i.pull_request);
    const all = [...open, ...closed];

    const bugs = all.filter((i: any) => i.labels?.some((l: any) => l.name.toLowerCase().includes("bug")));
    const features = all.filter((i: any) => i.labels?.some((l: any) =>
      l.name.toLowerCase().includes("feature") || l.name.toLowerCase().includes("enhancement")
    ));

    // Calculate average response time for closed issues
    let totalResponseTime = 0;
    let respondedCount = 0;
    for (const issue of closed.slice(0, 50)) {
      if (issue.created_at && issue.closed_at) {
        const created = new Date(issue.created_at).getTime();
        const closedAt = new Date(issue.closed_at).getTime();
        totalResponseTime += closedAt - created;
        respondedCount++;
      }
    }
    const avgMs = respondedCount > 0 ? totalResponseTime / respondedCount : 0;
    const avgDays = Math.round(avgMs / (1000 * 60 * 60 * 24));

    // Build timeline (last 6 months)
    const timeline: { date: string; opened: number; closed: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = month.toISOString().slice(0, 7);
      const opened = all.filter((issue) => issue.created_at?.startsWith(monthStr)).length;
      const closedInMonth = closed.filter((issue) => issue.closed_at?.startsWith(monthStr)).length;
      timeline.push({ date: monthStr, opened, closed: closedInMonth });
    }

    return {
      total: all.length,
      open: open.length,
      closed: closed.length,
      bugs: bugs.length,
      features: features.length,
      avgResponseTime: avgDays > 0 ? `${avgDays} days` : "N/A",
      timeline,
    };
  } catch {
    return { total: 0, open: 0, closed: 0, bugs: 0, features: 0, avgResponseTime: "N/A", timeline: [] };
  }
}

export async function getPRAnalytics(owner: string, repo: string): Promise<PRAnalytics> {
  try {
    const [openPRs, closedPRs] = await Promise.all([
      githubFetch<any[]>(`/repos/${owner}/${repo}/pulls?state=open&per_page=100`),
      githubFetch<any[]>(`/repos/${owner}/${repo}/pulls?state=closed&per_page=100`),
    ]);

    const merged = closedPRs.filter((pr: any) => pr.merged_at);
    const rejected = closedPRs.filter((pr: any) => !pr.merged_at);

    // Average review time
    let totalReviewTime = 0;
    let reviewedCount = 0;
    for (const pr of merged.slice(0, 50)) {
      if (pr.created_at && pr.merged_at) {
        const created = new Date(pr.created_at).getTime();
        const mergedAt = new Date(pr.merged_at).getTime();
        totalReviewTime += mergedAt - created;
        reviewedCount++;
      }
    }
    const avgMs = reviewedCount > 0 ? totalReviewTime / reviewedCount : 0;
    const avgHours = Math.round(avgMs / (1000 * 60 * 60));

    // Review distribution
    const reviewerMap: Record<string, number> = {};
    for (const pr of [...openPRs, ...closedPRs].slice(0, 100)) {
      if (pr.user?.login) {
        reviewerMap[pr.user.login] = (reviewerMap[pr.user.login] || 0) + 1;
      }
    }

    return {
      total: openPRs.length + closedPRs.length,
      merged: merged.length,
      rejected: rejected.length,
      open: openPRs.length,
      avgReviewTime: avgHours > 24 ? `${Math.round(avgHours / 24)} days` : `${avgHours} hours`,
      reviewDistribution: Object.entries(reviewerMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([reviewer, count]) => ({ reviewer, count })),
    };
  } catch {
    return { total: 0, merged: 0, rejected: 0, open: 0, avgReviewTime: "N/A", reviewDistribution: [] };
  }
}
