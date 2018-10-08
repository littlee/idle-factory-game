import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';


const TEXT_STYLE = {
  font: 'Arial',
  fontSize: 36,
  fill: '#fbf36d'
};

class BtnCash extends window.Phaser.Group {
  constructor(game, x, y, value = 0) {
    super(game);
    this.x = x;
    this.y = y;
    this.value = value;

    this.img = this.game.make.image(0, 0, 'btn_cash');
    this.add(this.img);

    this.text = this.game.make.text(55, 45, this._getformattedCashValue(), TEXT_STYLE);
    this.add(this.text);

    this.setAllChildren('inputEnabled', true);
    this.setAllChildren('input.priorityID', 888);
  }

  _getformattedCashValue() {
    let tmp = Big(this.value);
    return formatBigNum(tmp);
  }

  _resetCashValueUI() {
    this.text.setText(this._getformattedCashValue());
  }

  addCash(increment) {
    this.value += increment;
    this._resetCashValueUI();
  }

  subtractCash(decrement) {
    this.value -= decrement;
    this._resetCashValueUI();
  }

  onClick(func, context) {
    this.onChildInputDown.add(func, context);
  }

  getCash() {
    return this.value;
  }
}

export default BtnCash;
