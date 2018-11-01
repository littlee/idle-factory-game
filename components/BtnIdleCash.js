// import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';

const TEXT_STYLE = {
  font: 'Arial',
  fontSize: 26,
  fill: '#fbf36d',
};

class BtnIdleCash extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;
    this.unit = '/min';
    this.value = '0';

    this.img = this.game.make.image(0, 0, 'btn_idle_cash');
    this.add(this.img);

    this.text = this.game.make.text(55, 50, formatBigNum(this.value) + this.unit, TEXT_STYLE);
    this.add(this.text);
  }

  setText(text) {
    this.value = text;
    this.text.setText(formatBigNum(this.value) + this.unit, true);
  }

  onClick(func, context) {
    this.img.inputEnabled = true;
    this.img.events.onInputDown.add(func, context);
  }

  getValue = () => {
    return this.value;
  }
}

export default BtnIdleCash;
