import { cn } from "@/lib/utils"

function MarkSvg({
  viewBox,
  className,
  children,
}: {
  viewBox: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("manifesto-mark", className)}
      fill="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function MarkRecord({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 240 80" className={className}>
      <circle pathLength={1} cx="120" cy="40" r="28" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="120" cy="40" r="8" stroke="currentColor" strokeWidth="1" />
      <circle cx="120" cy="40" r="2" fill="currentColor" />
    </MarkSvg>
  )
}

export function MarkCity({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 320 90" className={className}>
      <circle pathLength={1} cx="36" cy="48" r="10" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M80 70V38M80 38h16v32" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M120 70V22h28v48" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M168 70V44h18v26" stroke="currentColor" strokeWidth="1" />
      <path
        pathLength={1}
        d="M210 36c0-14 22-14 22 0v34H210V36Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle pathLength={1} cx="284" cy="28" r="10" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkBox({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 160 90" className={className}>
      <path pathLength={1} d="M40 58 80 22l40 36v20H40V58Z" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M40 58h80" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M80 22v56" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkSplit({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 200 80" className={className}>
      <circle pathLength={1} cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="160" cy="22" r="10" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="160" cy="58" r="10" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M54 40h56L150 22M110 40 150 58" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkGlobe({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 120 80" className={className}>
      <circle pathLength={1} cx="60" cy="40" r="26" stroke="currentColor" strokeWidth="1" />
      <ellipse pathLength={1} cx="60" cy="40" rx="12" ry="26" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M34 40h52M38 28h44M38 52h44" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkSearch({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 280 90" className={className}>
      <circle pathLength={1} cx="86" cy="40" r="22" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="86" cy="40" r="7" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M102 56 124 78" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M154 28h92M154 44h72M154 60h48" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="246" cy="44" r="3" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkDatabase({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 220 90" className={className}>
      <ellipse pathLength={1} cx="110" cy="22" rx="48" ry="10" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M62 22v40c0 6 21 10 48 10s48-4 48-10V22" stroke="currentColor" strokeWidth="1" />
      <ellipse pathLength={1} cx="110" cy="42" rx="48" ry="10" stroke="currentColor" strokeWidth="1" />
      <ellipse pathLength={1} cx="110" cy="62" rx="48" ry="10" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M168 34 198 20M168 50h36" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkLedger({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 300 90" className={className}>
      <rect pathLength={1} x="48" y="16" width="140" height="58" rx="2" stroke="currentColor" />
      <path pathLength={1} d="M48 32h140M80 16v58M164 16v58" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M56 44h16M88 44h60M56 56h16M88 56h44" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="230" cy="44" r="16" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M230 36v16M224 40c3-3 9-3 12 0M224 50c3 3 9 3 12 0" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M188 44h24" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkMatch({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 280 90" className={className}>
      <rect pathLength={1} x="28" y="28" width="70" height="34" rx="2" stroke="currentColor" />
      <path pathLength={1} d="M40 40h46M40 50h30" stroke="currentColor" strokeWidth="1" />
      <rect pathLength={1} x="182" y="28" width="70" height="34" rx="2" stroke="currentColor" />
      <path pathLength={1} d="M194 40h46M194 50h30" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M98 45h84" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="140" cy="45" r="6" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkWell({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 220 80" className={className}>
      <ellipse pathLength={1} cx="110" cy="40" rx="72" ry="18" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="110" cy="40" r="6" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="52" cy="40" r="2" fill="currentColor" />
      <circle pathLength={1} cx="168" cy="40" r="2" fill="currentColor" />
      <circle pathLength={1} cx="132" cy="28" r="1.5" fill="currentColor" />
    </MarkSvg>
  )
}

export function MarkPipeline({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 320 90" className={className}>
      <rect pathLength={1} x="20" y="22" width="40" height="22" rx="2" stroke="currentColor" />
      <rect pathLength={1} x="20" y="52" width="40" height="22" rx="2" stroke="currentColor" />
      <rect pathLength={1} x="260" y="30" width="40" height="36" rx="2" stroke="currentColor" />
      <path pathLength={1} d="M60 33h40l24 15H260" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M60 63h40l24-15" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="280" cy="48" r="6" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkScanRows({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 300 90" className={className}>
      <path pathLength={1} d="M40 24h220M40 40h220M40 56h220M40 72h160" stroke="currentColor" strokeWidth="1" />
      <path className="manifesto-scan" d="M36 16v60" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="28" cy="24" r="2" fill="currentColor" />
      <circle pathLength={1} cx="28" cy="40" r="2" stroke="currentColor" />
      <circle pathLength={1} cx="28" cy="56" r="2" stroke="currentColor" />
    </MarkSvg>
  )
}

export function MarkSocieties({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 280 90" className={className}>
      <circle pathLength={1} cx="140" cy="46" r="10" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="52" cy="24" r="8" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="52" cy="68" r="8" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="228" cy="24" r="8" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="228" cy="68" r="8" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M60 28 130 42M60 64 130 50M150 42 220 28M150 50 220 64" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}

export function MarkUnclaimed({ className }: { className?: string }) {
  return (
    <MarkSvg viewBox="0 0 260 90" className={className}>
      <circle pathLength={1} cx="70" cy="44" r="16" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="130" cy="44" r="16" stroke="currentColor" strokeWidth="1" />
      <circle pathLength={1} cx="190" cy="44" r="16" stroke="currentColor" strokeDasharray="3 4" />
      <path pathLength={1} d="M70 38v12M64 42c3-3 9-3 12 0" stroke="currentColor" strokeWidth="1" />
      <path pathLength={1} d="M130 38v12M124 42c3-3 9-3 12 0" stroke="currentColor" strokeWidth="1" />
    </MarkSvg>
  )
}
