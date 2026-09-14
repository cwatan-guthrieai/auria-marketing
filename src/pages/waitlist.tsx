import { useId, useState, type FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import { StudioFrame } from "@/components/studio-frame"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { joinWaitlist } from "@/lib/waitlist"

export function WaitlistPage() {
  const emailId = useId()
  const nameId = useId()
  const [params] = useSearchParams()
  const artist = params.get("artist")?.trim() ?? ""
  const track = params.get("track")?.trim() ?? ""
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")

    const result = await joinWaitlist({ email, name, artist, track })
    setBusy(false)

    if (!result.ok) {
      setError(
        result.error === "invalid_email"
          ? "Enter a valid email address."
          : result.error === "not_configured"
            ? "The invite list is not connected yet. Try again soon."
            : "We couldn't add you right now. Try again in a moment.",
      )
      return
    }

    setDone(true)
  }

  const dek = artist
    ? track
      ? `We'll save a spot for ${artist} and walk "${track}" with you. Auria is invite-only — leave your email and we'll go through the full catalog together.`
      : `We'll save a spot for ${artist}. Auria is invite-only — leave your email and we'll walk the full catalog with you.`
    : "Auria is invite-only. Leave your email and we'll walk your full catalog with you — every track, every missing registration."

  return (
    <StudioFrame>
      <section className="studio-slide relative min-h-svh overflow-hidden bg-transparent">
        <div
          data-tone="ink"
          className="studio-slide-frame relative flex min-h-svh flex-col justify-center px-6 sm:px-12 lg:px-20"
        >
          <div className="studio-waitlist waitlist-page">
            <p className="about-kicker">Invite list</p>
            <h1 className="studio-title about-display studio-join-title">
              <span>
                <span className="block">See every song</span>
                <span className="block">that still needs</span>
                <span className="block">a filing</span>
              </span>
            </h1>
            <p className="studio-body about-dek studio-join-dek">{dek}</p>

            {done ? (
              <p className="about-kicker studio-waitlist-done" role="status">
                You're on the list. We'll write when a spot opens.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="studio-waitlist-form waitlist-page-form">
                <div className="waitlist-page-fields">
                  <div className="waitlist-page-field">
                    <Label htmlFor={nameId} className="sr-only">
                      Name
                    </Label>
                    <Input
                      id={nameId}
                      name="name"
                      autoComplete="name"
                      placeholder="Name"
                      disabled={busy}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className="waitlist-page-field">
                    <Label htmlFor={emailId} className="sr-only">
                      Email
                    </Label>
                    <Input
                      id={emailId}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Email"
                      disabled={busy}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="studio-waitlist-submit" disabled={busy}>
                  {busy ? "Joining…" : "Join Auria"}
                </button>
                {error ? <p className="scan-error">{error}</p> : null}
              </form>
            )}
          </div>
        </div>
      </section>
    </StudioFrame>
  )
}
