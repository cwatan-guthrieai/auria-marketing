import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"

const root = document.documentElement
const dark = window.matchMedia("(prefers-color-scheme: dark)")

function syncTheme() {
  root.classList.toggle("dark", dark.matches)
}

syncTheme()
dark.addEventListener("change", syncTheme)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
