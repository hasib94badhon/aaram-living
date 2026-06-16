import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ftpUpload } from "@/lib/ftp";
import sharp from "sharp";
import { randomBytes } from "crypto";

const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE = 4 * 1024 * 1024; // 4 MB raw (→ ~300 KB WebP after sharp)
const MAX_VIDEO = 3 * 1024 * 1024; // 3 MB (Vercel free body limit is ~4.5 MB)

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string | null)?.trim();

  if (!file || !folder) {
    return NextResponse.json({ error: "file and folder are required" }, { status: 400 });
  }

  // Prevent path traversal — only alphanumeric, dash, underscore allowed
  if (!/^[\w-]{1,64}$/.test(folder)) {
    return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
  }

  const mime = file.type.toLowerCase();
  const isImage = ALLOWED_IMAGE.has(mime);
  const isVideo = ALLOWED_VIDEO.has(mime);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only images (jpg/png/webp/gif) or videos (mp4/webm) are allowed" },
      { status: 400 }
    );
  }

  const sizeLimit = isImage ? MAX_IMAGE : MAX_VIDEO;
  if (file.size > sizeLimit) {
    const mb = sizeLimit / 1024 / 1024;
    return NextResponse.json(
      { error: `File too large. Maximum ${mb} MB for ${isImage ? "images" : "videos"}` },
      { status: 400 }
    );
  }

  const raw = Buffer.from(await file.arrayBuffer());
  const hex = randomBytes(5).toString("hex");
  const ts = Date.now();

  let uploadBuffer: Buffer;
  let filename: string;
  let mediaType: "image" | "video";

  if (isImage) {
    // Resize to max 1200×1200 and convert to WebP — reduces file size dramatically
    uploadBuffer = await sharp(raw)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    filename = `${ts}-${hex}.webp`;
    mediaType = "image";
  } else {
    uploadBuffer = raw;
    filename = `${ts}-${hex}.mp4`;
    mediaType = "video";
  }

  try {
    const url = await ftpUpload(uploadBuffer, `uploads/products/${folder}/${filename}`);
    return NextResponse.json({ url, mediaType });
  } catch (err) {
    console.error("[upload] FTP error:", err);
    return NextResponse.json({ error: "Upload failed — please try again" }, { status: 500 });
  }
}
