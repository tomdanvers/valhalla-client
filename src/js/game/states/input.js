
var ConnectionManager = require('../managers/connection-manager');
var Player = require('../objects/player');

var Input = function(game) {
    Phaser.State.call(this, game);
}

Input.prototype = Object.create(Phaser.State.prototype);
Input.prototype.constructor = Input;

Input.prototype.init = function(options) {
    console.log('Input.init(',options,')');
    this.initialState = options.state;
}
Input.prototype.create = function() {

    this.settings = this.game.cache.getJSON('settings');

    this.playerCount = 0;
    this.players = [];
    this.playersMap = {};

    this.input = {};// Used to prevent uneccessary commands from being sent

    this.commands = [];

    this.game.input.keyboard.addCallbacks(this, this.inputKeyDown, this.inputKeyUp);

    var buttonWidth = 80;
    var buttonHeight = 80;

    var buttonBMD = new Phaser.BitmapData(this.game, 'button', buttonWidth, buttonHeight);
    buttonBMD.ctx.fillStyle = 'red';
    buttonBMD.ctx.fillRect(0, 0, buttonWidth, buttonHeight);

    var viewportWidth = this.game.width;
    var viewportHeight = this.game.height;

    var buttonUp = this.game.add.button((viewportWidth-buttonWidth)*.5, 100, buttonBMD);
    var buttonDown = this.game.add.button((viewportWidth-buttonWidth)*.5, 200, buttonBMD);
    var buttonLeft = this.game.add.button((viewportWidth-buttonWidth)*.5 - 100, 200, buttonBMD);
    var buttonRight = this.game.add.button((viewportWidth-buttonWidth)*.5 + 100, 200, buttonBMD);

    var that = this;
    ConnectionManager.onUpdate.add(function(data){

        if(data.time < this.serverTime) return;

        this.serverTime = data.time;

    }, this);

    ConnectionManager.onDisconnect.add(this.onDisconnect, this);
    ConnectionManager.onReconnect.add(this.onReconnect, this);
    ConnectionManager.onStateChange.add(this.onStateChange, this);

    this.onStateChange({
        state: this.initialState
    });
};

Input.prototype.onDisconnect = function(){
    // this.overlayPanel.visible = true;
};

Input.prototype.onReconnect = function(){
    // this.overlayPanel.visible = false;
};

Input.prototype.onStateChange = function(data){

    switch(data.state) {
        case 'intro':
        // this.overlayPanel.visible = true;
        break;
        case 'match':
        // this.overlayPanel.visible = false;
        break;
        case 'results':
        // this.overlayPanel.visible = true;
        break;
    }

};

Input.prototype.update = function() {
    if(this.commands.length > 0){
        this.sendCommands(this.commands);
        this.commands.length = 0;
    }
};

Input.prototype.inputKeyDown = function(event) {
    if(!this.input[event.keyCode]){
        this.input[event.keyCode] = true;
        this.commands.push('d-'+event.keyCode);
    }
};

Input.prototype.inputKeyUp = function(event) {
    if(this.input[event.keyCode]){
        this.input[event.keyCode] = false;
        this.commands.push('u-'+event.keyCode);
    }
};

Input.prototype.sendCommands = function(commands) {
    ConnectionManager.emit('commands', {time:this.serverTime, data:commands});
};

// ------------------------------------------------------------------------------------------------------------ PLAYERS CHECK

module.exports = Input;
