/**
  Communication library with Chrome.Hue extension
  @author: jldupont
*/

function HueRequester() {
};

/**
 *  makeRequest(msg, responseHandler [,errorHandler])
 *  where:
 *    msg: any JSON serializable object
 *    responseHandler: function(response, msg)
 *    errorHandler: function(msg)
 *
 *    `responseHandler` is called when a response is available
 *     or when an error occured (e.g. extension not present) and
 *     no `errorHandler` is provided.
 *
 *    `errorHandler` is called when the extension can not be reached.
 */
HueRequester.prototype.makeRequest = function(msg, responseHandler, errorHandler) {

  chrome.runtime.sendMessage("okcbadfdlhldjgkbafhnkcpofabckgde", msg, function(response) {
    if (response === undefined && errorHandler) {
      errorHandler(msg);
      return;
    }
    responseHandler(response, msg);
  });

};
