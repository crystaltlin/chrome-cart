import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine('Using a function from the Print Module');

chrome.storage.local.get(['imageURLs'], function(result){
        console.log(result);
    });







chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("get imageURL", request)
    chrome.storage.local.get(['imageURLs'], function(result){
        console.log("result", result);
    });
  if (request.type === 'getImage') {
      console.log("get image!!!")
      console.log(request, sender)

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
    console.log("update menu!!!", request.menu)

    chrome.runtime.sendMessage(request.id, {type: 'updateMenu', menu: request.menu});
  }
  if (request.type === 'viewCart') {
    console.log("view cart!!!")
    chrome.runtime.sendMessage(request.id, {type: 'viewCart', cart: request.cart, imageURLs : request.imageURLs});
  }
});

