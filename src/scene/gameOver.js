var keys = {};
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init() {
    this.width = this.sys.canvas.width;
    this.height = this.sys.canvas.height;
  }

  create(data) {
    this.sound.add("deathSound", { loop: false }).play();
    keys = this.input.keyboard.addKeys({
      space: "space",
      enter: "enter",
    });
    this.bg = this.add
      .image(this.width / 2, this.height / 2, "background")
      .setDepth(-10);
    this.bg.setScale(1);
    this.bg.setAlpha(1);
    this.background1 = this.add
      .tileSprite(
        this.width / 2,
        this.height / 2 - 50,
        this.width,
        this.height,
        "background1"
      )
      .setDepth(-5)
      .setAlpha(1);
    this.platform2 = this.add
      .tileSprite(this.width / 2, this.height - 16, this.width, 32, "ground1")
      .setAlpha(1);
    this.platform2.setScale(4.25);

    this.add.tween({
      targets: this.bg,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.bg.x,
      y: this.bg.y,
      alpha: 0.5,
    });
    this.add.tween({
      targets: this.background1,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.background1.x,
      y: this.background1.y,
      alpha: 0.5,
    });
    this.add.tween({
      targets: this.platform2,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.platform2.x,
      y: this.platform2.y,
      alpha: 0.5,
    });
    this.data = data;
    this.gameOverImg = this.physics.add
      .image(this.width / 2, 200, "gameOver")
      .setAlpha(0);
    this.scoreText = this.make
      .text({
        x: this.width / 2,
        y: 400,
        text: "Score: " + this.data.score,
        style: {
          font: "20px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);
    this.highScoreText = this.make
      .text({
        x: this.width / 2,
        y: 500,
        text: "High Score: " + this.data.highScore,
        style: {
          font: "20px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);

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
        for (const key of [...Object.values(keys)]) {
          this.input.keyboard.removeKey(key, false);
        }
        this.scene.stop();
        this.scene.start("PlayGame", this.data);
      })
      .on("pointerover", () => {
        startButton.setStyle({ fill: "#f39c12" });
      })
      .on("pointerout", () => {
        startButton.setStyle({ fill: "#ffffff" });
      })
      .setAlpha(0);
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
        for (const key of [...Object.values(keys)]) {
          this.input.keyboard.removeKey(key, false);
        }
        this.scene.stop();
        this.scene.start("MainMenu", this.data);
      })
      .on("pointerover", () => {
        mainMenuButton.setStyle({ fill: "#f39c12" });
      })
      .on("pointerout", () => {
        mainMenuButton.setStyle({ fill: "#FFF" });
      })
      .setAlpha(0);

    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.add.tween({
      targets: this.scoreText,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.scoreText.x,
      y: this.scoreText.y,
      alpha: 1,
    });
    this.add.tween({
      targets: this.highScoreText,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.highScoreText.x,
      y: this.highScoreText.y,
      alpha: 1,
    });
    this.add.tween({
      targets: startButton,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: startButton.x,
      y: startButton.y,
      alpha: 1,
    });
    this.add.tween({
      targets: mainMenuButton,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: mainMenuButton.x,
      y: mainMenuButton.y,
      alpha: 1,
    });
    this.add.tween({
      targets: this.gameOverImg,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.gameOverImg.x,
      y: this.gameOverImg.y,
      alpha: 1,
    });
  }

  update() {
    this.background1.tilePositionX += 1;
    this.platform2.tilePositionX += 1;
    setTimeout(() => {
      if (keys.enter._justDown || keys.space._justDown) {
        this.scene.start("PlayGame", this.data);
      }
    }, 100);
  }
}

export default GameOver;
