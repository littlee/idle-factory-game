import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';

import { bellRedInfo } from '../js/config.js';

import ModalRaw from './ModalRaw.js';

const CONFIG = {
  modalHeight: 1095,
  modalWidth: 610,
  headingH: 40,
  headingTxt: '',
  bgColor: 0xb88a80,
  bgWidth: 567,
  bgHeight: 437,
  redTip: '在90秒内，每个\n人的工作速度快3倍',
  yellowTip: '在90秒内，总的\n销售额会提升3倍'
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize || '24px',
    fill: color || '#ffb500', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}

const SKILL_PRICE_MAP = {
  red: {
    bought1: {
      coinNeeded: '100'
    },
    bought2: {
      coinNeeded: '200'
    },
    bought3: {
      coinNeeded: '300'
    },
    bought4: {
      coinNeeded: '400'
    },
    bought5: {
      coinNeeded: '500'
    },
    bought6: {
      coinNeeded: '600'
    }
  },
  yellow: {}
};

const BELL_LEVEL_MAP = {
  red: {
    level1: 1,
    level2: 1,
    level3: 1,
    level4: 1,
    level5: 1,
    level6: 1
  },
  yellow: {
    level1: 1,
    level2: 1,
    level3: 2,
    level4: 2,
    level5: 3,
    level6: 3
  }
};

// 如果变成close-destroy, bell的level, boughtCount, point都要存着, 存了。
// 这里还没去测试阈值的情况， 测了红色的。
class ModalSkills extends ModalRaw {
  constructor({
    game,
    headingH = CONFIG.headingH,
    headingTxt = CONFIG.headingTxt,
    height = CONFIG.modalHeight,
    width = CONFIG.modalWidth,
    close
  }) {
    super(
      game,
      headingTxt,
      height,
      width,
      undefined,
      undefined,
      undefined,
      headingH,
      undefined,
      undefined,
      undefined,
      close
    );

    this.state = this.game.state.states[this.game.state.current];
    // curr upgraded level, 需要可以被初始化到指定的级数，对应的bell也是要可以实现对应的初始化
    this.levelRed = bellRedInfo.level;
    this.levelYellow = 1;
    this.boughtRedCount = bellRedInfo.boughtCount;
    // skills point bought but haven't used
    this.pointRed = bellRedInfo.point;
    this.pointYellow = 0;
    // coinNeeded to buy
    this.coin4BellRed = SKILL_PRICE_MAP.red[`bought${this.boughtRedCount}`] ? SKILL_PRICE_MAP.red[`bought${this.boughtRedCount}`].coinNeeded : 0;
    this.coin4BellYellow = 0;
    this.point4BellRed = BELL_LEVEL_MAP.red[`level${this.levelRed}`] ? BELL_LEVEL_MAP.red[`level${this.levelRed}`] : 0;
    this.point4BellYellow = BELL_LEVEL_MAP.yellow[`level${this.levelYellow}`];

    this._getInit();
    // 初始化buyBuySkill1, 和speedUpgradeBtn
    let currenCoin = this.state.getCurrCoin();
    this.updateBtnBuySkill1UI(currenCoin);
    this._updateSpeedUpgradeBtnUI();
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this._getContextGroupInit();

    this._prepAfterContentGroup();
  };

