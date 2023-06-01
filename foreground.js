(function() {
    let count = true;
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            sendResponse({status: 'ok'});

            let windowVideo = document.querySelector("video");
            if(request.data.startAscii){
                if(windowVideo && count ){
                    count = false;
                    windowVideo.pause()
                    startAsciiVideo()
                    windowVideo.play()
                }
                else if(windowVideo){
                    windowVideo.pause()
                    resizeAscii()
                    windowVideo.play()
    
                }
            }
            if(request.data.invertAscii){
                let preElement = document.querySelector("pre")
                if(preElement){preElement.style.transform=request.data.invertAscii}
                invert = request.data.invertAscii
            }
            if(request.data.resizeAscii){
                ratio = request.data.resizeAscii
            }
            console.log(request, sender, sendResponse)

    });


})();
const multiplier = 4;
let ratio = 0.5;
let invert = ""
function resizeAscii(){
    const canvas = document.getElementById('preview');
    const asciiImage = document.getElementById('ascii');
    const video = document.getElementsByTagName('video')[0];

    let offsets = video.getBoundingClientRect()
    canvas.style.top = offsets.top +"px"
    canvas.style.left = offsets.left +"px"
    canvas.style.width = video.style.width 
    canvas.style.height = video.style.height
    asciiImage.style.top = offsets.top +"px"
    asciiImage.style.left = offsets.left +"px"
    asciiImage.style.width = video.style.width 
    asciiImage.style.height = video.style.height 
}
function startAsciiVideo(){

    const video = document.getElementsByTagName('video')[0];
    let offsets = video.getBoundingClientRect()
    let preD = document.createElement("pre")
    preD.style.top = offsets.top +"px"
    preD.style.left = offsets.left +"px"
    preD.style.width = video.style.width 
    preD.style.height = video.style.height 
    preD.style.position = "absolute"
    preD.style.background ="white"
    preD.style.zIndex="5000000"
    preD.id="ascii"
    preD.style.lineHeight = ".55"
    preD.style.fontSize= video.scrollWidth/video.scrollHeight*multiplier +"px"
    preD.style.fontSize= "8px"
    let canvasD = document.createElement("canvas")
    canvasD.id ="preview"
    canvasD.style.top = offsets.top +"px"
    canvasD.style.left = offsets.left +"px"
    canvasD.style.width = video.style.width 
    canvasD.style.height = video.style.height 
    canvasD.style.position = "absolute"
    canvasD.style.background ="white"
    canvasD.style.display="none"

    document.body.appendChild(preD)
    document.body.appendChild(canvasD)
    const canvas = document.getElementById('preview');
    const asciiImage = document.getElementById('ascii');
    window.addEventListener("resize",()=>{
        resizeAscii()
    })


    const context = canvas.getContext("2d", { willReadFrequently: true })
    const toGrayScale = (r, g, b) => 0.334 * r + 0.333 * g + 0.333 * b;
    let isDark = false;



    const convertToGrayScales = (context, width, height) => {
        const imageData = context.getImageData(0, 0,width, height);

        const grayScales = [];
        let count = 0;
        for (let i = 0 ; i < imageData.data.length ; i += 4) {
        
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];

            const grayScale = toGrayScale(r, g, b);
            imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;
            grayScales.push(grayScale);
        }
        context.putImageData(imageData, 0, 0);

        return grayScales;
    };




    function renderAscii (e){
            const width = video.scrollWidth/multiplier*ratio
            const height = video.scrollHeight/multiplier*ratio

            canvas.width=width;
            canvas.height=height;
            context.drawImage(e, 0, 0, width, height);
            const grayScales = convertToGrayScales(context, width, height);
            drawAscii(grayScales, Math.floor(width));
    };


    // set canvas size = video size when known
    video.addEventListener('loadedmetadata', function() {
    preD.style.fontSize= video.scrollWidth/video.scrollHeight*multiplier +"px"

    });

    video.addEventListener('play', function() {
    var $this = this; //cache
    asciiImage.style.display= "flex";
    (function loop() {
        if (!$this.paused && !$this.ended) {
        renderAscii($this)
        setTimeout(loop, (1000 / 60)); // drawing at 60fps
        }
    })();
    });
    video.addEventListener('pause', function() {
        asciiImage.style.display="none"
    });

    const grayRampBalanced = '$@08GCLft1i;:.,:;i1tfLCG0 ';
    const grayRampDark = '$@08;:.,:;i1tfLCG0 ';


    const getCharacterForGrayScale = (grayScale) => {
    let grayRamP = isDark ? grayRampDark:grayRampBalanced;
    let rampLength = grayRamP.length;
    return grayRamP[Math.ceil((rampLength - 1) * grayScale / 255)]
    };

    const drawAscii = (grayScales, width) => {
        const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
            let nextChars = getCharacterForGrayScale(grayScale);
            if ((index + 1) % width === 0) {
                nextChars += '\n';
            }

            return asciiImage + nextChars;
        }, '');

        asciiImage.textContent = ascii;
    };
}