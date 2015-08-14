'use strict';

var TypeSelect = function(game) {
    Phaser.State.call(this, game);
}

TypeSelect.prototype = Object.create(Phaser.State.prototype);
TypeSelect.prototype.constructor = TypeSelect;

TypeSelect.prototype.init = function() {
  console.log('TypeSelect.init()');
};

TypeSelect.prototype.preload = function() {
  console.log('TypeSelect.preload()');
};

TypeSelect.prototype.create = function() {
  console.log('TypeSelect.create()');

  var buttonWidth = 200;
  var buttonHeight = 60;

  var buttonBMD = new Phaser.BitmapData(this.game, 'button', buttonWidth, buttonHeight);
  buttonBMD.ctx.fillStyle='red';
  buttonBMD.ctx.fillRect(0, 0, buttonWidth, buttonHeight);

  var viewportWidth = this.game.width;
  var viewportHeight = this.game.height;

  var buttonBoth = this.game.add.button((viewportWidth-buttonWidth)*.5, 100, buttonBMD, this.bothClickHandler, this);
  var buttonScreen = this.game.add.button((viewportWidth-buttonWidth)*.5, 200, buttonBMD, this.screenClickHandler, this);
  var buttonInput = this.game.add.button((viewportWidth-buttonWidth)*.5, 280, buttonBMD, this.inputClickHandler, this);
  
};

TypeSelect.prototype.bothClickHandler = function() {
  this.game.state.start('connect', true, false, {
    type: 'both'
  });
};

TypeSelect.prototype.screenClickHandler = function() {
  this.game.state.start('connect', true, false, {
    type: 'screen'
  });
};

TypeSelect.prototype.inputClickHandler = function() {
  this.game.state.start('connect', true, false, {
    type: 'input'
  });
};

TypeSelect.prototype.update = function() {
};

module.exports = TypeSelect;