import { createRoot } from "react-dom/client"
import { NewTabSettingsForm } from "@/features/new-tab-settings/ui/new-tab-settings-form"
import { getNewTabUrls } from "@/shared/lib/new-tab-settings"
import "./index.css"

const root = createRoot(document.getElementById("root")!)

try {
  const [urls, privateAccess] = await Promise.all([
    getNewTabUrls(),
    browser.extension.isAllowedIncognitoAccess(),
  ])

  root.render(
    <NewTabSettingsForm initialUrls={urls} privateAccess={privateAccess} />
  )
} catch {
  root.render(
    <p className="p-5 text-sm" role="alert">
      Couldn't load settings. Reopen the popup.
    </p>
  )
}
