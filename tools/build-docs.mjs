// Regenerates the cheatsheet from src/combos.js:
//   documentation/combo.md   - readable table for GitHub
//   uwrouting/options.html   - the extension's Options page
//
// Nothing at runtime reads a combo's `description`; it exists to feed this
// generator, so the docs cannot drift from the shortcuts as long as this runs.
// Run with `npm run docs` (or just `npm run build`, which calls it).

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { combos } from '../src/combos.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const TITLE = 'Uwrouting Combinations'
const INTRO = "All the key combo for the extension are listed below.The combo keys must be pressed in rapid sequence and in it's specific order."

const escapeHtml = s => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

// `foo` -> <code>foo</code>, on already-escaped text. Unpaired backticks (the
// leader key in a combo cell) are left as literal characters.
function renderInline (text) {
  const parts = escapeHtml(text).split('`')
  if (parts.length % 2 === 0) return escapeHtml(text) // unpaired: leave alone
  return parts.map((p, i) => (i % 2 ? `<code>${p}</code>` : p)).join('')
}

// The original page was formatted at 120 columns. Two overflow behaviours are
// reproduced so that regenerating the page produces no spurious diff:
//   1. only the closing tag overflows -> </td> drops to its own line
//   2. the content itself overflows   -> break at the comma between CI and AG
const WRAP_AT = 120
function tdLines (html) {
  const indent = ' '.repeat(16)
  const single = `${indent}<td>${html}</td>`
  if (single.length <= WRAP_AT) return [single]

  const withoutClose = `${indent}<td>${html}`
  if (withoutClose.length <= WRAP_AT) return [withoutClose, `${indent}</td>`]

  const idx = html.indexOf(', AG:')
  if (idx === -1) return [single]
  return [
    `${indent}<td>${html.slice(0, idx + 1)}`,
    `${' '.repeat(20)}${html.slice(idx + 2)}</td>`
  ]
}

const rows = combos.map(c => [
  '            <tr>',
  `                <td>${escapeHtml(c.combo)}</td>`,
  ...tdLines(renderInline(c.description)),
  '            </tr>'
].join('\n')).join('\n')

const html = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>uwrouting Documentation</title>
    <link rel="stylesheet" href="options.css">
</head>

<body class="markdown-body">
    <h1>${TITLE}</h1>
    <p>All the key combo for the extension are listed below.The combo keys must be pressed in rapid sequence and in
        it&#39;s specific order.</p>
    <table>
        <thead>
            <tr>
                <th>Combo</th>
                <th>Command</th>
            </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
    </table>
</body>

</html>`

// Markdown cells are split on pipes before inline parsing, so a lone leading
// backtick stays literal and the paired ones still become code spans.
const md = `# ${TITLE}

${INTRO}

| Combo | Command |
| ----- | ------- |
${combos.map(c => `| ${c.combo} | ${c.description} |`).join('\n')}
`

writeFileSync(join(ROOT, 'uwrouting', 'options.html'), html)
mkdirSync(join(ROOT, 'documentation'), { recursive: true })
writeFileSync(join(ROOT, 'documentation', 'combo.md'), md)

console.log(`docs: wrote ${combos.length} shortcuts to uwrouting/options.html and documentation/combo.md`)
