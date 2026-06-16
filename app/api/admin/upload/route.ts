import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ftpUpload } from "@/lib/ftp";
import { randomBytes } from "crypto";

// Extend Vercel function timeout beyond the default 10 s
export const maxDuration = 60;

const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE = 4 * 1024 * 1024; // 4 MB raw (→ ~300 KB WebP after sharp)
const MAX_VIDEO = 3 * 1024 * 1024; // 3 MB (Vercel free body limit ~4.5 MB)

// GET — health check so you can verify the route is reachable
export async function GET() {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch (e) {
      console.error("[upload] formData parse error:", e);
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

    let raw: Buffer;
    try {
      raw = Buffer.from(await file.arrayBuffer());
    } catch (e) {
      console.error("[upload] arrayBuffer error:", e);
      return NextResponse.json({ error: "Failed to read file data" }, { status: 500 });
    }

    const hex = randomBytes(5).toString("hex");
    const ts = Date.now();

    let uploadBuffer: Buffer;
    let filename: string;
    let mediaType: "image" | "video";

    if (isImage) {
      try {
        // Dynamic import avoids any bundling issues — sharp is already auto-externalized
        const sharp = (await import("sharp")).default;
        uploadBuffer = await sharp(raw)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
      } catch (e) {
        console.error("[upload] sharp error:", e);
        return NextResponse.json({ error: "Image processing failed — is it a valid image?" }, { status: 500 });
      }
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
      return NextResponse.json({ error: "FTP upload failed. Check Vercel function logs for details." }, { status: 500 });
    }
  } catch (err) {
    // Catch-all: prevents unhandled exception from returning HTML instead of JSON
    console.error("[upload] unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
