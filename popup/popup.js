
let btnAscii = document.querySelector("#renderAscii")
btnAscii.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: {startAscii:true}}, function(response) {
        });
    });

});
let invertAsciiInput = document.querySelector("#invert")
invertAsciiInput.addEventListener('click', function() {
    let checkedInt = invertAsciiInput.checked? "scaleX(-1)":"scaleX(1)"
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: {invertAscii:checkedInt}}, function(response) {
        });
    });

});
let resizeSlider = document.querySelector("#resize");
resizeSlider.addEventListener('input', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: {resizeAscii:resizeSlider.value/100}}, function(response) {
        });
    });

});
// let pxSlider = document.querySelector("#pxRatio");
// pxSlider.addEventListener('input', function() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {data: {pxRatio:pxSlider.value}}, function(response) {
//         });
//     });

// });