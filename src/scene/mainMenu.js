class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }
  init(data) {
    this.data = data;

    this.width = this.sys.canvas.width;
    this.height = this.sys.canvas.height;
  }
  create() {
    this.bg = this.add
      .image(this.width / 2, this.height / 2, "background")
      .setDepth(-10);
    this.bg.setScale(1);
    this.bg.setAlpha(0.5);
    this.background1 = this.add
      .tileSprite(
        this.width / 2,
        this.height / 2 - 50,
        this.width,
        this.height,
        "background1"
      )
      .setDepth(-5)
      .setAlpha(0.5);
    this.platform2 = this.add
      .tileSprite(this.width / 2, this.height - 16, this.width, 32, "ground1")
      .setAlpha(0.5);
    this.platform2.setScale(4.25);
    this.user = this.physics.add
      .sprite(this.width * 0.1, this.height / 2, "plane")
      .setAlpha(0.5);
    this.make
      .text({
        x: this.width / 2,
        y: 200,
        text: "VIRUS INVASION",
        style: {
          font: "80px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5);
    this.make
      .text({
        x: this.width / 2,
        y: 400,
        text: "High Score: " + this.data.highScore,
        style: {
          font: "30px monospace",
          fill: "#ffffff",
        },
      })
      .setOrigin(0.5);

    let startButton = this.make
      .text({
        x: this.width / 2,
        y: 500,
        text: "Play Game",
        style: {
          font: "40px monospace",
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
        startButton.setStyle({ fill: "#f39c12" });
      })
      .on("pointerout", () => {
        startButton.setStyle({ fill: "#FFF" });
      });
  }
  update() {
    this.background1.tilePositionX += 1;
    this.platform2.tilePositionX += 1;
  }
}

export default MainMenu;
