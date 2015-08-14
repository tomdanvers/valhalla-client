var GameOverlay = function(game, x, y, width, height) {

    Phaser.Group.call(this, game, x, y);

    this.renderWidth = width;
    this.renderHeight = height;

    this.bg = new Phaser.Graphics(this.game, 0, 0);
    this.bg.beginFill(0x000000, .75);
    this.bg.drawRect(0, 0, this.renderWidth, this.renderHeight);
    this.bg.fixedToCamera = true;
    this.addChild(this.bg);

    var style = { font: "64px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: this.renderWidth, align: "center" };

    this.text = new Phaser.Text(game, 0, 0, '', style);
    this.addChild(this.text);

};

GameOverlay.prototype = Object.create(Phaser.Group.prototype);
GameOverlay.prototype.constructor = GameOverlay;

GameOverlay.prototype.setMessage = function(message) {

    this.text.setText(message);
    this.text.x = (this.renderWidth - this.text.width) * .5;
    this.text.y = (this.renderHeight - this.text.height) * .5;

};

module.exports = GameOverlay;
