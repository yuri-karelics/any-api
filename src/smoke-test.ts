import { readFileSync, existsSync } from "fs";
import path from "path";

const endpointName = process.env.POST_ENDPOINT_NAME ?? "ingest";
const date = new Date().toISOString().slice(0, 10);
const logPath = path.join(process.cwd(), "logs", `${endpointName}-${date}.log`);

if (!existsSync(logPath)) {
  console.error(`Missing log file: ${logPath}`);
  process.exit(1);
}

const content = readFileSync(logPath, "utf8").trim();
if (!content) {
  console.error(`Log file is empty: ${logPath}`);
  process.exit(1);
}

console.log(`Smoke test passed: ${logPath}`);

