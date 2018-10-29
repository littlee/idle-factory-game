const INIT_LEVEL = 1;

const BTN_TEXT_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff'
};

class BtnUpgrade extends window.Phaser.Group {
  constructor(game, x, y, type) {
    super(game);
    this.x = x;
    this.y = y;
    this.type = type;

    this._data = {
      level: null
    };

    this.btn = this.game.make.sprite(0, 0, 'btn_level');
    this.arrow1 = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow1.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, 10);
    this.arrow10 = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow10.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, 2);
    this.arrow50 = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow50.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, -6);
    this.hideAllArrows();

    this.btnText = this.game.make.text(0, 0, '等级', BTN_TEXT_STYLE);
    this.btnText.alignIn(this.btn, window.Phaser.TOP_CENTER, 0, -15);

    this.levelText = this.game.make.text(0, 0, '', BTN_TEXT_STYLE);

    this.add(this.btn);
    this.add(this.arrow1);
    this.add(this.arrow10);
    this.add(this.arrow50);
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

  showArrowByName = (name) => {
    this[`arrow${name}`].visible = true;
  }

  hideArrowByName = (name) => {
    this[`arrow${name}`].visible = false;
  }

  hideAllArrows = () => {
    this.arrow1.visible = false;
    this.arrow10.visible = false;
    this.arrow50.visible = false;
  }
}

export default BtnUpgrade;
