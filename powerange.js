
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

var mouse = require('mouse')
  , percentage = require('percentage-calc');

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
  , disable: false
  , disableOpacity: 0.5
  , min: 0
  , max: 100
  , start: 0
  , vertical: false
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
  if (typeof this.options.decimal !== 'boolean') this.options.decimal = defaults.decimal;

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

  if (this.options.vertical) this.slider.className += ' vertical';

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
  if (typeof min === 'number' && typeof max === 'number') {
    this.slider.querySelector('.range-min').innerHTML = min;
    this.slider.querySelector('.range-max').innerHTML = max;
  }
};

/**
 * Set starting position.
 *
 * @param {Number} start
 * @api private
 */

Powerange.prototype.setStart = function(start) {
  if (start < this.options.min) start = this.options.min;
  if (start > this.options.max) start = this.options.max;
  if (this.options.min >= this.options.max) this.options.min = this.options.max;

  var part = percentage.from(start - this.options.min, this.options.max - this.options.min) || 0
    , position = (!this.options.vertical) ? percentage.of(part, this.slider.offsetWidth - this.handle.offsetWidth) : percentage.of(part, this.slider.offsetHeight - this.handle.offsetHeight);

  this.setPosition(position);
  this.setValue();
};

/**
 * Set current position.
 *
 * @param {Number} val
 * @api private
 */

Powerange.prototype.setPosition = function(val) {
  if (!this.options.vertical) {
    this.handle.style.left = val + 'px';
    this.slider.querySelector('.range-quantity').style.width = val + 'px';
  } else {
    this.handle.style.bottom = val + 'px';
    this.slider.querySelector('.range-quantity').style.height = val + 'px';
  }
};

/**
 * Set current value.
 *
 * @api private
 */

Powerange.prototype.setValue = function () {
  var part = (!this.options.vertical) ? percentage.from(parseFloat(this.handle.style.left), this.slider.offsetWidth - this.handle.offsetWidth) : percentage.from(parseFloat(this.handle.style.bottom), this.slider.offsetHeight - this.handle.offsetHeight)
    , value = percentage.of(part, this.options.max - this.options.min) + this.options.min;

  value = (this.options.decimal) ? (Math.round(value * 10) / 10) : Math.round(value);

  this.element.value = value;
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
 * On mouse down.
 *
 * @param {Object} e
 * @api private
 */

Powerange.prototype.onmousedown = function(e) {
  if (!this.options.vertical) {
    this.startX = e.clientX;
    this.handleOffsetX = this.handle.offsetLeft;
    this.restrictHandleX = this.slider.offsetWidth - this.handle.offsetWidth;
  } else {
    this.startY = e.clientY;
    this.handleOffsetY = this.slider.offsetHeight - this.handle.offsetHeight - this.handle.offsetTop;
    this.restrictHandleY = this.slider.offsetHeight - this.handle.offsetHeight;
  }
};

/**
 * On mouse move.
 *
 * @param {Object} e
 * @api private
 */

Powerange.prototype.onmousemove = function(e) {
  if (!this.options.vertical) {
    var leftOffset = this.handleOffsetX + e.clientX - this.startX;

    if (leftOffset <= 0) {
      this.setPosition(0);
    } else if (leftOffset >= this.restrictHandleX) {
      this.setPosition(this.restrictHandleX);
    } else {
      this.setPosition(leftOffset);
    }
  } else {
    var bottomOffset = this.handleOffsetY + this.startY - e.clientY;

    if (bottomOffset <= 0) {
      this.setPosition(0);
    } else if (bottomOffset >= this.restrictHandleY) {
      this.setPosition(this.restrictHandleY);
    } else {
      this.setPosition(bottomOffset);
    }
  }

  this.setValue();
};

/**
 * Initialize.
 *
 * @api private
 */

Powerange.prototype.init = function() {
  this.hide();
  this.append();
  this.bindEvents();
  this.setStart(this.options.start);
  this.setRange(this.options.min, this.options.max);
  this.disable();
};