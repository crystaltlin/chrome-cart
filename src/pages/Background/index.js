import '../../assets/img/cart-icon.png';
'use strict';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.contextMenus.create({ 
  id: 'ImageFetcher',
  title: 'Add image to cart',
  contexts: ['all']
});

chrome.contextMenus.onClicked.addListener(() => {
    console.log("clicked", chrome.tabs)
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        console.log("send message")
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getImage', url: tabs[0].url});
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("receive message")
  if (request.type === 'popup') {
      console.log("from popup!!!")
      console.log(request, sender)
  }
});

// chrome.runtime.onInstalled.addListener(() => {
//   console.log('onInstalled...');
//   // create alarm after extension is installed / upgraded
//   chrome.alarms.create('refresh', { periodInMinutes: 5 });
// });

// chrome.alarms.onAlarm.addListener((alarm) => {
//   console.log(alarm.name); // refresh
//   helloWorld();
// });

// function helloWorld() {
//   console.log("Hello, world!");
//   startRequest();
// }

// async function startRequest() {
//   console.log(chrome.tabs);
// }


// chrome.runtime.onMessage.addListener(request => {
//   if (request.type === 'getHeadlines') {
//       console.log("request!")
//   }
// });