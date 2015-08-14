var CharacterText = function(game, characterName, x, y, width, height) {

  this.bmd = new Phaser.BitmapData(game, width, height);

  this.characterName = characterName.toUpperCase();
  this.score = 0;
  this.baseX = x;
  this.baseY = y;

  Phaser.Sprite.call(this, game, x, y, this.bmd);

  this.render();

};

CharacterText.prototype = Object.create(Phaser.Sprite.prototype);
CharacterText.prototype.constructor = CharacterText;

CharacterText.prototype.init = function() {
};

CharacterText.prototype.create = function() {
};

CharacterText.prototype.setScore = function(score) {

    this.score = score;

    this.render();

};

CharacterText.prototype.render = function() {

    var canvas = this.bmd.canvas;
    var ctx = this.bmd.ctx;

    var upscaleFactor = window.devicePixelRatio;

    var fontHeight = 13 * upscaleFactor;
    var fontHeightScore = 24 * upscaleFactor;
    ctx.textBaseline = 'top';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    // ctx.lineWidth = '1';
    // ctx.strokeStyle = 'white';
    ctx.font = 'normal normal 700 ' + fontHeight + 'px Arial';
    ctx.shadowBlur = 5;
    ctx.shadowColor="black";

    var nameParts = this.characterName.split(' ');
    var lineCount = nameParts.length;

    var bounds = [];
    var width = 0;
    for (var i = 0; i < lineCount; i++) {
        var bound = ctx.measureText(nameParts[i])
        bounds.push(bound);
        width = Math.max(bound.width, width);
    }

    var width = Math.ceil(width);
    var height = Math.ceil(fontHeight * lineCount + fontHeightScore);
    this.bmd.resize(width, height);

    for (var i = 0; i < lineCount; i++) {
        ctx.fillText(nameParts[i], (width - bounds[i].width)*.5, i*fontHeight);
    }

    ctx.font = 'normal normal 700 ' + fontHeightScore + 'px Arial';
    var boundsScore = ctx.measureText(String(this.score));
    // ctx.strokeText(this.score, (width-boundsScore.width)*.5, fontHeight * 2);
    ctx.fillText(this.score, (width-boundsScore.width)*.5, fontHeight * lineCount);

    this.width = width / upscaleFactor;
    this.height = height / upscaleFactor;
    this.x = -(width/upscaleFactor) * .5;
    this.y = this.baseY - this.height - 14;
}


module.exports = CharacterText;
