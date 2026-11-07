/**
 * Alur rilis satu perintah.
 *   npm run release                 -> format, lint, test, build, salin ke release/
 *   npm run release -- --skip-test  -> sama, tapi melewati test
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const skipTest = process.argv.includes("--skip-test");

const step = (label, cmd) => {
  console.log(`\n==> ${label}`);
  execSync(cmd, { stdio: "inherit" });
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

// Format dulu (menulis ulang file), jadi tidak perlu gagal hanya karena spasi
step("Format", "npm run format");
step("Lint", "npm run lint");

if (skipTest) {
  console.log("\n==> Test dilewati (--skip-test)");
} else {
  step("Test", "npm run test");
}

step("Build", "npm run build");

const source = join("dist", "index.html");
if (!existsSync(source)) {
  console.error(`\nGagal: ${source} tidak ditemukan setelah build.`);
  process.exit(1);
}

const outDir = "release";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, `${pkg.name}-v${pkg.version}.html`);
copyFileSync(source, target);

console.log(`\nRilis siap: ${target}`);
