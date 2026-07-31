// Reconciles src/constants/{ci,ag}.js against CSV exported from ServiceNow.
//
// The short keys (`csrm`, `uwnetid`, ...) are hand-chosen and referenced by
// src/combos.js, so they are never derived from the export. The sys_id is the
// identity: an entry is matched by `value`, and only its `name` is refreshed.
// Anything whose sys_id is absent from the export is reported, never deleted --
// a shortcut still points at it, and a stale label is a smaller problem than a
// combo that throws on an undefined.
//
// Getting the CSV out of ServiceNow: sys_id is not offered in the list column
// picker, so right-click > Export > CSV yields names without sys_ids. Force the
// columns through the URL instead, which downloads a CSV headed `name,sys_id`:
//
//   https://<instance>/sys_user_group_list.do?CSV&sysparm_query=active=true&sysparm_fields=name,sys_id
//
// See the README for picking the right CI table and for the export row cap.
//
// Only CSV is read here. If the instance blocks .do?CSV, an XML export (which
// always carries sys_id) is the fallback -- that needs a second reader beside
// readExport() returning the same Map of sys_id -> name; nothing else changes.
//
// Usage:
//   node tools/sync-constants.mjs --ag groups.csv --ci items.csv
//       Report drift. Writes nothing.
//   node tools/sync-constants.mjs --ag groups.csv --write
//       Apply the renames it reported.
//   node tools/sync-constants.mjs --ag groups.csv --search "network"
//       Find candidates to add: every export row whose name matches, with its
//       sys_id and whether a constant already claims it.
//   node tools/sync-constants.mjs --ag groups.csv --add portblock=8cf4228a... --write
//       Add a new entry. The right-hand side is a sys_id or an exact name; the
//       label always comes from the export, so it cannot be typo'd.

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BUCKETS = { ci: 'Configuration Items', ag: 'Assignment Groups' }

// --- CSV -------------------------------------------------------------------

// ServiceNow quotes any field containing a comma, quote or newline, and escapes
// an embedded quote by doubling it. Splitting on commas is not enough.
function parseCsv (text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (quoted) {
      if (ch !== '"') { field += ch; continue }
      if (text[i + 1] === '"') { field += '"'; i++; continue }
      quoted = false
      continue
    }

    if (ch === '"') { quoted = true; continue }
    if (ch === ',') { row.push(field); field = ''; continue }
    if (ch === '\r') continue
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue }
    field += ch
  }

  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

// Exports come out headed either `name,sys_id` or `Name,Sys ID` depending on
// where they were triggered from. Normalise both to the same lookup key.
const normaliseHeader = h => h.toLowerCase().replace(/[^a-z0-9]/g, '')

function readExport (path) {
  const rows = parseCsv(readFileSync(path, 'utf8')).filter(r => r.some(c => c.trim() !== ''))
  if (!rows.length) throw new Error(`${path}: file is empty`)

  const headers = rows[0].map(normaliseHeader)
  const nameAt = headers.indexOf('name')
  const sysIdAt = headers.indexOf('sysid')
  if (nameAt === -1 || sysIdAt === -1) {
    throw new Error(
      `${path}: need Name and Sys ID columns, found [${rows[0].join(', ')}]. ` +
      'Add them to the list view before exporting.'
    )
  }

  // Real exports carry rows with a valid sys_id but an empty Name -- records the
  // account cannot read, mostly. Dropping them matters: kept, one that collided
  // with a constant would be reported as a rename to '' and blank a label that
  // gets typed into the form. A nameless row is never useful here anyway.
  const records = new Map()
  let nameless = 0
  for (const row of rows.slice(1)) {
    const sysId = (row[sysIdAt] ?? '').trim()
    const name = (row[nameAt] ?? '').trim()
    if (!/^[0-9a-f]{32}$/.test(sysId)) continue
    if (!name) { nameless++; continue }
    records.set(sysId, name)
  }
  if (!records.size) throw new Error(`${path}: no rows with both a name and a valid 32-character sys_id`)
  return { records, nameless }
}

// --- constants files -------------------------------------------------------

async function loadConstants (bucket) {
  const path = join(ROOT, 'src', 'constants', `${bucket}.js`)
  const { default: entries } = await import(path)
  // Everything above `export default` is the file's explanatory header; keep it
  // verbatim so regenerating does not eat the comment.
  const text = readFileSync(path, 'utf8')
  const header = text.slice(0, text.indexOf('export default {'))
  return { path, header, entries: { ...entries } }
}

const quote = s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

function render (header, entries) {
  const lines = Object.entries(entries)
    .map(([key, v]) => `  ${key}: { name: ${quote(v.name)}, value: ${quote(v.value)} }`)
  return `${header}export default {\n${lines.join(',\n')}\n}\n`
}

// --- reconcile -------------------------------------------------------------

function reconcile (bucket, entries, records, nameless) {
  const renames = []
  const missing = []

  for (const [key, entry] of Object.entries(entries)) {
    if (!records.has(entry.value)) { missing.push([key, entry]); continue }
    const current = records.get(entry.value)
    if (current !== entry.name) renames.push([key, entry.name, current])
  }

  console.log(`\n=== ${BUCKETS[bucket]} (${bucket}.js) ===`)
  console.log(
    `  export: ${records.size} rows | constants: ${Object.keys(entries).length} entries` +
    (nameless ? ` | skipped ${nameless} nameless row(s)` : '')
  )

  for (const [key, from, to] of renames) console.log(`  RENAMED  ${key}: ${quote(from)} -> ${quote(to)}`)
  for (const [key, entry] of missing) {
    console.log(`  MISSING  ${key}: ${quote(entry.name)} (${entry.value}) is not in the export`)
  }
  if (!renames.length && !missing.length) console.log('  all entries match the export')

  return { renames, missing }
}

