import Big from '../js/libs/big.min';

import ModalRaw from './ModalRaw.js';
import LevelUpgradeItem from './LevelUpgradeItem.js';
import PanelUpgrade from './PanelUpgrade.js';

import { LevelMap } from './puedoLevelMap.js';
import range from '../js/libs/_/range';

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

// 这里默认都给children boost priority到1001，所以scroll的input是听不到的。这里不需要滑动，所以没关系。
// 根据初始化弹窗拿到的当前等级数，来初始化弹窗内item的curr和futrue显示，外加升级btn的数额和颜色。
class ModalLevel extends ModalRaw {
  constructor({
    game,
    scrollable,
    opts,
    type = 'market',
    coupledBtn = null,
    currLevel = null,
    desLevel = null,
    workstation = null
  }) {
    super(game, undefined, undefined, scrollable);
    this.state = this.game.state.states[this.game.state.current];

    this.MAP = LevelMap[type];

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
      currLevel: currLevel === null ? INIT.currLevel : currLevel,
      desLevel: desLevel === null ? INIT.desLevel : desLevel
    };
    this.prevLevel = this._data.currLevel;

    this._getInit();
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
    this.avatarDesBg.drawRect(0, 0, 339, 30);
    this.avatarDesBg.endFill();
    this.avatarDesBg.alignTo(this.avatarHeading, Phaser.BOTTOM_LEFT, 0, 10);
    this.avatarDesTxt = this.game.make.text(
      0,
      0,
      `将在${this._data.desLevel}${this.opts.avatarDes}`,
      getFontStyle('18px', 'white')
    );
    this.avatarDesTxt.setTextBounds(0, 0, 339, 30); // 同上
    this.avatarDesTxt.alignTo(this.avatarDesBg, Phaser.Phaser.TOP_LEFT, 0, -30);

    this.avatarBar = this.game.make.graphics(0, 0);
    this.avatarBar.beginFill(0x3a0a00, 0.8);
    this.avatarBar.drawRect(0, 0, 339, 30);
    this.avatarBar.endFill();
    this.avatarBar.alignTo(this.avatarHeading, Phaser.BOTTOM_LEFT, 0, 70);

