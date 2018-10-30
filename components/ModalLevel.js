import Big from '../js/libs/big.min';

import ModalRaw from './ModalRaw.js';
import LevelUpgradeItem from './LevelUpgradeItem.js';
import PanelUpgrade from './PanelUpgrade.js';

import { LevelMap } from './puedoLevelMap.js';
import range from '../js/libs/_/range';
import { CN_NAME_MAP } from '../js/config.js';

const LEVEL = {
  aWidth: 537,
  aHeight: 178,
  desHeight: 85
};

const INIT = {
  currLevel: 1,
  desLevel: 10
};

const CONFIG = {
  frame_rgb: 0xe1d6cc,
  frame_line_width: 1,
  frame_line_color: 0x000000,
  frame_line_alpha: 0.7,
  avatarBar_height: 30,
  opts_wh: {
    avatarImg: 'avatar_tran_warehose',
    avatarHeading: '下一次大升级',
    avatarDes: '等级时获得额外的运输工人',
    item1Icon: 'icon_max_resource',
    item1Des: '已运输最大资源'
  },
  opts_m: {
    avatarImg: 'avatar_tran_market',
    avatarHeading: '下一次大升级',
    avatarDes: '等级时获得额外的运输工人',
    item1Icon: 'icon_money_transported',
    item1Des: '已运输最高现金'
  },
  opts_ws: {
    avatarImg: 'avatar_worker',
    avatarHeading: '下一次大升级',
    avatarDes: '等级时获得巨大生产力的提升'
  }
};

// all Big 一分钟每个market || warehouse worker的最大运输现金
function getMaxTransportedSpeed(allTime, transCapacity) {
  return Big(60)
    .div(allTime)
    .times(transCapacity); // eslint-disable-line
}

// 单位是s
function getMrtWorkerTimePerRound(
  workstationCount,
  transCapacity,
  loadSpeed,
  walkSpeed
) {
  let loadingTime = Big(transCapacity)
    .div(Big(loadSpeed))
    .times(2);
  let walkTime = Big(workstationCount)
    .div(Big(walkSpeed))
    .times(2);
  return loadingTime.plus(walkTime);
}

// 单位是s
function getWhsWorkerTimePerRound(
  workstationCount,
  transCapacity,
  loadSpeed,
  walkSpeed
) {
  let loadingTime = Big(transCapacity)
    .div(Big(loadSpeed))
    .times(workstationCount + 1);
  let walkTime = Big(workstationCount)
    .div(Big(walkSpeed))
    .times(2);
  return loadingTime.plus(walkTime);
}

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize,
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

function getValidImgKey(name) {
  let resoList = ['ore', 'copper', 'barrel', 'plug', 'aluminium', 'rubber'];
  return resoList.indexOf(name) > -1 ? `reso_${name}` : `prod_${name}`;
}

