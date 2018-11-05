import Big from '../js/libs/big.min';

import BtnBuy from './BtnBuy.js';

const CONFIG = {
	width: 456,
	height: 85,
	bgColor: 0x000000,
	bgAlpha: 0.1,
	bgUnableAlpha: 0.4,
	imgScale: 70 / 128
};

const KEY_TARGET_MAP = {
	reso_ore: 'ore',
	reso_copper: 'copper',
	reso_barrel: 'barrel',
	reso_plug: 'plug',
	reso_aluminium: 'aluminium',
	reso_rubber: 'rubber'
};

// item的购买与否在初始化时候，通过resourceTable返回的数据判断.
class ResourceItem extends window.Phaser.Group {
	constructor({ game, parent, key, pWidth, y, coinNeeded, cashNeeded, resourcesTable = null }) {
		super(game, parent);
		this.key = key;
		this.posX = (pWidth - CONFIG.width) / 2;
		this.posY = y;
		this.resourcesTable = resourcesTable;
		this.resourcesList = this.resourcesTable.getCurrentGoods();

		this._data = {
			target2buy: KEY_TARGET_MAP[key],
			boughtFlag: this.resourcesList.indexOf(KEY_TARGET_MAP[key]) > -1,
			coinNeeded: Big(coinNeeded),
			cashNeeded
		};

		this._getInit();
	}

	_getInit = () => {
		this.x = this.posX;
		this.y = this.posY;

		this.bg = this.game.make.graphics(0, 0);
		this.bg.beginFill(CONFIG.bgColor, CONFIG.bgAlpha);
		this.bg.drawRect(0, 0, CONFIG.width, CONFIG.height);
		this.bg.endFill();

		this.icon = this.game.make.image(20, 42, 'material', this.key);
		this.icon.anchor.setTo(0, 0.5);
		this.icon.scale.x = CONFIG.imgScale;
    this.icon.scale.y = CONFIG.imgScale;

    // if (this.key === 'reso_ore') {
    //   this.icon.events.onInputDown.add(() => {
    //     this.littlee = setTimeout();
    //   });
    //   this.icon.events.onInputUp.add(() => {
    //     console.log('yes???');
    //   });
    // }

		this.bgVeil = this.game.make.graphics(0, 0);
		this.bgVeil.beginFill(CONFIG.bgColor, CONFIG.bgUnableAlpha);
		this.bgVeil.drawRect(0, 0, CONFIG.width, CONFIG.height);
		this.bgVeil.endFill();
		this.bgVeil.visible = !this._data.boughtFlag;

		// btn_*buy
		this.btnBuyGroup = new BtnBuy({
			game: this.game,
			alignToObj: this.bg,
			target2buy: KEY_TARGET_MAP[this.key], // should map to a unified name
			coinNeeded: this._data.coinNeeded, // 一个Big
			cashNeeded: this._data.cashNeeded,
			boughtFlag: this._data.boughtFlag,
			resourcesTable: this.resourcesTable,
			upperLayer: this
		});

		this.addChild(this.bg);
		this.addChild(this.icon);
		this.addChild(this.btnBuyGroup);
		this.addChild(this.bgVeil);
	};

	getData = () => {
		let data = null;
		// 拿到的cash 和 coin都是个Big object
		data = Object.assign({}, this._data, this.btnBuyGroup.getData());
		return data;
	};

	rmBgVeil = () => {
		this.bgVeil.visible = false;
	};

	isBought = () => {
		return this.btnBuyGroup.isBought();
	};

	getTarget = () => {
		return this._data.target2buy;
	};

	// 被外调来改UI
	updateBtnBuyUI = (currCoin) => {
		this.btnBuyGroup.greyOutBtnOrNot(currCoin);
	};
}

export default ResourceItem;
