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
          bmd.ctx.fillStyle = isPlayerCharacter ? '#00FF00' : '#FF0000';
          bmd.ctx.fillRect(0, 0, width, height);
          //console.log('Player', game, bmd);
          Phaser.Image.call(this, game, 0, 0, bmd);

          this.id = id;
          this.model = model;

          game.physics.arcade.enable(this);
    };

    Player.prototype = Object.create(Phaser.Image.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.init = function() {
    };

    Player.prototype.create = function() {
    };

    return Player;
  }
);