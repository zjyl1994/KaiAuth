window.addEventListener('DOMContentLoaded', function () {
    var timer = setInterval(updateRemaining, 1000);
    var mainlist = document.getElementById('authcodes');
    var authcodes = [], selectIndex = 0;
    var shortCodeBuffer = '';
    var shortCodeActive = false;
    var softkeyBarStatus = 'mainlist';
    var softkeyLayout = {
        'mainlist': {
            left: 'Add',
            center: '',
            right: 'Delete'
        },
        'questionbox': {
            left: '',
            center: 'OK',
            right: 'Cancel'
        },
        'messagebox': {
            left: '',
            center: 'OK',
            right: ''
        }
    }
    // load data.json
    fetch('data/data.json')
        .then(res => res.json())
        .then((out) => {
            authcodes = out;
            refreshCodeList();
            updateRemaining();
            changeSoftkeyLayout('mainlist');
        });
    // functions
    function changeSoftkeyLayout(layout) {
        if (layout in softkeyLayout) {
            document.getElementById('softkey-left').innerText = softkeyLayout[layout].left;
            document.getElementById('softkey-center').innerText = softkeyLayout[layout].center;
            document.getElementById('softkey-right').innerText = softkeyLayout[layout].right;
            softkeyBarStatus = layout;
        }
    }
    function updateRemaining() {
        if (softkeyBarStatus === "mainlist") {
            let remain = window.otplib.authenticator.timeRemaining();
            document.getElementById('softkey-center').innerText = `Next in ${remain}s`;
            if (remain === 30) {
                refreshCodeList();
            }
        }
    }
    function refreshCodeList() {
        mainlist.innerHTML = '';
        authcodes.forEach(element => {
            let code = window.otplib.authenticator.generate(element.secret);
            let item = document.createElement('div');
            item.dataset.id = element.id;
            item.innerHTML = `<p class="code-row">${numberWithSpaces(code)}</p><p class="name-row">${element.name}</p>`;
            item.classList.add('authcode-item');
            mainlist.appendChild(item);
        });
        mainlist.children[selectIndex].classList.add('active');
    }
    function selectItemByIndex() {
        [].forEach.call(mainlist.children, function (el) {
            el.classList.remove('active');
        });
        let activeElem = mainlist.children[selectIndex];
        activeElem.classList.add('active');
        activeElem.scrollIntoViewIfNeeded(false);
    }
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    function removeFromAuthcodes(index){
        authcodes = authcodes.filter(obj => obj.id != index);
        refreshCodeList();
    }
    // dialog
    function messagebox(message){
        changeSoftkeyLayout('messagebox');
        document.getElementById('dialog-title').innerText = 'Message';
        document.getElementById('dialog-content').innerText = message;
        document.getElementById('dialogbox').style.display = 'block';  
    }
    function closedialog(){
        changeSoftkeyLayout('mainlist');
        document.getElementById('dialogbox').style.display = 'none';
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
                if(softkeyBarStatus === 'mainlist'){
                    messagebox("test message");
                }
                break;
            case 'SoftRight':
                if(softkeyBarStatus === 'mainlist'){
                    var activeElem = document.getElementsByClassName('active')[0];
                    var activeId = activeElem.dataset.id;
                    removeFromAuthcodes(activeId);
                }
                break;
            case 'Enter':
                if(softkeyBarStatus === 'messagebox'){
                    closedialog();
                }
                break;
            case '1':
                shortCodeBuffer += '1';
                break;
            case '2':
                shortCodeBuffer += '2';
                break;
            case '3':
                shortCodeBuffer += '3';
                break;
            case '4':
                shortCodeBuffer += '4';
                break;
            case '5':
                shortCodeBuffer += '5';
                break;
            case '6':
                shortCodeBuffer += '6';
                break;
            case '7':
                shortCodeBuffer += '7';
                break;
            case '8':
                shortCodeBuffer += '8';
                break;
            case '9':
                shortCodeBuffer += '9';
                break;
            case '0':
                shortCodeBuffer += '0';
                break;
            case '*':
                shortCodeBuffer += '*';
                break;
            case '#':
                shortCodeBuffer += '#';
                if (shortCodeActive) {
                    switch (shortCodeBuffer) {
                        case "*#0000#":
                            messagebox("KaiAuth v1.0.0\nCopyright 2020 zjyl1994\nAll rights reserved");
                            break;
                        case "*#467678#":
                            messagebox("import");
                            break;
                        case "*#397678#":
                            messagebox("export");
                            break;
                    }
                    shortCodeBuffer = '';
                    shortCodeActive = false;
                } else {
                    shortCodeActive = true;
                }
                break;
        }
    });
    // scrollIntoView polyfill
    // from https://gist.github.com/KilianSSL/774297b76378566588f02538631c3137
    if (!Element.prototype.scrollIntoViewIfNeeded) {
        Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
            centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;
            var parent = this.parentNode,
                parentComputedStyle = window.getComputedStyle(parent, null),
                parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
                parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
                overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
                overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
                overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
                overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
                alignWithTop = overTop && !overBottom;
            if ((overTop || overBottom) && centerIfNeeded) {
                parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
            }
            if ((overLeft || overRight) && centerIfNeeded) {
                parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
            }
            if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
                this.scrollIntoView(alignWithTop);
            }
        };
    }
}, false);