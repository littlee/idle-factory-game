window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

import range from '../js/libs/_/range';
import { formatBigNum } from '../utils';
import Big from '../js/libs/big.min';

const COLLECT_TYPES = {
  CASH: 'cash',
  PROD: 'prod'
};

const BTN_TEXT_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff'
};

const GROUND_NUM_STYLE = {
  font: 'Arial',
  fontSize: 30,
  fill: '#7a6a67'
};

const INPUT_NUM_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};

class Workstation extends window.Phaser.Group {
  constructor(game, x, y, stationLevel = 1, index = 1) {
    super(game);
    this.x = x;
    this.y = y;
    this.gameRef = game;

    this._data = {
      canUpgrade: true,
      level: 1,
      collectType: 'cash'
    };
    this._dataReactions = {
      canUpgrade: [this._setCanUpgrade],
      level: [this._setLevel],
      collectType: [this._setCollectType]
    };

    this.ground = this.gameRef.make.image(0, 0, `ground_level_${stationLevel}`);

    this.groundNum = this.gameRef.make.text(0, 0, `${index}`, GROUND_NUM_STYLE);
    this.groundNum.alignIn(this.ground, window.Phaser.LEFT_CENTER, -70, -30);

    this.table = this.gameRef.make.image(0, 0, `table_level_${stationLevel}`);
    this.table.alignIn(this.ground, window.Phaser.TOP_CENTER);

    this.tableCover = this.gameRef.make.sprite(0, 0, 'table_cover');
    this.tableCover.alignIn(this.table, window.Phaser.TOP_LEFT, 5, 0);

    this.buyBtnSuperCash = this.gameRef.make.sprite(0, 0, 'btn_buy_ws_super_cash');
    this.buyBtnSuperCash.alignIn(this.table, window.Phaser.TOP_LEFT, -5, -5);
    this.buyBtnSuperCash.inputEnabled = true;
    this.buyBtnSuperCash.events.onInputDown.add(() => {
      console.log('点击超级现金购买');
    });

    this.buyBtnSuperCashText = this.gameRef.make.text(0, 0, '123', BTN_TEXT_STYLE);
    this.buyBtnSuperCashText.alignIn(this.buyBtnSuperCash, window.Phaser.TOP_LEFT, -70, -5);

    this.buyBtnCash = this.gameRef.make.sprite(0, 0, 'btn_buy_ws_cash');
    this.buyBtnCash.alignIn(this.table, window.Phaser.TOP_RIGHT, -10, -5);
    this.buyBtnCash.inputEnabled = true;
    this.buyBtnCash.events.onInputDown.add(() => {
      console.log('点击现金购买');
    });

    this.buyBtnCashText = this.gameRef.make.text(0, 0, '123', BTN_TEXT_STYLE);
    this.buyBtnCashText.alignIn(this.buyBtnCash, window.Phaser.TOP_LEFT, -70, -5);

    this.productBtn = this.gameRef.make.sprite(0, 0, 'btn_product_holder');
    this.productBtn.alignIn(this.table, window.Phaser.TOP_RIGHT, -15, -15);
    this.productBtn.inputEnabled = true;
    this.productBtn.events.onInputDown.add(() => {
      console.log('点击工作台产品按钮');
    });
    this.productBtn.visible = false;

    this.productBtnItem = this.gameRef.make.sprite(0, 0, 'source_steel');
    this.productBtnItem.alignIn(this.productBtn, window.Phaser.CENTER, 0, -5);
    this.productBtnItem.visible = false;

    this.inputItems = this.gameRef.make.group();
    range(5).forEach(index => {
      this.inputItems.create(0, index * 5, 'source_ore');
    });
    this.inputItems.sort('z', window.Phaser.Group.SORT_DESCENDING);
    this.inputItems.alignIn(this.table, window.Phaser.TOP_LEFT, -30);
    this.inputItems.visible = false;

    this.inputNum = this.gameRef.make.text(0, 0, formatBigNum(Big('123456789')), INPUT_NUM_STYLE);
    this.inputNum.alignIn(this.table, window.Phaser.TOP_LEFT, -30);
    this.inputNum.visible = false;

    this.outputItems = this.gameRef.make.group();
    range(5).forEach(index => {
      this.outputItems.create(0, index * 5, 'source_steel');
    });
    this.outputItems.sort('z', window.Phaser.Group.SORT_DESCENDING);
    this.outputItems.alignIn(this.table, window.Phaser.TOP_CENTER);
    this.outputItems.visible = false;

    this.worker = this.gameRef.make.sprite(0, 0, 'worker');
    this.worker.alignTo(this.table, window.Phaser.TOP_CENTER);

    this.manager = this.gameRef.make.sprite(0, 0, 'mgr_worker');
    this.manager.alignIn(this.table, window.Phaser.TOP_LEFT, -15, 100);

    this.boxCollect = this.gameRef.make.sprite(0, 0, 'box_collect');

    this.boxHolderProd = this.gameRef.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderProd.alignTo(this.table, window.Phaser.BOTTOM_LEFT, -20, -5);
    this.boxHolderProd.inputEnabled = true;
    this.boxHolderProd.events.onInputDown.add(this._setData.bind(this, { collectType: COLLECT_TYPES.PROD }));

    this.boxHolderCash = this.gameRef.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderCash.alignTo(this.table, window.Phaser.BOTTOM_RIGHT, -20, -5);
    this.boxHolderCash.inputEnabled = true;
    this.boxHolderCash.events.onInputDown.add(this._setData.bind(this, { collectType: COLLECT_TYPES.CASH }));

    this.upgradeBtn = this.gameRef.make.sprite(0, 0, 'btn_level');
    this.upgradeBtn.alignIn(this.table, window.Phaser.BOTTOM_CENTER, 0, 30);
    this.upgradeBtn.inputEnabled = true;
    this.upgradeBtn.events.onInputDown.add(() => {
      console.log('点击工作台升级按钮');
    });

    this.upgradeBtnText = this.gameRef.make.text(0, 0, '等级', BTN_TEXT_STYLE);
    this.upgradeBtnText.alignIn(this.upgradeBtn, window.Phaser.TOP_CENTER, 0, -15);

    this.levelText = this.gameRef.make.text(0, 0, this._data.level, BTN_TEXT_STYLE);
    this.levelText.alignIn(this.upgradeBtn, window.Phaser.BOTTOM_CENTER, 0, -5);

    this.upgradeArrow = this.gameRef.make.sprite(0, 0, 'icon_level_up');
    this.upgradeArrow.alignIn(this.upgradeBtn, window.Phaser.TOP_RIGHT, 10, 10);

    // for simple z-depth
    this.add(this.ground);
    this.add(this.groundNum);
    this.add(this.manager);
    this.add(this.table);
    this.add(this.tableCover);
    this.add(this.buyBtnSuperCash);
    this.add(this.buyBtnSuperCashText);
    this.add(this.buyBtnCash);
    this.add(this.buyBtnCashText);
    this.add(this.productBtn);
    this.add(this.productBtnItem);
    this.add(this.inputItems);
    this.add(this.outputItems);
    this.add(this.inputNum);
    this.add(this.worker);
    this.add(this.boxHolderProd);
    this.add(this.boxHolderCash);
    this.add(this.boxCollect);
    this.add(this.upgradeBtn);
    this.add(this.upgradeBtnText);
    this.add(this.levelText);
    this.add(this.upgradeArrow);

    this._init();
  }