  _drawFrameBells = () => {
    // bell background-related
    this.bellGroup = this.game.make.group();

    let left = (this.w - CONFIG.bgWidth) / 2;
    this.bellFrame = this.game.make.graphics(0, 0);
    this.bellFrame.beginFill(CONFIG.bgColor);
    this.bellFrame.drawRect(left, 100, CONFIG.bgWidth, CONFIG.bgHeight);
    this.bellFrame.endFill();

    this.bellHeading = this.game.make.image(
      this.w / 2,
      50,
      'bell_panel_heading'
    );
    this.bellHeading.anchor.setTo(0.5, 0);

    this.bellBg0 = this.game.make.image(0, 0, 'bg_bell');
    this.bellBg0.alignTo(this.bellHeading, Phaser.BOTTOM_CENTER, 140, 30);

    this.bellBg1 = this.game.make.image(0, 0, 'bg_bell');
    this.bellBg1.alignTo(this.bellHeading, Phaser.BOTTOM_CENTER, -140, 30);

    // two bells
    this.redBell = this.game.make.image(0, 0, 'bell_red_whole');
    this.redBell.alignTo(this.bellBg1, Phaser.TOP_CENTER, 0, -153);
    this.redLevelTxt = this.game.make.text(
      0,
      0,
      `${this.levelRed}级`,
      getFontStyle()
    );
    this.redLevelTxt.setTextBounds(0, 0, 85, 34);
    this.redLevelTxt.alignTo(this.redBell, Phaser.BOTTOM_LEFT, -20, -42);

    this.yellowBell = this.game.make.image(0, 0, 'bell_yellow_whole');
    this.yellowBell.alignTo(this.bellBg0, Phaser.TOP_CENTER, 0, -153);
    this.yellowLevelTxt = this.game.make.text(
      0,
      0,
      `${this.levelYellow}级`,
      getFontStyle()
    );
    this.yellowLevelTxt.setTextBounds(0, 0, 85, 34);
    this.yellowLevelTxt.alignTo(this.yellowBell, Phaser.BOTTOM_LEFT, -20, -42);

    // two tip txt 217*60
    this.redTipTxt = this.game.make.text(
      0,
      0,
      CONFIG.redTip,
      getFontStyle('22px', '#9a3010')
    );
    this.redTipTxt.setTextBounds(0, 0, 217, 60);
    this.redTipTxt.alignTo(this.redBell, Phaser.BOTTOM_LEFT, 43, 10);

    this.yellowTipTxt = this.game.make.text(
      0,
      0,
      CONFIG.yellowTip,
      getFontStyle('22px', '#9a3010')
    );
    this.yellowTipTxt.setTextBounds(0, 0, 217, 60);
    this.yellowTipTxt.alignTo(this.yellowBell, Phaser.BOTTOM_LEFT, 43, 10);

    // speed upgrade
    this.speedUpgradeBtn = this.game.make.image(0, 0, 'btn_skill_upgrade_able'); // 'btn_skill_upgrade_disable'
    this.speedUpgradeBtn.alignTo(this.redTipTxt, Phaser.BOTTOM_CENTER, 12, 5);

    this.redPointTxt = this.game.make.text(
      0,
      0,
      this.point4BellRed,
      getFontStyle('26px')
    );
    this.redPointTxt.alignTo(this.speedUpgradeBtn, Phaser.RIGHT_TOP, -65, -6);
    this.speedUpgradeBtn.events.onInputDown.add(this._handleBtnSpeedUpgradeClick);
    this.redPointTxt.events.onInputDown.add(this._handleBtnSpeedUpgradeClick);

    // sale upgrade
    this.saleUpgradeBtn = this.game.make.image(0, 0, 'btn_sale_upgrade_disable'); // 'btn_sale_upgrade_disable btn_sale_upgrade_able'
    this.saleUpgradeBtn.alignTo(this.yellowTipTxt, Phaser.BOTTOM_CENTER, 22, 5);

    this.yellowPointTxt = this.game.make.text(
      0,
      0,
      this.point4BellYellow,
      getFontStyle('26px')
    );
    this.yellowPointTxt.alignTo(this.saleUpgradeBtn, Phaser.RIGHT_TOP, -65, -6);

    // bellGroup
    this.bellGroup.addChild(this.bellFrame);
    this.bellGroup.addChild(this.bellHeading);
    this.bellGroup.addChild(this.bellBg0);
    this.bellGroup.addChild(this.bellBg1);
    this.bellGroup.addChild(this.redBell);
    this.bellGroup.addChild(this.redLevelTxt);
    this.bellGroup.addChild(this.redTipTxt);
    this.bellGroup.addChild(this.yellowBell);
    this.bellGroup.addChild(this.yellowLevelTxt);
    this.bellGroup.addChild(this.yellowTipTxt);
    this.bellGroup.addChild(this.speedUpgradeBtn);
    this.bellGroup.addChild(this.redPointTxt);
    this.bellGroup.addChild(this.saleUpgradeBtn);
    this.bellGroup.addChild(this.yellowPointTxt);

    // contentGroup
    this.contentGroup.addChild(this.bellGroup);
  };

