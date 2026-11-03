import {
  getNewTabUrls,
  parseWebUrl,
  watchNewTabUrls,
} from "@/shared/lib/new-tab-settings"

const privateStartPage = "about:privatebrowsing"

// Read the URL when the background starts so a new private window doesn't
// wait on storage before redirecting.
let privateDestination = loadPrivateDestination()
watchNewTabUrls(() => {
  privateDestination = loadPrivateDestination()
})

async function loadPrivateDestination() {
  try {
    const urls = await getNewTabUrls()
    return parseWebUrl(urls.private)
  } catch {
    return null
  }
}

browser.windows.onCreated.addListener(async (window) => {
  if (!window.incognito || window.type !== "normal" || window.id === undefined)
    return

  const destination = await privateDestination
  if (!destination) return

  try {
    for (let attempt = 0; attempt < 100; attempt++) {
      const [tab] = await browser.tabs.query({ windowId: window.id, index: 0 })
      if (tab?.id !== undefined && tab.url === privateStartPage) {
        await browser.tabs.update(tab.id, {
          url: destination,
          loadReplace: true,
        })
        return
      }
      if (tab?.url && tab.url !== "about:blank") return

      await new Promise((resolve) => setTimeout(resolve, 20))
    }
  } catch {
    return
  }
})
