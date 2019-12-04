// Called when the user clicks on the browser extension icon
chrome.runtime.onInstalled.addListener(function() {
   chrome.storage.sync.set({color: '#3aa757'}, function() {
     console.log('The color is green.');
   });
   chrome.browserAction.onClicked.addListener(function(tab) {
      // Send a message to the active tab
      chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
         let activeTab = tabs[0];
         console.log("qiwei");
         chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
      });
   });
});