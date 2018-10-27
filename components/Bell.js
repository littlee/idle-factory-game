import { formatSec } from '../utils';

const TIMER_TEXT_STYLE = {
  font: 'Arial',
  fontSize: 26,
  fill: '#8ceb52'
};

const REPEAT_INTERVAL = 1000;

class Bell extends window.Phaser.Group {
  constructor(game, x, y, color = 'red') {
    super(game);

    this._data = {
      isOnSkill: false,
      skillDuration: 30,
      skillRestSec: 30,
      isOnCooldown: false,
      cooldownDuration: 15 * 60,
      cooldownRestSec: 15 * 60
    };

    this._onSkillFunc = null;
    this._onSkillContext = null;
    this._onSkillEndFunc = null;
    this._onSkillEndContext = null;

    this.x = x;
    this.y = y;

    this.hole = this.game.make.sprite(0, 0, 'bell_hole');

    this.bellBody = this.game.make.sprite(18, 0, `bell_body_${color}`);
    this.bellBody.oldX = this.bellBody.x;
    this.bellBody.inputEnabled = true;
    this.bellBody.input.priorityID = 999;
    this.bellBody.events.onInputDown.add(this._clickBell, this);

    this.bellBase = this.game.make.sprite(0, 0, 'bell_base');
    this.bellBase.alignTo(this.bellBody, window.Phaser.BOTTOM_CENTER);

    this.bellTimer = this.game.make.sprite(0, 0, 'bell_timer');
    this.bellTimer.alignTo(this.bellBody, window.Phaser.BOTTOM_CENTER, 0, 3);
    this.bellTimer.inputEnabled = true;
    this.bellTimer.input.priorityID = 999;
    this.bellTimer.events.onInputDown.add(this._clickBell, this);

    this.bellTimerText = this.game.make.text(0, 0, formatSec(this._data.skillDuration), TIMER_TEXT_STYLE);
    this.bellTimerText.alignIn(this.bellTimer, window.Phaser.CENTER, 0, 5);

    this.bellHandle = this.game.make.sprite(0, 0, `bell_handle_${color}`);
    this.bellHandle.anchor.setTo(1);
    this.bellHandle.alignTo(
      this.bellBody,
      window.Phaser.BOTTOM_CENTER,
      -40,
      -40
    );

    this.bellHandleTwn = this.game.add.tween(this.bellHandle).to(
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

    this.bellBodyTwn = this.game.add.tween(this.bellBody).to(
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

  _getCanClick() {
    return !this._data.isOnCooldown && !this._data.isOnSkill;
  }

  _clickBell() {
    if (!this._getCanClick()) {
      return;
    }

    this._triggerSkill();

    this._onSkillFunc && this._onSkillFunc.call(this._onSkillContext);
  }

  _triggerSkill() {
    this._data.isOnSkill = true;
    this.bellTimerText.setText(formatSec(this._data.skillRestSec));
    this._ring();

    this.game.time.events.repeat(REPEAT_INTERVAL, this._data.skillDuration, () => {
      this._data.skillRestSec--;
      this.bellTimerText.setText(formatSec(this._data.skillRestSec));

      if (this._data.skillRestSec <= 0) {
        this._data.isOnSkill = false;
        this._data.skillRestSec = this._data.skillDuration;
        this._onSkillEndFunc && this._onSkillEndFunc.call(this._onSkillEndContext);
        this._mute();
        this._triggerCooldown();
      }
    });
  }

  _triggerCooldown() {
    this._data.isOnCooldown = true;
    this.bellTimerText.setText(formatSec(this._data.cooldownRestSec));
    this._disable();

    this.game.time.events.repeat(REPEAT_INTERVAL, this._data.cooldownDuration, () => {
      this._data.cooldownRestSec--;
      this.bellTimerText.setText(formatSec(this._data.cooldownRestSec));

      if (this._data.cooldownRestSec <= 0) {
        this._data.isOnCooldown = false;
        this._data.cooldownRestSec = this._data.cooldownDuration;

        this._enable();
      }
    });
  }

  _enable() {
    this.alpha = 1;
  }

  _disable() {
    this.alpha = 0.6;
  }

  _ring() {
    this.bellHandle.angle = -15;
    this.bellHandleTwn.start();
    this.bellBody.x -= 5;
    this.bellBodyTwn.start();
  }

  _increaseDuration() {
    this._data.skillDuration += 10;
    this._data.skillRestSec += 10;
  }

  _mute() {
    this.bellHandle.angle = 0;
    this.bellHandleTwn.stop();
    this.bellBody.x = this.bellBody.oldX;
    this.bellBodyTwn.stop();
  }

  onSkill(func, context) {
    this._onSkillFunc = func;
    this._onSkillContext = context;
  }

  onSkillEnd(func, context) {
    this._onSkillEndFunc = func;
    this._onSkillEndContext = context;
  }

  upgradeSkillDuration() {
    this._increaseDuration();
    if (this._getCanClick()) {
      this.bellTimerText.setText(formatSec(this._data.skillDuration), true);
    };
  }

  unlock() {
    this.hole.visible = false;

    this.bellBody.visible = true;
    this.bellBase.visible = true;
    this.bellHandle.visible = true;
    this.bellTimer.visible = true;
    this.bellTimerText.visible = true;
  }
}

export default Bell;
