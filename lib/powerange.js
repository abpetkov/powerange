/**
 * Require classes.
 */

var Main = require('./main')
  , Horizontal = require('./horizontal')
  , Vertical = require('./vertical');

/**
 * Set default values.
 *
 * @api public
 */

var defaults = {
    callback: function() {}
  , decimal: false
  , disable: false
  , disableOpacity: 0.5
  , hideRange: false
  , klass: ''
  , min: 0
  , max: 100
  , start: null
  , step: null
  , vertical: false
};

/**
 * Expose proper type of `Powerange`.
 */

module.exports = function(element, options) {
  options = options || {};

  // if we have an element, fill in some values based on that input element
  if (element) {
    if (typeof options.min === 'undefined' && element.min)
      options.min = element.min;
    if (typeof options.max === 'undefined' && element.max)
      options.max = element.max;
    if (typeof options.step === 'undefined' && element.step)
      options.step = element.step;
    if (typeof options.start === 'undefined' && element.value)
      options.start = element.value;
  }

  for (var i in defaults) {
    if (options[i] == null) {
      options[i] = defaults[i];
    }
  }

  if (options.vertical) {
    return new Vertical(element, options);
  } else {
    return new Horizontal(element, options);
  }
};
