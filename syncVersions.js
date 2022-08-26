const { readFileSync, writeFileSync } = require("fs");

const packageJson = require("./package.json");

async function main() {
  const toml = await readFileSync("./src-tauri/Cargo.toml", "utf8");
  const lines = toml.split("\n");
  const versionLineIndex = lines.findIndex((line) =>
    line.includes("version = ")
  );
  lines[versionLineIndex] = `version = "${packageJson.version}"`;
  const newToml = lines.join("\n");
  await writeFileSync("./src-tauri/Cargo.toml", newToml);

  const tauriJson = await readFileSync("./src-tauri/tauri.conf.json", "utf8");
  const tauriJsonObject = JSON.parse(tauriJson);
  tauriJsonObject.package.version = packageJson.version;

  await writeFileSync(
    "./src-tauri/tauri.conf.json",
    JSON.stringify(tauriJsonObject, null, 2)
  );
}

main();
