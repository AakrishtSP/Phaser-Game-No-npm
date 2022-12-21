class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {
    this.load.image("background", "../../assets/bg.png");
    this.load.image("ground", "../../assets/platform.png");
    this.load.image("bullet", "../../assets/bomb.png");
    this.load.image("maskPowerUp", "../../assets/maskPowerup.png");
    this.load.image("magazinePowerUp", "../../assets/magazine.png");
    this.load.image("healthPowerUp", "../../assets/first-aid-box.png");
    this.load.image("easyvirus", "../../assets/easyvirus.png");
    this.load.image("mediumvirus", "../../assets/mediumvirus.png");
    this.load.image("deadlyvirus", "../../assets/deadlyvirus.png");
    this.load.image("maskShield", "../../assets/maskShield.png");
    this.load.image("gameOver", "../../assets/gameOver.png");
    this.load.image("plane", "../../assets/plane.png");
    this.load.image("background1", "../../assets/BG 01.png");
    this.load.image("ground1", "../../assets/Ground.png");

    this.load.audio("shootSound", "../../assets/audio/laser1.ogg");
    this.load.audio("virusDeathSound", "../../assets/audio/lowRandom.ogg");
    this.load.audio("damageTaken", "../../assets/audio/highDown.ogg");
    this.load.audio("deathSound", "../../assets/audio/deathSound.mp3");
    this.load.audio("shieldDestroy", "../../assets/audio/destroy.mp3");
    this.load.audio("healing", "../../assets/audio/healing.mp3");
    this.load.audio("reload", "../../assets/audio/reload.mp3");
    this.load.audio("shield", "../../assets/audio/shield.mp3");

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 320 / 2, 270, 320, 50);

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 300 / 2, 280, 300 * value, 30);
    });

    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }
  create() {
    this.scene.start("MainMenu", { score: 0, highScore: 0 });
  }
}

export default preloadGame;
