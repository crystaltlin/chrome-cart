import '../../assets/img/cart-icon.png';
'use strict';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.contextMenus.create({ 
  id: 'ImageFetcher',
  title: 'Add image to cart',
  contexts: ['image']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        console.log("send message")
        console.log(tabs[0])
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getImage', url: info.srcUrl});
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("receive message")
  if (request.type === 'popup') {
      console.log("from popup!!!")
      console.log(request, sender)
  }
});

