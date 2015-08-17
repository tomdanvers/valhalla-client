var CharacterText = require('./character-text');

var TEAM_COLOURS = {
    'red':'#CC0000',
    'blue':'#0000CC'
};

var Player = function(game, id, model, isPlayerCharacter, width, height) {

  Phaser.Group.call(this, game, 0, 0);

  var colour = model.alliance ? TEAM_COLOURS[model.alliance] : this.colourToHex(model.colour);
  // colour = this.colourToHex(model.colour);

  var body = new Phaser.BitmapData(game, 'body', width, height);
  body.ctx.fillStyle = isPlayerCharacter ? '#EEEEEE' : colour;
  body.ctx.fillRect(0, 0, width, height);
  if (isPlayerCharacter) {
    body.ctx.fillStyle = colour;
    body.ctx.fillRect(3, 3, width-6, height-6);
  }
  if (model.isNPC) {
    body.ctx.fillStyle = '#555555';
  }else {
    body.ctx.fillStyle = '#880000';
  }
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

  // this.scoreText = new Phaser.Text(game, 0, -height - 40, model.score);

  // var characterTextBMD = new Phaser.BitmapData(game, width, width);
  // characterTextBMD.ctx.fillStyle = 'red';
  // characterTextBMD.ctx.fillRect(0,0,width,width);

  // this.characterText = new Phaser.Sprite(game, -width*.5,-height-width,characterTextBMD)

  this.characterText = new CharacterText(game, isPlayerCharacter ? 'YOU' : model.name, -width*.5, -height, width, width)

  this.add(this.health);
  this.add(this.healthBar);
  this.add(this.body);
  // this.add(this.scoreText);
  this.add(this.characterText);

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

Player.prototype.setScore = function(score) {
    if (score !== this.score) {

        this.score = score;

        this.characterText.setScore(this.score);

    }
};

Player.prototype.setFacing = function(facing) {
  this.body.scale.x = facing;
};

Player.prototype.colourToHex = function(c) {
  var hex = c.toString(16);
  return '#' + hex;
};
module.exports = Player;
