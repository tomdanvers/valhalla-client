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
          Phaser.Group.call(this, game, 0, 0);

          var body = new Phaser.BitmapData(game, 'body', width, height);
          body.ctx.fillStyle = isPlayerCharacter ? '#00FF00' : this.colourToHex(model.colour);
          body.ctx.fillRect(0, 0, width, height);
          body.ctx.fillStyle = '#555555';
          body.ctx.fillRect(width - 30, 5, 30, 15);

          this.body = new Phaser.Sprite(game, 0, 0, body);
          this.body.anchor.setTo(.5, 1)

          var health = new Phaser.BitmapData(game, 'health', width, 5);
          health.ctx.fillStyle = '#FF0000';
          health.ctx.fillRect(0, 0, width, 5);

          this.health = new Phaser.Sprite(game, 0, -height-5, health);
          this.health.anchor.setTo(.5, 1);

          var healthBar = new Phaser.BitmapData(game, 'healthBar', width, 5);
          healthBar.ctx.fillStyle = '#00FF00';
          healthBar.ctx.fillRect(0, 0, width, 5);

          this.healthBar = new Phaser.Sprite(game, -width*.5, -height-5, healthBar);
          this.healthBar.anchor.setTo(0, 1);

          this.add(this.health);
          this.add(this.healthBar);
          this.add(this.body);

          this.id = id;
          this.model = model;
    };

    Player.prototype = Object.create(Phaser.Group.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.init = function() {
    };

    Player.prototype.create = function() {
    };

    Player.prototype.setHealthValue = function(healthValue) {
      this.healthBar.scale.setTo(healthValue, 1);
    };

    Player.prototype.setFacing = function(facing) {
      this.body.scale.x = facing;
    };

    Player.prototype.colourToHex = function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };

    return Player;
  }
);