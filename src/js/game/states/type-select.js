var TextButton = require('../objects/text-button');

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

  var buttonWidth = 400;
  var buttonHeight = 60;

  var viewportWidth = this.game.width;
  var viewportHeight = this.game.height;

  var buttonBoth = this.game.add.existing(new TextButton(this.game, buttonWidth, buttonHeight, (viewportWidth-buttonWidth)*.5, 100, 'Normal', this.bothClickHandler, this));
  var buttonScreen = this.game.add.existing(new TextButton(this.game, buttonWidth, buttonHeight, (viewportWidth-buttonWidth)*.5, 200, 'Screen Only', this.screenClickHandler, this));
  var buttonInput = this.game.add.existing(new TextButton(this.game, buttonWidth, buttonHeight, (viewportWidth-buttonWidth)*.5, 280, 'Input Only', this.inputClickHandler, this));


  // Debug
  // this.game.state.start('connect', true, false, {
  //   type: 'screen'
  // });

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
