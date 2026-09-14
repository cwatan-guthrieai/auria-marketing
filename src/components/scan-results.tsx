import { Link } from "react-router-dom"
import {
  formatCompact,
  formatRecoveryRange,
  trackRecovery,
  type CatalogAnalysis,
  type CatalogTrack,
  type MissingRegistration,
} from "@/lib/catalog-analysis"

const VISIBLE_TRACKS = 5

const REGISTRATION_KINDS: MissingRegistration[] = [
  "Performance",
  "Streaming",
  "Composition",
]

function missingSummary(missing: MissingRegistration[]) {
  if (missing.length === 0) return "All registrations filed"
  return `Missing ${missing.join(", ")}`
}

function trackRecoveryLabel(track: CatalogTrack) {
  const low = track.recoveryLow ?? trackRecovery(track.missing)?.low ?? 0
  const high = track.recoveryHigh ?? trackRecovery(track.missing)?.high ?? 0
  return formatRecoveryRange(low, high)
}

function previewTracks(result: CatalogAnalysis): CatalogTrack[] {
  const existing = result.tracks ?? []
  if (existing.length >= VISIBLE_TRACKS) {
    return existing.slice(0, VISIBLE_TRACKS)
  }
  const used = new Set(existing.map((track) => track.imageUrl).filter(Boolean))
  const extras: CatalogTrack[] = []
  for (const cover of result.covers) {
    if (used.has(cover)) continue
    extras.push({
      id: cover,
      name: result.artistName,
      imageUrl: cover,
      missing: ["Performance", "Streaming", "Composition"],
    })
    if (existing.length + extras.length >= VISIBLE_TRACKS) break
  }
  return [...existing, ...extras].slice(0, VISIBLE_TRACKS)
}

function totalRecoveryLabel(result: CatalogAnalysis) {
  const low = result.potentialLow
  const high = result.potentialHigh
  if (low <= 0 && high <= 0) return null
  return formatRecoveryRange(low, high)
}

export function ScanResults({ result }: { result: CatalogAnalysis }) {
  const tracks = previewTracks(result)
  const waitlist = `/waitlist?artist=${encodeURIComponent(result.artistName)}`
  const more = Math.max(0, result.recordingCount - tracks.length)
  const totalRecovery = totalRecoveryLabel(result)
  const profileImage =
    result.imageUrl ??
    result.tracks.find((track) => track.imageUrl)?.imageUrl ??
    result.covers[0]

  return (
    <div className="scan-results">
      <div className="scan-results-hero">
        <div className="scan-results-main">
          <div className="scan-results-profile">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="scan-results-profile-img"
              />
            ) : (
              <span className="scan-results-profile-fallback" aria-hidden>
                {result.artistName.slice(0, 1)}
              </span>
            )}
          </div>
          <div className="scan-results-intro">
            <h2 className="studio-title about-display">
              <span>{result.artistName}</span>
            </h2>
            <dl className="scan-results-meta">
              <div>
                <dt className="sr-only">Monthly listeners</dt>
                <dd>
                  {result.monthlyListeners
                    ? `${formatCompact(result.monthlyListeners)} monthly listeners`
                    : "Monthly listeners unavailable"}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Total works</dt>
                <dd>
                  {result.albumCount > 0
                    ? `${result.albumCount.toLocaleString("en-US")} ${result.albumCount === 1 ? "work" : "works"}`
                    : "Works unavailable"}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Recordings</dt>
                <dd>
                  {result.recordingCount.toLocaleString("en-US")}{" "}
                  {result.recordingCount === 1 ? "recording" : "recordings"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="scan-summary">
          <p className="scan-summary-label">Analysis summary</p>
          <div className="scan-summary-stats">
            <div className="scan-summary-stat">
              <p className="scan-summary-value">
                {result.missingRegistrations > 0
                  ? result.missingRegistrations.toLocaleString("en-US")
                  : "0"}
              </p>
              <p className="scan-summary-caption">
                {result.missingRegistrations > 0
                  ? result.missingRegistrations === 1
                    ? "recording still needs a filing"
                    : "recordings still need a filing"
                  : "recordings look fully filed"}
              </p>
            </div>
            <div className="scan-summary-divider" aria-hidden />
            <div className="scan-summary-stat scan-summary-stat-recovery">
              <p className="scan-summary-value">{totalRecovery ?? "—"}</p>
              <p className="scan-summary-caption">est. recoverable per year</p>
            </div>
          </div>
          <p className="scan-summary-note">
            {result.missingRegistrations > 0
              ? "Royalties may be waiting until registrations are complete."
              : "Your catalog looks registered. We'll keep watching for gaps."}
          </p>
        </div>
      </div>

      <ul className="scan-track-list">
        {tracks.map((track, index) => {
          const recovery = trackRecoveryLabel(track)
          return (
            <li key={track.id} className="scan-track-card">
              <div className="scan-track-card-main">
                <div className="scan-track-art">
                  {track.imageUrl ? (
                    <img src={track.imageUrl} alt="" className="scan-track-art-img" />
                  ) : (
                    <span className="scan-track-art-fallback" aria-hidden>
                      {track.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className="scan-track-info">
                  <p className="scan-track-name">
                    <span className="scan-track-index">{String(index + 1).padStart(2, "0")}</span>
                    {track.name}
                  </p>
                  <dl className="scan-track-meta">
                    <div>
                      <dt>ISRC</dt>
                      <dd>{track.isrc ?? "Not found"}</dd>
                    </div>
                    <div>
                      <dt>ISWC</dt>
                      <dd>{track.iswc ?? "Not found"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <ul className="scan-track-registrations" aria-label={missingSummary(track.missing)}>
                {REGISTRATION_KINDS.map((kind) => {
                  const isMissing = track.missing.includes(kind)
                  return (
                    <li
                      key={kind}
                      className={
                        isMissing ? "scan-reg-chip scan-reg-chip-missing" : "scan-reg-chip scan-reg-chip-filed"
                      }
                    >
                      {kind}
                      <span>{isMissing ? "Missing" : "Filed"}</span>
                    </li>
                  )
                })}
              </ul>
              {recovery || track.missing.length > 0 ? (
                <div className="scan-track-actions">
                  {recovery ? (
                    <div className="scan-track-recovery">
                      <div className="scan-track-recovery-amount">
                        <span className="scan-track-recovery-label">Est. recoverable</span>
                        <span className="scan-track-recovery-value">
                          {recovery}
                          <span className="scan-track-recovery-period">/yr</span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                  {track.missing.length > 0 ? (
                    <Link
                      to={`${waitlist}&track=${encodeURIComponent(track.name)}`}
                      className="scan-track-register"
                    >
                      Register Now
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </li>
          )
        })}
        {more > 0 ? (
          <li className="scan-track-card scan-track-more">
            <Link to={waitlist} className="scan-more">
              <span className="scan-more-label">+{formatCompact(more)} more recordings</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
