define(
  [
    'Phaser'
  ],
  function(Phaser) {
    'use strict';

    function Boot(game) {
        Phaser.State.call(this, game);

    }

    Boot.prototype = Object.create(Phaser.State.prototype);
    Boot.prototype.constructor = Boot;

    Boot.prototype.init = function() {
    };

    Boot.prototype.preload = function() {
      this.load.crossOrigin = true;
      this.load.onLoadStart.add(this.onLoadStart, this);
      this.load.onFileError.add(this.onFileLoadError, this);
      this.load.onLoadComplete.add(this.onLoadComplete, this);

      this.load.json('settings', environment.server+'/settings.json');
      this.load.image('tex_wall', environment.assetRoot+'img/texture_wall.jpg');
      this.load.image('tiles', environment.assetRoot+'img/tiles.png');
      //this.load.tilemap('map', assetRoot+'data/map.json', null, Phaser.Tilemap.TILED_JSON);
    };

    Boot.prototype.onLoadStart = function(data) {
      console.log('Boot.onLoadStart(',data,')')
    };

    Boot.prototype.onFileLoadError = function(data) {
      console.log('Boot.onFileLoadError(',data,')')
    };

    Boot.prototype.onLoadComplete = function() {
      console.log('Boot.onLoadComplete()')
    };

    Boot.prototype.create = function() {
      this.game.input.maxPointers = 1;
      this.game.state.start('connect');
    };

    return Boot;
  }
);