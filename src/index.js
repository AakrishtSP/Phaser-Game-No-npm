import playGame from "./scene/playGame.js";
import preloadGame from "./scene/preloadGame.js";
import GameOver from "./scene/gameOver.js";
import MainMenu from "./scene/mainMenu.js";

let height = window.innerHeight;
let width = window.innerWidth;

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [preloadGame, playGame, GameOver, MainMenu],
};

new Phaser.Game(config);
