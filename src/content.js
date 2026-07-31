import Combokeys from 'combokeys'
import selectors from './constants/selectors.js'
import { combos, mainkey, combokey } from './combos.js'
import { atTaskPage } from './utils.js'

const ERROR_STYLE = 'background: #00BFFF; color: white'

function warn (message) {
  console.log(`%c${message}`, ERROR_STYLE)
}

// UW Connect splits a request across frames, and the split differs between the
// classic nav page and the Polaris shell. Rather than have one frame reach
// across into another, the script is injected into every frame and each one
// binds to its own document, so a shortcut works whichever frame holds focus.
const combokeys = new Combokeys(document.documentElement)

combos.forEach(entry => {
  combokeys.bind(entry.combo, () => {
    if (atTaskPage()) {
      entry.execute()
    } else {
      warn('error: cant route, not at a req page')
    }
  })
})

combokeys.bind(`${mainkey}${combokey}right`, () => {
  const link = document.querySelector(selectors.navpage.nextreq)
  if (link) link.click()
  else warn('error: cant go to next req, no next req link in this frame')
})

combokeys.bind(`${mainkey}${combokey}enter`, () => {
  const button = document.querySelector(selectors.taskpage.updatebutton)
  if (button) button.click()
  else warn('error: cant submit form, no update button in this frame')
})

combokeys.bind(`${mainkey}${combokey}space`, () => {
  const link = document.querySelector(selectors.navpage.homelink)
  if (link) link.click()
})

// One line per frame, so the console shows which frames the shortcuts are live
// in. Without it a dead extension and a mistyped combo look identical.
console.log(
  `%cuwrouting: bound in frame ${location.pathname}`,
  'background: #4b2e83; color: white'
)
