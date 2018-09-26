const INIT_LEVEL = 1;

const BTN_TEXT_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff'
};

class BtnUpgrade extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;

    this._data = {
      level: null
    };

    this.btn = this.game.make.sprite(0, 0, 'btn_level');
    this.arrow = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, 10);

    this.btnText = this.game.make.text(0, 0, '等级', BTN_TEXT_STYLE);
    this.btnText.alignIn(this.btn, window.Phaser.TOP_CENTER, 0, -15);

    this.levelText = this.game.make.text(0, 0, '', BTN_TEXT_STYLE);

    this.add(this.btn);
    this.add(this.arrow);
    this.add(this.btnText);
    this.add(this.levelText);

    this._init();
  }

  _init() {
    this.setLevel(INIT_LEVEL);
  }

  onClick(func, context) {
    this.btn.inputEnabled = true;
    this.btn.input.priorityID = 999;
    this.btn.events.onInputDown.add(func, context);
  }

  setLevel(level) {
    this._data.level = level;
    this.levelText.setText(level.toString());
    this.levelText.alignIn(this.btn, window.Phaser.BOTTOM_CENTER, 0, -5);
  }

  getLevel() {
    return this._data.level;
  }
}

export default BtnUpgrade;
