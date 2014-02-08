/**
 * External dependencies.
 *
 */

var inherits = require('super')
  , percentage = require('percentage-calc');

/**
 * Require main class.
 */

var Powerange = require('./main');

/**
 * Expose `Vertical`.
 */

module.exports = Vertical;

/**
 * Create vertical slider object.
 *
 * @api public
 */

function Vertical() {
  Powerange.apply(this, arguments);
  this.initVertical();
}

/**
 * Inherit the main class.
 */

inherits(Vertical, Powerange);

/**
 * Set vertical slider position.
 *
 * @param {Number} start
 * @api private
 */

Vertical.prototype.setStart = function(start) {
  var part = percentage.from(start - this.options.min, this.options.max - this.options.min) || 0
    , position = percentage.of(part, this.slider.offsetHeight - this.handle.offsetHeight);

  this.setPosition(position);
  this.setValue();
};

/**
 * Set vertical slider current position.
 *
 * @param {Number} val
 * @api private
 */

Vertical.prototype.setPosition = function(val) {
  this.handle.style.bottom = val + 'px';
  this.slider.querySelector('.range-quantity').style.height = val + 'px';
};

/**
 * Set vertical slider current value.
 *
 * @api private
 */

Vertical.prototype.setValue = function () {
  var part = percentage.from(parseFloat(this.handle.style.bottom), this.slider.offsetHeight - this.handle.offsetHeight)
    , value = percentage.of(part, this.options.max - this.options.min) + this.options.min;

  value = (this.options.decimal) ? (Math.round(value * 100) / 100) : Math.round(value);

  this.element.value = value;
  this.options.callback();
  this.changeEvent();
};

/**
 * Add additional class to vertical slider.
 *
 * @api private
 */

Vertical.prototype.addClass = function() {
  this.slider.className += ' vertical';
};

/**
 * Set step.
 *
 * @returns {Array} this.steps
 * @api private
 */

Vertical.prototype.step = function() {
  var sliderHeight = this.slider.offsetHeight - this.handle.offsetHeight
    , interval = this.options.step
    , steps = [];

  for (i = 0; i <= sliderHeight; i += interval) {
    steps.push(i);
  }

  this.steps = steps;

  return this.steps;
};

/**
 * On mouse down.
 *
 * @param {Object} e
 * @api private
 */

Vertical.prototype.onmousedown = function(e) {
  this.startY = e.clientY;
  this.handleOffsetY = this.slider.offsetHeight - this.handle.offsetHeight - this.handle.offsetTop;
  this.restrictHandleY = this.slider.offsetHeight - this.handle.offsetHeight;
  if (this.options.step) this.step();
};

/**
 * On vertical slider mouse move.
 *
 * @param {Object} e
 * @api private
 */

Vertical.prototype.onmousemove = function(e) {
  var bottomOffset = this.handleOffsetY + this.startY - e.clientY
    , position = (this.steps) ? this.closest(bottomOffset, this.steps) : bottomOffset;

  if (bottomOffset <= 0) {
    this.setPosition(0);
  } else if (bottomOffset >= this.restrictHandleY) {
    this.setPosition(this.restrictHandleY);
  } else {
    this.setPosition(position);
  }

  this.setValue();
};

/**
 * Initialize vertical class.
 *
 * @api private
 */

Vertical.prototype.initVertical = function() {
  this.addClass();
  this.setStart(this.options.start);
};