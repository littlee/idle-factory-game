import { formatBigNum } from '../utils';
import Big from '../js/libs/big.min';
import range from '../js/libs/_/range';
import pick from '../js/libs/_/pick';

import ModalLevel from './ModalLevel';
import ModalProdPick from './ModalProdPick.js';
import Worker from './Worker';
import BtnUpgrade from './BtnUpgrade';
import ResourceEmitter from './ResourceEmitter';
import ResourcePile from './ResourcePile';
import BoxCollect from './BoxCollect';
import SourceImg from '../resource/SourceImg';
import Production from '../store/Production';

import { OUTPUT_INPUT_INFO } from '../js/config.js';

const MAX_INPUT_PILE = 2;
const A_MINUTE = 60000;

const INIT_OUTPUT_DELAY = 3000;

export const COLLECT_TYPES = {
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

// 单位输入对应的输出数量
const OUTPUT_PRODUCE_MAP = {
  steel: 2,
  can: 2,
  drill: 1,
  toaster: 1,
  battery: 2,
  coffeeMachine: 2,
  mp3: 3,
  speaker: 1,
  // 对应关系不一定正确
  plasticBar: 2,
  wheel: 2,
  screen: 3,
  phone: 1,

  circuit: 2,
  tv: 1,
  computer: 1,
  vr: 1,

  // aluminium goes here
  engine: 2,
  solarPanel: 3,
  car: 3,
  telescope: 1,

  projector: 1,
  headset: 2,
  walkieTalkie: 3,
  radio: 2
};

const TEXTURE_SCALE = 0.43;

function getInitInput(output) {
  return OUTPUT_INPUT_INFO[output].inputList.reduce((input, key) => {
    input[key] = {
      amount: Big(0),
      amountHu: '0'
    };
    return input;
  }, {});
}

class Workstation extends window.Phaser.Group {
  constructor(game, x, y, stationLevel = 1, index = 1) {
    super(game);
    this.state = this.game.state.states[this.game.state.current];
    this.x = x;
    this.y = y;

    const initOutput = 'steel';

    this._data = {
      isLocked: true,
      isBought: false,
      isWorking: false,
      input: getInitInput(initOutput),
      output: initOutput,
      outputAmount: {
        cash: Big(0),
        prod: Big(0)
      },
      producePerMin: Big(10000),
      outputDelay: INIT_OUTPUT_DELAY,
      price: {
        cash: Big(0),
        superCash: Big(0)
      },
      level: 1,
      collectType: 'cash',
      index: null
    };
    this._onAfterBuyFunc = null;
    this._onAfterBuyContext = null;

    this._onValidateBuyFunc = () => true;
    this._onValidateBuyContext = null;

    this.outputTimer = null;

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
    this.buyBtnSuperCash.events.onInputUp.add((target, pointer, isOver) => {
      if (!isOver) return false;
      this.buy.bind(this, 'superCash')();
    });

    this.buyBtnSuperCashText = this.game.make.text(0, 0, '0', BTN_TEXT_STYLE);
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
    this.buyBtnCash.events.onInputUp.add((target, pointer, isOver) => {
      if (!isOver) return false;
      this.buy.bind(this, 'cash')();
    });

    this.buyBtnCashText = this.game.make.text(0, 0, '0', BTN_TEXT_STYLE);
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
    if (index === 1) {
      this._drawProductProduceStuffs();
      this._drawWorkerManager();
      this._addProductionStuffs();
    }

    // for simple z-depth
    this.add(this.ground);
    this.add(this.groundNum);
    this.add(this.table);
    this.add(this.tableCover);

    this.add(this.buyBtnGroup);

    if (index === 1) {
      this._addTheRest();
      this._init();
    }
  }

  _drawProductProduceStuffs = () => {
    // 生产相关
    this.productGroup = this.game.make.group();
    this.productBtn = this.game.make.sprite(0, 0, 'btn_product_holder');
    this.productBtn.alignIn(this.table, window.Phaser.TOP_RIGHT, -15, -15);
    this.productBtn.inputEnabled = true;
    this.productBtn.input.priorityID = PRIORITY_ID;

    this.productBtn.events.onInputUp.add((target, pointer, isOver) => {
      console.log('点击工作台产品按钮');
      if (!isOver) return false;
      this.modalProdPick = new ModalProdPick({
        game: this.game,
        workstation: this,
        resourcesTable: this.state.warehouse
      });
      this.modalProdPick.onDestroy.add(() => {
        console.log('destroy done modalProdPick');
        this.modalProdPick = null;
      });
      this.modalProdPick.visible = true;
    });
    this.productBtnItem = this.game.make.sprite(
      0,
      0,
      'material',
      SourceImg.get(this._data.output)
    );
    this.productBtnItem.scale.setTo(TEXTURE_SCALE);
    this.productBtnItem.alignIn(this.productBtn, window.Phaser.CENTER, 0, -5);

    this.inputItemGroup = this.game.make.group();
    range(MAX_INPUT_PILE).forEach(index => {
      let { input } = this._data;
      let inputKeys = Object.keys(input);
      let inputItem = new ResourcePile(this.game, inputKeys[index], true);
      inputItem.x = this.table.x + 20 + index * 40;
      inputItem.y = index * 10;
      if (inputKeys[index]) {
        inputItem.setNum(formatBigNum(input[inputKeys[index]].amount));
      } else {
        inputItem.setNum(0);
      }
      inputItem.visible = Boolean(inputKeys[index]);
      this.inputItemGroup.add(inputItem);
    });

    let { output } = this._data;
    this.outputItems = new ResourcePile(this.game, output);
    this.outputItems.alignIn(this.table, window.Phaser.TOP_CENTER);

    this.inputItemsAni = new ResourceEmitter(
      this.game,
      this.table.x + 50,
      this.table.y + 50,
      Object.keys(this._data.input).map(item => SourceImg.get(item)),
      100,
      0
    );

    this.outputItemsAni = new ResourceEmitter(
      this.game,
      this.table.x + this.table.width / 2,
      this.table.y + this.table.height / 2 - 30,
      SourceImg.get(this._data.output),
      -120,
      100
    );

    this.boxCollect = new BoxCollect(this.game);
    let { collectType, outputAmount } = this._data;
    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));

    this.boxHolderProd = this.game.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderProd.alignTo(this.table, window.Phaser.BOTTOM_LEFT, -20, -5);
    this.boxHolderProd.inputEnabled = true;
    this.boxHolderProd.input.priorityID = PRIORITY_ID;
    this.boxHolderProd.events.onInputUp.add((target, pointer, isOver) => {
      if (!isOver) return false;
      this.setCollectType.bind(this, COLLECT_TYPES.PROD)();
      console.log('this.boxHolderProd', isOver);
    });

    this.outputGiveAni = new ResourceEmitter(
      this.game,
      this.boxHolderProd.x,
      this.boxHolderProd.y,
      SourceImg.get(this._data.output),
      -100,
      -30
    );

    this.boxHolderCash = this.game.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderCash.alignTo(this.table, window.Phaser.BOTTOM_RIGHT, -20, -5);
    this.boxHolderCash.inputEnabled = true;
    this.boxHolderCash.input.priorityID = PRIORITY_ID;
    this.boxHolderCash.events.onInputUp.add((target, pointer, isOver) => {
      if (!isOver) return false;
      this.setCollectType.bind(this, COLLECT_TYPES.CASH)();
      console.log('this.boxHolderCash', isOver);
    });

    this.upBtn = new BtnUpgrade(this.game, 0, 0, 'workstation');
    this.upBtn.alignIn(this.table, window.Phaser.BOTTOM_CENTER, 0, 30);
    this.upBtn.onClick((target, pointer, isOver) => {
      console.log('点击工作台升级按钮');
      if (isOver) {
        this.workestationLevelModal = new ModalLevel({
          game: this.game,
          type: 'workstation',
          currLevel: this.upBtn.getLevel(),
          coupledBtn: this.upBtn,
          workstation: this,
          close: 'destory'
        });
        this.workestationLevelModal.onDestroy.add(() => {
          this.workestationLevelModal = null;
        });
        this.workestationLevelModal.visible = true;
      }
    });
  };

  _drawWorkerManager = () => {
    this.worker = new Worker(this.game, 0, 0);
    this.worker.alignTo(this.table, window.Phaser.TOP_CENTER, 20, -10);
    this.worker.visible = false;

    this.manager = this.game.make.sprite(0, 0, 'mgr_worker');
    this.manager.alignIn(this.table, window.Phaser.TOP_LEFT, -15, 100);
    this.manager.visible = false;
  };

  _addProductionStuffs = () => {
    this.productGroup.add(this.productBtn);
    this.productGroup.add(this.productBtnItem);
    this.productGroup.add(this.inputItemGroup);
    this.productGroup.add(this.outputItems);
    this.productGroup.add(this.inputItemsAni);
    this.productGroup.add(this.outputItemsAni);
    this.productGroup.add(this.boxHolderProd);
    this.productGroup.add(this.boxHolderCash);
    this.productGroup.add(this.boxCollect);
    this.productGroup.add(this.outputGiveAni);
    this.productGroup.add(this.upBtn);
    this.productGroup.visible = false;
  };

  _addTheRest = () => {
    this.add(this.manager);
    this.add(this.worker);
    this.add(this.productGroup);
  };

  _init() {
    this.setCollectType(COLLECT_TYPES.CASH);
  }

  _outputLoop() {
    if (this._getHasNoInput()) {
      this.stopWork();
      return false;
    }
    let {
      collectType,
      input,
      producePerMin,
      output,
      outputAmount,
      outputDelay
    } = this._data;

    if (collectType === COLLECT_TYPES.CASH) {
      this._data.outputAmount[collectType] = outputAmount[collectType].plus(
        producePerMin
          .div(Big(A_MINUTE / outputDelay))
          .times(OUTPUT_PRODUCE_MAP[output])
          .times(Production.getPriceByKey(output))
      );
    } else {
      this._data.outputAmount[collectType] = outputAmount[collectType].plus(
        producePerMin
          .div(Big(A_MINUTE / outputDelay))
          .times(OUTPUT_PRODUCE_MAP[output])
      );
    }

    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));

    let inputKeys = Object.keys(this._data.input);
    this._data.input = inputKeys
      .map(key => {
        let nextAmount = input[key].amount.minus(
          producePerMin.div(Big(A_MINUTE / outputDelay))
        );
        if (nextAmount.lt(0)) {
          nextAmount = Big(0);
        }
        return {
          key,
          amount: nextAmount,
          amountHu: nextAmount.toString()
        };
      })
      .reduce((map, item) => {
        let { key, amount, amountHu } = item;
        map[key] = {
          amount,
          amountHu
        };
        return map;
      }, {});
    this.inputItemGroup.forEach(item => {
      let index = this.inputItemGroup.getChildIndex(item);
      if (inputKeys[index]) {
        item.setNum(formatBigNum(this._data.input[inputKeys[index]].amount));
      } else {
        item.setNum(0);
      }
    });
    return true;
  }

  _getHasNoInput() {
    let { input, output } = this._data;

    let inputAmt = Object.keys(
      pick(input, OUTPUT_INPUT_INFO[output].inputList)
    ).map(key => {
      return input[key].amount;
    });

    return inputAmt.some(amount => {
      return amount.lte(0);
    });
  }

  getSaveInfo() {
    return {
      isLocked: this._data.isLocked,
      isBought: this._data.isBought,
      input: this._data.input,
      output: this._data.output,
      outputAmount: this._data.outputAmount,
      producePerMin: this._data.producePerMin,
      outputDelay: this._data.outputDelay, // ???
      collectType: this._data.collectType
    };
  }

  restoreFromSaveInfo(info) {
    this._data.isLocked = info.isLocked;
    this._data.isBought = info.isBought;
    this._data.input = info.input;
    this._data.output = info.output;
    this._data.outputAmount = info.outputAmount;
    this._data.producePerMin = info.producePerMin;
    this._data.outputDelay = info.outputDelay;
    this._data.collectType = info.collectType;

    if (!this._data.isLocked) {
      this.beAbleToBuy();
    }

    if (this._data.isBought) {
      this._drawProductProduceStuffs();
      this._drawWorkerManager();
      this._addProductionStuffs();
      this._addTheRest();

      this.setCollectType(this._data.collectType);

      this.buyBtnGroup.visible = false;
      this.tableCover.visible = false;

      this.manager.visible = true;
      this.worker.visible = true;
      this.productGroup.visible = true;

      if (!this._getHasNoInput()) {
        this.startWork();
      }
    }
  }

  // public methods
  beAbleToBuy() {
    this._data.isLocked = false;
    this.buyBtnGroup.visible = true;
  }

  updateCashBtnTexture(currCash) {
    if (currCash.gte(this._data.price.cash)) {
      if (this.buyBtnCash.key !== 'btn_buy_ws_cash') {
        this.buyBtnCash.loadTexture('btn_buy_ws_cash');
      }
    } else {
      if (this.buyBtnCash.key !== 'btn_buy_ws_cash_disable') {
        this.buyBtnCash.loadTexture('btn_buy_ws_cash_disable');
      }
    }
  }

  onValidateBuy(func, context) {
    this._onValidateBuyFunc = func;
    this._onValidateBuyContext = context;
  }

  onAfterBuy(func, context) {
    this._onAfterBuyFunc = func;
    this._onAfterBuyContext = context;
  }

  buy(type) {
    // 计算消耗金币
    console.log('this buy: ', type);
    // 在桌子被购买时候才去render以下objects
    this._drawProductProduceStuffs();
    this._drawWorkerManager();
    this._addProductionStuffs();
    this._addTheRest();
    this._init();

    let priceOfType = this._data.price[type];
    let canBuy = this._onValidateBuyFunc.call(
      this._onValidateBuyContext,
      type,
      priceOfType
    );
    if (!canBuy) {
      return;
    }
    this._data.isBought = true;

    this.buyBtnGroup.visible = false;
    this.tableCover.visible = false;

    this.manager.visible = true;
    this.worker.visible = true;
    this.productGroup.visible = true;

    if (this._onAfterBuyFunc) {
      this._onAfterBuyFunc.call(this._onAfterBuyContext, type, priceOfType);
    }
    if (this._data.index !== 0) {
      this.state.updateIdleCash();
    }
  }

  setPrice({ cash, superCash }) {
    this._data.price = {
      cash,
      superCash
    };
    this.buyBtnCashText.setText(formatBigNum(cash));
    this.buyBtnSuperCashText.setText(formatBigNum(superCash));
  }

  getIndex() {
    return this._data.index;
  }

  setIndex(index) {
    this._data.index = index;
  }

  setProducePerMin = value => {
    // console.log('producePerMin set!', value);
    this._data.producePerMin = Big(value);
    this.state.updateIdleCash();
  };

  getProducePerMin = () => {
    return this._data.producePerMin;
  };

  getIsLocked() {
    return this._data.isLocked;
  }

  getIsBought() {
    return this._data.isBought;
  }

  getIsWorking() {
    return this._data.isWorking;
  }

  getOutputKey() {
    return this._data.output;
  }

  getHasProdOutput() {
    let isProdType = this.getCollectType() === COLLECT_TYPES.PROD;
    let hasProd = this.getProdOutput().gt(0);
    return isProdType && hasProd;
  }

  getHasCashOutput() {
    let isCashType = this.getCollectType() === COLLECT_TYPES.CASH;
    let hasCash = this.getCashOutput().gt(0);
    return isCashType && hasCash;
  }

  getProdOutput() {
    return this._data.outputAmount.prod;
  }

  getCashOutput() {
    return this._data.outputAmount.cash;
  }

  startWork() {
    this._data.isWorking = true;
    if (this.outputTimer) {
      this.game.time.events.remove(this.outputTimer);
    }
    this.inputItemsAni && this.inputItemsAni.start();
    this.outputItemsAni.start();
    if (this.getCollectType() === COLLECT_TYPES.PROD) {
      this.outputItemsAni.setXSpeed(-120, -120);
    } else {
      this.outputItemsAni.setXSpeed(120, 120);
    }

    if (this._data.outputDelay === INIT_OUTPUT_DELAY) {
      this.worker.work();
    } else {
      this.worker.multipleSpeed(3);
    }

    this.outputTimer = this.game.time.events.loop(
      this._data.outputDelay,
      this._outputLoop,
      this
    );
  }

  stopWork() {
    this._data.isWorking = false;
    this.inputItemsAni.stop();
    this.outputItemsAni.stop();
    this.worker.stop();
    if (this.outputTimer) {
      this.game.time.events.remove(this.outputTimer);
    }
  }

  takeFromWorker(amountMap) {
    let { input } = this._data;
    // update _data;
    Object.keys(amountMap).forEach(key => {
      input[key].amount = input[key].amount.plus(amountMap[key].amount);
      input[key].amountHu = input[key].amount.toString();
    });

    // update visual
    Object.keys(input).forEach(key => {
      this.inputItemGroup.forEach(inItem => {
        if (inItem.getKey() === key) {
          inItem.setNum(formatBigNum(input[key].amount));
        }
      });
    });

    if (!this.getIsWorking() && !this._getHasNoInput()) {
      this.startWork();
    }
  }

  giveToWorker(amount) {
    this.outputGiveAni.start();
    let { outputAmount } = this._data;
    outputAmount.prod = outputAmount.prod.minus(amount);
  }

  giveToWorkerLoading(stayDuration) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.outputGiveAni.stop();
        let { outputAmount, collectType } = this._data;
        this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));
        resolve();
      }, stayDuration);
    });
  }

  giveToWorkerMarket(amount) {
    let { outputAmount, collectType } = this._data;
    outputAmount.cash = outputAmount.cash.minus(amount);
    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));
  }

  getCollectType() {
    return this._data.collectType;
  }

  setCollectType(collectType) {
    this._data.collectType = collectType;
    let { outputAmount } = this._data;
    this.boxCollect.setNum(formatBigNum(outputAmount[collectType]));
    if (collectType === COLLECT_TYPES.CASH) {
      this.boxCollect.alignIn(this.boxHolderCash, window.Phaser.CENTER, 0, -5);
      this.boxHolderCash.frame = 1;
      this.boxHolderProd.frame = 0;
      if (!this._getHasNoInput()) {
        this.inputItemsAni.start();
        this.outputItemsAni.setXSpeed(120, 120);
      } else {
        this.outputItemsAni.stop();
      }
    } else if (collectType === COLLECT_TYPES.PROD) {
      this.boxCollect.alignIn(this.boxHolderProd, window.Phaser.CENTER, 0, -5);
      this.boxHolderProd.frame = 1;
      this.boxHolderCash.frame = 0;
      if (!this._getHasNoInput()) {
        this.inputItemsAni.start();
        this.outputItemsAni.setXSpeed(-120, -120);
      } else {
        this.outputItemsAni.stop();
      }
    }
  }

  setLevel(level) {
    this._data.level = level;
    // this.levelText.setText(level);
  }

  getLevel() {
    return this._data.level;
  }

  getInput() {
    return this._data.input;
  }

  getInputKeys() {
    let { input } = this._data;
    // return Object.keys(input);
    // console.log('xx', pick(input, ['ore']));
    return Object.keys(
      pick(input, OUTPUT_INPUT_INFO[this._data.output].inputList)
    );
  }

  setOutput(outputKey) {
    if (outputKey === this._data.output) {
      return;
    }
    this._data.output = outputKey;
    this._data.outputAmount.prod = Big(0);

    let nextInitInput = getInitInput(this._data.output);
    Object.keys(nextInitInput).forEach(key => {
      // only merge new keys
      if (!this._data.input[key]) {
        this._data.input[key] = nextInitInput[key];
      }
    });

    let outputTexture = SourceImg.get(outputKey);
    this.outputItems.changeTexture(outputKey);
    this.outputItemsAni.changeTexture(outputTexture);
    this.outputGiveAni.changeTexture(outputTexture);

    this.productBtnItem.loadTexture('material', outputTexture);

    let { input } = this._data;
    let inputKeys = OUTPUT_INPUT_INFO[this._data.output].inputList;
    this.inputItemGroup.forEach(inItem => {
      let index = this.inputItemGroup.getChildIndex(inItem);
      if (inputKeys[index]) {
        inItem.changeTexture(inputKeys[index]);
        inItem.setNum(formatBigNum(input[inputKeys[index]].amount));
        inItem.visible = true;
      } else {
        inItem.setNum(0);
        inItem.visible = false;
      }
    });

    let inputTexture = inputKeys.map(item => SourceImg.get(item));
    this.inputItemsAni.changeTexture(inputTexture);
  }

  // 刷新产品材质
  updateTexture() {
    this.inputItemGroup.forEach(item => {
      if (item.visible) {
        item.updateTexture();
      }
    });

    this.outputItems.updateTexture();

    let inputTextureKeys = Object.keys(this._data.input).map(item =>
      SourceImg.get(item)
    );
    this.inputItemsAni.changeTexture(inputTextureKeys);

    let outputTextureKey = SourceImg.get(this._data.output);
    this.outputItemsAni.changeTexture(outputTextureKey);
    this.outputGiveAni.changeTexture(outputTextureKey);

    this.productBtnItem.loadTexture('material', outputTextureKey);
  }

  multipleSpeed(times) {
    this._data.outputDelay = this._data.outputDelay / times;
    if (this._data.isBought) {
      this.startWork();
    }
  }

  resetSpeed() {
    this._data.outputDelay = INIT_OUTPUT_DELAY;
    if (this._data.isBought) {
      this.startWork();
    }
  }
}

export default Workstation;
