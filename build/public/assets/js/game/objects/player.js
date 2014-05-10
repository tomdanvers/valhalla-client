// Player = function (game, x, y) {

//     Phaser.Sprite.call(this, game, x, y, 'yeoman');
//     game.physics.arcade.enable(this);
//     this.body.collideWorldBounds = true;
//     this.body.bounce.setTo(0,.5);
//     this.body.velocity.x = game.rnd.integerInRange(-500,500);
//     this.body.velocity.y = game.rnd.integerInRange(-500,500);
//     console.log(this);
// };

// Player.prototype = Object.create(Phaser.Sprite.prototype);
// Player.prototype.constructor = Player;

// /**
//  * Automatically called by World.update
//  */
// Player.prototype.update = function() {

//     //this.angle += this.rotateSpeed;

// };



define(
  [
    'Phaser'
  ],
  function(Phaser) {
    'use strict';

    function Player(game, id, model, isPlayerCharacter, width, height) {
          var bmd = new Phaser.BitmapData(game, 'player', width, height);
          bmd.ctx.fillStyle = isPlayerCharacter ? '#00FF00' : this.colourToHex(model.colour);
          bmd.ctx.fillRect(0, 0, width, height);
          bmd.ctx.fillStyle = '#555555';
          bmd.ctx.fillRect(width - 30, 5, 30, 15);
          Phaser.Sprite.call(this, game, 0, 0, bmd);

          this.anchor.setTo(.5, 0)

          this.id = id;
          this.model = model;
    };

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.init = function() {
    };

    Player.prototype.create = function() {
    };

    Player.prototype.colourToHex = function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };

    return Player;
  }
);