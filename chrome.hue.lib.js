/**
  Communication library with Chrome.Hue extension
  @author: jldupont
*/

(function() {

  var extensionId = 'okcbadfdlhldjgkbafhnkcpofabckgde';

  function HueRequester() {
    this._defaultRequestParams = {};
  };

  HueRequester.prototype.setDefaultErrorHandler = function(cb) {
      this._defaultErrorHandler = cb;
  };

  HueRequester.prototype.setDefaultRequestParameters = function(params) {
      this._defaultRequestParams = params;
  };

  HueRequester.prototype.isExtensionPresent = function(cb) {

    chrome.runtime.sendMessage(extensionId, {msg: 'ping'}, function(response) {

      response = response || {};
      cb(response.msg == 'pong');
      
    });

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
  HueRequester.prototype.makeRequest = function(request, responseHandler, errorHandler) {

    var that = this;

    var computedRequest = {};

    for (var prop in this._defaultRequestParams) {
      computedRequest[prop] = request[prop] || this._defaultRequestParams[prop];
    }
    for (var prop in request) {
      computedRequest[prop] = request[prop];
    }

    chrome.runtime.sendMessage(extensionId, computedRequest, function(response) {

      if (response === undefined) {
        if (errorHandler) {
          return errorHandler(computedRequest);
        }
        if (that._defaultErrorHandler) {
          return that._defaultErrorHandler(computedRequest);
        }
      }
      responseHandler(response, computedRequest);
    });

  };

  // Public exports
  window.HueRequester = HueRequester;

})();
