window.addEventListener('DOMContentLoaded', function () {
    var activityHandler = null;
    var canvas = document.getElementById('cam-frame');
    var video = document.getElementById("cam-view");
    var canvasContext = canvas.getContext('2d');

    setInterval(capture,200);

    navigator.mozSetMessageHandler('activity', function(activityRequest) {
        activityHandler = activityRequest;
    });
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "environment" }
    }).then(function(stream) {  
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
    });

    function capture(){
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
            var imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if(code){
                activityHandler.postResult(code.data);
            }
        }
    }

    window.addEventListener('keydown', function (e) {
        switch(e.key){
            case 'SoftRight':
                activityHandler.postError('No QR Code');
                break;
        }
    });
},false);