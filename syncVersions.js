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
  tauriJsonObject.version = packageJson.version;

  await writeFileSync(
    "./src-tauri/tauri.conf.json",
    JSON.stringify(tauriJsonObject, null, 2)
  );

  const updaterFileContent = {
    version: packageJson.version,
    pub_date: new Date().toISOString(),
    platforms: {
      "linux-x86_64": {
        url: `https://github.com/FreeYourStream/freedeck-configurator/releases/download/dev/freedeck-configurator_${packageJson.version}_amd64.AppImage`,
        signature: "",
      },
      "darwin-x86_64": {
        url: `https://github.com/FreeYourStream/freedeck-configurator/releases/download/dev/freedeck-configurator_${packageJson.version}_x64.dmg`,
        signature: "",
      },
      "windows-x86_64": {
        url: `https://github.com/FreeYourStream/freedeck-configurator/releases/download/dev/freedeck-configurator_${packageJson.version}_x64_en-US.msi`,
        signature: "",
      },
    },
  };
  await writeFileSync(
    "./src-tauri/updater.json",
    JSON.stringify(updaterFileContent, null, 2)
  );
}

main();
