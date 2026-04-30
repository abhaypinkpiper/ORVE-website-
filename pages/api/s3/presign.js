import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function sanitizeFileName(fileName) {
  const raw = String(fileName || "file");
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length > 0 ? cleaned : "file";
}

function getS3Client() {
  const region =
    process.env.S3_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION;
  const accessKeyId =
    process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!region)
    throw new Error("Missing S3_REGION (or AWS_REGION/AWS_DEFAULT_REGION)");

  return new S3Client({
    region,
    credentials: accessKeyId
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined,
  });
}

async function getPresignedUrl({ fileName, contentType }) {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("Missing S3_BUCKET");

  const safeFileName = Date.now() + sanitizeFileName(fileName);
  const key = `docs/${safeFileName}`;
  const resolvedContentType = contentType || "application/octet-stream";
  const cacheControl = "public, max-age=31536000, immutable";

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    CacheControl: cacheControl,
    ContentType: resolvedContentType,
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: 3600,
  });
  const publicUrl = String(uploadUrl).split("?")[0];

  return {
    uploadUrl,
    publicUrl,
    key,
    headers: {
      "Content-Type": resolvedContentType,
      "Cache-Control": cacheControl,
      "x-amz-acl": "public-read",
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { fileName, contentType, size } = req.body || {};
    if (!fileName) return res.status(400).json({ error: "Missing fileName" });

    if (
      typeof size === "number" &&
      Number.isFinite(size) &&
      size > 25 * 1024 * 1024
    ) {
      return res.status(413).json({ error: "File too large (max 25MB)" });
    }

    const data = await getPresignedUrl({ fileName, contentType });
    return res.status(200).json({
      uploadUrl: data.uploadUrl,
      method: "PUT",
      headers: data.headers,
      key: data.key,
      publicUrl: data.publicUrl,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e?.message || "Error generating pre-signed URL" });
  }
}
