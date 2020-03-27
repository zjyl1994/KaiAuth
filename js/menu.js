window.addEventListener('DOMContentLoaded', function () {
    var activityHandler = null;
    var menulist = document.getElementById('menulists');
    var selectIndex = 0;

    navigator.mozSetMessageHandler('activity', function(activityRequest) {
        activityHandler = activityRequest;
    });
    selectItemByIndex();

    function selectItemByIndex() {
        [].forEach.call(menulist.children, function (el) {
            el.classList.remove('active');
        });
        if (selectIndex > 5) selectIndex = 0;
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
                if (selectIndex < 0) selectIndex = 5;
                selectItemByIndex();
                break;
            case 'ArrowDown': //scroll down
            case 'ArrowRight':
                selectIndex++;
                if (selectIndex > 5) selectIndex = 0;
                selectItemByIndex();
                break;
            case 'Enter':
                var menuId = document.getElementsByClassName('active')[0].dataset.menuId;
                activityHandler.postResult(menuId);
                break;
        }
    });
});