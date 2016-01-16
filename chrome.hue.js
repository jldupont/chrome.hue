chrome.runtime.onMessageExternal.addListener(

  function(request, sender, sendResponse) {

      console.log("Request: ", request);

      sendResponse({ status: "OK" });
  });
