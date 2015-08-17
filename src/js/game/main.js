var Boot = require('./states/boot');
var TypeSelect = require('./states/type-select');
var Connect = require('./states/connect');
var Level = require('./states/level');
var Input = require('./states/input');

var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'valhalla');

game.state.add('boot', new Boot());
game.state.add('type-select', new TypeSelect());
game.state.add('connect', new Connect());
game.state.add('input', new Input());
game.state.add('level', new Test());

game.state.start('boot');