    this.avatarBarGained = this.game.make.graphics(0, 0);
    this.avatarBarGained.beginFill(0x38ec43, 1);
    this.avatarBarGained.drawRect(0, 0, 139, 30);
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
        // value: '',
        // increment: '',
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
        key: 'reso_ore', // 改，下同
        txt: '铁矿',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 330,
        levelType: this._data.type,
        itemName: 'input',
        value: initOpts.input,
        increment: initDiffs.input,
        panelUpgradeInstance: this.upgradePanel
      });
      this.need2 = new LevelUpgradeItem({
        game: this.game,
        parent: this.needGroup, // this.mainGroup,
        key: 'reso_plug',
        txt: '铁矿',
        levelType: this._data.type,
        itemName: 'input',
        value: initOpts.input,
        increment: initDiffs.input,
        panelUpgradeInstance: this.upgradePanel
      });
      this.need2.alignTo(this.need1, Phaser.BOTTOM_LEFT, 0, 20);
      this.needGroup.addChild(this.needTxt);
      this.needGroup.addChild(this.need1);
      this.needGroup.addChild(this.need2);

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
        txt: '铁矿',
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
  _getDiffOpts4LevelBtns = (furtureOpts, currOpts) => {
    let keys = Object.keys(currOpts);
    let tmp = {};
    keys.forEach(item => {
      if (item === 'coinNeeded') {
        tmp[item] = Big(furtureOpts[item]);
      } else {
        tmp[item] = Big(furtureOpts[item]).minus(Big(currOpts[item]));
      }
    });
    return tmp;
  };

  // 应该整合下不同level的item值，这里定义了4个item的。
  _getAllItemsInitOpts = () => {
    // let opts;
    // if (this._data.type === 'warehouse') {
    //   opts = Object.assign({}, this._getCurrLevelInfoFromMap(), {'maxTransported': '10000'});
    // } else if (this._data.type === 'market') {
    //   opts = Object.assign({}, this._getCurrLevelInfoFromMap(), {'maxTransported': '10000'});
    // }
    // return opts;
    return this._getCurrLevelInfoFromMap();
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
    if (targetLevel > maxLength) {
      console.log(
        '_getCustomizedLevelInfoFromMap() 返回的是map中的最大level信息',
        this._data.currLevel + upCount
      );
      return this.MAP['level' + maxLength];
    } else {
      return this.MAP['level' + targetLevel];
    }
  };

  // 点击level升级btn之后所有要处理的更新
  handleUpgradation = (upgraded = false) => {
    let type = this._data.type;
    this.coupledBtn.setLevel(this._data.currLevel);
    this.heading.setText(this._data.currLevel + this.headingPart, true);
    // ****dev****
    if (this._data.currLevel > Object.keys(this.MAP).length) return false;
    // ****dev****
    // 传递当前等级信息给外面workers, market || workstation || warehouse
    let opts = Object.assign({}, this.MAP['level' + this._data.currLevel]);
    // 是否加人, 相对上次升级
    let prevOpts = this.MAP['level' + this.prevLevel];
    let addHC = opts.count - prevOpts.count;
    if (type === 'warehouse') {
      this.state.updateWarehouseWorkersInfoAndHC(opts, addHC);
    } else if (type === 'market') {
      this.state.updateMarketWorkersInfoAndHC(opts, addHC);
    } else if (type === 'workstation') {
      // ....
    }
    // this.avatarDesTxt.setText();
    this.handleLevelBtnsChoosing(upgraded);
  };

  // 点击 x1 x10 ... btns时候, 需要一起更新的东西【需要的coin数值不归在这里更新】
  handleLevelBtnsChoosing = upgraded => {
    let multiplier = this.upgradePanel.getMultiplier();

    // ****dev****
    if (Object.is(multiplier, NaN)) {
      console.log('handleLevelBtnsChoosing 选中max，不反应');
      return false;
    }
    // ****dev****
    let currOpts = this._getCurrLevelInfoFromMap();
    let furtureOpts = this._getCustomizedLevelInfoFromMap(multiplier);
    let fartherOpts = this._getCustomizedLevelInfoFromMap(multiplier * 2);

    let diffs = this._getDiffOpts4LevelBtns(furtureOpts, currOpts);
    let furtherDiffs = this._getDiffOpts4LevelBtns(fartherOpts, furtureOpts);

    if (this._data.type === 'market' || this._data.type === 'warehouse') {
      // update item的描述数据
      range(5).forEach(item => {
        this[`item${item+1}`].getDesUpdated(diffs, furtherDiffs, upgraded);
      });
      // update upgradeBtn的UI 根据currCoin
      this.upgradePanel.updateCoinNeeded4Upgrade(diffs, furtherDiffs, upgraded);
      this.upgradePanel.updateLevelUpgradeBtnUI();
    } else if (this._data.type === 'workstation') {
      // 未对接到MAP, fixme
      this.need1.getDesUpdated(diffs, furtherDiffs, upgraded);
      if (this.need2 !== null) {
        this.need2.getDesUpdated(diffs, furtherDiffs, upgraded);
      }
      this.prod.getDesUpdated(diffs, furtherDiffs, upgraded);
      this.iconPower.getDesUpdated(diffs, furtherDiffs, upgraded);
      this.upgradePanel.updateCoinNeeded4Upgrade(diffs, furtherDiffs, upgraded);
      this.upgradePanel.updateLevelUpgradeBtnUI();
    }
  };

  getUpdated = currCoin => {
    try {
      this.upgradePanel.updateLevelUpgradeBtnUI(currCoin);
      return true;
    } catch (ex) {
      console.log('game state update() err');
      console.log(ex);
      return false;
    }
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

  // untested
  getInfo2Stored = () => {
    // 如果是warehouse || market, 要存的是，当前的1）级数，2）箭头那里的级数，3）5个item中各自的数额，4）x1时候要升级的coin数目
    let info = null;
    if (this._data.type === 'market' || this._data.type === 'warehouse') {
      info = Object.assign({}, this._data);
      info.item1 = this.item1.getData();
      info.item2 = this.item2.getData();
      info.item3 = this.item3.getData();
      info.item4 = this.item4.getData();
      info.item5 = this.item5.getData();
      info.upgradePanel = this.upgradePanel.getData();
    } else if (this._data.type === 'workstation') {
      info = Object.assign({}, this._data);
      info.workstationNum = null; // unassigned
      info.need1 = this.need1.getData();
      info.need2 = this.need2.getData();
      info.iconPower = this.iconPower.getData();
      info.prod = this.prod.getData();
      info.upgradePanel = this.upgradePanel.getData();
    }
    return info;
  };

  setCurrLevel = level => {
    this.prevLevel = this._data.currLevel;
    this._data.currLevel += level;
  };
}

export default ModalLevel;
