
var ConnectionManager = require('../managers/connection-manager');
var Player = require('../objects/player');

var Test = function(game) {
    Phaser.State.call(this, game);
}

Test.prototype = Object.create(Phaser.State.prototype);
Test.prototype.constructor = Test;

Test.prototype.init = function(options) {
    console.log('Test.init(',options,')');
    this.initialState = options.state;
    this.isScreen = options.isScreen;
}
Test.prototype.create = function() {

    this.settings = this.game.cache.getJSON('settings');

    this.playerCount = 0;
    this.players = [];
    this.playersMap = {};

    this.input = {};// Used to prevent uneccessary commands from being sent

    var levelWidth = this.settings.map.width*32;
    var levelHeight = this.settings.map.height*32;

    var renderWidth = this.isScreen ? levelWidth : this.game.width;
    var renderHeight = this.isScreen ? levelHeight : this.game.height;

    this.game.world.scale.setTo(this.game.width/renderWidth, this.game.height/renderHeight);
    
    this.game.world.setBounds(0, 0, levelWidth, levelHeight);
    this.game.add.tileSprite(0, -64, levelWidth, levelHeight, 'tex_wall');
    

    this.game.cache.addTilemap('map',null,this.settings.map);
    this.tilemap = this.game.add.tilemap('map',32, 32, renderWidth, renderHeight);
    this.tilemap.addTilesetImage('tiles', 'tiles');

    this.levelContents = new Phaser.Group(this.game);

    this.decoration = this.tilemap.createLayer('decoration', renderWidth, renderHeight);
    this.levelContents.add(this.decoration);

    this.ground = this.tilemap.createLayer('floor', renderWidth, renderHeight);
    this.levelContents.add(this.ground);

    this.commands = [];
    this.game.input.keyboard.addCallbacks(this, this.inputKeyDown, this.inputKeyUp);

    // Disconnect panel...
    this.overlayPanel = new Phaser.Graphics(this.game, 0, 0);
    this.overlayPanel.beginFill(0x000000, .75);
    this.overlayPanel.drawRect(0,0,renderWidth, renderHeight);
    this.overlayPanel.fixedToCamera = true;
    this.overlayPanel.visible = false;
    this.game.add.existing(this.overlayPanel)


    var that = this;
    ConnectionManager.onUpdate.add(function(data){
        
        if(data.time < this.serverTime) return;
        
        this.serverTime = data.time;
        that.playersCheck(data.data.players);
        that.playersUpdate(data.data.players);

    }, this);

    ConnectionManager.onDisconnect.add(this.onDisconnect, this);
    ConnectionManager.onReconnect.add(this.onReconnect, this);
    ConnectionManager.onStateChange.add(this.onStateChange, this);

    this.onStateChange({
        state: this.initialState
    });
};

Test.prototype.onDisconnect = function(){
    this.overlayPanel.visible = true;
};

Test.prototype.onReconnect = function(){
    this.overlayPanel.visible = false;
};

Test.prototype.onStateChange = function(data){

    switch(data.state) {
        case 'intro':
        this.overlayPanel.visible = true;
        break;
        case 'match':
        this.overlayPanel.visible = false;
        break;
        case 'results':
        this.overlayPanel.visible = true;
        break;
    }

};

Test.prototype.update = function() {
    if(this.commands.length > 0){
        this.sendCommands(this.commands);
        this.commands.length = 0;
    }
};

Test.prototype.inputKeyDown = function(event) {
    if(!this.input[event.keyCode]){
        this.input[event.keyCode] = true;
        this.commands.push('d-'+event.keyCode);
    }
};

Test.prototype.inputKeyUp = function(event) {
    if(this.input[event.keyCode]){
        this.input[event.keyCode] = false;
        this.commands.push('u-'+event.keyCode);
    }
};

Test.prototype.sendCommands = function(commands) {
    ConnectionManager.emit('commands', {time:this.serverTime, data:commands});
};

// ------------------------------------------------------------------------------------------------------------ PLAYERS CHECK

Test.prototype.playersCheck = function(playerModels) {
    var count, i, id, checked = {};

    count = this.playerCount
    for (i = count - 1; i >= 0; i--){
        checked[this.players[i].id] = 'old';
    }

    count = playerModels.length;
    for (i = count - 1; i >= 0; i--) {
        var state = this.playerCheck(playerModels[i]);
        checked[playerModels[i].id] = state;
        if(state == 'new') this.playerAdd(playerModels[i].id, playerModels[i]);
    }

    for (id in checked) {
        if(checked[id] == 'old'){
            this.playerRemove(id);
        }
    }
};

Test.prototype.playerCheck = function(playerModel) {
    for (var i = this.playerCount - 1; i >= 0; i--) {
        if(this.players[i].id == playerModel.id){
            return 'existing';
        }
    };
    return 'new';
};

Test.prototype.playerAdd = function(id, playerModel) {
    var isPlayerCharacter = ConnectionManager.sessionId == id;
    var player = new Player(this.game, id, playerModel, isPlayerCharacter, this.settings.player.width, this.settings.player.height);
    //console.log('ADD:', id, playerModel);
    this.players.push(player);
    this.playersMap[id] = player;
    this.levelContents.add(player);
    this.playerCount ++;

    if(isPlayerCharacter && !this.isScreen){
        this.game.camera.follow(player);
        this.playerCharacter = player;
    }else if(this.playerCharacter !== undefined){
        //this.levelContents.bringToTop(this.playerCharacter);
    }
};

Test.prototype.playerRemove = function(id) {
// console.log('REMOVE:',id);
var player = this.playersMap[id];
for (var i = this.playerCount - 1; i >= 0; i--) {
    if(this.players[i].id == id){
        this.players.splice(i, 1);
        break;
    }
};
delete this.playersMap[id];
player.destroy();
this.playerCount --;
};

// ----------------------------------------------------------------------------------------------------------- PLAYERS UPDATE

Test.prototype.playersUpdate = function(playerModels) {
    var count = playerModels.length;
    var model, player;
    for (var i = count - 1; i >= 0; i--) {
        model = playerModels[i];
        player = this.playersMap[model.id];
        player.model = model;
        player.x = player.model.x;
        player.y = player.model.y;
        player.levelY = player.model.levelY;
        if(player === this.playerCharacter){
            player.previousX = player.x;
            player.previousY = player.y;
        }
        player.setFacing(player.model.facing);
        player.setHealthValue(player.model.health/this.settings.player.healthMax);
        player.setScore(player.model.score);
    };
    this.levelContents.sort('levelY', Phaser.Group.SORT_ASCENDING);
};

module.exports = Test;
