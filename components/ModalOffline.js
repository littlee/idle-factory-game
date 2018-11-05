import ModalRaw from './ModalRaw.js';
import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';

function getFontStyle(fSize, color, align, weight) {
	return {
		fontWeight: weight || 'normal',
		fontSize: fSize || '30px',
		fill: color || '#3a0a00', // '#00FF00', 3a0a00
		boundsAlignH: 'center',
		boundsAlignV: 'middle',
		align: align || 'center'
	};
}

const CONFIG = {
	width: 583,
  height: 770,
	headingTxt: '闲置现金收入',
	desPart: '离开时间: '
};

class ModalOffline extends ModalRaw {
	constructor({
		game,
		height = CONFIG.height,
		width = CONFIG.width,
    headingTxt = CONFIG.headingTxt,
    duration,
    coin = '10099990008009090909',
		close = 'destroy'
	}) {
		super(
			game,
			headingTxt,
			height,
			width,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			close
    );
    this.state = this.game.state.states[this.game.state.current];
    this.coin = Big(coin);
    this.duration = duration;
    this.hasClickShare = false;
    this.hasShare = false;
    this._getInit();
	}

	_getInit = () => {
		this._prepBeforeContentGroup();
		/* real content goes here */
		this._getContextGroupInit();
		this._prepAfterContentGroup();
	};

	_getContextGroupInit = () => {
    const OFFSET = this.headingH;
    this.chunk = this.game.make.image((this.w - 444) / 2, OFFSET * 2, 'idle_chunk');

    this.timeDesTxt = this.game.make.text(OFFSET, 0, CONFIG.desPart + this.duration, getFontStyle());
    this.timeDesTxt.setTextBounds(0, 0, 444, 40);
    this.timeDesTxt.alignTo(this.chunk, Phaser.TOP_LEFT, 0, 20);

    this.coin2Collect = this.game.make.text(0, 0, formatBigNum(this.coin), getFontStyle('36px', '#f8fc6a', '', 'bold'));
    this.coin2Collect.setTextBounds(0, 0, 145, 60);
    this.coin2Collect.alignTo(this.chunk, Phaser.RIGHT_BOTTOM, -155, -125);

    this.btnCollect = this.game.make.image(0, 0, 'btn_collect');
    this.btnCollect.alignTo(this.chunk, Phaser.BOTTOM_LEFT);
    this.btnCollect.events.onInputUp.add(this._handleCoinCollection);

    this.btnShare2 = this.game.make.image(0, 0, 'btn_share2');
    this.btnShare2.alignTo(this.chunk, Phaser.BOTTOM_RIGHT, 0, -20);
    this.btnShare2.events.onInputUp.add(this._handleShareClicked);

    this._addAllObjects();
  };

  _addAllObjects = () => {
    this.contentGroup.addChild(this.chunk);
    this.contentGroup.addChild(this.timeDesTxt);
    this.contentGroup.addChild(this.coin2Collect);
    this.contentGroup.addChild(this.btnCollect);
    this.contentGroup.addChild(this.btnShare2);
  }

  _handleCoinCollection = (target, point, isOver) => {
    if (!isOver) return false;
    if (this.hasClickShare) {
      this.coin = this.coin.times(2);
    }
    this.state.addCash(this.coin);
    this._handleClose();
  }

  _handleShareClicked = (target, point, isOver) => {
    if (!isOver) return false;
    if (this.hasClickShare) return false;
    this.hasClickShare = true;

    window.wx.shareAppMessage({
      title: '工业大亨2',
      imageUrl: '__static/images/share.png'
    });
  }
};

export default ModalOffline;
