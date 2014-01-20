
/**
 * Module dependencies.
 */

var url = require('url');
var HttpProxyAgent = require('http-proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');
var SocksProxyAgent = require('socks-proxy-agent');

/**
 * Module exports.
 */

module.exports = setup;

/**
 * Adds a `.proxy(uri)` function to the "superagent" module's Request class.
 * No `proxyAgents` are added by default. You must add an `http.Agent` subclass
 * (like HTTP proxy, HTTPS proxy, and SOCKS) to handle the connection internally.
 *
 * @param {Object} superagent The `superagent` exports object
 * @api public
 */

function setup (superagent) {
  var Request = superagent.Request;
  superagent.proxies = Request._proxies = {
    'http:': httpOrHttpsProxy,
    'https:': httpOrHttpsProxy,
    'socks:': socksProxy
  };
  Request.prototype.proxy = proxy;
}

/**
 * Sets the proxy server to use for this HTTP(s) request.
 *
 * @param {String} uri proxy url
 * @api public
 */

function proxy (uri) {
  var proxies = this.constructor._proxies;
  var proxyParsed = url.parse(uri);
  var proxyFn = proxies[proxyParsed.protocol];
  if (!proxyFn) throw new Error('unsupported proxy protocol: "' + proxyParsed.protocol + '"');

  var agent = proxyFn(this, proxyParsed);
  if (agent) {
    this._proxy = proxyParsed;
    this._proxyUri = uri;
    this.agent(agent);
  }

  return this;
}


/**
 * Default "http:" and "https:" proxy uri handlers.
 *
 * @api protected
 */

function httpOrHttpsProxy (req, proxy) {
  var url = req.url;
  if (0 == url.indexOf('https:')) {
    // HTTPS
    return new HttpsProxyAgent(proxy);
  } else {
    // HTTP
    return new HttpProxyAgent(proxy);
  }
}

/**
 * Default "socks:" proxy uri handler.
 *
 * @api protected
 */

function socksProxy (req, proxy) {
  var url = req.url;
  var secure = 0 == url.indexOf('https:');
  return new SocksProxyAgent(proxy, secure);
}
