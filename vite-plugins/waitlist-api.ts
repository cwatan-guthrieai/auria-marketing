import type { IncomingMessage, ServerResponse } from "node:http"
import type { Plugin, ViteDevServer } from "vite"
import {
  readWaitlistBody,
  subscribeToWaitlist,
  waitlistConfig,
} from "./waitlist-server.ts"

async function handleWaitlist(
  root: string,
  mode: string,
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method !== "POST") {
    res.statusCode = 405
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Method not allowed" }))
    return
  }

  const payload = await readWaitlistBody(req)
  if (!payload) {
    res.statusCode = 400
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Valid email is required" }))
    return
  }

  const config = waitlistConfig(root, mode)
  if (!config) {
    res.statusCode = 503
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Mailing list is not configured" }))
    return
  }

  const result = await subscribeToWaitlist(payload, config)
  if (!result.ok) {
    res.statusCode = result.status >= 400 ? result.status : 502
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: result.message }))
    return
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ ok: true }))
}

function middleware(root: string, mode: string) {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const pathName = req.url?.split("?")[0]
    if (pathName === "/api/waitlist") {
      void handleWaitlist(root, mode, req, res).catch(() => {
        res.statusCode = 502
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ error: "Waitlist signup failed" }))
      })
      return
    }
    next()
  }
}

export function waitlistApi(): Plugin {
  return {
    name: "waitlist-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware(server.config.root, server.config.mode))
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(server.config.root, server.config.mode))
    },
  }
}
