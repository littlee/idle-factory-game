class ResourceEmitter extends window.Phaser.Particles.Arcade.Emitter {
  constructor(
    game,
    x,
    y,
    key,
    xSpeed,
    ySpeed,
    lifespan = 1000,
    frequency = 450
  ) {
    super(game, x, y, 10);

    this.makeParticles(key);

    if (Array.isArray(xSpeed)) {
      this.setXSpeed(xSpeed[0], xSpeed[1]);
    } else {
      this.setXSpeed(xSpeed, xSpeed);
    }
    if (Array.isArray(ySpeed)) {
      this.setYSpeed(ySpeed[0], ySpeed[1]);
    } else {
      this.setYSpeed(ySpeed, ySpeed);
    }
    this.setRotation(0, 0);
    this.setScale(0.7, 0.7, 0.7, 0.7);
    this.gravity = 0;

    this.particleKey = key;
    this.inLifespan = lifespan;
    this.inFrequency = frequency;

    // this.start();
  }

  changeTexture(key) {
    this.particleKey = key;
    if (Array.isArray(key) && key.length > 1) {
      this.forEach(p =>
        p.loadTexture(key[this.game.rnd.between(0, key.length - 1)])
      );
    } else {
      this.forEach(p => p.loadTexture(key));
    }
  }

  start() {
    super.start(false, this.inLifespan, this.inFrequency);
  }

  stop() {
    this.on = false;
  }
}

export default ResourceEmitter;
