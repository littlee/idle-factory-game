import ModalRaw from './ModalRaw.js';
import LevelUpgradeItem from './LevelUpgradeItem.js';
import PanelUpgrade from './PanelUpgrade.js';

import {LevelMap} from './puedoLevelMap.js';

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
    avatarDes: '等级时获得巨大生产力的提升',
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

/*
key:
heading是变动的，具体等级数字需要显示在外部等级btn上。
【思路一：点击时候，吧btn上面的等级传入，在关闭panel的时候，传出等级重写btn的text】
【思路二：btn上的text和heading的等级text用同一个state下的属性，然后在state的update函数中，一直去重设这两个text】
组件要进行再一次的封装，减少实例化时候的传入值。
updatePanel有bug
同时需要点击updatePanel btn的时候，items需要作出相应的变化。
确定升级按钮需要有grey out的状态，实例需要实时拿到当前的总金额【如何实现？】
*/

// 这里默认都给children boost priority到1001，所以scroll的input是听不到的。这里不需要滑动，所以没关系。
class ModalLevel extends ModalRaw {
  constructor({
    game,
    scrollable,
    opts,
    type = 'market',
    coupledBtn = null,
    currLevel = null,
    desLevel = null,
    workstation = null,
  }) {
    super(game, undefined, undefined, scrollable);
    this.state = this.game.state.states[this.game.state.current];

    this.MAP = LevelMap[type];

    this.opts = type === 'market' ? CONFIG.opts_m : type === 'warehouse' ? CONFIG.opts_wh : CONFIG.opts_ws;
    this.headingPart =
      type === 'market'
        ? '级市场'
        : type === 'warehouse'
          ? '级仓库'
          : '级生产线';
    this.coupledBtn = coupledBtn;
    // specific to workstation level UI, for fetching needed(input) & production(output)
    this.workstation = workstation;
    this.workstationNeed = null; // 希望是可以从this.workstation拿到一个array
    this.workstationProduction = null; // 同上
    this.workstationNum = null;

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
  }


  _overwriteHeadingTxt = () => {
    this.heading.setText(this._data.currLevel + this.headingPart, true);
  }

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
    this.avatarDesTxt.alignTo(this.avatarDesBg, Phaser.Phaser.TOP_LEFT, 0, -28);

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

    this.upgradePanel = new PanelUpgrade({
      game: this.game,
      parent: this.contentGroup,
      veilHeight: this.h - this.headingH,
      modal: this
    });

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
        panelUpgradeInstance: this.upgradePanel
      });
    } else {
      // workstation要根据生产台的生产改变need和production的UI，而且need的数量会有变化，都未实现。
      this.needTxt = this.game.make.text((this.w - LEVEL.aWidth) / 2, 290, '需要', getFontStyle('30px'));
      this.need1 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_ore', // 改，下同
        txt: '铁矿',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 330,
        levelType: this._data.type,
        itemName: 'prodNeeded',
        panelUpgradeInstance: this.upgradePanel
      });
      this.need2 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_ore',
        txt: '铁矿',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 330 + 85 + 17,
        levelType: this._data.type,
        itemName: 'prodNeeded',
        panelUpgradeInstance: this.upgradePanel
      });


      this.prodTxt = this.game.make.text((this.w - LEVEL.aWidth) / 2, 330 + 85 * 2 + 44, '生产', getFontStyle('30px'));
      this.prod = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_ore',
        txt: '铁矿',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 330 + 44 + 40 + 85 * 2,
        levelType: this._data.type,
        itemName: 'prodProduced',
        panelUpgradeInstance: this.upgradePanel
      });
      this.iconPower = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_power',
        txt: '生产力',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 330 + 44 + 40 + 85 * 3 + 20,
        levelType: this._data.type,
        itemName: 'power',
        panelUpgradeInstance: this.upgradePanel
      });
      this.mainGroup.addChild(this.needTxt);
      this.mainGroup.addChild(this.prodTxt);
    }

    this.contentGroup.addChild(this.avatarBg);
    this.contentGroup.addChild(this.avatarGroup);
    this.contentGroup.addChild(this.mainGroup);
  }

  // 点击level升级之后所有要处理的更新
  handleUpgradation = (upgraded = false) => {
    let type = this._data.type;
    this.coupledBtn.setLevel(this._data.currLevel);
    this.heading.setText(this._data.currLevel + this.headingPart, true);
    // ****dev****
    if (this._data.currLevel > Object.keys(this.MAP).length) return false;
    // ****dev****
    // 传递当前等级信息给外面workers, market || workstation || warehouse
    let opts = Object.assign({}, this.MAP['level'+ this._data.currLevel]);
    // 是否加人, 相对上次升级
    let prevOpts = this.MAP['level'+ this.prevLevel];
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
  }

  // 点击 x1 x10 ... btns时候, 需要一起更新的东西【需要的coin数值不归在这里更新】
  handleLevelBtnsChoosing = (upgraded) => {
    let multiplier = this.upgradePanel.getMultiplier();
    let furtureOpts = this.MAP['level'+ (this._data.currLevel + multiplier)];
    let diffs = this._getDiffOpts4LevelBtns(furtureOpts, this.MAP['level' + this._data.currLevel]);
    console.log('now diff: ', diffs);
    if (this._data.type === 'market' || this._data.type === 'warehouse') {
      // update item的描述数据
      this.item1.getDesUpdated(diffs, upgraded);
      this.item2.getDesUpdated(diffs,upgraded);
      this.item3.getDesUpdated(diffs,upgraded);
      this.item4.getDesUpdated(diffs,upgraded);
      this.item5.getDesUpdated(diffs,upgraded);
      // update upgradeBtn的UI 根据currCoin
      this.upgradePanel.updateLevelUpgradeBtnUI();
    } else if (this._data.type === 'workstation') {
      // 未对接到MAP
      this.need1.getDesUpdated(upgraded);
      this.need2.getDesUpdated(upgraded);
      this.prod.getDesUpdated(upgraded);
      this.iconPower.getDesUpdated(upgraded);

      this.upgradePanel.updateLevelUpgradeBtnUI();
    }
  }

  _getDiffOpts4LevelBtns = (furtureOpts, currOpts) => {
    let keys = Object.keys(currOpts);
    let tmp = {};
    keys.forEach((item) => {
      tmp[item] = furtureOpts[item] - currOpts[item];
    });

    return tmp;
  }

  getUpdated = (currCoin) => {
    try {
      this.upgradePanel.updateLevelUpgradeBtnUI(currCoin);
      return true;
    } catch (ex) {
      console.log('game state update() err');
      console.log(ex);
      return false;
    }
  }

  getLevelType = () => {
    return this._data.type;
  }

  getCurrLevel = () => {
    return this._data.currLevel;
  }

  getData = () => {
    return this._data;
  }

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
      info.iconPower = this.iconPower.getData();;
      info.prod = this.prod.getData();
      info.upgradePanel = this.upgradePanel.getData();
    }
    return info;
  }

  setCurrLevel = (level) => {
    this.prevLevel = this._data.currLevel;
    this._data.currLevel += level;
  }
}

export default ModalLevel;
