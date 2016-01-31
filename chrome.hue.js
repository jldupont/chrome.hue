/**
 * Chrome Extension for communicating with
 *  Philips Hue bridges on local LAN
 *
 * No access code (aka username) is maintained in the extension.
 *
 * The protocol is fairly simple:
 * - Web page sends request message to this extension
 * - The request:
 *   {
 *     ip, method, path, access, body, timeout
 *   }
 *
 * @author: Jean-Lou Dupont
 */

chrome.runtime.onMessageExternal.addListener(function(request, _sender, sendResponse) {

  var ip      = request.ip;
  var timeout = request.timeout || 2000;
  var path    = request.path    || '/api';
  var method  = request.method  || 'GET';
  var body    = request.body    || '{}';
  var scheme  = request.scheme  || 'http';

  var url     = scheme + '://' + ip + path;

  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.ontimeout = function() {
    sendResponse({ status: 'TIMEOUT' });
  };

  xhr.onload = function(e) {
    var rep;
    try {
      rep = JSON.parse(xhr.responseText);
      sendResponse({ status: 'LOAD', msg: rep });
    } catch(e) {
      sendResponse({ status: 'ERROR', msg: 'not JSON' });
    }
  };

  xhr.onerror = function(e) {
    sendResponse({ status: 'ERROR', code: e.target.status });
  };

  try {
    xhr.send(body);
  } catch(e) {
    sendResponse({ status: 'ERROR', msg: e});
  }

  // keep the callback `sendResponse` valid
  // so that an async response can be sent back
  return true;
});
