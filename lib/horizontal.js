/**
 * External dependencies.
 *
 */

var inherits = require('super')
  , percentage = require('percentage-calc')
  , closest = require('closest-num');

/**
 * Require main class.
 */

var Powerange = require('./main');

/**
 * Expose `Horizontal`.
 */

module.exports = Horizontal;

/**
 * Create horizontal slider object.
 *
 * @api public
 */

function Horizontal() {
  Powerange.apply(this, arguments);
  this.initHorizontal();
}

/**
 * Inherit the main class.
 */

inherits(Horizontal, Powerange);

/**
 * Set horizontal slider position.
 *
 * @param {Number} start
 * @api private
 */

Horizontal.prototype.setStart = function(start) {
  var part = percentage.from(start - this.options.min, this.options.max - this.options.min) || 0
    , position = percentage.of(part, this.slider.offsetWidth - this.handle.offsetWidth);

  this.setPosition(position);
  this.setValue();
};

/**
 * Set horizontal slider current position.
 *
 * @param {Number} val
 * @api private
 */

Horizontal.prototype.setPosition = function(val) {
  this.handle.style.left = val + 'px';
  this.slider.querySelector('.range-quantity').style.width = val + 'px';
};

/**
 * Set horizontal slider current value.
 *
 * @api private
 */

Horizontal.prototype.setValue = function () {
  var part = percentage.from(parseFloat(this.handle.style.left), this.slider.offsetWidth - this.handle.offsetWidth)
    , value = percentage.of(part, this.options.max - this.options.min) + this.options.min;

  value = (this.options.decimal) ? (Math.round(value * 10) / 10) : Math.round(value);

  this.element.value = value;
  this.options.callback();
  this.changeEvent();
};

/**
 * Set step.
 *
 * @returns {Array} this.steps
 * @api private
 */

Horizontal.prototype.step = function() {
  var sliderWidth = this.slider.offsetWidth - this.handle.offsetWidth
    , part = percentage.from(this.options.step, this.options.max - this.options.min)
    , interval = percentage.of(part, sliderWidth)
    , steps = [];

  for (i = 0; i <= sliderWidth; i += interval) {
    steps.push(i);
  }

  this.steps = steps;

  return this.steps;
};

/**
 * On horizontal slider mouse down.
 *
 * @param {Object} e
 * @api private
 */

Horizontal.prototype.onmousedown = function(e) {
  this.startX = e.clientX;
  this.handleOffsetX = this.handle.offsetLeft;
  this.restrictHandleX = this.slider.offsetWidth - this.handle.offsetWidth;
  if (this.options.step) this.step();
};

/**
 * On horizontal slider mouse move.
 *
 * @param {Object} e
 * @api private
 */

Horizontal.prototype.onmousemove = function(e) {
  var leftOffset = this.handleOffsetX + e.clientX - this.startX
    , position = (this.steps) ? closest.find(leftOffset, this.steps) : leftOffset;


  if (leftOffset <= 0) {
    this.setPosition(0);
  } else if (leftOffset >= this.restrictHandleX) {
    this.setPosition(this.restrictHandleX);
  } else {
    this.setPosition(position);
  }

  this.setValue();
};

/**
 * Initialize horizontal class.
 *
 * @api private
 */

Horizontal.prototype.initHorizontal = function() {
  this.setStart(this.options.start);
};