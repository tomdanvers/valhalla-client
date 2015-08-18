var TextButton = function(game, width, height, x, y, label, clickCallback, clickContext) {

  Phaser.Group.call(this, game, 0, 0);

  var buttonBMD = new Phaser.BitmapData(this.game, 'button', width, height);
  var ctx = buttonBMD.ctx;

  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, width, height);

  label = label.toUpperCase();

  var upscaleFactor = window.devicePixelRatio;
  var fontHeight = 18 * upscaleFactor;

  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';
  ctx.font = 'normal normal 700 ' + fontHeight + 'px Arial';
  var bounds = ctx.measureText(label);
  ctx.fillText(label, (width - bounds.width) * .5, (height - fontHeight) * .5);

  this.add(new Phaser.Button(this.game, x, y, buttonBMD, clickCallback, clickContext));

};

TextButton.prototype = Object.create(Phaser.Group.prototype);
TextButton.prototype.constructor = TextButton;

TextButton.prototype.init = function() {


};

module.exports = TextButton;
