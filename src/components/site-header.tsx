import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Product", end: true },
  { to: "/welcome", label: "Scan", end: true },
  { to: "/about", label: "About", end: true },
]

export function SiteHeader({
  overlay = false,
  wide = false,
}: {
  overlay?: boolean
  wide?: boolean
}) {
  return (
    <header
      className={cn(
        overlay
          ? "absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-black/20"
          : "border-b border-border bg-background",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 items-center justify-between px-6",
          wide ? "max-w-none px-6 sm:px-12 lg:px-20" : overlay ? "max-w-5xl" : "max-w-3xl",
        )}
      >
        <NavLink
          to="/"
          className={cn(
            "text-sm font-semibold tracking-tight",
            overlay ? "text-white" : "text-foreground",
          )}
        >
          Auria Music
        </NavLink>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {links.map((link) => (
            <Button
              key={link.to}
              variant="ghost"
              size="sm"
              className={overlay ? "text-white/70 hover:bg-white/10 hover:text-white" : undefined}
              asChild
            >
              <NavLink
                to={link.to}
                end={link.end}
                className="text-muted-foreground"
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: overlay ? "#ffffff" : "var(--foreground)",
                        fontWeight: 600,
                      }
                    : overlay
                      ? { color: "rgba(255,255,255,0.7)" }
                      : undefined
                }
              >
                {link.label}
              </NavLink>
            </Button>
          ))}
          {wide ? (
            <Button
              size="sm"
              className="ml-2 h-8 rounded-md px-3 text-xs"
              asChild
            >
              <NavLink to="/waitlist">Join waitlist</NavLink>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
