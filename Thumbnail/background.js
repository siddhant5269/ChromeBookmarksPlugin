chrome.browserAction.onClicked.addListener(function() {
//    chrome.windows.create({'url': 'popup.html','height': 100,'width':300 ,'type': 'normal','left': 400,'top': 400}, function(window) {

//    });
 document.getElementsByTagName('body').innerHTML = document.getElementsByTagName('body').innerHTML + `<div style='width:400px;
    position:absolute;
    left:0;
    right:0;
    margin-left:auto;
    margin-right:auto;'></div>`
});