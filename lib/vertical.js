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
    , offset = percentage.of(part, this.slider.offsetHeight - this.handle.offsetHeight)
    , position = (this.options.step) ? closest.find(offset, this.steps) : offset;

  this.setPosition(position);
  this.setValue(this.handle.style.bottom, this.slider.offsetHeight - this.handle.offsetHeight);
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
 * Add additional class to vertical slider.
 *
 * @api private
 */

Vertical.prototype.addClass = function() {
  this.slider.className += ' vertical';
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
};

/**
 * On vertical slider mouse move.
 *
 * @param {Object} e
 * @api private
 */

Vertical.prototype.onmousemove = function(e) {
  var bottomOffset = this.handleOffsetY + this.startY - e.clientY
    , position = (this.steps) ? closest.find(bottomOffset, this.steps) : bottomOffset;

  if (bottomOffset <= 0) {
    this.setPosition(0);
  } else if (bottomOffset >= this.restrictHandleY) {
    this.setPosition(this.restrictHandleY);
  } else {
    this.setPosition(position);
  }

  this.setValue(this.handle.style.bottom, this.slider.offsetHeight - this.handle.offsetHeight);
};

/**
 * Initialize vertical class.
 *
 * @api private
 */

Vertical.prototype.initVertical = function() {
  this.addClass();
  if (this.options.step) this.step(this.slider.offsetHeight, this.handle.offsetHeight);
  this.setStart(this.options.start);
};