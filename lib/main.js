/**
 * External dependencies.
 *
 */

var mouse = require('mouse')
  , events = require('events')
  , classes = require('classes')
  , percentage = require('percentage-calc');

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
  this.slider = this.create('div', 'range-container');

  if (this.element !== null) this.init();
}

/**
 * Bind events on handle element.
 *
 * @api private
 */

Powerange.prototype.bindEvents = function () {
  this.handle = this.slider.querySelector('.range-handle');
  this.touch = events(this.slider, this);
  this.touch.bind('touchstart', 'onmousedown');
  this.touch.bind('touchmove', 'onmousemove');
  this.touch.bind('touchend', 'onmouseup');
  this.mouse = mouse(this.slider, this);
  this.mouse.bind();
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

  var bar = this.create('span', 'range-bar');
  this.slider.appendChild(bar);

  for (var key in elems) {
    if (elems.hasOwnProperty(key)) {
      var temp = this.create(elems[key].type, elems[key].selector);
      bar.appendChild(temp);
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
 * Add an additional class for extra customization.
 *
 * @param {String} klass
 * @api private
 */

Powerange.prototype.extraClass = function(klass) {
  if (this.options.klass) classes(this.slider).add(klass);
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
 * Set slider current value.
 *
 * @param {Number} offset
 * @param {Number} size
 * @api private
 */

Powerange.prototype.setValue = function (offset, size) {
  var part = percentage.from(parseFloat(offset), size)
    , value = percentage.of(part, this.options.max - this.options.min) + this.options.min
    , changed = false;

  value = (this.options.decimal) ? (Math.round(value * 100) / 100) : Math.round(value);
  changed = (this.element.value != value) ? true : false;

  this.element.value = value;
  this.options.callback();
  if (changed) this.changeEvent();
};

/**
 * Set step.
 *
 * @param {Number} sliderSize
 * @param {Number} handleSize
 * @returns {Array} this.steps
 * @api private
 */

Powerange.prototype.step = function(sliderSize, handleSize) {
  var dimension = sliderSize - handleSize
    , part = percentage.from(this.checkStep(this.options.step), this.options.max - this.options.min)
    , interval = percentage.of(part, dimension)
    , steps = [];

  for (i = 0; i <= dimension; i += interval) {
    steps.push(i);
  }

  this.steps = steps;

  return this.steps;
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
 * Make sure `step` is positive.
 *
 * @param {Number} value
 * @returns {Number} this.options.step
 * @api private
 */

Powerange.prototype.checkStep = function(value) {
  if (value < 0) value = Math.abs(value);
  this.options.step = value;
  return this.options.step;
};

/**
 * Disable range slider.
 *
 * @api private
 */

Powerange.prototype.disable = function() {
  if (this.options.min == this.options.max || this.options.min > this.options.max || this.options.disable) {
    this.mouse.unbind();
    this.touch.unbind();
    this.slider.style.opacity = this.options.disableOpacity;
    classes(this.handle).add('range-disabled');
  }
};

/**
 * Make element unselectable.
 *
 * @param {Object} element
 * @param {Boolean} set
 * @api private
 */

Powerange.prototype.unselectable = function(element, set) {
  if (!classes(this.slider).has('unselectable') && set === true) {
    classes(this.slider).add('unselectable');
  } else {
    classes(this.slider).remove('unselectable');
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
  this.extraClass(this.options.klass);
  this.checkValues(this.options.start);
  this.setRange(this.options.min, this.options.max);
  this.disable();
};
