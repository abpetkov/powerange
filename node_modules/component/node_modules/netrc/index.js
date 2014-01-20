/**
 * Module dependencies
 */
var fs = require("fs")
  , join = require("path").join;

/**
 * Read and parse .netrc
 *
 * @param {String} file
 * @return {Object}
 * @api public
 */
module.exports = exports = function(file) {
  var home = process.env.HOME || process.env.HOMEPATH;
  
  if(!file && !home) return {};
  file = file || join(home, ".netrc");

  if(!file || !fs.existsSync(file)) return {};
  var netrc = fs.readFileSync(file, "UTF-8");
  return exports.parse(netrc);
};

/**
 * Parse netrc
 *
 * @param {String} content
 * @return {Object}
 * @api public
 */
exports.parse = function(content) {
  // Remove comments
  var lines = content.split('\n');
  for (var n in lines) {
    var i = lines[n].indexOf('#');
    if (i > -1) lines[n] = lines[n].substring(0,i);
  }
  content = lines.join('\n');

  var tokens = content.split(/[ \t\n\r]+/)
    , machines = {}
    , m = null
    , key = null;

  //if first index in array is empty string, strip it off (happens when first line of file is comment. Breaks the parsing)
  if (tokens[0] === "") {
    tokens.shift();
  }

  for(var i = 0; i < tokens.length; i+=2) {
    var key = tokens[i]
      , value = tokens[i+1];

    // Whitespace
    if(!key || !value) continue;

    // We have a new machine definition
    if(key === "machine") {
      m = {};
      machines[value] = m;
    }
    // key=value
    else {
      m[key] = value;
    }
  }

  return machines
};

/**
 * Generate contents of netrc file from objects.
 * @param {Object} machines as returned by `netrc.parse`
 * @return {String} text of the netrc file
 */
exports.format = function format(machines){
    var lines = [],
        keys = Object.getOwnPropertyNames(machines).sort();
    keys.forEach(function(key){
        lines.push('machine ' + key);
        var machine = machines[key];
        var attrs = Object.getOwnPropertyNames(machine).sort();
        attrs.forEach(function(attr){
            if(typeof(machine[attr]) === 'string'){
                lines.push('    ' + attr + ' ' + machine[attr]);
            }
        });
    });
    return lines.join('\n');
};

