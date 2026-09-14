import { useId, useState, type FormEvent } from "react"
import { ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { manifestoJoin } from "@/content/manifesto"
import { joinWaitlist } from "@/lib/waitlist"

export function WaitlistJoin() {
  const emailId = useId()
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")

    const result = await joinWaitlist({ email })
    setBusy(false)

    if (!result.ok) {
      if (result.error === "invalid_email") {
        setInvalid(true)
        return
      }
      setInvalid(false)
      setError(
        result.error === "not_configured"
          ? "The invite list is not connected yet. Try again soon."
          : "We couldn't add you right now. Try again in a moment.",
      )
      return
    }

    setInvalid(false)
    setDone(true)
  }

  return (
    <div className="studio-waitlist">
      <h2 className="studio-title about-display studio-join-title">
        <span>
          {manifestoJoin.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      </h2>

      {done ? (
        <p className="about-kicker studio-waitlist-done" role="status">
          You're on the list. We'll write when a spot opens.
        </p>
      ) : (
        <>
          {manifestoJoin.body.map((paragraph) => (
            <p key={paragraph} className="studio-body about-dek studio-join-dek">
              {paragraph}
            </p>
          ))}

          <form className="studio-waitlist-form" onSubmit={onSubmit}>
            <div className="studio-waitlist-row">
              <Label htmlFor={emailId} className="sr-only">
                Email
              </Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={busy}
                aria-invalid={invalid}
                placeholder="Email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (invalid) setInvalid(false)
                  if (error) setError("")
                }}
              />
              <button type="submit" className="studio-waitlist-submit" disabled={busy}>
                <ArrowRight strokeWidth={2.4} aria-hidden />
                {busy ? "Joining…" : manifestoJoin.formLabel}
              </button>
            </div>
            {error ? <p className="scan-error">{error}</p> : null}
          </form>
        </>
      )}
    </div>
  )
}
