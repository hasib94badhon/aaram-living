// Next.js calls register() once at server startup — before any requests are handled.
// Guard with NEXT_RUNTIME === 'nodejs' so this never runs on the Edge runtime.

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV === "production") return;

  const { execSync } = await import("child_process");
  const { default: prisma } = await import("./lib/prisma");

  // ── ANSI helpers (local — don't import logger here to avoid circular deps) ─
  const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
  const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
  const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
  const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
  const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
  const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
  const line = "═".repeat(46);

  // ── Git branch ──────────────────────────────────────────────────────────────
  let branch = dim("unknown");
  try {
    const raw = execSync("git branch --show-current", {
      stdio: ["pipe", "pipe", "pipe"],
    })
      .toString()
      .trim();
    branch = raw || dim("(detached HEAD)");
  } catch {
    // Not a git repo or git not in PATH
  }

  // ── Database connectivity ───────────────────────────────────────────────────
  let dbStatus: string;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout after 5s")), 5000)
      ),
    ]);
    dbStatus = green("✓ Connected");
  } catch (err) {
    const msg = err instanceof Error ? err.message.slice(0, 50) : String(err);
    dbStatus = red(`✗ ${msg}`);
  }

  // ── FTP config (we report config, not connectivity — FTP test adds ~2s delay) ─
  const ftpHost = process.env.FTP_HOST;
  const ftpUser = process.env.FTP_USER;
  const ftpStatus =
    ftpHost && ftpUser
      ? green(`✓ Configured`) + dim(` (${ftpHost} / ${ftpUser})`)
      : yellow("⚠  FTP_HOST / FTP_USER not set in .env");

  // ── Media base URL ──────────────────────────────────────────────────────────
  const mediaBase = process.env.MEDIA_BASE_URL ?? yellow("(not set)");

  // ── DEBUG_MODE ──────────────────────────────────────────────────────────────
  const debugStatus =
    process.env.DEBUG_MODE === "true"
      ? green("ON") + dim(" — all DB queries visible in terminal")
      : dim("off  (set DEBUG_MODE=true to enable verbose query logs)");

  // ── Banner ──────────────────────────────────────────────────────────────────
  console.log(
    [
      "",
      bold(green(line)),
      bold(green("  AARAM LIVING — DEV SERVER")),
      bold(green(line)),
      `  ${bold("Environment")}  ${process.env.NODE_ENV}`,
      `  ${bold("Database")}     ${dbStatus}`,
      `  ${bold("FTP")}          ${ftpStatus}`,
      `  ${bold("Media URL")}    ${cyan(String(mediaBase))}`,
      `  ${bold("Branch")}       ${branch}`,
      `  ${bold("URL")}          ${cyan("http://localhost:3000")}`,
      `  ${bold("DEBUG_MODE")}   ${debugStatus}`,
      bold(green(line)),
      "",
    ].join("\n")
  );
}
