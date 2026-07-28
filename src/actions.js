import selectors from './constants/selectors.js'
import { atNavPage } from './utils.js'

// On the nav page the form lives inside an iframe; everywhere else it is in the
// top-level document. Every write below goes through this.
function activeDocument () {
  return atNavPage()
    ? document.querySelector(selectors.navpage.taskiframe).contentDocument
    : document
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
