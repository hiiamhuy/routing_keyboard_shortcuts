# uwrouting
Uwrouting is a web extension which adds custom keyboard shortcuts in UW Connect for faster routing.

## Installation
First, download this repository to a known location locally. 

#### For Chrome
1. Open Chrome and type in `chrome://extensions` in the address bar. This opens the Chrome extentions page.
2. Click 'Development Mode'
3. Click 'Load unpacked extension...'
4. Choose the 'uwrouting' folder as the main folder.
5. Refresh your UW Connect window.

#### For Firefox

1. Open `about:debugging` in Firefox.
2. Click "Load Temporary Add-on".
3. Select the content.bundle.js file.

## How it Works
Each CI and AG in Connect has a specific ID. This extension fills out the CI and AG input with one of the known [CI](./src/constants/ci.js) or [AG](./src/constants/ag.js) as if you were typing it.

To use the keyboard shortcuts, you must press a combination of atleast two keyboard buttons. **The keys have to be pressed precisely in order, and not together, but in sequence.**

For example, to route a REQ to the Reported Spam AG, press: `~ + r`. And then press `~ enter`. 
- `~ r`: Change CI = "No Configuration Item" and AG = "UW-IT Reported Spam".
- `~ enter`: Clicks the update button.

## Commands
See the full [list](./documentation/combo.md) of commands, or the extension's Options page after installing.

Note that the navigation shortcuts are defined in [src/content.js](./src/content.js) rather than the combo table, so they are not in that generated list: `` ` enter`` updates the request, `` ` right`` opens the next request from the nav page, and `` ` space`` returns to the home page.

## Development setup

1. Clone this repository.
2. Have [node](https://nodejs.org/en/download/) installed.
3. In a bash shell within the directory of the repo, type `npm install`
4. Type `npm start` to start webpack in watch mode, or `npm run build` for a production build.

Webpack compiles `src/` into `uwrouting/content.bundle.js` and `uwrouting/background.bundle.js`, which is the folder you load as an unpacked extension. The built bundles are committed so the extension can be installed straight from a clone without running a build.

### Layout

| Path | Purpose |
|------|---------|
| [src/content.js](./src/content.js) | Content script: binds every shortcut on the request and nav pages |
| [src/background.js](./src/background.js) | Shows the page action on `service-now.com` |
| [src/combos.js](./src/combos.js) | The shortcut table — add or change shortcuts here |
| [src/actions.js](./src/actions.js) | Writes the CI/AG/sector/template form fields |
| [src/utils.js](./src/utils.js) | Page detection helpers |
| [src/constants/](./src/constants/) | CI, AG, template, and CSS selector tables |
| [tools/build-docs.mjs](./tools/build-docs.mjs) | Regenerates the cheatsheet from the combo table |

### Adding a shortcut

Add an entry to [src/combos.js](./src/combos.js), reusing the CI/AG entries in `src/constants/`, then run `npm run build`.

Each entry's `description` is not read at runtime — it exists purely to generate the cheatsheet. `npm run build` runs webpack and then `npm run docs`, which rewrites both [documentation/combo.md](./documentation/combo.md) and `uwrouting/options.html` from the combo table, so the docs cannot drift from the shortcuts. Never edit `options.html` by hand; it is generated.