  _init() {
    this._setCollectType();
    this._setCanUpgrade();
  }

  _setData(data) {
    this._data = {
      ...this._data,
      ...data
    };

    Object.keys(data).forEach(key => {
      let reaction = this._dataReactions[key];
      if (reaction) {
        reaction.forEach(re => {
          re.apply(this);
        });
      }
    });
  }

  _setCollectType() {
    const { collectType } = this._data;
    if (collectType === COLLECT_TYPES.CASH) {
      this.boxCollect.alignIn(this.boxHolderCash, window.Phaser.CENTER);
      this.boxHolderCash.frame = 1;
      this.boxHolderProd.frame = 0;
    } else if (collectType === COLLECT_TYPES.PROD) {
      this.boxCollect.alignIn(this.boxHolderProd, window.Phaser.CENTER);
      this.boxHolderProd.frame = 1;
      this.boxHolderCash.frame = 0;
    }
  }

  _setLevel() {
    const { level } = this._data;
    this.levelText.setText(level);
  }

  _setCanUpgrade() {
    const { canUpgrade } = this._data;
    if (canUpgrade) {
      this.upgradeArrow.visible = true;
    } else {
      this.upgradeArrow.visible = false;
    }
  }

  // public methods
  getData() {
    return this._data;
  }

  setCanUpgrade(canUpgrade) {
    this._setData({
      canUpgrade
    });
  }
}

export default Workstation;
