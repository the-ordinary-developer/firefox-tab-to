const storageKey = "newTabUrls"

export type NewTabUrls = {
  normal: string
  private: string
}

export function parseWebUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return null

  const url = URL.parse(trimmed)
  if (!url || url.username || url.password) return null

  return url.href
}

export async function getNewTabUrls(): Promise<NewTabUrls> {
  const settings = await browser.storage.local.get(storageKey)
  const urls = settings[storageKey] as Partial<NewTabUrls> | undefined

  return {
    normal: typeof urls?.normal === "string" ? urls.normal : "",
    private: typeof urls?.private === "string" ? urls.private : "",
  }
}

export function saveNewTabUrls(urls: NewTabUrls) {
  return browser.storage.local.set({ [storageKey]: urls })
}

export function watchNewTabUrls(listener: () => void) {
  browser.storage.local.onChanged.addListener((changes) => {
    if (storageKey in changes) listener()
  })
}
