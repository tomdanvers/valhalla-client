require.config({
     waitSeconds:30,
     paths: {
        "Phaser": "lib/phaser/phaser-arcade-physics",
        "io": "lib/socket-io/socket.io.min"
     }
});
require(
    ["game/main"]
);