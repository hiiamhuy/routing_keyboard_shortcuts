// Show the extension's action only on UW Connect (ServiceNow) pages.
const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostSuffix: 'service-now.com', schemes: ['https'] }
    })
  ],
  actions: [new chrome.declarativeContent.ShowAction()]
}

chrome.runtime.onInstalled.addListener(() => {
  // Unlike the old page action, an MV3 action starts out enabled everywhere,
  // so it has to be switched off before the rule below can turn it back on.
  chrome.action.disable()
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule])
  })
})
