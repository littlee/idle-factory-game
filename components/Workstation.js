import { formatBigNum } from '../utils';
import Big from '../js/libs/big.min';
import range from '../js/libs/_/range';

// import ModalLevel from './ModalLevel';
import Worker from './Worker';
import BtnUpgrade from './BtnUpgrade';
import ResourceEmitter from './ResourceEmitter';
import ResourecePile from './ResourcePile';
import BoxCollect from './BoxCollect';

const MAX_INPUT_PILE = 2;

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

const SOURCE_IMG_MAP = {
  ore: 'reso_ore',
  steel: 'prod_steel',
  can: 'prod_can',
  drill: 'prod_drill',
  toaster: 'prod_toaster'
};

class Workstation extends window.Phaser.Group {
  constructor(game, x, y, stationLevel = 1, index = 1) {
    super(game);
    this.x = x;
    this.y = y;

    this._data = {
      input: OUTPUT_REQ_MAP['steel'],
      inputAmount: [123, 456],
      output: 'steel',
      outputAmount: {
        cash: 789,
        prod: 999
      },
      price: {
        cash: 123,
        superCash: 456
      },
      level: 1,
      collectType: 'cash'
    };

    this.ground = this.game.make.image(0, 0, `ground_level_${stationLevel}`);

    this.groundNum = this.game.make.text(0, 0, `${index}`, GROUND_NUM_STYLE);
    this.groundNum.alignIn(this.ground, window.Phaser.LEFT_CENTER, -70, -30);

    this.table = this.game.make.image(0, 0, `table_level_${stationLevel}`);
    this.table.alignIn(this.ground, window.Phaser.TOP_CENTER);

    this.tableCover = this.game.make.sprite(0, 0, 'table_cover');
    this.tableCover.alignIn(this.table, window.Phaser.TOP_LEFT, 5, 0);
    this.tableCover.visible = false;

    // 购买按钮
    this.buyBtnGroup = this.game.make.group();

    this.buyBtnSuperCash = this.game.make.sprite(0, 0, 'btn_buy_ws_super_cash');
    this.buyBtnSuperCash.alignIn(this.table, window.Phaser.TOP_LEFT, -5, -5);
    this.buyBtnSuperCash.inputEnabled = true;
    this.buyBtnSuperCash.input.priorityID = PRIORITY_ID;
    this.buyBtnSuperCash.events.onInputDown.add(() => {
      console.log('点击超级现金购买');
    });

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
    this.buyBtnCash.events.onInputDown.add(() => {
      console.log('点击现金购买');
    });

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
      this.setOutput('drill');
    });
    this.productBtnItem = this.game.make.sprite(0, 0, SOURCE_IMG_MAP[this._data.output]);
    this.productBtnItem.alignIn(this.productBtn, window.Phaser.CENTER, 0, -5);

    // FIX ME 需要考虑一个变成两个的情况
    this.inputItemGroup = this.game.make.group();
    range(2).forEach(index => {
      let { input } = this._data;
      let inputItem = new ResourecePile(
        this.game,
        'reso_ore',
        true
      );
      inputItem.x = this.table.x + 20 + index * 40;
      inputItem.y = index * 10;
      inputItem.setNum(formatBigNum(Big(this._data.inputAmount[index])));
      this.inputItemGroup.add(inputItem);
    });
    // this._data.input.forEach((inputKey, index) => {
    //   let inputItem = new ResourecePile(
    //     this.game,
    //     SOURCE_IMG_MAP[inputKey],
    //     true
    //   );
    //   inputItem.x = this.table.x + 20 + index * 40;
    //   inputItem.y = index * 10;
    //   inputItem.setNum(formatBigNum(Big(this._data.inputAmount[index])));
    //   this.inputItemGroup.add(inputItem);
    // });

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
    this.inputItemsAni.start();

    this.outputItemsAniLeft = new ResourceEmitter(
      this.game,
      this.table.x + this.table.width / 2 - 30,
      this.table.y + this.table.height / 2 - 20,
      'prod_steel',
      -100,
      100
    );

    this.outputItemsAniRight = new ResourceEmitter(
      this.game,
      this.table.x + this.table.width / 2 + 30,
      this.table.y + this.table.height / 2 - 20,
      'prod_steel',
      100,
      100
    );

    this.productGroup.add(this.productBtn);
    this.productGroup.add(this.productBtnItem);
    this.productGroup.add(this.inputItemGroup);
    this.productGroup.add(this.outputItems);
    this.productGroup.add(this.inputItemsAni);
    this.productGroup.add(this.outputItemsAniLeft);
    this.productGroup.add(this.outputItemsAniRight);

    this.worker = new Worker(this.game, 0, 0);
    this.worker.alignTo(this.table, window.Phaser.TOP_CENTER, 20, -10);
    this.worker.work();

    this.manager = this.game.make.sprite(0, 0, 'mgr_worker');
    this.manager.alignIn(this.table, window.Phaser.TOP_LEFT, -15, 100);

    this.boxCollect = new BoxCollect(this.game);
    let { collectType, outputAmount } = this._data;
    this.boxCollect.setNum(formatBigNum(Big(outputAmount[collectType])));

    this.boxHolderProd = this.game.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderProd.alignTo(this.table, window.Phaser.BOTTOM_LEFT, -20, -5);
    this.boxHolderProd.inputEnabled = true;
    this.boxHolderProd.input.priorityID = PRIORITY_ID;
    this.boxHolderProd.events.onInputDown.add(
      this.setCollectType.bind(this, COLLECT_TYPES.PROD)
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

    this.add(this.boxHolderProd);
    this.add(this.boxHolderCash);
    this.add(this.boxCollect);

    this.add(this.upBtn);

    this._init();
  }

  _init() {
    this.setCollectType(COLLECT_TYPES.CASH);
  }

  // public methods
  setCollectType(collectType) {
    this._data.collectType = collectType;
    if (collectType === COLLECT_TYPES.CASH) {
      this.boxCollect.alignIn(this.boxHolderCash, window.Phaser.CENTER, 0, -5);
      this.boxHolderCash.frame = 1;
      this.boxHolderProd.frame = 0;
      this.outputItemsAniLeft.stop();
      this.outputItemsAniRight.start();
    } else if (collectType === COLLECT_TYPES.PROD) {
      this.boxCollect.alignIn(this.boxHolderProd, window.Phaser.CENTER, 0, -5);
      this.boxHolderProd.frame = 1;
      this.boxHolderCash.frame = 0;
      this.outputItemsAniLeft.start();
      this.outputItemsAniRight.stop();
    }
  }

  setLevel(level) {
    this._data.level = level;
    this.levelText.setText(level);
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

    this.productBtnItem.loadTexture(outputTexture);

    let inputTexture = this._data.input.map(item => SOURCE_IMG_MAP[item]);
    this.inputItemGroup.forEach((item) => {
      let index = this.inputItemGroup.getChildIndex(item);
      item.changeTexture(inputTexture[index]);
    });
    this.inputItemsAni.changeTexture(inputTexture);
    
  }

  setOutputAmount(amout) {

  }

  setInputAmount(amount) {

  }

  getData() {
    return this._data;
  }
}

export default Workstation;
