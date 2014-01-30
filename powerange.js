
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
 * External dependencies.
 *
 */

var mouse = require('mouse');

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
    color: '#a9acb1'
  , decimal: false
  , min: 0
  , max: 100
  , start: 0
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
  this.slider = this.create('span', 'range-bar');

  for (var i in defaults) {
    if (this.options[i] == null) {
      this.options[i] = defaults[i];
    }
  }

  if (typeof this.options.start !== 'number') this.options.start = defaults.start;
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
 * @param {String} type
 * @returns {Object} this.slider
 * @api private
 */

Powerange.prototype.generate = function(type) {
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
 * Set min and max values.
 *
 * @param {Number} min
 * @param {Number} max
 * @api private
 */

Powerange.prototype.setRange = function(min, max) {
  if (typeof min === 'number' && typeof max === 'number') {
    this.slider.querySelector('.range-min').innerHTML = min;
    this.slider.querySelector('.range-max').innerHTML = max;
  }
};

/**
 * Set current position.
 *
 * @param {Number} val
 * @api private
 */

Powerange.prototype.setPosition = function(val) {
  this.handle.style.left = val + 'px';
  this.slider.querySelector('.range-quantity').style.width = val + 'px';
};

/**
 * Set current value.
 *
 * @api private
 */

Powerange.prototype.setValue = function () {
  var handleLeft = parseFloat(this.handle.style.left)
    , sliderWidth = this.slider.offsetWidth - this.handle.offsetWidth
    , flag = handleLeft / sliderWidth
    , result = flag * this.options.max;

  result = (this.options.decimal) ? (Math.round(result * 10) / 10) : Math.round(result);

  this.element.value = result;
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
 * On mouse down.
 *
 * @param {Object} e
 * @api private
 */

Powerange.prototype.onmousedown = function(e) {
  this.startX = e.clientX;
  this.handleOffsetX = this.handle.offsetLeft;
  this.restrictHandle = this.slider.offsetWidth - this.handle.offsetWidth;
};

/**
 * On mouse move.
 *
 * @param {Object} e
 * @api private
 */

Powerange.prototype.onmousemove = function(e) {
  var leftOffset = this.handleOffsetX + e.clientX - this.startX;

  if (leftOffset <= 0) {
    this.setPosition(0);
  } else if (leftOffset >= this.restrictHandle) {
    this.setPosition(this.restrictHandle);
  } else {
    this.setPosition(leftOffset);
  }

  this.setValue();
};

/**
 * Initialize.
 *
 * @api private
 */

Powerange.prototype.init = function() {
  // this.hide();
  this.append();
  this.bindEvents();
  this.setRange(this.options.min, this.options.max);
  this.setPosition((this.slider.offsetWidth - this.handle.offsetWidth) / ((this.options.max - this.options.min) / this.options.start));
  this.setValue();
};