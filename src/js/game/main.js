var Boot = require('./states/boot');
var CreateCharacter = require('./states/create-character');
var Connect = require('./states/connect');
var Test = require('./states/test');

var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'valhalla');

game.state.add('boot', new Boot());
game.state.add('create-character', new CreateCharacter());
game.state.add('connect', new Connect());
game.state.add('test', new Test());

game.state.start('boot');