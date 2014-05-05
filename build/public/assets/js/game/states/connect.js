define(
  [
    'Phaser',
    'game/managers/connection-manager'
  ],
  function(Phaser, ConnectionManager) {
    'use strict';

    function Connect(game) {
      Phaser.State.call(this, game);
    }

    Connect.prototype = Object.create(Phaser.State.prototype);
    Connect.prototype.constructor = Connect;

    Connect.prototype.create = function() {
      ConnectionManager.connect();
      ConnectionManager.onConnect.add(this.onConnect, this);
      ConnectionManager.onConnecting.add(this.onConnecting, this);
    };

    Connect.prototype.onConnecting = function(){
      console.log('Connect.onConnecting()');
    };

    Connect.prototype.onConnect = function(){
      console.log('Connect.onConnect()');

      this.game.state.start('test');
    };

    return Connect;
  }
);