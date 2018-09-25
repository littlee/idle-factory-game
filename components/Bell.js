const TIMER_TEXT_STYLE = {
  font: 'Arial',
  fontSize: 26,
  fill: '#8ceb52'
};

class Bell extends window.Phaser.Group {
  constructor(game, x, y, color = 'red') {
    super(game);
    this.x = x;
    this.y = y;
    this.gameRef = game;

    this.hole = this.gameRef.make.sprite(0, 0, 'bell_hole');

    this.bellBody = this.gameRef.make.sprite(18, 0, `bell_body_${color}`);
    this.bellBody.oldX = this.bellBody.x;

    this.bellBase = this.gameRef.make.sprite(0, 0, 'bell_base');
    this.bellBase.alignTo(this.bellBody, window.Phaser.BOTTOM_CENTER);

    this.bellTimer = this.gameRef.make.sprite(0, 0, 'bell_timer');
    this.bellTimer.alignTo(this.bellBody, window.Phaser.BOTTOM_CENTER, 0, 3);

    this.bellTimerText = this.gameRef.make.text(
      0,
      0,
      '12:34',
      TIMER_TEXT_STYLE
    );
    this.bellTimerText.alignIn(this.bellTimer, window.Phaser.CENTER, 0, 5);

    this.bellHandle = this.gameRef.make.sprite(0, 0, `bell_handle_${color}`);
    this.bellHandle.anchor.setTo(1);
    this.bellHandle.alignTo(
      this.bellBody,
      window.Phaser.BOTTOM_CENTER,
      -40,
      -40
    );

    this.bellHandleTwn = this.gameRef.add.tween(this.bellHandle).to(
      {
        angle: 15
      },
      200,
      null,
      false,
      0,
      -1,
      true
    );

    this.bellBodyTwn = this.gameRef.add.tween(this.bellBody).to(
      {
        x: '+10'
      },
      50,
      null,
      false,
      0,
      -1,
      true
    );

    this.add(this.hole);
    this.add(this.bellBody);
    this.add(this.bellBase);
    this.add(this.bellHandle);
    this.add(this.bellTimer);
    this.add(this.bellTimerText);

    this.bellBody.visible = false;
    this.bellBase.visible = false;
    this.bellHandle.visible = false;
    this.bellTimer.visible = false;
    this.bellTimerText.visible = false;
  }

  unlock() {
    this.hole.visible = false;

    this.bellBody.visible = true;
    this.bellBase.visible = true;
    this.bellHandle.visible = true;
    this.bellTimer.visible = true;
    this.bellTimerText.visible = true;
  }

  ring() {
    this.bellHandle.angle = -15;
    this.bellHandleTwn.start();
    this.bellBody.x -= 5;
    this.bellBodyTwn.start();
  }

  mute() {
    this.bellHandle.angle = 0;
    this.bellHandleTwn.stop();
    this.bellBody.x = this.bellBody.oldX;
    this.bellBodyTwn.stop();
  }

  enable() {
    this.alpha = 1;
  }

  disable() {
    this.alpha = 0.75;
  }
}

export default Bell;
