export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-1 px-6 py-8 text-center text-xs text-muted-foreground">
        <p>Auria Music by Auria Labs Inc. 2026 All Rights Reserved</p>
        <p>
          Contact{" "}
          <a href="mailto:admin@aurialabs.co" className="underline-offset-2 hover:underline">
            admin@aurialabs.co
          </a>
        </p>
      </div>
    </footer>
  )
}
