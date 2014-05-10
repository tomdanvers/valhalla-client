require.config({
     waitSeconds:30,
     paths: {
        "Phaser": "lib/phaser/phaser-arcade-physics.min",
        "io": "lib/socket-io/socket.io.min"
     }
});
require(
    ["game/main"]
);