  _drawFrameSkill = () => {
    this.skillGroup = this.game.make.group();
    this.skillGroup.alignTo(this.bellGroup, Phaser.BOTTOM_LEFT);

    let left = (this.w - CONFIG.bgWidth) / 2;
    this.skillFrame = this.game.make.graphics(0, 0);
    this.skillFrame.beginFill(CONFIG.bgColor);
    this.skillFrame.drawRect(0, 80, CONFIG.bgWidth, CONFIG.bgHeight);
    this.skillFrame.endFill();

    this.skillHeading = this.game.make.image(
      this.w / 2 - left,
      30,
      'skill_panel_heading'
    );
    this.skillHeading.anchor.setTo(0.5, 0);

    this.skillBg0 = this.game.make.image(0, 0, 'bg_skill');
    this.skillBg0.alignTo(this.skillHeading, Phaser.BOTTOM_CENTER, 140, 30);

    this.skillBg1 = this.game.make.image(0, 0, 'bg_skill');
    this.skillBg1.alignTo(this.skillHeading, Phaser.BOTTOM_CENTER, -140, 30);

    // two skill count panel
    this.panelSkillCount1 = this.game.make.image(0, 0, 'panel_skill_counts');
    this.panelSkillCount1.alignTo(this.skillBg1, Phaser.TOP_CENTER, 0, -33);
    this.skillCountTxt1 = this.game.make.text(
      0,
      0,
      this.pointRed,
      getFontStyle()
    );
    this.skillCountTxt1.alignTo(
      this.panelSkillCount1,
      Phaser.BOTTOM_CENTER,
      0,
      -33
    );

    this.panelSkillCount2 = this.game.make.image(0, 0, 'panel_skill_counts');
    this.panelSkillCount2.alignTo(this.skillBg0, Phaser.TOP_CENTER, 0, -33);
    this.skillCountTxt2 = this.game.make.text(
      0,
      0,
      this.pointYellow,
      getFontStyle()
    );
    this.skillCountTxt2.alignTo(
      this.panelSkillCount2,
      Phaser.BOTTOM_CENTER,
      0,
      -33
    );

    // two skill icons
    this.iconFactory1 = this.game.make.image(0, 0, 'icon_skill_factory1');
    this.iconFactory1.alignTo(this.skillBg1, Phaser.TOP_CENTER, 0, -223);

    this.iconFactory2 = this.game.make.image(0, 0, 'icon_skill_factory2');
    this.iconFactory2.alignTo(this.skillBg0, Phaser.TOP_CENTER, 0, -223);

    // buy-able btn & disable btn
    this.btnBuySkill1 = this.game.make.image(0, 0, 'btn_skill_buy_able'); // 'btn_skill_buy_disable'
    this.btnBuySkill1.alignTo(this.iconFactory1, Phaser.BOTTOM_LEFT, -7, 10);
    this.btnBuySkill1.events.onInputDown.add(this._handleBtnBuySkillClick);

    // coin value need to be Big-gified
    this.coin4RedTxt = this.game.make.text(
      0,
      0,
      formatBigNum(this.coin4BellRed),
      getFontStyle()
    );
    this.coin4RedTxt.alignTo(this.btnBuySkill1, Phaser.RIGHT_TOP, -90, -6);
    this.coin4RedTxt.events.onInputDown.add(this._handleBtnBuySkillClick);

    this.btnBuySkill2 = this.game.make.image(0, 0, 'btn_skill_buy_disable'); // 'btn_skill_buy_able btn_skill_buy_disable'
    this.btnBuySkill2.alignTo(this.iconFactory2, Phaser.BOTTOM_LEFT, -7, 10);

    // coin value need to be Big-gified
    this.coin4YellowTxt = this.game.make.text(
      0,
      0,
      formatBigNum(this.coin4BellYellow),
      getFontStyle()
    );
    this.coin4YellowTxt.alignTo(this.btnBuySkill2, Phaser.RIGHT_TOP, -90, -6);

    this.skillGroup.addChild(this.skillFrame);
    this.skillGroup.addChild(this.skillHeading);
    this.skillGroup.addChild(this.skillBg0);
    this.skillGroup.addChild(this.skillBg1);
    this.skillGroup.addChild(this.panelSkillCount1);
    this.skillGroup.addChild(this.panelSkillCount2);
    this.skillGroup.addChild(this.skillCountTxt1);
    this.skillGroup.addChild(this.skillCountTxt2);
    this.skillGroup.addChild(this.iconFactory1);
    this.skillGroup.addChild(this.iconFactory2);
    this.skillGroup.addChild(this.btnBuySkill1);
    this.skillGroup.addChild(this.btnBuySkill2);
    this.skillGroup.addChild(this.coin4RedTxt);
    this.skillGroup.addChild(this.coin4YellowTxt);

    // contentGroup
    this.contentGroup.addChild(this.skillGroup);
  };

