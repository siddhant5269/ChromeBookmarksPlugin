var allBookmarks = [];

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
    document.getElementById('resultList').innerHTML =
      `${document.getElementById('resultList').innerHTML}
            <li>
              <a href='${bookmark.url}'>${bookmark.title}</a>
            </li>`;
  }
}

document.addEventListener('DOMContentLoaded', function () {

  chrome.bookmarks.getTree(function (root) {
    extractBookmarks(root);
    createBookmarksList(allBookmarks);
  });

  document.getElementById('bookmarks').addEventListener('keyup', function (e) {
    createBookmarksList(allBookmarks.filter(p => p.title.includes(e.currentTarget.value)));
  });
});