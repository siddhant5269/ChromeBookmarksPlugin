var Constants ={
  DefaultIndex : 0
}
var allBookmarks = [];
var filteredBookmarks =[];
var focusedListIndex = Constants.DefaultIndex;

Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
};

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function extractBookmarks(parentNode) {
  parentNode.forEach(function (bookmark) {
    if (!(bookmark.url === undefined || bookmark.url === null)) {
      allBookmarks.push(bookmark);
    }
    if (bookmark.children) {
      extractBookmarks(bookmark.children);
    }
  });
}

function createBookmarksList(bookmarksList) {
  document.getElementById('resultList').innerHTML = '';

  for (let bookmark of bookmarksList) {
    focusedListIndex = Constants.DefaultIndex;
    document.getElementById('resultList').innerHTML =
      `${document.getElementById('resultList').innerHTML}
            <li class='bookmarkItem'>
              <a href='${bookmark.url}'>${bookmark.title}</a>
            </li>`;
  }
}

document.addEventListener('keydown',function(e){
  var listLength = document.getElementsByClassName('bookmarkItem').length;
  if(e.which == 38 && focusedListIndex > 0){
    console.log('i was here');
    removeClass(document.getElementsByClassName('bookmarkItem')[focusedListIndex],'focused');
    e.preventDefault();
    addClass(document.getElementsByClassName('bookmarkItem')[--focusedListIndex],'focused');   
  }          
  if(e.which == 40 && focusedListIndex < listLength - 1 ){    
    e.preventDefault();
    removeClass(document.getElementsByClassName('bookmarkItem')[focusedListIndex],'focused');
    addClass(document.getElementsByClassName('bookmarkItem')[++focusedListIndex],'focused');       
  } 

  var top = document.getElementsByClassName('bookmarkItem')[focusedListIndex].documentOffsetTop() - ( window.innerHeight / 1.66 );
  window.scrollTo( 0, top );  

  if(e.which == 13){
    chrome.tabs.create({active : true,
      url : filteredBookmarks[focusedListIndex].url});
  }
})

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('bookmarks').focus();
  chrome.bookmarks.getTree(function (root) {
    extractBookmarks(root);
    filteredBookmarks = allBookmarks.sort((p,q)=> p.title.toUpperCase() > q.title.toUpperCase() ? 1 : p.title.toUpperCase() < q.title.toUpperCase()? -1 : 0);    
    createBookmarksList(allBookmarks);
    addClass(document.getElementsByClassName('bookmarkItem')[focusedListIndex],'focused'); 
  });

  document.getElementById('bookmarks').addEventListener('input', function (e) {      
    filteredBookmarks = allBookmarks.filter(p => p.title.toUpperCase().includes(e.currentTarget.value.toUpperCase()));
    createBookmarksList(filteredBookmarks);
    addClass(document.getElementsByClassName('bookmarkItem')[focusedListIndex],'focused'); 
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
