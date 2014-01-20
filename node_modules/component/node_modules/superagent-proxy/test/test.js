
/**
 * Module dependencies.
 */

var net = require('net');
var url = require('url');
var assert = require('assert');
var request = require('superagent');

// extend with .proxy()
require('../')(request);

describe('superagent-proxy', function () {

  this.slow(5000);
  this.timeout(10000);

  var httpLink = 'http://jsonip.com/';
  var httpsLink = 'https://graph.facebook.com/tootallnate';

  describe('http: - HTTP proxy', function () {
    var proxy = process.env.HTTP_PROXY || process.env.http_proxy || 'http://10.1.10.200:3128';

    it('should work against an HTTP endpoint', function (done) {
      request
      .get(httpLink)
      .proxy(proxy)
      .end(function (res) {
        var data = res.body;
        assert('ip' in data);
        var ips = data.ip.split(/\,\s*/g);
        assert(ips.length >= 1);
        ips.forEach(function (ip) {
          assert(net.isIP(ip));
        });
        done();
      });
    });

    it('should work against an HTTPS endpoint', function (done) {
      request
      .get(httpsLink)
      .proxy(proxy)
      .end(function (res) {
        var data = JSON.parse(res.text);
        assert.equal('tootallnate', data.username);
        done();
      });
    });
  });

  describe('https: - HTTPS proxy', function () {
    var proxy = process.env.HTTPS_PROXY || process.env.https_proxy || 'https://10.1.10.200:3130';

    it('should work against an HTTP endpoint', function (done) {
      var p = url.parse(proxy);
      p.rejectUnauthorized = false;

      request
      .get(httpLink)
      .proxy(p)
      .end(function (res) {
        var data = res.body;
        assert('ip' in data);
        var ips = data.ip.split(/\,\s*/g);
        assert(ips.length >= 1);
        ips.forEach(function (ip) {
          assert(net.isIP(ip));
        });
        done();
      });
    });

    it('should work against an HTTPS endpoint', function (done) {
      var p = url.parse(proxy);
      p.rejectUnauthorized = false;

      request
      .get(httpsLink)
      .proxy(p)
      .end(function (res) {
        var data = JSON.parse(res.text);
        assert.equal('tootallnate', data.username);
        done();
      });
    });
  });

  describe('socks: - SOCKS proxy', function () {
    var proxy = process.env.SOCKS_PROXY || process.env.socks_proxy || 'socks://127.0.0.1:9050';

    it('should work against an HTTP endpoint', function (done) {
      request
      .get(httpLink)
      .proxy(proxy)
      .end(function (res) {
        var data = res.body;
        assert('ip' in data);
        var ips = data.ip.split(/\,\s*/g);
        assert(ips.length >= 1);
        ips.forEach(function (ip) {
          assert(net.isIP(ip));
        });
        done();
      });
    });

    it('should work against an HTTPS endpoint', function (done) {
      request
      .get(httpsLink)
      .proxy(proxy)
      .end(function (res) {
        var data = JSON.parse(res.text);
        assert.equal('tootallnate', data.username);
        done();
      });
    });
  });

});
