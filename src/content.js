import Combokeys from 'combokeys'
import selectors from './constants/selectors.js'
import { combos, mainkey, combokey } from './combos.js'
import { atNavPage, atTaskPage, queryIframe } from './utils.js'

const ERROR_STYLE = 'background: #00BFFF; color: white'

function warn (message) {
  console.log(`%c${message}`, ERROR_STYLE)
}

// Routing shortcuts only make sense on a request page.
function bindRouteCombos (combokeys) {
  combos.forEach(entry => {
    combokeys.bind(entry.combo, () => {
      if (atTaskPage()) {
        entry.execute()
      } else {
        warn('error: cant route, not at a req page')
      }
    })
  })
}

function bindNextRequest (combokeys, doc) {
  combokeys.bind(`${mainkey}${combokey}right`, () => {
    if (atTaskPage()) {
      warn('error: cant go to next req, not at the nav page.')
      return
    }
    const link = doc.querySelector(selectors.navpage.nextreq)
    if (link) link.click()
  })
}

function bindUpdate (combokeys, doc) {
  combokeys.bind(`${mainkey}${combokey}enter`, () => {
    if (!atTaskPage()) {
      warn('error: cant submit form, not at req page')
      return
    }
    const button = doc.querySelector(selectors.taskpage.updatebutton)
    if (button) button.click()
  })
}

function bindHome (combokeys, doc) {
  combokeys.bind(`${mainkey}${combokey}space`, () => {
    const link = doc.querySelector(selectors.navpage.homelink)
    if (link) link.click()
  })
}

const outer = new Combokeys(document.documentElement)

if (atNavPage()) {
  // On the nav page the request form is inside an iframe. Bindings are attached
  // to both documents so a shortcut works whichever one holds focus.
  bindRouteCombos(outer)

  const iframe = queryIframe()
  if (iframe) {
    iframe.onload = () => {
      const inner = new Combokeys(iframe.contentDocument)
      bindRouteCombos(inner)

      bindNextRequest(inner, iframe.contentDocument)
      bindNextRequest(outer, iframe.contentDocument)

      bindUpdate(inner, iframe.contentDocument)
      bindUpdate(outer, iframe.contentDocument)

      bindHome(inner, document)
      bindHome(outer, document)
    }
  }
} else {
  bindRouteCombos(outer)
  bindNextRequest(outer, document)
  bindUpdate(outer, document)
}
