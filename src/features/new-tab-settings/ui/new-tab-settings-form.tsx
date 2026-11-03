import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import {
  parseWebUrl,
  saveNewTabUrls,
  type NewTabUrls,
} from "@/shared/lib/new-tab-settings"

const fields = [
  { name: "normal", label: "Regular window" },
  { name: "private", label: "Private window" },
] as const

const savedDuration = 3000

type Props = {
  initialUrls: NewTabUrls
  privateAccess: boolean
}

export function NewTabSettingsForm({ initialUrls, privateAccess }: Props) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [invalidField, setInvalidField] = useState<keyof NewTabUrls>()
  const savedTimer = useRef<number>(undefined)

  useEffect(() => () => clearTimeout(savedTimer.current), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const urls: NewTabUrls = { normal: "", private: "" }

    for (const { name, label } of fields) {
      const value = String(data.get(name) ?? "").trim()
      if (!value) continue

      const url = parseWebUrl(value)
      if (!url) {
        setInvalidField(name)
        setError(`${label}: enter an http:// or https:// URL.`)
        const input = form.elements.namedItem(name)
        if (input instanceof HTMLInputElement) input.focus()
        return
      }

      urls[name] = url
    }

    setError("")
    setInvalidField(undefined)

    try {
      await saveNewTabUrls(urls)
      clearTimeout(savedTimer.current)
      setSaved(true)
      savedTimer.current = window.setTimeout(
        () => setSaved(false),
        savedDuration
      )
    } catch {
      setError("Couldn't save. Try again.")
    }
  }

  return (
    <main className="flex flex-col gap-4 p-5">
      <header>
        <h1 className="text-base font-bold">Tab To</h1>
      </header>

      <form noValidate onSubmit={handleSubmit}>
        <FieldGroup className="gap-3">
          {fields.map(({ name, label }) => (
            <Field key={name} data-invalid={invalidField === name}>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Input
                id={name}
                name={name}
                type="url"
                placeholder="https://example.com"
                defaultValue={initialUrls[name]}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={invalidField === name}
                aria-describedby={
                  invalidField === name ? "feedback" : undefined
                }
                onChange={() => {
                  setInvalidField(undefined)
                  setError("")
                }}
              />
            </Field>
          ))}
          {privateAccess ? null : (
            <p className="text-xs text-muted-foreground -mt-1">
              To use in private windows, allow it in Add-ons Manager.
            </p>
          )}
          <Button type="submit" className="w-full mt-4">
            {saved ? "Saved" : "Save"}
          </Button>
        </FieldGroup>
        {error ? (
          <FieldError id="feedback" className="mt-2 text-xs">
            {error}
          </FieldError>
        ) : null}
      </form>
    </main>
  )
}
