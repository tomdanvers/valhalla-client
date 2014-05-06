define(
  [
    'Phaser',
    'io'
  ],
  function(Phaser, IO) {
    'use strict';

    function ConnectionManager(game) {
        console.log('ConnectionManager');
        console.log(IO);

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
      this.socket = IO.connect(environment.server);
      this.socket.on('connecting', this.onConnecting.dispatch);
      this.socket.on('connect_failed', this.onConnectFailed.dispatch);
      this.socket.on('error', this.onConnectError.dispatch);
      this.socket.on('connect', function () {
        that.sessionId = that.socket.socket.sessionid;
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


// socket.on('connect', function () {}) - "connect" is emitted when the socket connected successfully
// socket.on('connecting', function () {}) - "connecting" is emitted when the socket is attempting to connect with the server.
// socket.on('disconnect', function () {}) - "disconnect" is emitted when the socket disconnected
// socket.on('connect_failed', function () {}) - "connect_failed" is emitted when socket.io fails to establish a connection to the server and has no more transports to fallback to.
// socket.on('error', function () {}) - "error" is emitted when an error occurs and it cannot be handled by the other event types.
// socket.on('message', function (message, callback) {}) - "message" is emitted when a message sent with socket.send is received. message is the sent message, and callback is an optional acknowledgement function.
// socket.on('anything', function(data, callback) {}) - "anything" can be any event except for the reserved ones. data is data, and callback can be used to send a reply.
// socket.on('reconnect_failed', function () {}) - "reconnect_failed" is emitted when socket.io fails to re-establish a working connection after the connection was dropped.
// socket.on('reconnect', function () {}) - "reconnect" is emitted when socket.io successfully reconnected to the server.
// socket.on('reconnecting', function () {}) - "reconnecting" is emitted when the socket is attempting to reconnect with the server.



    return new ConnectionManager();
  }
);