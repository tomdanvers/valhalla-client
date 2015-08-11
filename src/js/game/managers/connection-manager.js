var socket = require('socket.io-client');

var ConnectionManager = function(game) {
    console.log('ConnectionManager');
    console.log(socket);

    this.onConnecting = new Phaser.Signal();
    this.onConnect = new Phaser.Signal();
    this.onDisconnect = new Phaser.Signal();
    this.onConnectFailed = new Phaser.Signal();
    this.onConnectError = new Phaser.Signal();
    this.onReconnectFailed = new Phaser.Signal();
    this.onReconnect = new Phaser.Signal();
    this.onReconnecting = new Phaser.Signal();
    this.onUpdate = new Phaser.Signal();
}

ConnectionManager.prototype = Object.create({});
ConnectionManager.prototype.constructor = ConnectionManager;

ConnectionManager.prototype.connect = function() {
  var that = this;
  this.socket = socket(environment.server);
  this.socket.on('connecting', this.onConnecting.dispatch);
  this.socket.on('connect_failed', this.onConnectFailed.dispatch);
  this.socket.on('error', this.onConnectError.dispatch);
  this.socket.on('connect', function () {
    that.sessionId = that.socket.io.engine.id;
    that.onConnect.dispatch();
  });
  this.socket.on('disconnect', this.onDisconnect.dispatch);
  this.socket.on('reconnect', this.onReconnect.dispatch);
  this.socket.on('update', function (data) {
    that.onUpdate.dispatch(data);
  });
};

ConnectionManager.prototype.emit = function(name, data) {
  this.socket.emit(name, data);
};

ConnectionManager.prototype.onUpdate = function() {
  if(data.time < this.serverTime) return;
  this.serverTime = data.time;
  that.playersCheck(data.data.players);
  that.playersUpdate(data.data.players);
};

module.exports = new ConnectionManager();