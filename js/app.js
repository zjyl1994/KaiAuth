window.addEventListener('DOMContentLoaded', function () {
    var timer = setInterval(updateRemaining, 1000);
    var mainlist = document.getElementById('authcodes');
    var authcodes = [], selectIndex = 0;
    // load data.json
    fetch('data/data.json')
    .then(res => res.json())
    .then((out) => {
        authcodes = out;
        refreshCodeList();
        updateRemaining();
    });
    // functions
    function updateRemaining(){
        let remain = window.otplib.authenticator.timeRemaining();
        document.getElementById('footbar').innerText = `Next in ${remain}s`;
        if(remain === 30){
            refreshCodeList();
        }
    }
    function refreshCodeList() {
        mainlist.innerHTML = '';
        authcodes.forEach(element => {
            let code = window.otplib.authenticator.generate(element.secert);
            let item = document.createElement('div');
            item.innerHTML = `<p class="code-row">${numberWithSpaces(code)}</p><p class="name-row">${element.name}</p>`;
            item.classList.add('authcode-item');
            mainlist.appendChild(item);
        });
        mainlist.children[selectIndex].classList.add('active');
    }
    function selectItemByIndex() {
        [].forEach.call(mainlist.children, function(el) {
          el.classList.remove('active');
        });
        let activeElem = mainlist.children[selectIndex];
        activeElem.classList.add('active');
        activeElem.scrollIntoViewIfNeeded(false);
    }
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
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