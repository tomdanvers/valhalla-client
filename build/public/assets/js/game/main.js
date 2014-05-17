define(
  [
    'Phaser',
    'game/states/boot',
    'game/states/connect',
    'game/states/test'
  ],
  function(Phaser, Boot, Connect, Test){
    'use strict';

    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'valhalla');

    // Game States
    game.state.add('boot', new Boot());
    game.state.add('connect', new Connect());
    game.state.add('test', new Test());
    //game.state.add('gameover', new GameOver());
    //game.state.add('menu', new Menu());
    //game.state.add('play', new Play());
    //game.state.add('preload', new Preload());

    game.state.start('boot');
  }
);