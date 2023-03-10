let i = 0;
let passingData = {};
var keys = {};

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  init(data) {
    this.isAlive = true;
    this.width = this.sys.canvas.width;
    this.height = this.sys.canvas.height;
    this.velocity = 0;
    this.angle = 0;
    this.virusType = ["easyvirus", "mediumvirus", "deadlyvirus"];
    this.powerUpType = ["maskPowerUp", "magazinePowerUp", "healthPowerUp"];
    this.magazineSize = 30;
    this.bulletNumber = this.magazineSize;
    this.bulletCooldown = 0;
    this.maxBulletCooldown = 20;
    this.gameSpeed = 1;
    this.health = 3;
    this.maxhealth = 3;
    this.score = 1;
    this.highScore = data.highScore;
    this.isGoingDown = false;
    this.isGoingUp = false;
    this.isShooting = false;

    this.maskCooldown = 0;
    this.maskMaxCooldown = 2000;
    this.virusSpawnRate = 10;
    this.powerUpSpawnRate = 0.05;
    console.log(data);
  }
  preload() {}
  create() {
    //console.log(data);
    //background creation here

    this.bg = this.add
      .image(this.width / 2, this.height / 2, "background")
      .setDepth(-10);
    this.bg.setScale(1).setAlpha(0.5);
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

    this.add.tween({
      targets: this.bg,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.bg.x,
      y: this.bg.y,
      alpha: 1,
    });
    this.add.tween({
      targets: this.background1,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.background1.x,
      y: this.background1.y,
      alpha: 1,
    });

    this.shootSound = this.sound.add("shootSound", { loop: false });
    this.virusDeathSound = this.sound.add("virusDeathSound", { loop: false });
    this.damageTakenSound = this.sound.add("damageTaken", { loop: false });
    this.shieldDestroySound = this.sound.add("shieldDestroy", { loop: false });
    this.healingSound = this.sound.add("healing", { loop: false });
    this.reloadSound = this.sound.add("reload", { loop: false });
    this.shieldSound = this.sound.add("shield", { loop: false });

    //platform is created here
    this.platforms = this.physics.add.group({});
    this.sensor = this.physics.add.staticGroup();
    this.platform1 = this.platforms
      .create(this.width / 2, 0, "ground")
      .setScale(10, 4.25)
      .setAlpha(0);

    this.platform2 = this.add
      .tileSprite(this.width / 2, this.height - 16, this.width, 32, "ground1")
      .setAlpha(0.5);
    this.platform3 = this.platforms
      .create(this.width / 2, this.height - 16, "")
      .setSize(this.width, 100)
      .setDepth(-10)
      .setAlpha(0);

    this.platform2.setScale(4.25);
    this.add.tween({
      targets: this.platform1,
      ease: "Sine.easeInOut",
      duration: 1000,
      delay: 0,
      x: this.platform1.x,
      y: this.platform1.y,
      alpha: 1,
    });
    this.add.tween({
      targets: this.platform2,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      x: this.platform2.x,
      y: this.platform2.y,
      alpha: 1,
    });
    this.platforms.add(this.platform3);
    let sensorLeft = this.sensor
      .create(-100, this.height / 2, "")
      .setVisible(false)
      .setSize(1, 1200);

    let sensorRight = this.sensor
      .create(this.width + 50, this.height / 2, "")
      .setVisible(false)
      .setSize(1, 1200);
    // sensor.angle = 90;

    //texts
    this.bulletCountText = this.make.text({
      x: 800,
      y: 25,
      text: "Bullet Count: " + this.bulletNumber,
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    this.scoreText = this.make.text({
      x: 10,
      y: 25,
      text: "Score: " + this.score,
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    this.HealthCountText = this.make.text({
      x: 500,
      y: 25,
      text: "Health Count: " + this.health,
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    //plane is created here
    this.user = this.physics.add.sprite(
      this.width * 0.1,
      this.height / 2,
      "plane"
    );
    this.user.setSize(153, 51, true);

    //events listening here

    //objects spawners

    //collsiion with ground is detected here
    this.physics.add.collider(
      this.user,
      this.platforms,
      this.hitwithplatform,
      null,
      this
    );
    // this.physics.add.overlap(
    //   this.user,
    //   this.platforms,
    //   (user, platforn) => {
    //     this.died();
    //   },
    //   null,
    //   this
    // );

    //virus groups
    this.virusGroup = this.add.group({});
    this.bulletGroup = this.add.group({});
    this.powerUpGroup = this.add.group({});
    this.maskGroup = this.physics.add.group({});

    this.physics.add.overlap(
      sensorLeft,
      this.virusGroup,
      (sensor, virus) => {
        this.virusGroup.killAndHide(virus);
        this.virusGroup.remove(virus);
        virus.destroy();
      },
      null,
      this
    );
    this.physics.add.overlap(
      sensorRight,
      this.bulletGroup,
      (sensor, bullet) => {
        this.bulletGroup.remove(bullet);
        bullet.destroy();
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.powerUpGroup,
      this.virusGroup,
      (sensor, virus) => {
        this.virusGroup.remove(virus);
        virus.destroy();
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.powerUpGroup,
      this.powerUpGroup,
      (sensor, powerup) => {
        this.powerUpGroup.remove(powerup);
        powerup.destroy();
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.virusGroup,
      this.virusGroup,
      (virus0, virus1) => {
        this.virusGroup.killAndHide(virus0);
        this.virusGroup.remove(virus0);
        virus0.destroy();
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.user,
      this.virusGroup,
      (player, virus) => {
        this.damageTakenSound.play();
        if (virus.texture.key === "easyvirus") {
          this.health -= 1;
        } else if (virus.texture.key === "mediumvirus") {
          this.health -= 2;
        }
        if (virus.texture.key === "deadlyvirus") {
          this.health -= 3;
        }
        this.HealthCountText.setText("Health: " + this.health);
        this.virusGroup.remove(virus);
        virus.destroy();
        if (this.health <= 0) {
          this.died();
        }
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.user,
      this.powerUpGroup,
      (player, powerUp) => {
        let pUp = powerUp.texture.key;
        if (pUp === "magazinePowerUp") {
          this.reloadSound.play();
          this.bulletNumber = this.magazineSize;
          this.bulletCountText.setText("Bullet " + this.bulletNumber);
        } else if (pUp === "healthPowerUp") {
          this.healingSound.play();
          this.health = this.maxhealth;
          this.HealthCountText.setText("Health: " + this.health);
        } else if (pUp === "maskPowerUp") {
          this.shieldSound.play();
          this.wearmask();
          console.log(pUp);
        }
        this.powerUpGroup.remove(powerUp);
        powerUp.destroy();
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.maskGroup,
      this.virusGroup,
      (mask, virus) => {
        this.shieldDestroySound.play();
        this.virusGroup.remove(virus);
        virus.destroy();
        this.maskGroup.remove(mask);
        mask.destroy();
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.bulletGroup,
      this.virusGroup,
      (bullet, virus) => {
        this.virusDeathSound.play();
        this.tweens.add({
          targets: virus,
          x: virus.x + 10,
          alpha: 0,
          duration: 100,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function () {
            this.virusGroup.remove(virus);
            virus.destroy();
            this.score += 5;
            this.updateScore();
          },
        });
        this.bulletGroup.remove(bullet);
        bullet.destroy();
      },
      null,
      this
    );
  }
  addVirus(type) {
    let posX = this.width + Phaser.Math.Between(50, 1000);
    let posY = Phaser.Math.Between(125, this.height - 125);
    let virus = this.physics.add.image(posX, posY, type);
    //this.physics.add.existing(virus);
    virus.body.setVelocityX(-200 * this.gameSpeed);
    virus.body.isCircle = true;
    this.virusGroup.add(virus);
  }
  updateScore() {
    this.scoreText.setText("Score: " + this.score);
  }
  spawnPowerUp(type) {
    let posX = this.width + 50;
    let posY = Phaser.Math.Between(125, this.height - 125);
    let powerUp = this.physics.add.image(posX, posY, type);

    powerUp.body.setVelocityX(-200 * this.gameSpeed);
    this.powerUpGroup.add(powerUp);
  }

  shootBullet() {
    let posX = this.user.x;
    let posY = this.user.y;

    if (this.bulletNumber > 0 && this.bulletCooldown === 0) {
      let bullet = this.physics.add.image(posX, posY, "bullet").setDepth(-1);
      this.shootSound.play();
      bullet.setScale(1.5);
      bullet.body.setVelocityX(400);
      bullet.body.isCircle = true;
      this.bulletGroup.add(bullet);

      this.bulletNumber--;
      this.bulletCooldown = this.maxBulletCooldown;
      this.bulletCountText.setText("Bullet Count: " + this.bulletNumber);
    }
  }

  wearmask() {
    if (!this.mask || !this.mask.active) {
      this.mask = this.physics.add.image(
        this.user.x,
        this.user.y,
        "maskShield"
      );
      this.mask.setActive(true);
      this.maskGroup.add(this.mask);
    }
    console.log(this.mask);
    this.maskCooldown = this.maskMaxCooldown;
  }

  controls() {
    keys = this.input.keyboard.addKeys({
      up: "up",
      down: "down",
      left: "left",
      right: "right",
      space: "space",
      w: "w",
      s: "s",
    });
    if (keys.up._justDown || keys.w._justDown) {
      this.isGoingUp = true;
    }
    if (keys.up._justUp || keys.w._justUp) {
      this.isGoingUp = false;
    }
    if (keys.down._justDown || keys.s._justDown) {
      this.isGoingDown = true;
    }
    if (keys.down._justUp || keys.s._justUp) {
      this.isGoingDown = false;
    }
    if (keys.space._justDown) {
      this.isShooting = true;
    }
    if (keys.space._justUp) {
      this.isShooting = false;
    }
    if (this.isGoingUp) {
      this.velocity -= 20;
      if (this.angle > -15) {
        this.angle -= 1;
        this.user.angle = this.angle;
      }
      this.user.setVelocityY(this.velocity);
    }
    if (this.isGoingDown) {
      this.velocity += 20;
      if (this.angle < 15) {
        this.angle += 1;
        this.user.angle = this.angle;
      }
      this.user.setVelocityY(this.velocity);
    }
    if (this.isShooting) {
      this.shootBullet();
    }

    if (!this.isGoingDown && !this.isGoingUp) {
      // angle = 0;
      // user.angle = angle;
      if (this.angle > 2) {
        this.angle -= 2;
      } else if (this.angle < -2) {
        this.angle += 2;
      } else {
        this.angle = 0;
      }
      this.user.angle = this.angle;
      //   this.velocity = 0;
      if (this.velocity > 0) {
        this.velocity -= 20;
      } else if (this.velocity < 0) {
        this.velocity += 20;
      }
      this.user.setVelocityY(this.velocity);
    }

    if (this.mask && this.mask.active) {
      this.mask.y = this.user.y;
      this.mask.angle = this.user.angle;
    }
  }
  died() {
    this.isAlive = false;
    this.health = 0;
    this.HealthCountText.setText("Health: " + this.health);
    passingData.score = this.score;
    if (this.score > this.highScore) passingData.highScore = this.score;

    setTimeout(() => {
      for (const key of [...Object.values(keys)]) {
        this.input.keyboard.removeKey(key, false);
      }
      this.scene.stop();
      this.scene.start("GameOver", passingData);
      /*
      if (confirm("You Died,try again?")) {
        this.scene.restart(passingData);
      } else {
        this.scene.restart(passingData);
      }
      */
    }, 10);
  }

  update() {
    // Movement events
    this.controls();
    //console.log(this.background1);
    this.background1.tilePositionX += 1;
    this.platform2.tilePositionX += 1;
    this.gameSpeed += 0.0001;
    if (Phaser.Math.Between(1, 100) <= this.virusSpawnRate) {
      let i = Phaser.Math.Between(0, 2);
      this.addVirus(this.virusType[i]);
    }
    if (Phaser.Math.Between(0, 100000000) <= this.powerUpSpawnRate * 1000000) {
      let i = Phaser.Math.Between(0, 2);
      this.spawnPowerUp(this.powerUpType[i]);
      this.powerUpSpawnRate *= 0.9;
    }
    if (this.mask) {
      if (this.mask.active === true && this.maskCooldown > 0) {
        this.maskCooldown--;
        //console.log("maskCooldown: " + this.maskCooldown);
        //console.log(this.mask);
      } else if (this.mask.active === true) {
        //console.log("inside: ", this.mask.active);
        this.maskGroup.remove(this.mask);
        this.mask.destroy();

        console.log(this.mask);
      }
    }
    if (this.bulletCooldown > 0) {
      this.bulletCooldown--;
    }
    i++;
    if (i % 200 === 0) {
      this.score += 1;
      i = 0;
      this.updateScore();
      this.virusSpawnRate *= 1.01;
    }
  }
  hitwithplatform() {
    this.died();
  }
}

export default playGame;
