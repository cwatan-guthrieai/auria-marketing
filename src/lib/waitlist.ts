export type WaitlistEntry = {
  email: string
  name: string
  artist: string
  track: string
  at: string
}

export type JoinWaitlistInput = {
  email: string
  name?: string
  artist?: string
  track?: string
}

export type JoinWaitlistResult =
  | { ok: true }
  | { ok: false; error: "invalid_email" | "request_failed" | "not_configured" }

export async function joinWaitlist(input: JoinWaitlistInput): Promise<JoinWaitlistResult> {
  const trimmed = input.email.trim()
  if (!trimmed.includes("@")) {
    return { ok: false, error: "invalid_email" }
  }

  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: trimmed,
      name: input.name?.trim() ?? "",
      artist: input.artist?.trim() ?? "",
      track: input.track?.trim() ?? "",
    }),
  })

  if (response.status === 503) {
    return { ok: false, error: "not_configured" }
  }

  if (!response.ok) {
    return { ok: false, error: "request_failed" }
  }

  return { ok: true }
}
