import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine('Using a function from the Print Module');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getImage') {
      console.log("get image!!!")
      console.log(request, sender)
      chrome.storage.local.set({url: request.url});
      chrome.runtime.sendMessage(request.id, {type: 'getImage', url: request.url});
  }
});

