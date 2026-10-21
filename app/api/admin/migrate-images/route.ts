import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { isAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const maxDuration = 300;

const OWNER_REPO = () => process.env.GITHUB_REPO || "paoktsis926-stack/mario-k-official";
const BRANCH = () => process.env.GITHUB_BRANCH || "main";
const API = () => `https://api.github.com/repos/${OWNER_REPO()}`;
const headers = () => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "User-Agent": "mario-k-admin-media-migration",
});
const allowedHosts = new Set(["base44.app", "media.base44.com"]);
const imageKeys = new Set(["image_url", "hero_image", "portrait", "logo_url"]);
const isOldImage = (key: string, value: unknown): value is string => {
  if (typeof value !== "string" || !value.startsWith("https://")) return false;
  if (!imageKeys.has(key)) return false;
  try { return allowedHosts.has(new URL(value).hostname); } catch { return false; }
};
const greek: Record<string, string> = { α: "a", β: "v", γ: "g", δ: "d", ε: "e", ζ: "z", η: "i", θ: "th", ι: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o" };\nconst slug = (s: string) => s.normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[α-ω]/g, (ch) => greek[ch] || ch).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "image";

async function gh(path: string, init?: RequestInit) {
  const r = await fetch(`${API()}${path}`, { ...init, headers: headers(), cache: "no-store" });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${body.message || "API error"}`);
  return body;
}
async function githubBlob(content: string, encoding: "base64" | "utf-8") {
  return gh("/git/blobs", { method: "POST", body: JSON.stringify({ content, encoding }) });
}

export async function POST(request: Request) {
  const fail = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });
  if (!isAuthed(request)) return fail("Μη εξουσιοδοτημένο.", 401);
  if (!process.env.GITHUB_TOKEN) return fail("Λείπει το GITHUB_TOKEN.", 500);
  try {
    const contentPath = "/contents/data/content.json?ref=" + encodeURIComponent(BRANCH());
    const current = await gh(contentPath);
    const data = JSON.parse(Buffer.from(current.content, "base64").toString("utf8"));
    const files: { path: string; url: string; key: string; label: string }[] = [];
    const seen = new Map<string, string>();
    async function collect(node: any, parent: any = null, parentKey = ""): Promise<void> {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) { for (const item of node) await collect(item, null, ""); return; }
      for (const [key, value] of Object.entries(node)) {
        if (isOldImage(key, value)) {
          if (!seen.has(value)) {
            const label = String(node.title || node.name || node.hero_headline || node.brand_name || key);
            const id = createHash("sha256").update(value).digest("hex").slice(0, 12);
            const response = await fetch(value, { cache: "no-store", signal: AbortSignal.timeout(20000) });
            if (!response.ok) throw new Error(`Δεν ήταν δυνατή η λήψη εικόνας «${label}» (HTTP ${response.status}).`);
            const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
            const extByType: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
            const ext = extByType[type];
            if (!ext) throw new Error(`Η εικόνα «${label}» έχει μη υποστηριζόμενο τύπο: ${type || "άγνωστος"}.`);
            const bytes = Buffer.from(await response.arrayBuffer());
            if (!bytes.length || bytes.length > 8 * 1024 * 1024) throw new Error(`Η εικόνα «${label}» είναι κενή ή ξεπερνά τα 8MB.`);
            const path = `public/uploads/${slug(label)}-${id}.${ext}`;
            const blob = await githubBlob(bytes.toString("base64"), "base64");
            files.push({ path, url: `/uploads/${path.split("/").pop()}`, key, label });
            seen.set(value, `/uploads/${path.split("/").pop()}`);
            (seen as any).set(`blob:${path}`, blob.sha);
          }
        }
      }
      for (const [key, value] of Object.entries(node)) if (value && typeof value === "object") await collect(value, node, key);
    }
    await collect(data);
    if (!files.length) return NextResponse.json({ ok: true, migrated: 0, message: "Δεν βρέθηκαν παλιές εξωτερικές φωτογραφίες για μεταφορά." });

    function replace(node: any) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) { node.forEach(replace); return; }
      for (const [key, value] of Object.entries(node)) {
        if (isOldImage(key, value)) {
          const local = seen.get(value);
          if (local) {
            node[key] = local;
            const altKey = key === "image_url" ? "image_alt" : key === "hero_image" ? "hero_image_alt" : key === "portrait" ? "portrait_alt" : "logo_alt";
            const fallback = String(node.title || node.name || node.hero_headline || node.brand_name || "MARIO K - επαγγελματίας DJ");
            if (!node[altKey]) node[altKey] = `MARIO K - ${fallback}`.slice(0, 180);
          }
        } else if (value && typeof value === "object") replace(value);
      }
    }
    replace(data);

    const ref = await gh(`/git/ref/heads/${encodeURIComponent(BRANCH())}`);
    const parentSha = ref.object.sha;
    const parentCommit = await gh(`/git/commits/${parentSha}`);
    const treeEntries = files.map((file) => ({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: (seen as any).get(`blob:${file.path}`),
    }));
    const contentBlob = await githubBlob(JSON.stringify(data, null, 1), "utf-8");
    treeEntries.push({ path: "data/content.json", mode: "100644", type: "blob", sha: contentBlob.sha } as any);
    const configResponse = await gh("/contents/next.config.ts?ref=" + encodeURIComponent(BRANCH()));
    const configText = Buffer.from(configResponse.content, "base64").toString("utf8");
    const configWithoutLegacyHosts = configText.replace(/  images: \{\s*remotePatterns: \[\s*\{ protocol: "https", hostname: "base44\.app" \},\s*\{ protocol: "https", hostname: "media\.base44\.com" \},\s*\],\s*\},\s*/, "");
    if (configWithoutLegacyHosts !== configText) {
      const configBlob = await githubBlob(configWithoutLegacyHosts, "utf-8");
      treeEntries.push({ path: "next.config.ts", mode: "100644", type: "blob", sha: configBlob.sha } as any);
    }
    const tree = await gh("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeEntries }) });
    const commit = await gh("/git/commits", { method: "POST", body: JSON.stringify({ message: "Migrate site images to first-party media library", tree: tree.sha, parents: [parentSha] }) });
    await gh(`/git/refs/heads/${encodeURIComponent(BRANCH())}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
    return NextResponse.json({ ok: true, migrated: files.length, message: `Μεταφέρθηκαν ${files.length} φωτογραφίες σε δική σου φιλοξενία. Το site θα ενημερωθεί μετά το deployment.` });
  } catch (error) {
    return fail((error as Error).message || "Αποτυχία μεταφοράς φωτογραφιών.", 502);
  }
}
