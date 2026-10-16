const repo = () => process.env.GITHUB_REPO || "paoktsis926-stack/mario-k-official";
const branch = () => process.env.GITHUB_BRANCH || "main";
const headers = () => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "mario-k-admin",
  "Content-Type": "application/json",
});
const url = (p: string) => `https://api.github.com/repos/${repo()}/contents/${p}`;

export async function getFile(path: string) {
  const r = await fetch(`${url(path)}?ref=${branch()}`, { headers: headers(), cache: "no-store" });
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  return { text: Buffer.from(j.content, "base64").toString("utf8"), sha: j.sha as string };
}

export async function putFile(path: string, contentB64: string, message: string, sha?: string) {
  const r = await fetch(url(path), {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ message, content: contentB64, branch: branch(), sha }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(r.status === 409 ? "CONFLICT" : `GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).content.sha as string;
}
