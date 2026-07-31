import selectors from './constants/selectors.js'

// The script runs in every frame, so usually the form is right here in this
// one. When a shortcut fires from an outer frame instead, fall back to the
// classic form iframe. Every write below goes through this.
function activeDocument () {
  if (document.querySelector(selectors.formfields.ci.hidden)) return document

  const iframe = document.querySelector(selectors.navpage.taskiframe)
  if (!iframe) return document
  try {
    return iframe.contentDocument || document
  } catch (e) {
    // Cross-origin iframe; nothing reachable from here.
    return document
  }
}

// ServiceNow only reacts to a field once it sees a bubbling change event, so
// setting .value alone is not enough.
function fireChange (element) {
  element.dispatchEvent(new Event('change', { bubbles: true }))
}

export function changeInput (ci, ag) {
  const doc = activeDocument()
  const ciHidden = doc.querySelector(selectors.formfields.ci.hidden)
  const ciDisplayed = doc.querySelector(selectors.formfields.ci.displayed)
  const agHidden = doc.querySelector(selectors.formfields.ag.hidden)
  const agDisplayed = doc.querySelector(selectors.formfields.ag.displayed)

  // A missing field means the form is in some frame this one cannot see. Say so
  // rather than throwing on a null.
  if (!ciHidden || !ciDisplayed || !agHidden || !agDisplayed) {
    console.log(
      '%cerror: cant find the CI/AG fields from this frame',
      'background: #00BFFF; color: white'
    )
    return
  }

  ciHidden.value = ci.value
  ciDisplayed.value = ci.name
  agHidden.value = ag.value
  agDisplayed.value = ag.name

  fireChange(agDisplayed)
  fireChange(ciDisplayed)
}

export function changeSector (sector) {
  const field = activeDocument().querySelector(selectors.formfields.sector)
  field.value = sector
  fireChange(field)
}

export function changeDisableNotificationInput (value) {
  activeDocument().querySelector(selectors.formfields.disablenotif).value = value
}

export function applyTemplate (name, value) {
  const doc = activeDocument()
  doc.querySelector(selectors.formfields.template.displayed).value = name
  const hidden = doc.querySelector(selectors.formfields.template.hidden)
  hidden.value = value
  fireChange(hidden)
}

export default { changeInput, changeSector, changeDisableNotificationInput, applyTemplate }
