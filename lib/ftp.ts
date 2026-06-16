import * as ftp from "basic-ftp";
import { Readable } from "stream";

const FTP_HOST = process.env.FTP_HOST!;
const FTP_USER = process.env.FTP_USER!;
const FTP_PASS = process.env.FTP_PASSWORD!;
const FTP_ROOT = process.env.FTP_ROOT_PATH ?? "public_html";
const MEDIA_BASE = process.env.MEDIA_BASE_URL!;

function makeClient() {
  const client = new ftp.Client(8000);
  client.ftp.verbose = false;
  return client;
}

async function connect(client: ftp.Client) {
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASS,
    secure: false,
  });
}

/**
 * Upload a buffer to Hostinger via FTP.
 * @param buffer  File contents to upload
 * @param remotePath  Path relative to FTP_ROOT, e.g. "uploads/products/123/img.webp"
 * @returns Public URL of the uploaded file
 */
export async function ftpUpload(buffer: Buffer, remotePath: string): Promise<string> {
  const client = makeClient();
  try {
    await connect(client);
    const fullPath = `/${FTP_ROOT}/${remotePath}`;
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    await client.ensureDir(dir);
    // Wrap in array so Readable pushes the buffer as one chunk, not byte-by-byte
    await client.uploadFrom(Readable.from([buffer]), fullPath);
    return `${MEDIA_BASE}/${remotePath}`;
  } finally {
    client.close();
  }
}

/**
 * Delete a file from Hostinger via FTP.
 * Silently ignores missing files.
 * @param remotePath  Path relative to FTP_ROOT, e.g. "uploads/products/123/img.webp"
 */
export async function ftpDelete(remotePath: string): Promise<void> {
  const client = makeClient();
  try {
    await connect(client);
    await client.remove(`/${FTP_ROOT}/${remotePath}`);
  } catch {
    // File may not exist — not an error
  } finally {
    client.close();
  }
}
