
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      require('../objects/player');

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;

      this.game.physics.arcade.gravity = new Phaser.Point(0, 981);
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(0,.5);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);

      this.player = new Player(this.game, 0, 0);
      this.game.add.existing(this.player);
      console.log(this.player);
    },
    update: function() {
      if(this.game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
        this.sprite.body.velocity.y = -500;
      }

      if(this.game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
        this.sprite.body.velocity.x = -500;
      }

      if(this.game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
        this.sprite.body.velocity.x = 500;
      }
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };