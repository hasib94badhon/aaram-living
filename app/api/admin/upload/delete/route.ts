import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ftpDelete } from "@/lib/ftp";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { mediaId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const mediaId = body?.mediaId;
  if (typeof mediaId !== "number") {
    return NextResponse.json({ error: "mediaId (number) is required" }, { status: 400 });
  }

  const media = await prisma.productImage.findUnique({ where: { id: mediaId } });
  if (!media) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  // Derive relative FTP path from the public URL
  // e.g. "https://aarambd.com/uploads/products/123/img.webp"
  //   → "uploads/products/123/img.webp"
  const base = process.env.MEDIA_BASE_URL ?? "";
  const relativePath = media.url.startsWith(base + "/")
    ? media.url.slice(base.length + 1)
    : null;

  if (relativePath) {
    await ftpDelete(relativePath);
  }

  await prisma.productImage.delete({ where: { id: mediaId } });

  return NextResponse.json({ success: true });
}
