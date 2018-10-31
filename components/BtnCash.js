import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';


const TEXT_STYLE = {
  font: 'Arial',
  fontSize: 36,
  fill: '#fbf36d'
};

const INIT_CASH = 100000000;

class BtnCash extends window.Phaser.Group {
  constructor(game, x, y, value = INIT_CASH) {
    super(game);
    this.x = x;
    this.y = y;
    this.value = Big(value);

    this.img = this.game.make.image(0, 0, 'btn_cash');
    this.add(this.img);

    this.text = this.game.make.text(55, 45, this._getformattedCashValue(), TEXT_STYLE);
    this.add(this.text);

    this.setAllChildren('inputEnabled', true);
    this.setAllChildren('input.priorityID', 888);

    this._onChangeFunc = null;
    this._onChangeContext = null;
  }

  _getformattedCashValue() {
    return formatBigNum(this.value);
  }

  _resetCashValueUI() {
    this.text.setText(this._getformattedCashValue(), true);

    if (this._onChangeFunc) {
      this._onChangeFunc.call(this._onChangeContext, this.value);
    }
  }
  addCashAndUpdate(increment) {
    this.value = this.value.plus(increment);
    this._resetCashValueUI();
  }

  subtractCashAndUpdate(decrement) {
    this.value = this.value.minus(decrement);
    this._resetCashValueUI();
  }

  onClick(func, context) {
    this.onChildInputDown.add(func, context);
  }

  getCash() {
    return this.value;
  }

  onChange(func, context) {
    this._onChangeFunc = func;
    this._onChangeContext = context;
  }

}

export default BtnCash;
