import * as ftp from "basic-ftp";
import { Readable } from "stream";
import { log } from "@/lib/logger";

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

export async function ftpUpload(buffer: Buffer, remotePath: string): Promise<string> {
  const client = makeClient();
  const start = Date.now();
  log.ftp.connecting(FTP_HOST);
  try {
    await connect(client);
    log.ftp.connected();

    const fullPath = `/${FTP_ROOT}/${remotePath}`;
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    await client.ensureDir(dir);

    log.ftp.uploading(remotePath, buffer.length);
    // Wrap in array so Readable treats the Buffer as a single chunk, not byte-by-byte
    await client.uploadFrom(Readable.from([buffer]), fullPath);

    log.ftp.done(Date.now() - start);
    return `${MEDIA_BASE}/${remotePath}`;
  } catch (err) {
    log.ftp.error(err);
    throw err;
  } finally {
    client.close();
  }
}

export async function ftpDelete(remotePath: string): Promise<void> {
  const client = makeClient();
  log.ftp.deleting(remotePath);
  try {
    await connect(client);
    await client.remove(`/${FTP_ROOT}/${remotePath}`);
  } catch {
    // File may not exist on the server — not an error worth surfacing
  } finally {
    client.close();
  }
}
