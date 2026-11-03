# Tab To

Pick which site opens in a new tab. Regular and private windows each get their own URL.

## Usage

Click the Tab To icon in the toolbar, enter a URL for each window type, and click **Save**. Leave a field empty for a blank tab.

For private windows, go to `about:addons` → Tab To and set **Run in Private Windows** to **Allow**.

Notes:

- Only `http://` and `https://` URLs work.
- The private URL also replaces the first page of a new private window. Firefox shows its own private browsing page for a moment before the redirect; there's no way for an extension to skip it.
- A new regular window still opens your Firefox home page. Only new tabs use the URL.

## Privacy

Tab To doesn't collect or send any data. Your URLs are saved in Firefox's local extension storage and never leave your computer.

Permissions:

- `storage`: saves your URLs.
- `tabs`: checks whether the first tab of a new private window is the private browsing page, so links opened in a private window aren't redirected.

## Build

Requires Node.js 22.12+ and Firefox 140+.

```sh
npm ci
npm run package
```

This builds into `dist/` and creates `tab-to.zip`.

For development, run `npm run dev`. It opens a separate Firefox with the extension loaded and reloads it whenever you save a file. Restart it after editing `public/`.

To test the zip in your own Firefox, open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and select `tab-to.zip`. Temporary add-ons are removed when Firefox restarts.

## License

MIT
