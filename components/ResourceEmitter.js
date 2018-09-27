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
    super(game, x, y, 5);
    this.makeParticles(key);
    this.setXSpeed(xSpeed, xSpeed);
    this.setYSpeed(ySpeed, ySpeed);
    this.setRotation(0, 0);
    this.setScale(0.7, 0.7, 0.7, 0.7);
    this.gravity = 0;

    this.inLifespan = lifespan;
    this.inFrequency = frequency;

    this.start();
  }

  changeTexture(key) {
    this.forEach(p => p.loadTexture(key));
  }

  start() {
    super.start(false, this.inLifespan, this.inFrequency);
  }

  stop() {
    this.on = false;
  }
}

export default ResourceEmitter;
