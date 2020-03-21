window.addEventListener('DOMContentLoaded', function () {
    setInterval(updateRemaining, 1000);
    var translate = navigator.mozL10n.get;
    var mainlist = document.getElementById('authcodes');
    var authcodes = [], selectIndex = 0;
    var shortCodeBuffer = '';
    var shortCodeActive = false;
    init();
    // functions
    function init(){
        if(window.localStorage.getItem("authcodes")!=null){
            authcodes = JSON.parse(window.localStorage.getItem("authcodes"));
        }else{
            authcodes = [];
        }
        refreshCodeList();
        updateRemaining();
    }
    function updateRemaining() {
        let remain = window.otplib.authenticator.timeRemaining();
        document.getElementById('time-remaining').innerText = `${remain}s`;
        if (remain === 30) {
            refreshCodeList();
        }
    }
    function refreshCodeList() {
        mainlist.innerHTML = '';
        if(authcodes.length > 0){
            authcodes.forEach(element => {
                let code = window.otplib.authenticator.generate(element.secret);
                let item = document.createElement('div');
                item.dataset.id = element.id;
                item.innerHTML = `<p class="code-row">${numberWithSpaces(code)}</p><p class="name-row">${element.name}</p>`;
                item.classList.add('authcode-item');
                mainlist.appendChild(item);
            });
            selectItemByIndex();
        }
    }
    function shortcodeKeyPress(key){
        if(key == 'Enter'){
            shortCodeBuffer = '';
            shortCodeActive = false;
        }
        if(key.length == 1){
            shortCodeBuffer += key;
        }
        if(shortCodeActive){
            document.getElementById('title').innerText = shortCodeBuffer;
        }else{
            document.getElementById('title').innerText = "KaiAuth";
        }
        if(key == '#'){
            if(shortCodeActive){
                switch (shortCodeBuffer) {
                    case "*#0000#":
                        alert("KaiAuth v1.0.3\nCopyright 2020 zjyl1994\nAll rights reserved");
                        break;
                    case "*#467678#":
                        loadSDFile();
                        break;
                    case "*#397678#":
                        dumpSDFile();
                        break;
                    case "*#7370#":
                        var result = confirm(translate('reset-confirm'));
                        if(result == true){
                            window.localStorage.clear();
                            alert(translate('reset-success'))
                            init();
                        }
                        break;
                }
                shortCodeBuffer = '';
                shortCodeActive = false;
                document.getElementById('title').innerText = "KaiAuth";
            }else{
                shortCodeActive = true;
                document.getElementById('title').innerText = shortCodeBuffer;
            }
        }
    }
    function selectItemByIndex() {
        [].forEach.call(mainlist.children, function (el) {
            el.classList.remove('active');
        });
        if (selectIndex > (authcodes.length - 1)) selectIndex = 0;
        let activeElem = mainlist.children[selectIndex];
        activeElem.classList.add('active');
        activeElem.scrollIntoViewIfNeeded(false);
    }
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    function generateNewID(){
        var maxID = 0;
        authcodes.forEach(element => {
            if(element.id > maxID) maxID = element.id;
        });
        return maxID + 1;
    }
    function loadSDFile(){
        var sdcard = navigator.getDeviceStorage('sdcard');
        var request = sdcard.get("kaiauth.json");
        request.onsuccess = function () {
            var reader = new FileReader();
            reader.onload = function(e) {
                window.localStorage.setItem('authcodes',reader.result);
                alert(translate('load-success'));
                init();
            }
            reader.readAsText(this.result)
        }
        request.onerror = function () {
            alert(translate('load-error') + this.error.name);
            console.error(this.error);
        }
    }
    function dumpSDFile(){
        var sdcard = navigator.getDeviceStorage('sdcard');
        var deleteRequest = sdcard.delete("kaiauth.json");
        deleteRequest.onsuccess = function () {
            var file = new Blob([window.localStorage.getItem("authcodes")], {type: "application/json"});
            var writeRequest = sdcard.addNamed(file, "kaiauth.json");
            writeRequest.onsuccess = function () {
                var name = this.result;
                alert(translate('dump-success'));
            }
            writeRequest.onerror = function () {
                alert(translate('dump-error') + this.error.name);
                console.error(this.error);
            }
        }
        deleteRequest.onerror = function () {
            alert(this.error.name);
            console.error(this.error);
        }
    }
    // key
    window.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowUp': //scroll up
            case 'ArrowLeft':
                selectIndex--;
                if (selectIndex < 0) selectIndex = authcodes.length - 1;
                selectItemByIndex();
                break;
            case 'ArrowDown': //scroll down
            case 'ArrowRight':
                selectIndex++;
                if (selectIndex > (authcodes.length - 1)) selectIndex = 0;
                selectItemByIndex();
                break;
            case 'SoftLeft':
                var qrcode = new MozActivity({
					name: 'com.zjyl1994.kaiauth.addCode'
				})
				qrcode.onsuccess = function () {
					qrcodeContent = this.result;
                    gaDetail = parseURI(qrcodeContent);
                    if(gaDetail == null){
                        alert(translate('valid-qrcode'));
                    }else{
                        var totpName = gaDetail.label.account;
                        if(gaDetail.label.issuer){
                            totpName = gaDetail.label.issuer + ':' + totpName;
                        }else{
                            if(gaDetail.query.hasOwnProperty('issuer')){
                                totpName = gaDetail.query.issuer + ':' + totpName;
                            }
                        }
                        var item = {
                            id: generateNewID(),
                            name: totpName,
                            secret: gaDetail.query.secret
                        }
                        authcodes.push(item);
                        window.localStorage.setItem('authcodes', JSON.stringify(authcodes));
                        init();
                        selectIndex = authcodes.length - 1;
                        selectItemByIndex();
                    }
				}
                break;
            case 'SoftRight':
                var authcodeActiveItem = document.getElementsByClassName('active')[0].dataset.id;
                var result = confirm(translate('delete-confirm'));
                if(result == true){
                    authcodes = authcodes.filter(obj => obj.id != authcodeActiveItem);
                    refreshCodeList();
                }
                break;
            default:
                shortcodeKeyPress(e.key);
        }
    });
}, false);