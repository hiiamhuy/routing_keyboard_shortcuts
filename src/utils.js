import selectors from './constants/selectors.js'

// UW Connect renders the request form either directly or inside the nav page's
// iframe, so most helpers have to ask which of the two we are looking at.
export function atNavPage () {
  const pathname = window.location.pathname
  return pathname === '/nav_to.do' || pathname === '/navpage.do'
}

export function queryIframe () {
  return document.querySelector(selectors.navpage.taskiframe)
}

export function atTaskPage () {
  return window.location.href.includes('u_simple_requests.do')
}

export function formatRouteDescription (ciName, agName) {
  return `route CI:\`${ciName}\`, AG:\`${agName}\``
}

export default { atNavPage, queryIframe, atTaskPage, formatRouteDescription }
