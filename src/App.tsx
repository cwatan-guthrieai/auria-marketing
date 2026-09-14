import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { AboutPage } from "@/pages/about"
import { HomePage } from "@/pages/home"
import { WaitlistPage } from "@/pages/waitlist"
import { ResultsPage } from "@/pages/results"
import { WelcomePage } from "@/pages/welcome"

function DocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === "/about") {
      document.title = "How Auria Works — Auria Music"
      return
    }
    if (pathname === "/welcome") {
      document.title = "Scan your catalog — Auria Music"
      return
    }
    if (pathname === "/results") {
      document.title = "Catalog scan results — Auria Music"
      return
    }
    if (pathname === "/waitlist") {
      document.title = "Join the waitlist — Auria Music"
      return
    }
    document.title = "Auria Music — Your digital rights portfolio"
  }, [pathname])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const welcome = pathname === "/welcome"
  const results = pathname === "/results"
  const waitlist = pathname === "/waitlist"
  const studio = pathname === "/" || pathname === "/about" || welcome || results || waitlist
  const fullBleed = studio

  return (
    <div
      className={
        studio ? "flex min-h-svh flex-col bg-transparent" : "flex min-h-svh flex-col"
      }
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <DocumentTitle />
      {studio ? null : <SiteHeader />}
      <main
        id="main"
        className={fullBleed ? "flex-1" : "mx-auto w-full max-w-3xl flex-1 px-6"}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {studio ? null : <SiteFooter />}
    </div>
  )
}
