// Called when the user clicks on the browser extension icon

// google analytics (i want to know what url user create notes on)
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      
ga('create', 'UA-154429650-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check.
ga('require', 'displayfeatures');

chrome.runtime.onMessage.addListener(function( request, sender, sendResponse ) {
   if(request.action === "generated_new_note") {
      ga('send', 'pageview', request.url); // Specify the virtual path
   }
});

chrome.runtime.onInstalled.addListener(function(details) {
   if (details.reason === "install") {
      chrome.storage.local.set({id: 0}, function() {
        console.log("set initial id");
      });
      chrome.storage.local.set({defaultTheme: 'monokai'}, function() {
        console.log("set default theme");
      });
      chrome.storage.local.set({defaultEditorFontFamily: '"Consolas","monaco",monospace'}, function() {
        console.log("set default font family");
      });
      chrome.storage.local.set({defaultEditorFontSize: 14}, function() {
        console.log("set default font size");
      });
   }
   // if (details.OnInstalledReason === "update") {
   //    // automatic refresh pages? OR ask user to do that?
   // }
});

chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_extension_action"});
   });
});
