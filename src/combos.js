import ci from './constants/ci.js'
import ag from './constants/ag.js'
import templates from './constants/templates.js'
import actions from './actions.js'
import utils from './utils.js'

// Every shortcut is a sequence: the leader key, then the combo separator, then the
// remaining keys. Keys must be pressed in order, not held down together.
export const mainkey = '`'
export const combokey = ' '

export const combos = [
  {
    combo: `${mainkey}${combokey}u`,
    execute: () => actions.changeInput(ci.uwnetid, ag.info),
    description: utils.formatRouteDescription(ci.uwnetid.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}t`,
    execute: () => actions.changeInput(ci.tele, ag.csrm),
    description: utils.formatRouteDescription(ci.tele.name, ag.csrm.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}t`,
    execute: () => actions.changeInput(ci.teleconf, ag.teleconf),
    description: utils.formatRouteDescription(ci.teleconf.name, ag.teleconf.name)
  },
  {
    combo: `${mainkey}${combokey}m`,
    execute: () => actions.changeInput(ci.msca, ag.msca),
    description: utils.formatRouteDescription(ci.msca.name, ag.msca.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}m`,
    execute: () => actions.changeInput(ci.mailman, ag.mailman),
    description: utils.formatRouteDescription(ci.mailman.name, ag.mailman.name)
  },
  {
    combo: `${mainkey}${combokey}2${combokey}m`,
    execute: () => actions.changeInput(ci.mws, ag.mws),
    description: utils.formatRouteDescription(ci.mws.name, ag.mws.name)
  },
  {
    combo: `${mainkey}${combokey}3${combokey}m`,
    execute: () => actions.changeInput(ci.mailman, ag.info),
    description: utils.formatRouteDescription(ci.mailman.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}4${combokey}m`,
    execute: () => actions.changeInput(ci.myuw, ag.myuw),
    description: utils.formatRouteDescription(ci.myuw.name, ag.myuw.name)
  },
  {
    combo: `${mainkey}${combokey}c`,
    execute: () => actions.changeInput(ci.connect, ag.connect),
    description: utils.formatRouteDescription(ci.connect.name, ag.connect.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}c`,
    execute: () => actions.changeInput(ci.canvas, ag.canvas),
    description: utils.formatRouteDescription(ci.canvas.name, ag.canvas.name)
  },
  {
    combo: `${mainkey}${combokey}2${combokey}c`,
    execute: () => actions.changeInput(ci.catalyst, ag.catalyst),
    description: utils.formatRouteDescription(ci.catalyst.name, ag.catalyst.name)
  },
  {
    combo: `${mainkey}${combokey}3${combokey}c`,
    execute: () => actions.changeInput(ci.cte, ag.cte),
    description: utils.formatRouteDescription(ci.cte.name, ag.cte.name)
  },
  {
    combo: `${mainkey}${combokey}4${combokey}c`,
    execute: () => actions.changeInput(ci.trumba, ag.trumba),
    description: utils.formatRouteDescription(ci.trumba.name, ag.trumba.name)
  },
  {
    combo: `${mainkey}${combokey}5${combokey}c`,
    execute: () => actions.changeInput(ci.cert, ag.cert),
    description: utils.formatRouteDescription(ci.cert.name, ag.cert.name)
  },
  {
    combo: `${mainkey}${combokey}h`,
    execute: () => actions.changeInput(ci.hyak, ag.hyak),
    description: utils.formatRouteDescription(ci.hyak.name, ag.hyak.name)
  },
  {
    combo: `${mainkey}${combokey}p`,
    execute: () => actions.changeInput(ci.wired, ag.csrm),
    description: utils.formatRouteDescription(ci.wired.name, ag.csrm.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}p`,
    execute: () => actions.changeInput(ci.purchasing, ag.procurement),
    description: utils.formatRouteDescription(ci.purchasing.name, ag.procurement.name)
  },
  {
    combo: `${mainkey}${combokey}d`,
    execute: () => actions.changeInput(ci.duo, ag.info),
    description: utils.formatRouteDescription(ci.duo.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}d`,
    execute: () => actions.changeInput(ci.desk, ag.info),
    description: utils.formatRouteDescription(ci.desk.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}2${combokey}d`,
    execute: () => actions.changeInput(ci.wired, ag.datacenter),
    description: utils.formatRouteDescription(ci.wired.name, ag.datacenter.name)
  },
  {
    combo: `${mainkey}${combokey}w`,
    execute: () => actions.changeInput(ci.web, ag.web),
    description: utils.formatRouteDescription(ci.web.name, ag.web.name)
  },
  {
    combo: `${mainkey}${combokey}e`,
    execute: () => actions.changeInput(ci.edw, ag.edw),
    description: utils.formatRouteDescription(ci.edw.name, ag.edw.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}e`,
    execute: () => actions.changeInput(ci.esignatures, ag.esignatures),
    description: utils.formatRouteDescription(ci.esignatures.name, ag.esignatures.name)
  },
  {
    combo: `${mainkey}${combokey}r`,
    execute: () => actions.applyTemplate(templates.redirect.name, templates.redirect.value),
    description: `apply \`${templates.redirect.name}\` template`
  },
  {
    combo: `${mainkey}${combokey}1${combokey}r`,
    execute: () => actions.changeInput(ci.noci, ag.spam),
    description: utils.formatRouteDescription(ci.noci.name, ag.spam.name)
  },
  {
    combo: `${mainkey}${combokey}n`,
    execute: () => {
      actions.changeInput(ci.wired, ag.netops)
      actions.changeSector('UW')
    },
    description: utils.formatRouteDescription(ci.wired.name, ag.netops.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}n`,
    execute: () => {
      actions.changeInput(ci.wifi, ag.netops)
      actions.changeSector('UW')
    },
    description: utils.formatRouteDescription(ci.wifi.name, ag.netops.name)
  },
  {
    combo: `${mainkey}${combokey}z`,
    execute: () => actions.changeInput(ci.zoom, ag.zoom),
    description: utils.formatRouteDescription(ci.zoom.name, ag.zoom.name)
  },
  {
    combo: `${mainkey}${combokey}o`,
    execute: () => actions.changeInput(ci.officedir, ag.officedir),
    description: utils.formatRouteDescription(ci.officedir.name, ag.officedir.name)
  },
  {
    combo: `${mainkey}${combokey}k`,
    execute: () => actions.changeInput(ci.keynes, ag.uwitacm),
    description: utils.formatRouteDescription(ci.keynes.name, ag.uwitacm.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}k`,
    execute: () => actions.changeInput(ci.keynes, ag.info),
    description: utils.formatRouteDescription(ci.keynes.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}2${combokey}k`,
    execute: () => actions.changeInput(ci.kuali, ag.sis),
    description: utils.formatRouteDescription(ci.kuali.name, ag.sis.name)
  },
  {
    combo: `${mainkey}${combokey}g`,
    execute: () => actions.changeInput(ci.groups, ag.iam),
    description: utils.formatRouteDescription(ci.groups.name, ag.iam.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}g`,
    execute: () => actions.changeInput(ci.google, ag.google),
    description: utils.formatRouteDescription(ci.google.name, ag.google.name)
  },
  {
    combo: `${mainkey}${combokey}2${combokey}g`,
    execute: () => actions.changeInput(ci.google, ag.info),
    description: utils.formatRouteDescription(ci.google.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}j`,
    execute: () => actions.applyTemplate(templates.spm.name, templates.spm.value),
    description: `apply \`${templates.spm.name}\` template`
  },
  {
    combo: `${mainkey}${combokey}1${combokey}j`,
    execute: () => actions.applyTemplate(templates.spmresp1.name, templates.spmresp1.value),
    description: `apply \`${templates.spmresp1.name}\` template`
  },
  {
    combo: `${mainkey}${combokey}s`,
    execute: () => actions.changeInput(ci.stdsvr, ag.stdsvr),
    description: utils.formatRouteDescription(ci.stdsvr.name, ag.stdsvr.name)
  },
  {
    combo: `${mainkey}${combokey}1${combokey}s`,
    execute: () => actions.changeInput(ci.softwareent, ag.software),
    description: utils.formatRouteDescription(ci.softwareent.name, ag.software.name)
  },
  {
    combo: `${mainkey}${combokey}2${combokey}s`,
    execute: () => actions.changeInput(ci.softwaresub, ag.software),
    description: utils.formatRouteDescription(ci.softwaresub.name, ag.software.name)
  },
  {
    combo: `${mainkey}${combokey}3${combokey}s`,
    execute: () => actions.changeInput(ci.software, ag.software),
    description: utils.formatRouteDescription(ci.software.name, ag.software.name)
  },
  {
    combo: `${mainkey}${combokey}4${combokey}s`,
    execute: () => actions.changeInput(ci.subscription, ag.info),
    description: utils.formatRouteDescription(ci.subscription.name, ag.info.name)
  },
  {
    combo: `${mainkey}${combokey}f`,
    execute: () => actions.applyTemplate(templates.foster.name, templates.foster.value),
    description: `apply \`${templates.foster.name}\` template`
  }
]

export default { mainkey, combokey, combos }
