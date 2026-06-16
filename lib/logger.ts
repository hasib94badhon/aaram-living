// Development-only structured logger.
// Every method is a no-op in production — zero overhead when NODE_ENV=production.
// Set DEBUG_MODE=true in .env to see Prisma queries and verbose proxy/session logs.

const DEV = process.env.NODE_ENV !== "production";
const DEBUG = process.env.DEBUG_MODE === "true";

// ── ANSI terminal colours ────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
} as const;

function tag(colour: string, label: string) {
  return `${colour}${c.bold}[${label}]${c.reset}`;
}

// ── Formatting helpers (exported so ftp.ts / route.ts can reuse them) ────────

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

export function fmtMs(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}s` : `${n}ms`;
}

// ── Logger ───────────────────────────────────────────────────────────────────

export const log = {
  // ── Authentication ─────────────────────────────────────────────────────────
  auth: {
    attempt(email: string) {
      if (!DEV) return;
      console.log(`${tag(c.yellow, "AUTH")} Login attempt ${c.gray}${email}${c.reset}`);
    },
    success(email: string, role: string, userId: number) {
      if (!DEV) return;
      console.log(
        `${tag(c.green, "AUTH")} ${c.green}✓${c.reset} Login: ${email} (${role} #${userId})`
      );
    },
    failure(email: string) {
      if (!DEV) return;
      console.log(
        `${tag(c.red, "AUTH")} ${c.red}✗${c.reset} Login failed: ${c.gray}${email}${c.reset}`
      );
    },
    signup(email: string, userId: number) {
      if (!DEV) return;
      console.log(
        `${tag(c.green, "AUTH")} ${c.green}✓${c.reset} Signup: ${email} (userId:${userId})`
      );
    },
    logout(userId: number) {
      if (!DEV) return;
      console.log(`${tag(c.yellow, "AUTH")} Logout userId:${userId}`);
    },
  },

  // ── File uploads ───────────────────────────────────────────────────────────
  upload: {
    start(filename: string, sizeBytes: number, mimeType: string) {
      if (!DEV) return;
      console.log(
        `${tag(c.magenta, "UPLOAD")} Started: ${c.bold}${filename}${c.reset} ` +
          `${fmtBytes(sizeBytes)} [${mimeType}]`
      );
    },
    sharpDone(inputBytes: number, outputBytes: number) {
      if (!DEV) return;
      const pct = Math.round((1 - outputBytes / inputBytes) * 100);
      console.log(
        `${tag(c.magenta, "UPLOAD")} Sharp: ${fmtBytes(inputBytes)} → ` +
          `${c.green}${fmtBytes(outputBytes)}${c.reset} WebP (${pct}% smaller)`
      );
    },
    sharpSkip(reason: string) {
      if (!DEV) return;
      console.log(
        `${tag(c.yellow, "UPLOAD")} Sharp unavailable (${reason}) — uploading original`
      );
    },
    success(url: string, elapsedMs: number) {
      if (!DEV) return;
      console.log(
        `${tag(c.magenta, "UPLOAD")} ${c.green}✓${c.reset} Done ${fmtMs(elapsedMs)} → ${c.cyan}${url}${c.reset}`
      );
    },
    failure(reason: string) {
      if (!DEV) return;
      console.log(`${tag(c.red, "UPLOAD")} ${c.red}✗${c.reset} ${reason}`);
    },
  },

  // ── FTP operations ─────────────────────────────────────────────────────────
  ftp: {
    connecting(host: string) {
      if (!DEV) return;
      console.log(`${tag(c.cyan, "FTP")} Connecting → ${host}`);
    },
    connected() {
      if (!DEV || !DEBUG) return;
      console.log(`${tag(c.cyan, "FTP")} ${c.green}✓${c.reset} Connected`);
    },
    uploading(remotePath: string, sizeBytes: number) {
      if (!DEV) return;
      console.log(
        `${tag(c.cyan, "FTP")} Uploading ${c.gray}${remotePath}${c.reset} (${fmtBytes(sizeBytes)})`
      );
    },
    done(elapsedMs: number) {
      if (!DEV) return;
      console.log(`${tag(c.cyan, "FTP")} ${c.green}✓${c.reset} Complete (${fmtMs(elapsedMs)})`);
    },
    deleting(remotePath: string) {
      if (!DEV || !DEBUG) return;
      console.log(`${tag(c.cyan, "FTP")} Delete ${c.gray}${remotePath}${c.reset}`);
    },
    error(err: unknown) {
      if (!DEV) return;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`${tag(c.red, "FTP")} ${c.red}✗${c.reset} ${msg}`);
    },
  },

  // ── Prisma / database ──────────────────────────────────────────────────────
  db: {
    // Always shown when a query exceeds the slow-query threshold (200 ms)
    slowQuery(query: string, durationMs: number) {
      if (!DEV) return;
      const preview = query.replace(/\s+/g, " ").trim().slice(0, 90);
      console.log(
        `${tag(c.yellow, "DB")} ⚠ Slow ${fmtMs(durationMs)}: ${c.gray}${preview}…${c.reset}`
      );
    },
    // Shown for every query only when DEBUG_MODE=true
    query(query: string, durationMs: number) {
      if (!DEV || !DEBUG) return;
      const preview = query.replace(/\s+/g, " ").trim().slice(0, 100);
      console.log(`${tag(c.gray, "DB")} ${fmtMs(durationMs)} ${c.gray}${preview}${c.reset}`);
    },
    warn(msg: string) {
      if (!DEV) return;
      console.log(`${tag(c.yellow, "DB")} ⚠ ${msg}`);
    },
    error(msg: string) {
      // DB errors are always logged — they indicate real problems
      console.error(`${tag(c.red, "DB")} ${c.red}✗ ${msg}${c.reset}`);
    },
  },

  // ── Proxy / middleware ─────────────────────────────────────────────────────
  proxy: {
    // Log every redirect the proxy performs (auth failures, guest-only enforcement)
    redirect(from: string, to: string, reason: string) {
      if (!DEV) return;
      console.log(
        `${tag(c.blue, "PROXY")} ${from} → ${to} ${c.gray}(${reason})${c.reset}`
      );
    },
    // Verbose: logged only in DEBUG_MODE — shows each successful protected-route pass
    allow(pathname: string, role: string, userId: number) {
      if (!DEV || !DEBUG) return;
      console.log(
        `${tag(c.blue, "PROXY")} ${c.green}✓${c.reset} ${pathname} (${role}:${userId})`
      );
    },
  },

  // ── General purpose ────────────────────────────────────────────────────────
  info(msg: string) {
    if (!DEV) return;
    console.log(`${tag(c.cyan, "INFO")} ${msg}`);
  },
  warn(msg: string) {
    if (!DEV) return;
    console.warn(`${tag(c.yellow, "WARN")} ${msg}`);
  },
  error(location: string, err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`${tag(c.red, "ERROR")} [${location}] ${c.red}${msg}${c.reset}`);
    if (DEBUG && err instanceof Error && err.stack) {
      console.error(`${c.gray}${err.stack}${c.reset}`);
    }
  },
  success(msg: string) {
    if (!DEV) return;
    console.log(`${tag(c.green, "OK")} ${c.green}${msg}${c.reset}`);
  },
  debug(msg: string) {
    if (!DEV || !DEBUG) return;
    console.log(`${tag(c.gray, "DEBUG")} ${c.gray}${msg}${c.reset}`);
  },
};
