define(
  [
    'Phaser',
    'io',
    'game/objects/player'
  ],
  function(Phaser, IO, Player) {
    'use strict';

    function Test(game) {
        Phaser.State.call(this, game);
    }

    Test.prototype = Object.create(Phaser.State.prototype);
    Test.prototype.constructor = Test;

    Test.prototype.create = function() {



      this.socket = IO.connect('http://54.186.210.165/');

      this.settings = this.game.cache.getJSON('settings');
      console.log(this.settings);

      this.playerCount = 0;
      this.players = [];
      this.playersMap = {};

      this.input = {};// Used to prevent uneccessary commands from being sent

      this.game.world.setBounds(0, 0, this.settings.map.width*32, this.settings.map.height*32);

      this.game.add.tileSprite(0, 0, this.settings.map.width*32, this.settings.map.height*32, 'tex_wall');

      this.game.cache.addTilemap('map',null,this.settings.map);
      this.tilemap = this.game.add.tilemap('map');
      this.tilemap.addTilesetImage('floor', 'tiles', 32, 32, 0, 0, 1);

      this.levelContents = new Phaser.Group(this.game);

      this.ground = this.tilemap.createLayer('floor');
      this.levelContents.add(this.ground);

      this.commands = [];
      this.game.input.keyboard.addCallbacks(this, this.inputKeyDown, this.inputKeyUp);

      var that = this;
      this.socket.on('connect', function (data) {
        console.log('connect', that.socket)
      });
      this.socket.on('update', function (data) {
          if(data.time < this.serverTime) return;
          this.serverTime = data.time;
          that.playersCheck(data.data.players);
          that.playersUpdate(data.data.players);
      });

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
      this.socket.emit('commands', {time:this.serverTime, data:commands});
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
      };

      for (id in checked) {
        if(checked[id] == 'old'){
          this.playerRemove(id);
        }
      };
    };

    Test.prototype.playerCheck = function(playerModel) {
      for (var i = this.playerCount - 1; i >= 0; i--) {
        if(this.players[i].id == playerModel.id){
          return 'existing';
        }
      };
      return 'new'
    };

    Test.prototype.playerAdd = function(id, playerModel) {
      var isPlayerCharacter = this.socket.socket.sessionid == id;
      var player = new Player(this.game, id, playerModel, isPlayerCharacter, this.settings.player.width, this.settings.player.height);
      console.log('ADD:',id);
      this.players.push(player);
      this.playersMap[id] = player;
      this.levelContents.add(player);
      this.playerCount ++;

      if(isPlayerCharacter){
        this.game.camera.follow(player);
        player.cameraOffset.x = this.game.width/2 - this.settings.player.width/2;
        player.cameraOffset.y = this.game.height - this.settings.player.height;
        this.playerCharacter = player;
      }else if(this.playerCharacter !== undefined){
        this.levelContents.bringToTop(this.playerCharacter);
      }
    };

    Test.prototype.playerRemove = function(id) {
      console.log('REMOVE:',id);
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
        player.x = model.x;
        player.y = model.y;
      };
    };

    return Test;
  }
);