function search (bucket, entries, records, term) {
  const needle = term.toLowerCase()
  const claimed = new Map(Object.entries(entries).map(([key, v]) => [v.value, key]))
  const hits = [...records].filter(([, name]) => name.toLowerCase().includes(needle))

  console.log(`\n=== ${BUCKETS[bucket]}: ${hits.length} match ${quote(term)} ===`)
  for (const [sysId, name] of hits.sort((a, b) => a[1].localeCompare(b[1]))) {
    const key = claimed.get(sysId)
    console.log(`  ${sysId}  ${name}${key ? `   [already ${bucket}.${key}]` : ''}`)
  }
  if (!hits.length) console.log('  no matches')
}

// Right-hand side of --add is a sys_id or an exact (case-insensitive) name. The
// label is taken from the export either way.
function resolveAddition (bucket, entries, records, key, target) {
  if (entries[key]) throw new Error(`${bucket}.${key} already exists; remove it first to redefine it`)
  if (!/^[a-z][a-z0-9]*$/.test(key)) throw new Error(`--add key ${quote(key)} must be lowercase alphanumeric`)

  if (records.has(target)) return { name: records.get(target), value: target }

  const byName = [...records].filter(([, name]) => name.toLowerCase() === target.toLowerCase())
  if (byName.length === 1) return { name: byName[0][1], value: byName[0][0] }
  if (byName.length > 1) {
    throw new Error(`${quote(target)} matches ${byName.length} rows; use the sys_id instead`)
  }
  throw new Error(`no export row with sys_id or name ${quote(target)} -- try --search`)
}

// --- entry point -----------------------------------------------------------

function parseArgs (argv) {
  const opts = { exports: {}, adds: { ci: [], ag: [] }, write: false, search: null }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--write') { opts.write = true; continue }
    if (arg === '--ci' || arg === '--ag') { opts.exports[arg.slice(2)] = argv[++i]; continue }
    if (arg === '--search') { opts.search = argv[++i]; continue }
    if (arg === '--add') {
      const spec = argv[++i] ?? ''
      const eq = spec.indexOf('=')
      if (eq === -1) throw new Error(`--add expects key=sys_id or key=name, got ${quote(spec)}`)
      let [key, bucket] = [spec.slice(0, eq), null]
      const colon = key.indexOf(':')
      if (colon !== -1) { bucket = key.slice(0, colon); key = key.slice(colon + 1) }
      opts.adds[bucket ?? '?'] ??= []
      opts.adds[bucket ?? '?'].push({ bucket, key, target: spec.slice(eq + 1) })
      continue
    }
    throw new Error(`unknown argument ${quote(arg)}`)
  }
  return opts
}

async function main () {
  const opts = parseArgs(process.argv.slice(2))
  const buckets = Object.keys(opts.exports)
  if (!buckets.length) throw new Error('pass at least one of --ci <file.csv> or --ag <file.csv>')

  // An --add without a `ci:`/`ag:` prefix is unambiguous only when a single
  // export is loaded; otherwise it could land in either file.
  const pending = Object.values(opts.adds).flat()
  for (const add of pending) {
    if (add.bucket && !BUCKETS[add.bucket]) throw new Error(`--add prefix must be ci: or ag:, got ${quote(add.bucket)}`)
    if (!add.bucket) {
      if (buckets.length > 1) throw new Error(`--add ${add.key} needs a ci: or ag: prefix when both exports are loaded`)
      add.bucket = buckets[0]
    }
    if (!opts.exports[add.bucket]) throw new Error(`--add ${add.bucket}:${add.key} needs --${add.bucket} <file.csv>`)
  }

  let dirty = false
  for (const bucket of buckets) {
    const { records, nameless } = readExport(opts.exports[bucket])
    const { path, header, entries } = await loadConstants(bucket)

    if (opts.search !== null) { search(bucket, entries, records, opts.search); continue }

    const { renames } = reconcile(bucket, entries, records, nameless)
    const additions = pending.filter(a => a.bucket === bucket)
      .map(a => [a.key, resolveAddition(bucket, entries, records, a.key, a.target)])

    for (const [key, entry] of additions) {
      console.log(`  ADDED    ${key}: ${quote(entry.name)} (${entry.value})`)
    }

    if (!renames.length && !additions.length) continue
    if (!opts.write) { dirty = true; console.log('  (dry run -- pass --write to apply)'); continue }

    for (const [key, , to] of renames) entries[key].name = to
    for (const [key, entry] of additions) entries[key] = entry
    writeFileSync(path, render(header, entries))
    console.log(`  wrote ${renames.length} rename(s) and ${additions.length} addition(s) to src/constants/${bucket}.js`)
  }

  if (dirty) console.log('\nnothing written. Re-run with --write once the changes above look right.')
  else if (opts.write) console.log('\nDone. Run `npm run docs` to refresh the cheatsheet if any label changed.')
}

main().catch(err => {
  console.error(`sync-constants: ${err.message}`)
  process.exitCode = 1
})
