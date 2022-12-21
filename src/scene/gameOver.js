var keys = {};
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    this.data = data;
    this.width = this.sys.canvas.width;
    this.height = this.sys.canvas.height;
    keys = this.input.keyboard.addKeys({
      enter: "enter",
    });
  }

  create() {
    this.physics.add.image(this.width / 2, 200, "gameOver");
    this.make
      .text({
        x: this.width / 2,
        y: 400,
        text: "Score: " + this.data.score,
        style: {
          font: "20px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5);
    this.make
      .text({
        x: this.width / 2,
        y: 500,
        text: "High Score: " + this.data.highScore,
        style: {
          font: "20px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5);

    let startButton = this.make
      .text({
        x: this.width / 2,
        y: 600,
        text: "Play Again",
        style: {
          font: "20px monospace",
          fill: "#ffffff",
          backgroundColor: "#000",
        },
      })
      .setOrigin(0.5)
      .setPadding(20)
      .setStyle({ backgroundColor: "#111" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.start("PlayGame", this.data);
      })
      .on("pointerover", () => {
        startButton.setStyle({ fill: "#f39c12" });
      })
      .on("pointerout", () => {
        startButton.setStyle({ fill: "#ffffff" });
      });
    let mainMenuButton = this.make
      .text({
        x: this.width / 2,
        y: 700,
        text: "Main Menu",
        style: {
          font: "20px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5)
      .setPadding(20)
      .setStyle({ backgroundColor: "#111" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.start("PlayGame", this.data);
      })
      .on("pointerover", () => {
        mainMenuButton.setStyle({ fill: "#f39c12" });
      })
      .on("pointerout", () => {
        mainMenuButton.setStyle({ fill: "#FFF" });
      });

    this.input.keyboard.on("keydown-SPACE", () => {
      console.log("pressed a");
      this.scene.start("PlayGame", this.data);
    });
  }

  update() {
    keys = this.input.keyboard.addKeys({
      space: "space",
      enter: "enter",
    });
    if (keys.enter.isDown) {
      this.scene.start("PlayGame", this.data);
    }
  }
}

export default GameOver;
