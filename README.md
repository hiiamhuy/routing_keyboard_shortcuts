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

The leader key is the backtick `` ` `` (unshifted, below Esc), not the tilde `~`.

For example, to route a REQ to the Reported Spam AG, press `` ` `` then `1` then `r`. And then press `` ` `` then `enter`.
- `` ` 1 r``: Change CI = "No Configuration Item" and AG = "UW-IT Reported Spam".
- `` ` enter``: Clicks the update button.

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
| [tools/sync-constants.mjs](./tools/sync-constants.mjs) | Reconciles the CI/AG tables against a ServiceNow CSV export |

### Adding a shortcut

Add an entry to [src/combos.js](./src/combos.js), reusing the CI/AG entries in `src/constants/`, then run `npm run build`.

Each entry's `description` is not read at runtime — it exists purely to generate the cheatsheet. `npm run build` runs webpack and then `npm run docs`, which rewrites both [documentation/combo.md](./documentation/combo.md) and `uwrouting/options.html` from the combo table, so the docs cannot drift from the shortcuts. Never edit `options.html` by hand; it is generated.

### Refreshing the CI/AG tables

Group names and configuration items drift as UW-IT reorganises, so [src/constants/ci.js](./src/constants/ci.js) and [src/constants/ag.js](./src/constants/ag.js) need an occasional pass against ServiceNow.

#### Exporting the CSV from ServiceNow

`sys_id` is not offered in the list column picker, so the usual right-click → **Export → CSV** produces names with no sys_ids. Force the columns through the URL instead — while logged into UW Connect, paste this into the address bar and it downloads a CSV headed exactly `name,sys_id`:

```
https://<your-instance>/sys_user_group_list.do?CSV&sysparm_query=active=true&sysparm_fields=name,sys_id
```

`sysparm_fields` overrides the list layout entirely, which is what makes the sys_id column reachable.

For configuration items, first confirm which table the CI field actually references: open any request, click the magnifier next to **Configuration Item**, and read the table out of the popup's URL (`…_list.do?sysparm_reference=…`). It is a narrower table than the `cmdb_ci` base, so exporting the right one turns thousands of rows into dozens and makes `--search` usable.

```
https://<your-instance>/cmdb_ci_service_list.do?CSV&sysparm_query=active=true&sysparm_fields=name,sys_id
```

Two things that bite:

- **Row cap.** Instances set `glide.ui.export.limit`, commonly 10,000. Past that the export truncates silently — narrow `sysparm_query` rather than raising the cap.
- **Export ACLs.** If `.do?CSV` returns a permission error or an HTML login page instead of a download, fall back to right-click header → **Export → XML**, which always includes `sys_id` regardless of list layout. The sync tool reads CSV only, so this needs a converter — see the note in [tools/sync-constants.mjs](./tools/sync-constants.mjs).

#### Running the sync

```sh
npm run sync -- --ag groups.csv --ci items.csv          # report drift, write nothing
npm run sync -- --ag groups.csv --search "network"      # find a sys_id to add
npm run sync -- --ag groups.csv --add portblock=8cf4228a6f2a070030b1073aea3ee41c --write
```

Three assignment groups are known dead as of the 2026-07-31 sync — `msca` (` m), `google` (` 1 g) and `spam` (` 1 r) are all inactive in ServiceNow with no live successor. Those shortcuts still fire but route nowhere useful; the header comment in [src/constants/ag.js](./src/constants/ag.js) records the details. Repoint them once the current owners are known.

The sys_id is the identity: entries are matched on `value` and only their `name` is refreshed, so the short keys that [src/combos.js](./src/combos.js) references are never renamed out from under it. An entry whose sys_id is absent from the export is reported but never deleted — a shortcut may still point at it, and a stale label beats a combo that throws. Runs are dry by default; add `--write` to apply, then `npm run docs` if any label changed.
