import {
  subscribeToWaitlist,
  type WaitlistPayload,
} from "../../src/lib/waitlist-server.ts"

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  let payload: WaitlistPayload
  try {
    payload = (await req.json()) as WaitlistPayload
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = payload.email?.trim() ?? ""
  if (!email.includes("@")) {
    return Response.json({ error: "Valid email is required" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_RESEND_API_KEY
  if (!apiKey) {
    return Response.json({ error: "Mailing list is not configured" }, { status: 503 })
  }

  const result = await subscribeToWaitlist(
    {
      email,
      name: payload.name?.trim() ?? "",
      artist: payload.artist?.trim() ?? "",
      track: payload.track?.trim() ?? "",
    },
    {
      apiKey,
      segmentId: process.env.RESEND_SEGMENT_ID,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    },
  )

  if (!result.ok) {
    return Response.json(
      { error: result.message },
      { status: result.status >= 400 ? result.status : 502 },
    )
  }

  return Response.json({ ok: true })
}
