export function MarkVolume() {
  return (
    <div className="studio-figure" aria-hidden>
      <span className="studio-bar studio-bar-v" />
      <span className="studio-bar studio-bar-v" />
      <span className="studio-bar studio-bar-v" />
    </div>
  )
}

export function MarkOffset() {
  return (
    <div className="studio-figure studio-figure-stack" aria-hidden>
      <span className="studio-bar studio-bar-h" />
      <span className="studio-bar studio-bar-h" />
      <span className="studio-bar studio-bar-h" />
    </div>
  )
}

export function MarkWells() {
  return (
    <div className="studio-figure studio-figure-wells" aria-hidden>
      <span className="studio-dot" />
      <span className="studio-dot" />
      <span className="studio-dot" />
    </div>
  )
}

export function MarkSplitBars() {
  return (
    <div className="studio-figure studio-figure-split" aria-hidden>
      <span className="studio-bar studio-bar-h studio-bar-short" />
      <span className="studio-bar studio-bar-h" />
      <span className="studio-bar studio-bar-h studio-bar-mid" />
    </div>
  )
}
