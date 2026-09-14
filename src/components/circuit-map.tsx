const NODES = [
  {
    id: "meta",
    area: "a",
    lines: ["Metadata", "Cleaning"],
    tag: "<the root cause>",
    hue: "violet",
  },
  {
    id: "reg",
    area: "b",
    lines: ["Global", "Registration"],
    tag: "<everywhere owed>",
    hue: "green",
  },
  {
    id: "own",
    area: "c",
    lines: ["Ownership"],
    tag: "<who wrote what>",
    hue: "orange",
    shape: "box",
  },
  {
    id: "roy",
    area: "d",
    lines: ["Royalty", "Aggregation"],
    tag: "<finally readable>",
    hue: "blue",
  },
  {
    id: "split",
    area: "e",
    lines: ["Splits"],
    tag: null,
    hue: "none",
    shape: "capsule",
  },
  {
    id: "dash",
    area: "f",
    lines: ["Earnings", "Dashboard"],
    tag: "<your money, clear>",
    hue: "violet",
  },
  {
    id: "live",
    area: "g",
    lines: ["Live"],
    tag: "<from the stage>",
    hue: "pink",
    shape: "box",
  },
  {
    id: "cat",
    area: "h",
    lines: ["Catalog", "& IP"],
    tag: "<organised>",
    hue: "orange",
  },
  {
    id: "perm",
    area: "i",
    lines: ["Permissions"],
    tag: "<you set that>",
    hue: "green",
  },
  {
    id: "health",
    area: "j",
    lines: ["Rights", "Health"],
    tag: "<what to fix>",
    hue: "blue",
  },
  {
    id: "filings",
    area: "k",
    lines: ["Filings"],
    tag: null,
    hue: "none",
    shape: "capsule",
  },
] as const

function CircuitWires() {
  return (
    <svg className="circuit-wires" viewBox="0 0 1200 720" fill="none" aria-hidden>
      <path d="M390 90 H620" />
      <path d="M620 90 C700 90 700 40 780 40 H1120 V90" />
      <path d="M200 210 C200 270 80 270 80 340 H240" />
      <path d="M80 340 C200 340 200 400 360 400" />
      <path d="M390 280 C520 280 520 220 640 220" />
      <path d="M900 180 V260 H1040 V340" />
      <path d="M240 500 Q320 460 400 500 T560 500 H820" />
      <path d="M180 560 C180 620 320 620 460 620 H900" />
      <path d="M1040 500 V620 H900" />
      <circle cx="620" cy="90" r="9" />
      <circle cx="360" cy="400" r="9" />
      <circle cx="820" cy="500" r="9" />
      <path d="M780 40 l7 7 -7 7 -7 -7 z" />
      <path d="M1040 340 l12 0 -7 -6 0 12" />
    </svg>
  )
}

export function CircuitMap() {
  return (
    <div className="circuit">
      <CircuitWires />
      {NODES.map((node) => (
        <article
          key={node.id}
          className={`circuit-node circuit-node-${"shape" in node ? node.shape : "box"}`}
          style={{ gridArea: node.area }}
        >
          <h3>
            {node.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h3>
          {node.tag ? (
            <p className="circuit-tag" data-hue={node.hue}>
              {node.tag}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  )
}
