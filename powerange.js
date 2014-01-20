
/**
 * Powerange 0.0.1
 * http://abpetkov.github.io/powerange/
 *
 * Authored by Alexander Petkov
 * https://github.com/abpetkov
 *
 * Copyright 2014, Alexander Petkov
 * License: The MIT License (MIT)
 * http://opensource.org/licenses/MIT
 *
 */

/**
 * Expose `Powerange`.
 */

module.exports = Powerange;

/**
 * Set default values.
 *
 * @api public
 */

var defaults = {
  color: '#64bd63'
};

/**
 * Create Powerange object.
 *
 * @constructor
 * @param {Object} element
 * @param {Object} options
 * @api public
 */

function Powerange(element, options) {
  if (!(this instanceof Powerange)) return new Powerange(element, options);

  this.element = element;
  this.options = options || {};

  for (var i in defaults) {
    if (this.options[i] === null) {
      this.options[i] = defaults[i];
    }
  }

  this.init();
}

/*
 * Initialize
 *
 * @api private
 */

Powerange.prototype.init = function() {
  console.log(this.options);
};