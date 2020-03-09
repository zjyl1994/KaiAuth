window.addEventListener('DOMContentLoaded', function () {
    var qrcodeDecoded = '';
    var activityHandler = null;
    navigator.mozSetMessageHandler('activity', function(activityRequest) {
        activityHandler = activityRequest;
    })
    qrcodeDecoded = 'dgdfgdfgdfgdfg';
    window.addEventListener('keydown', function (e) {
        switch(e.key){
            case 'SoftRight':
                if(qrcodeDecoded==''){
                    activityHandler.postError('No QR Code');
                }else{
                    activityHandler.postResult(qrcodeDecoded);
                }
                break;
        }
    });
},false);