export type WaitlistPayload = {
  email: string
  name?: string
  artist?: string
  track?: string
}

export type WaitlistConfig = {
  apiKey: string
  segmentId?: string
  audienceId?: string
}

export async function subscribeToWaitlist(
  payload: WaitlistPayload,
  config: WaitlistConfig,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const segmentId = config.segmentId || config.audienceId
  const properties: Record<string, string> = {
    source: "auria-marketing",
  }
  if (payload.artist) properties.artist = payload.artist
  if (payload.track) properties.track = payload.track

  const useLegacyAudience = Boolean(config.audienceId && !config.segmentId)
  const endpoint = useLegacyAudience
    ? `https://api.resend.com/audiences/${config.audienceId}/contacts`
    : "https://api.resend.com/contacts"

  const body: Record<string, unknown> = useLegacyAudience
    ? {
        email: payload.email,
        first_name: payload.name || undefined,
        unsubscribed: false,
      }
    : {
        email: payload.email,
        first_name: payload.name || undefined,
        unsubscribed: false,
        properties,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (response.ok) {
    return { ok: true }
  }

  const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
  const message = errorBody?.message ?? "Waitlist signup failed"

  if (
    response.status === 409 ||
    message.toLowerCase().includes("already") ||
    message.toLowerCase().includes("exist")
  ) {
    return { ok: true }
  }

  if (response.status === 401 && message.toLowerCase().includes("restricted")) {
    return {
      ok: false,
      status: 503,
      message:
        "Resend API key needs Contacts permission. Create a full-access key and set RESEND_SEGMENT_ID.",
    }
  }

  return { ok: false, status: response.status, message }
}
