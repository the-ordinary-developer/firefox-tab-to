import { getNewTabUrls, parseWebUrl } from "@/shared/lib/new-tab-settings"

try {
  const urls = await getNewTabUrls()
  const url = browser.extension.inIncognitoContext ? urls.private : urls.normal

  const destination = parseWebUrl(url)
  if (destination) window.location.replace(destination)
} catch {
  document.body.textContent = "Couldn't load settings."
}
