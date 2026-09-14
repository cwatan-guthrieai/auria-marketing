import { readFileSync } from "node:fs"
import path from "node:path"
import type { IncomingMessage, ServerResponse } from "node:http"
import type { Plugin, ViteDevServer } from "vite"
import { loadEnv } from "vite"
import {
  analyzeSoundchartsArtist,
  searchSoundchartsArtists,
  type SoundchartsCreds,
} from "../src/lib/soundcharts-server.ts"

function parseSiblingEnv(filePath: string) {
  const values: Record<string, string> = {}
  try {
    for (const line of readFileSync(filePath, "utf8").split("\n")) {
      const match = line.match(/^(SOUNDCHARTS_[A-Z0-9_]+)=(.*)$/)
      if (match) {
        values[match[1]] = match[2].trim()
      }
    }
  } catch {
    return values
  }
  return values
}

function credentials(root: string, mode: string): SoundchartsCreds | null {
  const fromVite = loadEnv(mode, root, "SOUNDCHARTS_")
  const fromSibling = parseSiblingEnv(path.resolve(root, "../auria-platform/.env"))
  const appId = fromVite.SOUNDCHARTS_APP_ID || fromSibling.SOUNDCHARTS_APP_ID
  const apiKey = fromVite.SOUNDCHARTS_API_KEY || fromSibling.SOUNDCHARTS_API_KEY
  if (!appId || !apiKey) return null

  return {
    baseUrl: (
      fromVite.SOUNDCHARTS_API_BASE_URL ||
      fromSibling.SOUNDCHARTS_API_BASE_URL ||
      "https://customer.api.soundcharts.com"
    ).replace(/\/$/, ""),
    appId,
    apiKey,
  }
}

async function handleArtists(
  root: string,
  mode: string,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = new URL(req.url ?? "/", "http://localhost")
  const query = url.searchParams.get("q")?.trim() ?? ""
  const creds = credentials(root, mode)
  if (!creds) {
    res.statusCode = 503
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Soundcharts is not configured" }))
    return
  }

  const result = await searchSoundchartsArtists(creds, query)
  if ("error" in result) {
    res.statusCode = result.status
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: result.error }))
    return
  }

  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ items: result.items }))
}

async function handleAnalysis(
  root: string,
  mode: string,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = new URL(req.url ?? "/", "http://localhost")
  const id = url.searchParams.get("id")?.trim() ?? ""
  const query = url.searchParams.get("q")?.trim() ?? ""
  const creds = credentials(root, mode)
  if (!creds) {
    res.statusCode = 503
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Soundcharts is not configured" }))
    return
  }

  const result = await analyzeSoundchartsArtist(creds, { id, query })
  if ("error" in result) {
    res.statusCode = result.status
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: result.error }))
    return
  }

  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(result.analysis))
}

function middleware(root: string, mode: string) {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const pathName = req.url?.split("?")[0]
    if (req.method === "GET" && pathName === "/lookup/soundcharts/artists") {
      void handleArtists(root, mode, req, res).catch(() => {
        res.statusCode = 502
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ error: "Soundcharts lookup failed" }))
      })
      return
    }
    if (req.method === "GET" && pathName === "/lookup/soundcharts/analysis") {
      void handleAnalysis(root, mode, req, res).catch(() => {
        res.statusCode = 502
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ error: "Soundcharts analysis failed" }))
      })
      return
    }
    next()
  }
}

export function soundchartsLookup(): Plugin {
  return {
    name: "soundcharts-lookup",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware(server.config.root, server.config.mode))
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(server.config.root, server.config.mode))
    },
  }
}
