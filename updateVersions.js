import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const newVersion = process.argv[2];
if (!newVersion) {
  console.error("No version provided.");
  process.exit(1);
}
function updateChartYamlVersion(newVersion) {
  const chartFilePath = resolve(__dirname, "chart/cohort-web/Chart.yaml");
  const chartContent = readFileSync(chartFilePath, "utf8");

  const updatedContent = chartContent.replace(
    /^appVersion:\s*"?[0-9]+\.[0-9]+\.[0-9]+"?/m,
    `appVersion: "${newVersion}"`,
  );

  writeFileSync(chartFilePath, updatedContent, "utf8");
  console.log(`Updated chart/Chart.yaml to version ${newVersion}`);
}
function updatePackageJsonVersion(newVersion) {
  const packageJsonPath = resolve(__dirname, "package.json");
  const packageJsonContent = readFileSync(packageJsonPath, "utf8");

  const packageJson = JSON.parse(packageJsonContent);
  packageJson.version = newVersion;

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");
  console.log(`Updated package.json to version ${newVersion}`);
}

updateChartYamlVersion(newVersion);
updatePackageJsonVersion(newVersion);
