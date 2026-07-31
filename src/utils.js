// True in any frame whose URL points at a request record -- the form frame
// itself, and the outer frame whose URL carries it as a target parameter.
export function atTaskPage () {
  return window.location.href.includes('u_simple_requests.do')
}

export function formatRouteDescription (ciName, agName) {
  return `route CI:\`${ciName}\`, AG:\`${agName}\``
}

export default { atTaskPage, formatRouteDescription }
