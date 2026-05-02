import express, { Request } from "express";
import { promises as fs } from "fs";
import path from "path";

const DEFAULT_POST_ENDPOINT_NAME = "ingest";

const app = express();

const port = Number(process.env.PORT ?? 3000);
const endpointName = (process.env.POST_ENDPOINT_NAME ?? DEFAULT_POST_ENDPOINT_NAME).replace(/^\/+|\/+$/g, "") || DEFAULT_POST_ENDPOINT_NAME;
const endpointPath = `/${endpointName}`;
const logDir = process.env.LOG_DIR ?? path.join(process.cwd(), "logs");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.text({ type: ["text/*", "application/xml", "application/x-yaml"], limit: "10mb" }));
app.use(express.raw({ type: "application/octet-stream", limit: "10mb" }));

function getCurrentDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getLogFileName(): string {
  return `${endpointName}-${getCurrentDate()}.log`;
}

function normalizeBody(body: unknown): unknown {
  if (Buffer.isBuffer(body)) {
    return {
      encoding: "base64",
      data: body.toString("base64")
    };
  }
  return body;
}

async function appendLogLine(req: Request): Promise<string> {
  const logFilePath = path.join(logDir, getLogFileName());
  const logRecord = {
    timestamp: new Date().toISOString(),
    body: normalizeBody(req.body)
  };

  await fs.mkdir(logDir, { recursive: true });
  await fs.appendFile(logFilePath, `${JSON.stringify(logRecord)}\n`, "utf8");

  return logFilePath;
}

app.post(endpointPath, async (req, res) => {
  try {
    const logFilePath = await appendLogLine(req);
    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      status: "error",
      message,
    });
  }
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
  console.log(`POST endpoint: ${endpointPath}`);
  console.log(`Log directory: ${logDir}`);
});

