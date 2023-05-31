
let btnAscii = document.querySelector("#renderAscii")
btnAscii.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: "data"}, function(response) {
        });
    });

});