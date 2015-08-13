'use strict';

var CreateCharacter = function(game) {
    Phaser.State.call(this, game);
}

CreateCharacter.prototype = Object.create(Phaser.State.prototype);
CreateCharacter.prototype.constructor = CreateCharacter;

CreateCharacter.prototype.init = function() {
  console.log('CreateCharacter.init()');
};

CreateCharacter.prototype.preload = function() {
  console.log('CreateCharacter.preload()');
  


};

CreateCharacter.prototype.create = function() {
  console.log('CreateCharacter.create()');
  
  //this.game.state.start('connect');
  console.log(Phaser)
  var text = new Phaser.Text(this.game, 0, 0, 'Hello');

  console.log(this.game.input.keyboard)
  var keyboard = this.game.input.keyboard;

  this.game.input.keyboard.onUpCallback = function(event) {
    console.log(keyboard.justPressed);
    
  }
};

CreateCharacter.prototype.update = function() {
};

module.exports = CreateCharacter;