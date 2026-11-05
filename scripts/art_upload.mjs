// Upload paintings from public/art/ to the Cloudflare R2 bucket that serves
// them in production (S3-compatible API, the bulk path R2 recommends).
//
//   node scripts/art_upload.mjs --dry-run            # what would be uploaded
//   node scripts/art_upload.mjs                      # upload files not yet in the bucket
//   node scripts/art_upload.mjs 02-01 03-01          # only these sections
//   node scripts/art_upload.mjs --prune-local        # after upload, delete local copies that are safely in R2
//
// Env (put them in .env.local, which is gitignored; see DEPLOY.md):
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
//
// Paintings are immutable: an existing key is never overwritten. A redone
// painting must get a new file name (e.g. 04-razm-2.avif), which is what lets
// the CDN cache every painting for a year.
import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const prune = args.includes("--prune-local");
const only = args.filter((a) => !a.startsWith("--"));

// Load .env.local without a dependency.
const envFile = join(root, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const artDir = join(root, "public/art");
const local = readdirSync(artDir)
  .filter((d) => statSync(join(artDir, d)).isDirectory() && (!only.length || only.includes(d)))
  .flatMap((d) => readdirSync(join(artDir, d)).filter((f) => f.endsWith(".avif")).map((f) => `art/${d}/${f}`));

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  if (dry) {
    console.log(`${local.length} local paintings (no R2 credentials, so the bucket was not compared):`);
    console.log(local.slice(0, 20).join("\n") + (local.length > 20 ? `\n… ${local.length - 20} more` : ""));
    process.exit(0);
  }
  console.error("Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET (see DEPLOY.md).");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// What is already in the bucket.
const remote = new Map();
let token;
do {
  const page = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: "art/", ContinuationToken: token }));
  for (const o of page.Contents ?? []) remote.set(o.Key, o.Size);
  token = page.IsTruncated ? page.NextContinuationToken : undefined;
} while (token);

const todo = local.filter((key) => !remote.has(key));
console.log(`${local.length} local, ${remote.size} in bucket, ${todo.length} to upload`);
if (dry) {
  console.log(todo.join("\n"));
  process.exit(0);
}

let done = 0;
const queue = [...todo];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let key; (key = queue.shift()); ) {
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: readFileSync(join(root, "public", key)),
          ContentType: "image/avif",
          CacheControl: "public, max-age=31536000, immutable",
          IfNoneMatch: "*", // never overwrite a painting
        }),
      );
      remote.set(key, statSync(join(root, "public", key)).size);
      if (++done % 25 === 0 || done === todo.length) console.log(`uploaded ${done}/${todo.length}`);
    }
  }),
);

if (prune) {
  let removed = 0;
  for (const key of local) {
    const size = statSync(join(root, "public", key)).size;
    const head = await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key })).catch(() => null);
    if (head && head.ContentLength === size) {
      rmSync(join(root, "public", key));
      removed++;
    }
  }
  console.log(`pruned ${removed} local files that are safely in R2. Set VITE_ART_BASE in .env.local so dev loads them from R2.`);
}
