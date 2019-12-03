import '../../assets/img/cart-icon.png';
'use strict';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.storage.sync.get(['bgmenu'], function(result){
    var menu = result['bgmenu']
    chrome.contextMenus.removeAll()
    if (!menu) {
        console.log("cannot find menu")
        return
    } else {
        console.log("menu", menu)
    }
    for (var index = 0; index < menu.length; index++) { 
        chrome.contextMenus.create({ 
          id: menu[index],
          title: menu[index],
          contexts: ['image']
        });
    }
});




chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        console.log("send message", info.menuItemId, tab)
        console.log(tabs[0])
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getImage', cart: info.menuItemId, url: info.srcUrl});
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("receive message")
  if (request.type === 'updateMenu') {
      console.log("update Menu")
      console.log(request.menu)
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
        chrome.tabs.executeScript(tab.id, {file:"contentScript.bundle.js"}, function() {
          chrome.tabs.sendMessage(tab.id, {type: "cartInfo", cart: request.cart, state : request.imageURLs});
        });

  })
  }
});

