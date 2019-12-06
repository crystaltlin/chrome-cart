import { printLine } from './modules/print';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 
  if (request.type === 'getImage') {
      chrome.storage.local.get(['imageURLs'], function(result){
        var newTotalURLs = result['imageURLs']
        if (!newTotalURLs){
            newTotalURLs = {}
        }
        if (!newTotalURLs[request.cart]){
        newTotalURLs[request.cart] = [request.url];
      } else {
        var newURLs = newTotalURLs[request.cart]
        newURLs.push(request.url)
        newTotalURLs[request.cart] = newURLs
      }
      chrome.storage.local.set({imageURLs: newTotalURLs});
    }); 
      chrome.runtime.sendMessage(request.id, {type: 'getImage', url: request.url, cart: request.cart});
  } 
  if (request.type === "updateMenu") {
    chrome.runtime.sendMessage(request.id, {type: 'updateMenu', menu: request.menu});
  } 
  if (request.type === 'viewCart') {
    chrome.runtime.sendMessage(request.id, {type: 'viewCart', cart: request.cart, imageURLs : request.imageURLs});
  }
});

