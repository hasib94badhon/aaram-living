import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ftpUpload } from "@/lib/ftp";
import { randomBytes } from "crypto";
import { log } from "@/lib/logger";

export const maxDuration = 60;

const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE = 4 * 1024 * 1024;
const MAX_VIDEO = 3 * 1024 * 1024;

// Health check — visit GET /api/admin/upload while logged in to verify the route is reachable
export async function GET() {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const session = await getSession();
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch (e) {
      log.error("upload/formData", e);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const file = form.get("file") as File | null;
    const folder = (form.get("folder") as string | null)?.trim();

    if (!file || !folder) {
      return NextResponse.json({ error: "file and folder are required" }, { status: 400 });
    }
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

    log.upload.start(file.name, file.size, mime);

    let raw: Buffer;
    try {
      raw = Buffer.from(await file.arrayBuffer());
    } catch (e) {
      log.error("upload/arrayBuffer", e);
      return NextResponse.json({ error: "Failed to read file data" }, { status: 500 });
    }

    const hex = randomBytes(5).toString("hex");
    const ts = Date.now();

    let uploadBuffer: Buffer;
    let filename: string;
    let mediaType: "image" | "video";

    if (isImage) {
      try {
        const sharp = (await import("sharp")).default;
        const processed = await sharp(raw)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        log.upload.sharpDone(raw.length, processed.length);
        uploadBuffer = processed;
      } catch (e) {
        // Sharp unavailable in this runtime — upload raw file as-is
        log.upload.sharpSkip(e instanceof Error ? e.message.slice(0, 60) : "unknown error");
        uploadBuffer = raw;
      }
      filename = uploadBuffer === raw
        ? `${ts}-${hex}.${mime.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg"}`
        : `${ts}-${hex}.webp`;
      mediaType = "image";
    } else {
      uploadBuffer = raw;
      filename = `${ts}-${hex}.mp4`;
      mediaType = "video";
    }

    try {
      const url = await ftpUpload(uploadBuffer, `uploads/products/${folder}/${filename}`);
      log.upload.success(url, Date.now() - start);
      return NextResponse.json({ url, mediaType });
    } catch (err) {
      log.upload.failure("FTP upload failed");
      log.error("upload/ftp", err);
      return NextResponse.json(
        { error: "FTP upload failed. Check Vercel function logs for details." },
        { status: 500 }
      );
    }
  } catch (err) {
    // Catch-all: prevents any unhandled exception from returning HTML instead of JSON
    log.error("upload/unexpected", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
