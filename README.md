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
See the full [list](./documentation/combo.md) of commands.

## Development setup

1. clone this repository.
2. Have [node](https://nodejs.org/en/download/) installed.
3. In a bash shell within the directory of the repo, type `npm install`
4. type `npm start` to start webpack.
