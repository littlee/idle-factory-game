import { formatBigNum } from '../utils';
import Big from '../js/libs/big.min';
import range from '../js/libs/_/range';

import ModalLevel from './ModalLevel';
import Worker from './Worker';
import BtnUpgrade from './BtnUpgrade';
import ResourceEmitter from './ResourceEmitter';
import ResourecePile from './ResourcePile';
import BoxCollect from './BoxCollect';
import SOURCE_IMG_MAP from '../constants/SourceImgMap';

const MAX_INPUT_PILE = 2;
const A_MINUTE = 60000;
const OUTPUT_DELAY = {
  normal: 3000,
  fast: 1000
};

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

const PRIORITY_ID = 999;

const OUTPUT_REQ_MAP = {
  steel: ['ore'],
  can: ['ore'],
  drill: ['steel'],
  toaster: ['steel', 'can']
};

class Workstation extends window.Phaser.Group {
  constructor(game, x, y, stationLevel = 1, index = 1) {
    super(game);
    this.x = x;
    this.y = y;

    this._data = {
      isBought: false,
      input: OUTPUT_REQ_MAP['steel'],
      inputAmount: [Big(0), Big(0)],
      inputComsumePerMin: [Big(0), Big(0)],
      output: 'steel',
      outputAmount: {
        cash: Big(0),
        prod: Big(0)
      },
      outputAmountPerMin: {
        cash: Big(0),
        prod: Big(0)
      },
      outputDelay: 'normal',
      price: {
        cash: Big(123),
        superCash: Big(456)
      },
      level: 1,
      collectType: 'cash'
    };
    this.outputTimer = null;
    // this.outputTimer = this.game.time.events.loop(1000, this.incOutput, this);

    this.ground = this.game.make.image(0, 0, `ground_level_${stationLevel}`);

    this.groundNum = this.game.make.text(0, 0, `${index}`, GROUND_NUM_STYLE);
    this.groundNum.alignIn(this.ground, window.Phaser.LEFT_CENTER, -70, -30);

    this.table = this.game.make.image(0, 0, `table_level_${stationLevel}`);
    this.table.alignIn(this.ground, window.Phaser.TOP_CENTER);

    this.tableCover = this.game.make.sprite(0, 0, 'table_cover');
    this.tableCover.alignIn(this.table, window.Phaser.TOP_LEFT, 5, 0);

    // 购买按钮
    this.buyBtnGroup = this.game.make.group();

    this.buyBtnSuperCash = this.game.make.sprite(0, 0, 'btn_buy_ws_super_cash');
    this.buyBtnSuperCash.alignIn(this.table, window.Phaser.TOP_LEFT, -5, -5);
    this.buyBtnSuperCash.inputEnabled = true;
    this.buyBtnSuperCash.input.priorityID = PRIORITY_ID;
    this.buyBtnSuperCash.events.onInputDown.add(
      this.buy.bind(this, 'super_cash')
    );

    this.buyBtnSuperCashText = this.game.make.text(0, 0, '123', BTN_TEXT_STYLE);
    this.buyBtnSuperCashText.alignIn(
      this.buyBtnSuperCash,
      window.Phaser.TOP_LEFT,
      -70,
      -5
    );

    this.buyBtnCash = this.game.make.sprite(0, 0, 'btn_buy_ws_cash');
    this.buyBtnCash.alignIn(this.table, window.Phaser.TOP_RIGHT, -10, -5);
    this.buyBtnCash.inputEnabled = true;
    this.buyBtnCash.input.priorityID = PRIORITY_ID;
    this.buyBtnCash.events.onInputDown.add(this.buy.bind(this, 'cash'));

    this.buyBtnCashText = this.game.make.text(0, 0, '123', BTN_TEXT_STYLE);
    this.buyBtnCashText.alignIn(
      this.buyBtnCash,
      window.Phaser.TOP_LEFT,
      -70,
      -5
    );

    this.buyBtnGroup.add(this.buyBtnSuperCash);
    this.buyBtnGroup.add(this.buyBtnSuperCashText);
    this.buyBtnGroup.add(this.buyBtnCash);
    this.buyBtnGroup.add(this.buyBtnCashText);
    this.buyBtnGroup.visible = false;

    // 生产相关
    this.productGroup = this.game.make.group();
    this.productBtn = this.game.make.sprite(0, 0, 'btn_product_holder');
    this.productBtn.alignIn(this.table, window.Phaser.TOP_RIGHT, -15, -15);
    this.productBtn.inputEnabled = true;
    this.productBtn.input.priorityID = PRIORITY_ID;
    this.productBtn.events.onInputDown.add(() => {
      console.log('点击工作台产品按钮');
      // this.game.state.start('Test');
      // this.outputTimer.delay = 100;
    });
    this.productBtnItem = this.game.make.sprite(
      0,
      0,
      SOURCE_IMG_MAP[this._data.output]
    );
    this.productBtnItem.alignIn(this.productBtn, window.Phaser.CENTER, 0, -5);

    this.inputItemGroup = this.game.make.group();
    range(MAX_INPUT_PILE).forEach(index => {
      let { input } = this._data;
      let inputTexture = SOURCE_IMG_MAP[input[index]];
      let inputItem = new ResourecePile(this.game, inputTexture, true);
      inputItem.x = this.table.x + 20 + index * 40;
      inputItem.y = index * 10;
      inputItem.setNum(formatBigNum(this._data.inputAmount[index]));
      inputItem.visible = Boolean(inputTexture);
      this.inputItemGroup.add(inputItem);
    });

    this.outputItems = new ResourecePile(this.game, 'prod_steel');
    this.outputItems.alignIn(this.table, window.Phaser.TOP_CENTER);

    this.inputItemsAni = new ResourceEmitter(
      this.game,
      this.table.x + 50,
      this.table.y + 50,
      this._data.input.map(item => SOURCE_IMG_MAP[item]),
      100,
      0
    );

    this.outputItemsAniLeft = new ResourceEmitter(
      this.game,
      this.table.x + this.table.width / 2 - 30,
      this.table.y + this.table.height / 2 - 20,
      SOURCE_IMG_MAP[this._data.output],
      -100,
      100
    );

    this.outputItemsAniRight = new ResourceEmitter(
      this.game,
      this.table.x + this.table.width / 2 + 30,
      this.table.y + this.table.height / 2 - 20,
      SOURCE_IMG_MAP[this._data.output],
      100,
      100
    );

    this.worker = new Worker(this.game, 0, 0);
    this.worker.alignTo(this.table, window.Phaser.TOP_CENTER, 20, -10);
    this.worker.visible = false;

    this.manager = this.game.make.sprite(0, 0, 'mgr_worker');
    this.manager.alignIn(this.table, window.Phaser.TOP_LEFT, -15, 100);
    this.manager.visible = false;

    this.boxCollect = new BoxCollect(this.game);
    let { collectType, outputAmount } = this._data;
    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));

    this.boxHolderProd = this.game.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderProd.alignTo(this.table, window.Phaser.BOTTOM_LEFT, -20, -5);
    this.boxHolderProd.inputEnabled = true;
    this.boxHolderProd.input.priorityID = PRIORITY_ID;
    this.boxHolderProd.events.onInputDown.add(
      this.setCollectType.bind(this, COLLECT_TYPES.PROD)
    );

    this.outputTradeAni = new ResourceEmitter(
      this.game,
      this.boxHolderProd.x,
      this.boxHolderProd.y,
      SOURCE_IMG_MAP[this._data.output],
      -100,
      -30
    );

    this.boxHolderCash = this.game.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderCash.alignTo(this.table, window.Phaser.BOTTOM_RIGHT, -20, -5);
    this.boxHolderCash.inputEnabled = true;
    this.boxHolderCash.input.priorityID = PRIORITY_ID;
    this.boxHolderCash.events.onInputDown.add(
      this.setCollectType.bind(this, COLLECT_TYPES.CASH)
    );

    this.upBtn = new BtnUpgrade(this.game, 0, 0);
    this.upBtn.alignIn(this.table, window.Phaser.BOTTOM_CENTER, 0, 30);
    this.upBtn.onClick(() => {
      console.log('点击工作台升级按钮');
      this.workestationLevelModal.visible = true;
    });

    this.productGroup.add(this.productBtn);
    this.productGroup.add(this.productBtnItem);
    this.productGroup.add(this.inputItemGroup);
    this.productGroup.add(this.outputItems);
    this.productGroup.add(this.inputItemsAni);
    this.productGroup.add(this.outputItemsAniLeft);
    this.productGroup.add(this.outputItemsAniRight);
    this.productGroup.add(this.boxHolderProd);
    this.productGroup.add(this.boxHolderCash);
    this.productGroup.add(this.boxCollect);
    this.productGroup.add(this.outputTradeAni);
    this.productGroup.add(this.upBtn);
    this.productGroup.visible = false;

    // modal
    this.workestationLevelModal = new ModalLevel({
      game: this.game,
      type: 'workstation',
      coupledBtn: this.upBtn,
      workstation: this, // more to go
    });

    // for simple z-depth
    this.add(this.ground);
    this.add(this.groundNum);
    this.add(this.manager);
    this.add(this.worker);
    this.add(this.table);
    this.add(this.tableCover);

    this.add(this.buyBtnGroup);

    this.add(this.productGroup);

    this._init();
  }

  _init() {
    // this.beAbleToBuy();
    // this.buy('cash');
    // this.setCollectType(COLLECT_TYPES.CASH);
  }

  _outputLoop() {
    if (this._getHasNoInput()) {
      this.stopWork();
    }
    let {
      collectType,
      inputAmount,
      inputComsumePerMin,
      outputAmount,
      outputAmountPerMin,
      outputDelay
    } = this._data;
    this._data.outputAmount[collectType] = outputAmount[collectType].plus(
      outputAmountPerMin[collectType].div(
        Big(A_MINUTE / OUTPUT_DELAY[outputDelay])
      )
    );
    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));

    this._data.inputAmount = inputAmount.map((amount, index) => {
      let nextAmount = amount.minus(
        inputComsumePerMin[index].div(Big(A_MINUTE / OUTPUT_DELAY[outputDelay]))
      );
      if (nextAmount.lt(0)) {
        nextAmount = Big(0);
      }
      return nextAmount;
    });
    this.inputItemGroup.forEach(item => {
      let index = this.inputItemGroup.getChildIndex(item);
      item.setNum(formatBigNum(this._data.inputAmount[index]));
    });
  }

  _getHasNoInput() {
    let neededInputAmount = this._data.inputAmount.slice(
      0,
      this._data.input.length
    );
    return neededInputAmount.some(amount => {
      return amount.lte(0);
    });
  }

  // public methods
  beAbleToBuy() {
    this.buyBtnGroup.visible = true;
  }

  buy(type) {
    // 计算消耗金币
    console.log('this buy: ', type);
    this._data.isBought = true;

    this.buyBtnGroup.visible = false;
    this.tableCover.visible = false;

    this.manager.visible = true;
    this.worker.visible = true;
    this.productGroup.visible = true;

    this.startWork();
  }

  getIsBought() {
    return this._data.isBought;
  }

  startWork() {
    if (this.outputTimer) {
      this.game.time.events.remove(this.outputTimer);
    }
    this.worker.work();
    this.setCollectType(COLLECT_TYPES.CASH);
    this._outputLoop();
    this.outputTimer = this.game.time.events.loop(
      OUTPUT_DELAY[this._data.outputDelay],
      this._outputLoop,
      this
    );
  }

  stopWork() {
    this.inputItemsAni.stop();
    this.outputItemsAniLeft.stop();
    this.outputItemsAniRight.stop();
    this.worker.stop();
    if (this.outputTimer) {
      this.game.time.events.remove(this.outputTimer);
    }
  }

  takeFromWorker() {
    
  }

  setCollectType(collectType) {
    this._data.collectType = collectType;
    let { outputAmount } = this._data;
    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));
    if (collectType === COLLECT_TYPES.CASH) {
      this.boxCollect.alignIn(this.boxHolderCash, window.Phaser.CENTER, 0, -5);
      this.boxHolderCash.frame = 1;
      this.boxHolderProd.frame = 0;
      this.outputItemsAniLeft.stop();
      if (!this._getHasNoInput()) {
        this.inputItemsAni.start();
        this.outputItemsAniRight.start();
      }
    } else if (collectType === COLLECT_TYPES.PROD) {
      this.boxCollect.alignIn(this.boxHolderProd, window.Phaser.CENTER, 0, -5);
      this.boxHolderProd.frame = 1;
      this.boxHolderCash.frame = 0;
      this.outputItemsAniRight.stop();
      if (!this._getHasNoInput()) {
        this.inputItemsAni.start();
        this.outputItemsAniLeft.start();
      }
    }
  }

  setLevel(level) {
    this._data.level = level;
    this.levelText.setText(level);
  }

  getInput() {
    return this._data.input;
  }

  setOutput(outputKey) {
    if (outputKey === this._data.output) {
      return;
    }
    this._data.output = outputKey;
    this._data.input = OUTPUT_REQ_MAP[outputKey];

    let outputTexture = SOURCE_IMG_MAP[outputKey];
    this.outputItems.changeTexture(outputTexture);
    this.outputItemsAniLeft.changeTexture(outputTexture);
    this.outputItemsAniRight.changeTexture(outputTexture);
    this.outputTradeAni.changeTexture(outputTexture);

    this.productBtnItem.loadTexture(outputTexture);

    let inputTexture = this._data.input.map(item => SOURCE_IMG_MAP[item]);
    this.inputItemGroup.forEach(item => {
      let index = this.inputItemGroup.getChildIndex(item);
      if (inputTexture[index]) {
        item.changeTexture(inputTexture[index]);
        item.visible = true;
      } else {
        item.visible = false;
      }
    });
    this.inputItemsAni.changeTexture(inputTexture);
  }

  getData() {
    return this._data;
  }
}

export default Workstation;
