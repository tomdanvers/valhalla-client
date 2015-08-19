
var ConnectionManager = require('../managers/connection-manager');
var Player = require('../objects/player');
var GameOverlay = require('../objects/game-overlay');

var Level = function(game) {
    Phaser.State.call(this, game);
}

Level.prototype = Object.create(Phaser.State.prototype);
Level.prototype.constructor = Level;

Level.prototype.init = function(options) {
    console.log('Level.init(',options,')');
    this.initialState = options.state;
    this.mapId = options.map;
    this.isScreen = options.isScreen;
}
Level.prototype.create = function() {

    this.settings = this.game.cache.getJSON('settings');

    this.playerCount = 0;
    this.players = [];
    this.playersMap = {};

    this.input = {};// Used to prevent uneccessary commands from being sent

    for (var i = 0; i < this.settings.maps.length; i++) {
        if (this.settings.maps[i].id === this.mapId) {
            this.map = this.settings.maps[i];
        }
    }

    if (this.map === undefined) {
        console.warn('No map with id',this.mapId);
    }

    var levelWidth = this.map.width*32;
    var levelHeight = this.map.height*32;

    var renderWidth = this.isScreen ? levelWidth : this.game.width;
    var renderHeight = this.isScreen ? levelHeight : this.game.height;

    this.game.world.scale.setTo(this.game.width/renderWidth, this.game.height/renderHeight);

    this.game.world.setBounds(0, 0, levelWidth, levelHeight);
    this.game.add.tileSprite(0, -64, levelWidth, levelHeight, 'tex_wall');


    this.game.cache.addTilemap('map', null, this.map);
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
    this.overlayPanel = new GameOverlay(this.game, 0, 0, renderWidth, renderHeight);
    this.overlayPanel.fixedToCamera = true;
    this.overlayPanel.alpha = 0;
    this.game.add.existing(this.overlayPanel);


    var that = this;
    ConnectionManager.onUpdate.add(this.onUpdate, this);
    ConnectionManager.onDisconnect.add(this.onDisconnect, this);
    ConnectionManager.onReconnect.add(this.onReconnect, this);
    ConnectionManager.onStateChange.add(this.onStateChange, this);

    this.onStateChange({
        map: this.mapId,
        state: this.initialState
    });
};

Level.prototype.onDisconnect = function(){
    this.overlayPanel.show();
};

Level.prototype.onReconnect = function(){
    this.overlayPanel.hide();
};

Level.prototype.onStateChange = function(data){

    console.log('Level.onStateChange', data);

    if (data.map !== this.map.id) {

        this.game.state.start('level', true, false, {
            mode: data.mode,
            map: data.map,
            state: data.state,
            isScreen: this.isScreen
        });

    }

    switch(data.state) {
        case 'intro':
            if (data.mode) {
                this.overlayPanel.setMessage((data.mode).toUpperCase());
            } else {
                this.overlayPanel.setMessage(('Game Starting...').toUpperCase());
            }
            this.overlayPanel.show();
            break;
        case 'match':
            this.playersRemove();
            this.overlayPanel.hide();
            break;
        case 'results':
            if (data.winner) {
                this.overlayPanel.setMessage(('Game Over\r' + data.winner + ' Won').toUpperCase());
            } else {
                this.overlayPanel.setMessage(('Game Over').toUpperCase());
            }
            this.overlayPanel.show();
            break;
    }

};

Level.prototype.onUpdate = function(data) {

    if(data.time < this.serverTime) return;

    this.serverTime = data.time;
    this.playersCheck(data.data.players);
    this.playersUpdate(data.data.players);

}

Level.prototype.update = function() {
    if(this.commands.length > 0){
        this.sendCommands(this.commands);
        this.commands.length = 0;
    }
};

Level.prototype.inputKeyDown = function(event) {
    if(!this.input[event.keyCode]){
        this.input[event.keyCode] = true;
        this.commands.push('d-'+event.keyCode);
    }
};

Level.prototype.inputKeyUp = function(event) {
    if(this.input[event.keyCode]){
        this.input[event.keyCode] = false;
        this.commands.push('u-'+event.keyCode);
    }
};

Level.prototype.sendCommands = function(commands) {
    ConnectionManager.emit('commands', {time:this.serverTime, data:commands});
};

// ------------------------------------------------------------------------------------------------------------ PLAYERS CHECK

Level.prototype.playersCheck = function(playerModels) {
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

Level.prototype.playerCheck = function(playerModel) {
    for (var i = this.playerCount - 1; i >= 0; i--) {
        if(this.players[i].id == playerModel.id){
            return 'existing';
        }
    }
    return 'new';
};

Level.prototype.playerAdd = function(id, playerModel) {
    var isPlayerCharacter = ConnectionManager.sessionId == id;
    var player = new Player(this.game, id, playerModel, isPlayerCharacter, this.settings.player.width, this.settings.player.height);
    this.players.push(player);
    this.playersMap[id] = player;
    this.levelContents.add(player);
    this.playerCount ++;

    if(isPlayerCharacter && !this.isScreen){
        this.game.camera.follow(player);
        this.playerCharacter = player;
    }
};

Level.prototype.playerRemove = function(id) {
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

Level.prototype.playersRemove = function() {

    for (var i = this.playerCount - 1; i >= 0; i--) {

        this.players[i].destroy();

    };
    this.playersMap = {};
    this.players = [];
    this.playerCount = 0;

};

// ----------------------------------------------------------------------------------------------------------- PLAYERS UPDATE

Level.prototype.playersUpdate = function(playerModels) {
    var count = playerModels.length;
    var model, player;
    for (var i = count - 1; i >= 0; i--) {

        model = playerModels[i];

        player = this.playersMap[model.id];
        player.model = model;
        if (player.model.justAttacked) {
            player.attack();
        }
        player.x = player.model.x;
        player.y = player.model.y;
        player.levelY = player.model.levelY;
        player.visible = !(player.model.lives === 0);

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

module.exports = Level;