  _getContextGroupInit = () => {
    // 这里因为没有heading, 所以内容不需要有offset
    this._drawFrameBells();
    this._drawFrameSkill();
  };

  _updateBtnBuySkill1Value = () => {
    if (this.boughtRedCount > Object.keys(SKILL_PRICE_MAP.red).length) {
      this.coin4BellRed = 0;
    } else {
      this.coin4BellRed = SKILL_PRICE_MAP.red[`bought${this.boughtRedCount}`].coinNeeded;
    }
    this.coin4RedTxt.setText(formatBigNum(this.coin4BellRed), true);
    this.state.subtractCash(0);
  }

  _updateSpeedUpgradeBtnUI = () => {
    if (this.pointRed >= this.point4BellRed && this.levelRed <= Object.keys(BELL_LEVEL_MAP.red).length) {
      this.speedUpgradeBtn.loadTexture('btn_skill_upgrade_able');
    } else {
      this.speedUpgradeBtn.loadTexture('btn_skill_upgrade_disable');
    }
  }

  _buySkillRed = () => {
    // 相关技能点数目增加
    this.pointRed += 1;
    bellRedInfo.point += 1;
    this.boughtRedCount += 1; // key!!!
    bellRedInfo.boughtCount += 1;
    this.skillCountTxt1.setText(this.pointRed);
    // 更新够不够点去升级铃铃
    this._updateSpeedUpgradeBtnUI();
    // btnCash的值减少
    this.state.subtractCash(this.coin4BellRed);
    this._updateBtnBuySkill1Value();
  }

  _handleBtnSpeedUpgradeClick = () => {
    if (this.speedUpgradeBtn.key === 'btn_skill_upgrade_disable') return false;
    console.log('红铃铃升级');
    // point要减少点数，外部的bell的数字增加，自身的UI变，btnUI也要变
    this.pointRed -= this.point4BellRed;
    bellRedInfo.point -= this.point4BellRed;
    this.skillCountTxt1.setText(this.pointRed);
    this.levelRed += 1;
    bellRedInfo.level += 1;
    this.redLevelTxt.setText(`${this.levelRed}级`);
    // 更新下一次升级需要的点书
    if (this.levelRed <= Object.keys(BELL_LEVEL_MAP.red).length ) {
      this.point4BellRed = BELL_LEVEL_MAP.red[`level${this.levelRed}`];
    } else {
      this.point4BellRed = 0;
    }
    this.redPointTxt.setText(this.point4BellRed);
    this._updateSpeedUpgradeBtnUI();
    // 接增加红色铃铃的方法
    this.state.upgradeBellRed();
  }

  _handleBtnBuySkillClick = () => {
    if (this.btnBuySkill1.key === 'btn_skill_buy_disable') return false;
    console.log('买舵舵');
    this._buySkillRed();
  }

  // 只是update bellRed部分
  updateBtnBuySkill1UI = (currCoin) => {
    if (currCoin.lt(this.coin4BellRed) || this.boughtRedCount > 6) {
      this.btnBuySkill1.loadTexture('btn_skill_buy_disable');
    } else {
      this.btnBuySkill1.loadTexture('btn_skill_buy_able');
    }
  }
}

export default ModalSkills;
