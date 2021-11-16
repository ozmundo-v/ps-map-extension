//background.js
var boardData;

chrome.runtime.onInstalled.addListener(function() {
  getBoardData();

  chrome.alarms.get('dataFetch', alarm => {
    if (!alarm) {
      chrome.alarms.create('dataFetch', {periodInMinutes: 1});
    }
  });

});

chrome.alarms.onAlarm.addListener(alarm => {
  if(alarm.name == 'dataFetch') {
    getBoardData();
  }  
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if(changes.key == "count") {
    chrome.action.setBadgeText({"text" : storageChange.newValue.toString()});
  }  
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.popUpOpen) {
    chrome.storage.local.get(['boardData'], function (boardData) {
      if(boardData) {
        sendResponse(boardData.boardData);
      } else {
        getBoardData(sendResponse);
      }
    })
        
   }
   return true;
});

function getBoardData(sendResponse) {
  fetch('https://devtools.myald.co.uk/TFSMonitorWebAPI/releases')
    .then(response => response.json())
    .then(function(data) {
      if(data) {
        this.boardData = data;        
      }
      
      var count = data.Value.length;
      chrome.storage.local.set({"count": count });
      chrome.storage.local.set({"boardData": data});
      chrome.action.setBadgeText({"text" : count.toString()});
      if (sendResponse) {
        sendResponse(boardData);
      }
    })
    .catch(error => console.log(error) );
}