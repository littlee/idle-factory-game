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

    this.img = this.game.make.image(0, 0, 'btn_idle_cash');
    this.add(this.img);

    this.text = this.game.make.text(55, 50, '0' + this.unit, TEXT_STYLE);
    this.add(this.text);
  }

  setText(text) {
    this.text.setText(formatBigNum(text) + this.unit, true);
  }

  onClick(func, context) {
    this.img.inputEnabled = true;
    this.img.events.onInputDown.add(func, context);
  }
}

export default BtnIdleCash;
