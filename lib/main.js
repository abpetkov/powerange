/**
 * External dependencies.
 *
 */

var mouse = require('mouse');

/**
 * Expose `Powerange`.
 */

module.exports = Powerange;

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
  this.slider = this.create('span', 'range-bar');

  if (this.element !== null && this.element.type === 'text') this.init();
}

/**
 * Bind events on handle element.
 *
 * @api private
 */

Powerange.prototype.bindEvents = function () {
  this.handle = this.slider.querySelector('.range-handle');
  this.mouse = mouse(this.handle, this);
  this.mouse.bind();
};

/**
 * Get closest number in array.
 *
 * @param {Number} target
 * @param {Array} points
 * @returns {Number} closest
 * @api private
 */

Powerange.prototype.closest = function(target, points) {
  var diff = null
    , current = null
    , closest = points[0];

  for (i = 0; i < points.length; i++) {
    diff = Math.abs(target - closest);
    current = Math.abs(target - points[i]);
    if (current < diff) closest = points[i];
  }

  return closest;
};

/**
 * Hide the target element.
 *
 * @api private
 */

Powerange.prototype.hide = function() {
  this.element.style.display = 'none';
};

/**
 * Append the target after the element.
 *
 * @api private
 */

Powerange.prototype.append = function() {
  var slider = this.generate();
  this.insertAfter(this.element, slider);
};

/**
 * Generate the appropriate type of slider.
 *
 * @returns {Object} this.slider
 * @api private
 */

Powerange.prototype.generate = function() {
  var elems = {
      'handle': {
          'type': 'span'
        , 'selector': 'range-handle'
      }
    , 'min': {
          'type': 'span'
        , 'selector': 'range-min'
      }
    , 'max': {
          'type': 'span'
        , 'selector': 'range-max'
      }
    , 'quantity': {
          'type': 'span'
        , 'selector': 'range-quantity'
      }
  };

  for (var key in elems) {
    if (elems.hasOwnProperty(key)) {
      var temp = this.create(elems[key].type, elems[key].selector);
      this.slider.appendChild(temp);
    }
  }

  return this.slider;
};

/**
 * Create HTML element.
 *
 * @param {String} type
 * @param {String} name
 * @returns {Object} elem
 * @api private
 */

Powerange.prototype.create = function(type, name) {
  var elem = document.createElement(type);
  elem.className = name;

  return elem;
};

/**
 * Insert element after another element.
 *
 * @param {Object} reference
 * @param {Object} target
 * @api private
 */

Powerange.prototype.insertAfter = function(reference, target) {
  reference.parentNode.insertBefore(target, reference.nextSibling);
};

/**
 * Set min and max values.
 *
 * @param {Number} min
 * @param {Number} max
 * @api private
 */

Powerange.prototype.setRange = function(min, max) {
  if (typeof min === 'number' && typeof max === 'number' && !this.options.hideRange) {
    this.slider.querySelector('.range-min').innerHTML = min;
    this.slider.querySelector('.range-max').innerHTML = max;
  }
};

/**
 * Check values.
 *
 * @param {Number} start
 * @api private
 */

Powerange.prototype.checkValues = function(start) {
  if (start < this.options.min) this.options.start = this.options.min;
  if (start > this.options.max) this.options.start = this.options.max;
  if (this.options.min >= this.options.max) this.options.min = this.options.max;
};

/**
 * Disable range slider.
 *
 * @api private
 */

Powerange.prototype.disable = function() {
  if (this.options.min == this.options.max || this.options.min > this.options.max || this.options.disable) {
    this.mouse.unbind();
    this.slider.style.opacity = this.options.disableOpacity;
  }
};

/**
 * Handle the onchange event.
 *
 * @param {Boolean} state
 * @api private
 */

Powerange.prototype.changeEvent = function(state) {
  if (typeof Event === 'function' || !document.fireEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, true);
    this.element.dispatchEvent(event);
  } else {
    this.element.fireEvent('onchange');
  }
};

/**
 * Initialize main class.
 *
 * @api private
 */

Powerange.prototype.init = function() {
  this.hide();
  this.append();
  this.bindEvents();
  this.checkValues(this.options.start);
  this.setRange(this.options.min, this.options.max);
  this.disable();
};