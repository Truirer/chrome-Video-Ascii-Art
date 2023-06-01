chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

});

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}