/**
  Communication library with Chrome.Hue extension
  @author: jldupont
*/

(function() {

  var extensionId = 'okcbadfdlhldjgkbafhnkcpofabckgde';

  function HueRequester() {
  };

  HueRequester.prototype.setDefaultErrorHandler = function(cb) {
      this._defaultErrorHandler = cb;
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

    var that = this;
    
    chrome.runtime.sendMessage(extensionId, msg, function(response) {

      if (response === undefined) {
        if (errorHandler) {
          return errorHandler(msg);
        }
        if (that._defaultErrorHandler) {
          return that._defaultErrorHandler(msg);
        }
      }
      responseHandler(response, msg);
    });

  };

  // Public exports
  window.HueRequester = HueRequester;

})();
