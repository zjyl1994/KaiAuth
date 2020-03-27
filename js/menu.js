window.addEventListener('DOMContentLoaded', function () {
    var activityHandler = null;
    var menulist = document.getElementById('menulists');
    var selectIndex = 0,selectMin = 0;

    navigator.mozSetMessageHandler('activity', function(activityRequest) {
        activityHandler = activityRequest;
        if(activityRequest.source.data.activeId == 0){
            selectIndex = 3;
            selectMin = 3;
            var all = document.getElementsByClassName('authcode-related');
            for (var i = 0; i < all.length; i++) {
                all[i].style.color = 'grey';
            }
        }
        selectItemByIndex();
    });
    

    function selectItemByIndex() {
        [].forEach.call(menulist.children, function (el) {
            el.classList.remove('active');
        });
        if (selectIndex > 5) selectIndex = selectMin;
        let activeElem = menulist.children[selectIndex];
        activeElem.classList.add('active');
        activeElem.scrollIntoViewIfNeeded(false);
    }

    window.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'SoftLeft':
                activityHandler.postResult('about');
            case 'SoftRight':
                activityHandler.postError('back');
                break;
            case 'ArrowUp': //scroll up
            case 'ArrowLeft':
                selectIndex--;
                if (selectIndex < selectMin) selectIndex = 5;
                selectItemByIndex();
                break;
            case 'ArrowDown': //scroll down
            case 'ArrowRight':
                selectIndex++;
                if (selectIndex > 5) selectIndex = selectMin;
                selectItemByIndex();
                break;
            case 'Enter':
                var menuId = document.getElementsByClassName('active')[0].dataset.menuId;
                activityHandler.postResult(menuId);
                break;
        }
    });
});