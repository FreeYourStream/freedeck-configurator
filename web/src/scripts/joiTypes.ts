import { convertFromDirectory } from "joi-to-typescript";

async function generateTypes(): Promise<void> {
  console.log("Running joi-to-typescript...");

  // Configure your settings here
  const result = await convertFromDirectory({
    schemaDirectory: "./src/schemas",
    typeOutputDirectory: "./src/generated",
    debug: true,
    schemaFileSuffix: "Schema",
  });

  if (result) {
    console.log("Completed joi-to-typescript");
  } else {
    console.log("Failed to run joi-to-typescrip");
  }
}

generateTypes();
