# any-api

Simple Node.js + TypeScript API with one POST endpoint that writes request bodies to file logs.

## What it does

- Exposes POST endpoint: `/ingest` (customizable via `POST_ENDPOINT_NAME`)
- Accepts any request body (JSON, form, text, or octet-stream)
- Writes each request as one JSON line into `logs/<endpoint>-YYYY-MM-DD.log`
- Creates a new log file each day automatically

## Run locally

```bash
npm install
npm run build
npm start
```

Send request:

```bash
curl -X POST http://localhost:3000/ingest \
  -H "Content-Type: application/json" \
  -d '{"hello":"world"}'
```

## Run in Docker

```bash
docker compose up --build
```

Then send the same `curl` request to `http://localhost:3000/ingest`.

## Environment variables

- `PORT` (default: `3000`)
- `POST_ENDPOINT_NAME` (default: `ingest`)
- `LOG_DIR` (default: `./logs` locally, `/app/logs` in Docker)

