var ConnectionManager = require('../managers/connection-manager');

var Connect = function(game) {
  Phaser.State.call(this, game);
}

Connect.prototype = Object.create(Phaser.State.prototype);
Connect.prototype.constructor = Connect;

Connect.prototype.init = function(options) {
  this.type = options.type;
};

Connect.prototype.create = function() {
  ConnectionManager.connect(this.type);
  ConnectionManager.onConnect.add(this.onConnect, this);
};

Connect.prototype.onConnecting = function(){
  console.log('Connect.onConnecting()');
};

Connect.prototype.onConnect = function(data) {

  if (this.type === 'input') {

    this.game.state.start('input', true, false, {
        mode: data.mode,
        map: data.map,
        state: data.state,
    });

  } else {

    this.game.state.start('level', true, false, {
        mode: data.mode,
        map: data.map,
        state: data.state,
        isScreen: this.type === 'screen'
    });

  }

};

Connect.prototype.onConnectFailed = function(){
  console.log('Connect.onConnectFailed()');

};

Connect.prototype.onConnectError = function(){
  console.log('Connect.onConnectError()');

};

module.exports = Connect;
