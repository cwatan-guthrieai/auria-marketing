import { useEffect, useId, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  searchSoundchartsArtists,
  type SoundchartsProfile,
} from "@/lib/soundcharts"
import { cn } from "@/lib/utils"

function looksLikeUrl(value: string) {
  return /https?:\/\/|open\.spotify\.com|music\.apple\.com|soundcloud\.com|deezer\.com|youtube\.com|youtu\.be/i.test(
    value,
  )
}

export function ArtistSuggest({
  id,
  value,
  disabled,
  invalid,
  describedBy,
  onValueChange,
  onSelect,
}: {
  id: string
  value: string
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onValueChange: (value: string) => void
  onSelect: (profile: SoundchartsProfile) => void
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<SoundchartsProfile[]>([])
  const [active, setActive] = useState(0)
  const [failed, setFailed] = useState(false)
  const [locked, setLocked] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) {
      setOpen(false)
      setLoading(false)
      setLocked(true)
    }
  }, [disabled])

  useEffect(() => {
    if (locked) {
      setOpen(false)
      setLoading(false)
      return
    }

    const query = value.trim()
    if (looksLikeUrl(query) || query.length < 2) {
      setProfiles([])
      setOpen(false)
      setLoading(false)
      setFailed(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      setFailed(false)
      void searchSoundchartsArtists(query, controller.signal)
        .then((items) => {
          if (controller.signal.aborted) {
            return
          }
          setProfiles(items)
          setActive(0)
          setOpen(true)
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return
          }
          if (error instanceof DOMException && error.name === "AbortError") {
            return
          }
          setProfiles([])
          setFailed(true)
          setOpen(true)
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false)
          }
        })
    }, 280)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [value, locked])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  function choose(profile: SoundchartsProfile) {
    setLocked(true)
    setOpen(false)
    setProfiles([])
    setLoading(false)
    setFailed(false)
    onValueChange(profile.name)
    onSelect(profile)
  }

  return (
    <div ref={wrapRef} className="relative min-w-0 flex-1">
      <Input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          open && profiles[active] ? `${listId}-${profiles[active].id}` : undefined
        }
        value={value}
        onChange={(event) => {
          setLocked(false)
          onValueChange(event.target.value)
        }}
        onFocus={() => {
          if (locked || disabled) {
            return
          }
          if (profiles.length > 0 || failed) {
            setOpen(true)
          }
        }}
        onKeyDown={(event) => {
          if (!open || profiles.length === 0) {
            return
          }
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setActive((index) => (index + 1) % profiles.length)
          }
          if (event.key === "ArrowUp") {
            event.preventDefault()
            setActive((index) => (index - 1 + profiles.length) % profiles.length)
          }
          if (event.key === "Enter" && profiles[active]) {
            event.preventDefault()
            choose(profiles[active])
          }
          if (event.key === "Escape") {
            setOpen(false)
          }
        }}
        placeholder="Artist name or profile link"
        autoComplete="off"
        disabled={disabled}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        className="h-[3.15rem] rounded-full border-0 bg-white px-5 text-[#111] placeholder:text-neutral-400"
      />

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+6px)] z-20 max-h-64 w-full overflow-auto rounded-2xl bg-white p-1 text-[#111] shadow-lg"
        >
          {loading && profiles.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-500">Finding profiles…</li>
          ) : null}
          {failed ? (
            <li className="px-3 py-2 text-sm text-neutral-500">
              Profiles couldn’t load. Try again.
            </li>
          ) : null}
          {!loading && !failed && profiles.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-500">
              No profile for that name.
            </li>
          ) : null}
          {profiles.map((profile, index) => (
            <li key={profile.id} role="presentation">
              <button
                id={`${listId}-${profile.id}`}
                type="button"
                role="option"
                aria-selected={index === active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm text-[#111]",
                  index === active ? "bg-neutral-100" : "hover:bg-neutral-50",
                )}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(profile)}
              >
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt=""
                    className="size-8 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs">
                    {profile.name.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-medium">{profile.name}</span>
                  {profile.country ? (
                    <span className="block text-xs text-neutral-500">{profile.country}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
