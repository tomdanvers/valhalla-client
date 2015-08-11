var ConnectionManager = require('../managers/connection-manager');

var Connect = function(game) {
  Phaser.State.call(this, game);
}

Connect.prototype = Object.create(Phaser.State.prototype);
Connect.prototype.constructor = Connect;

Connect.prototype.create = function() {
  ConnectionManager.connect();
  ConnectionManager.onConnect.add(this.onConnect, this);
  ConnectionManager.onConnecting.add(this.onConnecting, this);
  ConnectionManager.onConnectFailed.add(this.onConnectFailed, this);
  ConnectionManager.onConnectError.add(this.onConnectError, this);
};

Connect.prototype.onConnecting = function(){
  console.log('Connect.onConnecting()');
};

Connect.prototype.onConnect = function(){
  console.log('Connect.onConnect()');

  this.game.state.start('test');
};

Connect.prototype.onConnectFailed = function(){
  console.log('Connect.onConnectFailed()');

};

Connect.prototype.onConnectError = function(){
  console.log('Connect.onConnectError()');

};

module.exports = Connect;