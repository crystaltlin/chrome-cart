import '../../assets/img/cart-icon.png';
'use strict';

console.log('This is the background page.');

// sync menu when load
chrome.storage.sync.get(['bgmenu'], function(result){
    var menu = result['bgmenu']
    chrome.contextMenus.removeAll()
    if (!menu) {
        console.log("cannot find menu")
        return
    }
    for (var index = 0; index < menu.length; index++) { 
        chrome.contextMenus.create({ 
          id: menu[index],
          title: menu[index],
          contexts: ['image']
        });
    }
});


// add image
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getImage', cart: info.menuItemId, url: info.srcUrl});
    });
});


// update menu and view cart when changed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'updateMenu') {
      chrome.contextMenus.removeAll()
      for (var index = 0; index < request.menu.length; index++) { 
        chrome.contextMenus.create({ 
          id: request.menu[index],
          title: request.menu[index],
          contexts: ['image']
        });
      } 
    chrome.storage.sync.set({'bgmenu': request.menu})
  }

  if (request.type === 'viewCart') {
      chrome.tabs.create({ url: 'newtab.html' }, function(tab) {     
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {type: "cartInfo", cart: request.cart, state : request.imageURLs});
      }, 1000);
    });
  }
});