/*
这里默认都给children boost priority到1001，所以scroll的input是听不到的。这里不需要滑动，所以没关系。
根据初始化弹窗拿到的当前等级数，来初始化弹窗内item的curr和futrue显示，外加升级btn的数额和颜色。
*/
class ModalLevel extends ModalRaw {
  constructor({
    game,
    opts,
    type = 'market',
    coupledBtn = null,
    currLevel = null,
    desLevel = null,
    workstation = null,
    close
  }) {
    super(
      game,
      undefined,
      undefined,
      undefined,
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

    this.MAP = LevelMap[type];
    this.maxAvailableLevel = null;
    this.levelIncrement = 1;
    this.barFullWidth = 339;

    this.opts =
      type === 'market'
        ? CONFIG.opts_m
        : type === 'warehouse'
          ? CONFIG.opts_wh
          : CONFIG.opts_ws;
    this.headingPart =
      type === 'market'
        ? '级市场'
        : type === 'warehouse'
          ? '级仓库'
          : '级生产线';
    this.coupledBtn = coupledBtn;
    // specific to workstation level UI, for fetching needed(input) & production(output)
    this.workstation = workstation;
    this.workstationInput = null; // 希望是可以从this.workstation拿到一个array
    this.workstationOutput = null; // 同上

    this._data = {
      type,
      currLevel:
        currLevel === null
          ? type === 'workstation'
            ? this.coupledBtn.getLevel()
            : INIT.currLevel
          : currLevel,
      desLevel: null
    };
    this.prevLevel = this._data.currLevel;

    this._getInit();
    this._updateAvatarGainedBar();
    // mimic the init data prep as with warehouse and market, since they are done by GameState automatically
    if (this._data.type === 'workstation') {
      let currCoin = this.state.getCurrCoin();
      this.getCoinRelatedStuffsUpdated(currCoin);
    }
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this._overwriteHeadingTxt();
    this.getContextGroupInit();

    this._prepAfterContentGroup();
  };

  _overwriteHeadingTxt = () => {
    this.heading.setText(this._data.currLevel + this.headingPart, true);
  };

  getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;
    this.avatarBg = this.game.make.graphics(
      (this.w - LEVEL.aWidth) / 2,
      OFFSET
    ); // graphics( [x] [, y] )
    this.avatarBg.beginFill(0x000000, 0.1);
    this.avatarBg.drawRect(0, 0, LEVEL.aWidth, LEVEL.aHeight);
    this.avatarBg.endFill();

    this.avatarGroup = this.game.add.group(this.avatarBg);
    this.avatar = this.game.make.image(40, 110, this.opts.avatarImg);
    this.avatarHeading = this.game.make.text(
      60 + this.avatar.width,
      120,
      this.opts.avatarHeading,
      getFontStyle('24px')
    );
    this.avatarDesBg = this.game.make.graphics(0, 0);
    this.avatarDesBg.beginFill(0x000000, 0.1);
    this.avatarDesBg.drawRect(0, 0, this.barFullWidth, CONFIG.avatarBar_height);
    this.avatarDesBg.endFill();
    this.avatarDesBg.alignTo(this.avatarHeading, Phaser.BOTTOM_LEFT, 0, 10);
    // 拿到初始化boostLevel的值
    this._data.desLevel = this._getCurrBoostLevelThreshold();
    this.avatarDesTxt = this.game.make.text(
      0,
      0,
      `将在 ${this._data.desLevel} ${this.opts.avatarDes}`,
      getFontStyle('18px', 'white')
    );
    this.avatarDesTxt.setTextBounds(0, 0, 339, 30); // 同上
    this.avatarDesTxt.alignTo(this.avatarDesBg, Phaser.TOP_LEFT, 0, -30);

    this.avatarBar = this.game.make.graphics(0, 0);
    this.avatarBar.beginFill(0x3a0a00, 0.8);
    this.avatarBar.drawRect(0, 0, this.barFullWidth, CONFIG.avatarBar_height);
    this.avatarBar.endFill();
    this.avatarBar.alignTo(this.avatarHeading, Phaser.BOTTOM_LEFT, 0, 70);

    this.avatarBarGained = this.game.make.graphics(0, 0);
    this.avatarBarGained.beginFill(0x38ec43, 1);
    this.avatarBarGained.drawRect(
      0,
      0,
      this.barFullWidth,
      CONFIG.avatarBar_height
    );
    this.avatarBarGained.endFill();
    this.avatarBarGained.alignTo(this.avatarHeading, Phaser.BOTTOM_LEFT, 0, 70);

    this.avatarArrow = this.game.make.image(0, 0, 'arrow_levelUp');
    this.avatarArrow.alignIn(this.avatarBarGained, Phaser.BOTTOM_LEFT, 10);

    this.avatarGroup.addChild(this.avatar);
    this.avatarGroup.addChild(this.avatarHeading);
    this.avatarGroup.addChild(this.avatarDesBg);
    this.avatarGroup.addChild(this.avatarDesTxt);
    this.avatarGroup.addChild(this.avatarBar);
    this.avatarGroup.addChild(this.avatarBarGained);
    this.avatarGroup.addChild(this.avatarArrow);

    this.mainGroup = this.game.add.group();

    // 确定初始化显示数额
    let initCoinNeeded = this._getCustomizedLevelInfoFromMap(1).coinNeeded;
    this.upgradePanel = new PanelUpgrade({
      game: this.game,
      parent: this.contentGroup,
      veilHeight: this.h - this.headingH,
      modal: this,
      coinNeeded: initCoinNeeded
    });

    // 确定初始化显示数额
    let initOpts = this._getAllItemsInitOpts();
    let initFutureOpts = this._getCustomizedLevelInfoFromMap(1);
    let initDiffs = this._getDiffOpts4LevelBtns(initFutureOpts, initOpts);
    if (this._data.type === 'market' || this._data.type === 'warehouse') {
      let initMaxDiff = this._getMaxTransportedDiff(
        initFutureOpts,
        initOpts.maxTransported
      );
      // gap 17
      this.item1 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: this.opts.item1Icon,
        txt: this.opts.item1Des,
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290,
        levelType: this._data.type,
        itemName: 'maxTransported',
        value: initOpts.maxTransported,
        increment: initMaxDiff,
        panelUpgradeInstance: this.upgradePanel
      });
      this.item2 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_transporter',
        txt: '运输工',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 + 17,
        levelType: this._data.type,
        itemName: 'count',
        value: initOpts.count,
        increment: initDiffs.count,
        panelUpgradeInstance: this.upgradePanel
      });

      this.item3 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_transporter_capacity',
        txt: '运输工能力',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 * 2 + 17 * 2,
        levelType: this._data.type,
        itemName: 'capacity',
        value: initOpts.capacity,
        increment: initDiffs.capacity,
        panelUpgradeInstance: this.upgradePanel
      });

      this.item4 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_loading_speed',
        txt: '运输工载运能力',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 * 3 + 17 * 3,
        levelType: this._data.type,
        itemName: 'loadingSpeed',
        value: initOpts.loadingSpeed,
        increment: initDiffs.loadingSpeed,
        panelUpgradeInstance: this.upgradePanel
      });

      this.item5 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_walk_speed',
        txt: '运输工行走速度',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 * 4 + 17 * 4,
        levelType: this._data.type,
        itemName: 'walkSpeed',
        value: initOpts.walkSpeed,
        increment: initDiffs.walkSpeed,
        panelUpgradeInstance: this.upgradePanel
      });
    } else {
      // 确定input数量，确定input + output，下面拿到的是最core的值，但是完整的image的key,即有无prefix, prod是不是已经升级了还无法得知；外加item对应的txt也需要被map出来
      this.workstationOutput = [this.workstation.getOutputKey()];
      this.workstationInput = this.workstation.getInputKeys();

      this.needGroup = this.game.make.group();

      this.needTxt = this.game.make.text(
        (this.w - LEVEL.aWidth) / 2,
        290,
        '需要',
        getFontStyle('30px')
      );
      this.need1 = new LevelUpgradeItem({
        game: this.game,
        parent: this.needGroup, //this.mainGroup,
        key: getValidImgKey(this.workstationInput[0]), // 改，下同
        txt: CN_NAME_MAP[this.workstationInput[0]],
        x: (this.w - LEVEL.aWidth) / 2,
        y: 330,
        levelType: this._data.type,
        itemName: 'input',
        value: initOpts.input,
        increment: initDiffs.input,
        panelUpgradeInstance: this.upgradePanel
      });
      this.need2 = null;

      if (this.workstationInput.length === 2) {
        this.need2 = new LevelUpgradeItem({
          game: this.game,
          parent: this.needGroup, // this.mainGroup,
          key: getValidImgKey(this.workstationInput[1]),
          txt: CN_NAME_MAP[this.workstationInput[1]],
          levelType: this._data.type,
          itemName: 'input',
          value: initOpts.input,
          increment: initDiffs.input,
          panelUpgradeInstance: this.upgradePanel
        });
        this.need2.alignTo(this.need1, Phaser.BOTTOM_LEFT, 0, 20);
      }

      this.needGroup.addChild(this.needTxt);
      this.needGroup.addChild(this.need1);
      if (this.workstationInput.length === 2) {
        this.needGroup.addChild(this.need2);
      }

      this.prodTxt = this.game.make.text(0, 0, '生产', getFontStyle('30px')); // 330 + 85 * 2 + 44
      this.prodTxt.alignTo(
        this.needGroup.children[this.needGroup.children.length - 1],
        Phaser.BOTTOM_LEFT,
        0,
        20
      );
      this.prod = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup, // this.mainGroup,
        key: `prod_${this.workstationOutput}`,
        txt: CN_NAME_MAP[this.workstationOutput],
        levelType: this._data.type,
        itemName: 'output',
        value: initOpts.output,
        increment: initDiffs.output,
        panelUpgradeInstance: this.upgradePanel
      });
      this.prod.alignTo(this.prodTxt, Phaser.BOTTOM_LEFT, 0, 0);

      this.iconPower = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup, // this.mainGroup,
        key: 'icon_power',
        txt: '生产力',
        levelType: this._data.type,
        itemName: 'power',
        value: initOpts.power,
        increment: initDiffs.power,
        panelUpgradeInstance: this.upgradePanel
      });
      this.iconPower.alignTo(this.prod, Phaser.BOTTOM_LEFT, 0, 20);

      this.mainGroup.addChild(this.needGroup);
      this.mainGroup.addChild(this.prodTxt);
    }

    this.contentGroup.addChild(this.avatarBg);
    this.contentGroup.addChild(this.avatarGroup);
    this.contentGroup.addChild(this.mainGroup);
  };

  // 算出选中升级每个item可以增加几多值，ALL Big
  _getDiffOpts4LevelBtns = (futureOpts, currOpts) => {
    let keys = Object.keys(currOpts);
    let tmp = {};
    keys.forEach(item => {
      if (item === 'coinNeeded') {
        tmp[item] =
          this.levelIncrement > 1
            ? this._getAccumulatedDiffs()
            : Big(futureOpts[item]);
      } else if (item !== 'maxTransported') {
        tmp[item] = Big(futureOpts[item]).minus(Big(currOpts[item]));
      }
    });
    return tmp;
  };

  // 升级跨度大于1才有必要去accumulate
  _getAccumulatedDiffs = () => {
    // 拿到中间跨度的data, 吧里头需要累加的东西，累加起来。其实只需要coinNeeded
    let arr = [];
    range(this.levelIncrement + 1).forEach(item => {
      let tmp = this._getCustomizedLevelInfoFromMap(item).coinNeeded;
      arr.push(Big(tmp)); // push进去的是string
    });

    let amassedCoinNeeded = arr.reduce((prev, curr) => {
      return prev.plus(curr);
    });
    return amassedCoinNeeded;
  };

  // 应该整合下不同level的item值，这里定义了4个item的。已经补充最后一个item
  _getAllItemsInitOpts = () => {
    let opts = Object.assign({}, this._getCurrLevelInfoFromMap());
    opts.maxTransported = this._getMaxTransportedValue(opts);
    return opts;
  };

  _getCurrLevelInfoFromMap = () => {
    let maxLength = Object.keys(this.MAP).length;
    if (this._data.currLevel > maxLength) {
      console.log('_getCurrLevelInfoFromMap() 返回的是map中的最大level信息');
      return this.MAP['level' + maxLength];
    } else {
      return this.MAP['level' + this._data.currLevel];
    }
  };

  _getCustomizedLevelInfoFromMap = upCount => {
    let maxLength = Object.keys(this.MAP).length;
    let targetLevel = this._data.currLevel + upCount;
    if (targetLevel < 1) {
      return this.MAP.level1;
    }
    if (targetLevel > maxLength) {
      return this.MAP['level' + maxLength];
    } else {
      return this.MAP['level' + targetLevel];
    }
  };

  _getLastBoostLevelThreshold = () => {
    let currCount = this._getCurrLevelInfoFromMap().count;
    let decrement = -1;
    let lastBoostLevel = null;

    while (
      this._getCustomizedLevelInfoFromMap(decrement).level > 1 &&
      this._getCustomizedLevelInfoFromMap(decrement).count === currCount
    ) {
      decrement -= 1;
    }

    lastBoostLevel = this._getCustomizedLevelInfoFromMap(decrement).level;
    lastBoostLevel = lastBoostLevel === 1 ? lastBoostLevel : lastBoostLevel + 1;
    return lastBoostLevel;
  };

  _getCurrBoostLevelThreshold = () => {
    let currCount = this._getCurrLevelInfoFromMap().count;
    let increment = 1;
    let currBoostLevel = null;

    while (
      this._getCustomizedLevelInfoFromMap(increment).level <
        Object.keys(this.MAP).length &&
      this._getCustomizedLevelInfoFromMap(increment).count === currCount
    ) {
      increment += 1;
    }

    currBoostLevel = this._getCustomizedLevelInfoFromMap(increment).level;
    // console.log('currBoostLevel: ', currBoostLevel);
    return currBoostLevel;
  };

  _getMaxLevelNowCanGet2 = currCoin => {
    let increment = 1;
    let futureOptCoin = this._getCustomizedLevelInfoFromMap(increment)
      .coinNeeded;
    let tmpBig = Big(futureOptCoin);

    while (
      currCoin.gt(tmpBig) &&
      this._data.currLevel + increment <= Object.keys(this.MAP).length
    ) {
      increment = increment + 1;
      futureOptCoin += this._getCustomizedLevelInfoFromMap(increment)
        .coinNeeded;
      tmpBig = Big(futureOptCoin);
    }
    // console.log('settled for curr vs needed: ', currCoin.valueOf(), tmpBig.minus(this._getCustomizedLevelInfoFromMap(increment).coinNeeded).valueOf());
    this.maxAvailableLevel =
      this._data.currLevel + increment > Object.keys(this.MAP).length
        ? Object.keys(this.MAP).length
        : this._data.currLevel + increment - 1;
    return this.maxAvailableLevel;
  };

  // 拿点击当时可以升级的值, 留住这个值，因为maxAvailableLevel的值是一直在变的
  _getLevelIncrement = () => {
    let devLength = Object.keys(this.MAP).length;
    let multiplier = this.upgradePanel.getMultiplier();
    if (Object.is(multiplier, NaN)) {
      // 和点击其他按钮为不同在于，x1之类的升级幅度由可视的multiplier直接拿到，max则是需要modal用自己的map和当前的coin来计算得出升级的差值。
      multiplier = this.maxAvailableLevel - this._data.currLevel;
    }
    if (this._data.currLevel >= devLength) {
      multiplier = 0;
    } else if (this._data.currLevel + multiplier > devLength) {
      multiplier = devLength - this._data.currLevel;
    }
    this.levelIncrement = multiplier;
    // console.log('multiplier: ', multiplier);
    return multiplier;
  };

  _handleWorkerAddingIfNeeded = () => {
    // 传递当前等级信息给外面workers, market || warehouse
    let opts = this._getCurrLevelInfoFromMap();
    // 是否加人, 相对上次升级
    let prevOpts = this._getCustomizedLevelInfoFromMap(
      this.prevLevel - this._data.currLevel
    );
    let addHC = opts.count - prevOpts.count;

    let type = this._data.type;
    if (type === 'warehouse') {
      this.state.updateWarehouseWorkersInfoAndHC(opts, addHC);
    } else if (type === 'market') {
      this.state.updateMarketWorkersInfoAndHC(opts, addHC);
    } else if (type === 'workstation') {
      // 不需要加人，所以不用做什么。。。
    }
  };

  _updateProducePerMin4Ws = () => {
    if (this._data.type !== 'workstation') return false;
    let value = this.MAP[`level${this._data.currLevel}`].output;
    this.workstation.setProducePerMin(value);
  };

  _UpdateAvatarDesLevel = () => {
    // 更新avatarDesTxt的值, 要有最新的currLevel的值
    this._data.desLevel = this._getCurrBoostLevelThreshold();
    this.avatarDesTxt.setText(
      `将在 ${this._data.desLevel} ${this.opts.avatarDes}`
    );
  };

  _updateAllItemsValues = () => {
    if (this._data.type === 'market' || this._data.type === 'warehouse') {
      // update item的描述数据
      // 'maxTransported'的值，在modal init以及btn-choosing的时候，就已经算好了值和存下了increment 这里直接相加更新，和其他item一样
      range(5).forEach(item => {
        this[`item${item + 1}`].updateItemValue();
      });
      if (this._data.type === 'market') {
        this._updateBtnIdleCash();
      }
    } else if (this._data.type === 'workstation') {
      this.need1.updateItemValue();
      if (this.need2 !== null) {
        this.need2.updateItemValue();
      }
      this.prod.updateItemValue();
      this.iconPower.updateItemValue();
    }
  };

  _updateBtnIdleCash() {
    this.state.updateIdleCash();
  }

  _getAcaleFactor4AvatarGainedBarWidth = () => {
    let lastEnd = this._getLastBoostLevelThreshold();
    let nowEnd = this._getCurrBoostLevelThreshold();
    let segmentCount = nowEnd - lastEnd;
    let scaleFactor = (this._data.currLevel - lastEnd) / segmentCount;
    return scaleFactor === 1 ? 0 : scaleFactor;
  };

  _updateAvatarGainedBar = () => {
    let scaleFactor = this._getAcaleFactor4AvatarGainedBarWidth();
    this.avatarBarGained.scale.x = scaleFactor;
  };

  // return a big
  _getMaxTransportedDiff = (futureOpts, currOpts) => {
    if (currOpts instanceof Big) {
      return this._getMaxTransportedValue(futureOpts).minus(currOpts);
    }
    return this._getMaxTransportedValue(futureOpts).minus(
      this._getMaxTransportedValue(currOpts)
    );
  };

  // 注意，这里的参数5是应该是curr active workstation count, 这里是hardcoded to 5
  _getMaxTransportedValue = opts => {
    if (this._data.type === 'market') {
      let allTime = getMrtWorkerTimePerRound(
        5,
        opts.capacity,
        opts.loadingSpeed,
        opts.walkSpeed
      );
      return getMaxTransportedSpeed(allTime, opts.capacity);
    } else if (this._data.type === 'warehouse') {
      let allTime = getWhsWorkerTimePerRound(
        5,
        opts.capacity,
        opts.loadingSpeed,
        opts.walkSpeed
      );
      return getMaxTransportedSpeed(allTime, opts.capacity);
    }
  };

  /*
  点击level升级btn之后所有要处理的更新，在点击这里之前，一定是点过x1 || max的按钮，即，itemDes本身就是显示前期available level up的信息
  */
  handleUpgradation = () => {
    this._updateAllItemsValues();
    // all set, we are good to update value of currLevel
    let levelIncrement = this.levelIncrement;
    this.setCurrLevel(levelIncrement);
    // set correct heading
    this.coupledBtn.setLevel(this._data.currLevel);
    this.heading.setText(this._data.currLevel + this.headingPart, true);
    // set correct avatar desLevel
    this._UpdateAvatarDesLevel();

    // update workers info, check whether to add worker or not
    this._handleWorkerAddingIfNeeded();
    // increase the ProducePerMin for workstation
    this._updateProducePerMin4Ws();
    // pay the bill
    let coinNeeded = this.upgradePanel.getCoinNeeded();
    this.state.subtractCash(coinNeeded);
    // 再根据已经更新的升级数更新modal的item
    this.handleLevelBtnsChoosing();
    this._updateAvatarGainedBar();
  };

  // 点击 x1 x10 ... btns时候, 需要一起更新的东西【需要的coin数值不归在这里更新】这里对可升级数<点击按钮multiplier数的时候的处理和箭头的处理是不一样的。
  handleLevelBtnsChoosing = () => {
    // 拿到最新的点击升级数 || 可升级数， 可为0
    let levelIncrement = this._getLevelIncrement();
    if (
      levelIncrement === 0 &&
      this._data.currLevel < Object.keys(this.MAP).length
    ) {
      // 这个出现在点击max之后，不够升级1级时候，做升级1级处理
      levelIncrement = 1;
      console.log('完全不够升级，但是级数没到阈值，做x1处理');
    } else if (
      levelIncrement === 0 &&
      this._data.currLevel >= Object.keys(this.MAP).length
    ) {
      console.log('levelIncrement为0，cause以及达到最大级数');
    }

    let currOpts = this._getCurrLevelInfoFromMap();
    let futureOpts = this._getCustomizedLevelInfoFromMap(levelIncrement);
    let diffs = this._getDiffOpts4LevelBtns(futureOpts, currOpts);

    if (levelIncrement === 0) {
      diffs.coinNeeded = Big(0); // 当当前级数已经>=配置表给出数目时
    }

    if (this._data.type === 'market' || this._data.type === 'warehouse') {
      // update item的描述数据
      // dev-ing start 先都写死工作台的数量是5个
      let MaxTransportedDiff = this._getMaxTransportedDiff(
        futureOpts,
        currOpts
      );
      diffs.maxTransported = MaxTransportedDiff;
      range(5).forEach(item => {
        this[`item${item + 1}`].getDesUpdated(diffs);
      });
      // dev-ing end
    } else if (this._data.type === 'workstation') {
      this.need1.getDesUpdated(diffs);
      if (this.need2 !== null) {
        this.need2.getDesUpdated(diffs);
      }
      this.prod.getDesUpdated(diffs);
      this.iconPower.getDesUpdated(diffs);
    }
    this.upgradePanel.updateCoinNeeded4Upgrade(diffs.coinNeeded, diffs.level);
    this.upgradePanel.updateLevelUpgradeBtnUI();
  };

  // 更新和coin value相关的东西only
  getCoinRelatedStuffsUpdated = currCoin => {
    this._getMaxLevelNowCanGet2(currCoin);
    this.upgradePanel.updateLevelUpgradeBtnUI(currCoin);
  };

  getLevelType = () => {
    return this._data.type;
  };

  getCurrLevel = () => {
    return this._data.currLevel;
  };

  getData = () => {
    return this._data;
  };

  getLevelIncrement = () => {
    return this.levelIncrement;
  };

  // 拿到个big
  getMarketWorkerNumber = () => {
    return this.item2.getValue();
  };

  // 拿到个big
  getMarketMaxTransported = () => {
    if (this._data.type === 'market') {
      return this.item1.getValue();
    }
  };

  setCurrLevel = level => {
    this.prevLevel = this._data.currLevel;
    this._data.currLevel += level;
    if (this.type !== 'workstation') return false;
    this.workstation.setLevel(this._data.currLevel);
  };
}

export default ModalLevel;
