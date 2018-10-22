import Big from '../js/libs/big.min';

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
  yellowTip: '在90秒内，总的\n销售额会提升3倍',
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

class ModalSkills extends ModalRaw {
  constructor({
    game,
    headingH = CONFIG.headingH,
    headingTxt = CONFIG.headingTxt,
    height = CONFIG.modalHeight,
    width = CONFIG.modalWidth
  }) {
    super(game, headingTxt, height, width, undefined, undefined, undefined, headingH);
    this.levelRed = 0;
    this.levelYellow = 0;
    this.pointRed = 0;
    this.pointYellow = 0;
    this.coin4BellRed = 0;
    this.coin4BellYellow = 0;

    this._getInit();
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();

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

    this.bellHeading = this.game.make.image(this.w / 2, 50, 'bell_panel_heading');
    this.bellHeading.anchor.setTo(0.5, 0);

    this.bellBg0 = this.game.make.image(0, 0, 'bg_bell');
    this.bellBg0.alignTo(this.bellHeading, Phaser.BOTTOM_CENTER, 140, 30);

    this.bellBg1 = this.game.make.image(0, 0, 'bg_bell');
    this.bellBg1.alignTo(this.bellHeading, Phaser.BOTTOM_CENTER, -140, 30);

    // two bells
    this.redBell = this.game.make.image(0, 0, 'bell_red_whole');
    this.redBell.alignTo(this.bellBg1, Phaser.TOP_CENTER, 0, -153);
    this.redLevelTxt = this.game.make.text(0, 0, `${this.levelRed}级`, getFontStyle());
    this.redLevelTxt.setTextBounds(0, 0, 85, 34);
    this.redLevelTxt.alignTo(this.redBell, Phaser.BOTTOM_LEFT, -20, -42);

    this.yellowBell = this.game.make.image(0, 0, 'bell_yellow_whole');
    this.yellowBell.alignTo(this.bellBg0, Phaser.TOP_CENTER, 0, -153);
    this.yellowLevelTxt = this.game.make.text(0, 0, `${this.levelYellow}级`, getFontStyle());
    this.yellowLevelTxt.setTextBounds(0, 0, 85, 34);
    this.yellowLevelTxt.alignTo(this.yellowBell, Phaser.BOTTOM_LEFT, -20, -42);

    // two tip txt 217*60
    this.redTipTxt = this.game.make.text(0, 0, CONFIG.redTip, getFontStyle('22px', '#9a3010'));
    this.redTipTxt.setTextBounds(0, 0, 217, 60);
    this.redTipTxt.alignTo(this.redBell, Phaser.BOTTOM_LEFT, 43, 10);

    this.yellowTipTxt = this.game.make.text(0, 0, CONFIG.yellowTip, getFontStyle('22px', '#9a3010'));
    this.yellowTipTxt.setTextBounds(0, 0, 217, 60);
    this.yellowTipTxt.alignTo(this.yellowBell, Phaser.BOTTOM_LEFT, 43, 10);

    // speed upgrade
    this.speedUpgradeAbleBtn = this.game.make.image(0, 0, 'btn_skill_upgrade_able');
    this.speedUpgradeAbleBtn.alignTo(this.redTipTxt, Phaser.BOTTOM_CENTER, 12, 5);
    this.speedUpgradeAbleBtn.visible = false;

    this.speedUpgradeDisableBtn = this.game.make.image(0, 0, 'btn_skill_upgrade_disable');
    this.speedUpgradeDisableBtn.alignTo(this.redTipTxt, Phaser.BOTTOM_CENTER, 12, 5);
    // this.speedUpgradeDisableBtn.visible = false;

    this.redPointTxt = this.game.make.text(0, 0, this.pointRed, getFontStyle('26px'));
    this.redPointTxt.alignTo(this.speedUpgradeAbleBtn, Phaser.RIGHT_TOP, -65, -6);

    // sale upgrade
    this.saleUpgradeAbleBtn = this.game.make.image(0, 0, 'btn_sale_upgrade_able');
    this.saleUpgradeAbleBtn.alignTo(this.yellowTipTxt, Phaser.BOTTOM_CENTER, 22, 5);

    this.saleUpgradeDisableBtn = this.game.make.image(0, 0, 'btn_sale_upgrade_disable');
    this.saleUpgradeDisableBtn.alignTo(this.yellowTipTxt, Phaser.BOTTOM_CENTER, 22, 5);

    this.yellowPointTxt = this.game.make.text(0, 0, this.pointYellow, getFontStyle('26px'));
    this.yellowPointTxt.alignTo(this.saleUpgradeAbleBtn, Phaser.RIGHT_TOP, -65, -6);

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
    this.bellGroup.addChild(this.speedUpgradeAbleBtn);
    this.bellGroup.addChild(this.speedUpgradeDisableBtn);
    this.bellGroup.addChild(this.redPointTxt);
    this.bellGroup.addChild(this.saleUpgradeAbleBtn);
    this.bellGroup.addChild(this.saleUpgradeDisableBtn);
    this.bellGroup.addChild(this.yellowPointTxt);

    // contentGroup
    this.contentGroup.addChild(this.bellGroup);
  }

  _drawFrameSkill = () => {
    this.skillGroup = this.game.make.group();
    this.skillGroup.alignTo(this.bellGroup, Phaser.BOTTOM_LEFT);

    let left = (this.w - CONFIG.bgWidth) / 2;
    this.skillFrame = this.game.make.graphics(0, 0);
    this.skillFrame.beginFill(CONFIG.bgColor);
    this.skillFrame.drawRect(0, 80, CONFIG.bgWidth, CONFIG.bgHeight);
    this.skillFrame.endFill();

    this.skillHeading = this.game.make.image(this.w / 2 - left, 30, 'skill_panel_heading');
    this.skillHeading.anchor.setTo(0.5, 0);

    this.skillBg0 = this.game.make.image(0, 0, 'bg_skill');
    this.skillBg0.alignTo(this.skillHeading, Phaser.BOTTOM_CENTER, 140, 30);

    this.skillBg1 = this.game.make.image(0, 0, 'bg_skill');
    this.skillBg1.alignTo(this.skillHeading, Phaser.BOTTOM_CENTER, -140, 30);

    // two skill count panel
    this.panelSkillCount1 = this.game.make.image(0, 0, 'panel_skill_counts');
    this.panelSkillCount1.alignTo(this.skillBg1, Phaser.TOP_CENTER, 0, -33);
    this.skillCountTxt1 = this.game.make.text(0, 0, this.pointRed, getFontStyle());
    this.skillCountTxt1.alignTo(this.panelSkillCount1, Phaser.BOTTOM_CENTER, 0, -33);

    this.panelSkillCount2 = this.game.make.image(0, 0, 'panel_skill_counts');
    this.panelSkillCount2.alignTo(this.skillBg0, Phaser.TOP_CENTER, 0, -33);
    this.skillCountTxt2 = this.game.make.text(0, 0, this.pointRed, getFontStyle());
    this.skillCountTxt2.alignTo(this.panelSkillCount2, Phaser.BOTTOM_CENTER, 0, -33);

    // two skill icons
    this.iconFactory1 = this.game.make.image(0, 0, 'icon_skill_factory1');
    this.iconFactory1.alignTo(this.skillBg1, Phaser.TOP_CENTER, 0, -223);

    this.iconFactory2 = this.game.make.image(0, 0, 'icon_skill_factory2');
    this.iconFactory2.alignTo(this.skillBg0, Phaser.TOP_CENTER, 0, -223);

    // buy-able btn & disable btn
    this.btnBuyAble1 = this.game.make.image(0, 0, 'btn_skill_buy_able');
    this.btnBuyAble1.alignTo(this.iconFactory1, Phaser.BOTTOM_LEFT, -7, 10);
    this.btnBuyDisable1 = this.game.make.image(0, 0, 'btn_skill_buy_disable');
    this.btnBuyDisable1.alignTo(this.iconFactory1, Phaser.BOTTOM_LEFT, -7, 10);

    // coin value need to be Big-gified
    this.coin4RedTxt = this.game.make.text(0, 0, this.coin4BellRed, getFontStyle());
    this.coin4RedTxt.alignTo(this.btnBuyAble1, Phaser.RIGHT_TOP, -90, -6);


    this.btnBuyAble2 = this.game.make.image(0, 0, 'btn_skill_buy_able');
    this.btnBuyAble2.alignTo(this.iconFactory2, Phaser.BOTTOM_LEFT, -7, 10);
    this.btnBuyDisable2 = this.game.make.image(0, 0, 'btn_skill_buy_disable');
    this.btnBuyDisable2.alignTo(this.iconFactory1, Phaser.BOTTOM_LEFT, -7, 10);

    // coin value need to be Big-gified
    this.coin4YellowTxt = this.game.make.text(0, 0, this.coin4BellYellow, getFontStyle());
    this.coin4YellowTxt.alignTo(this.btnBuyAble2, Phaser.RIGHT_TOP, -90, -6);

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
    this.skillGroup.addChild(this.btnBuyAble1);
    this.skillGroup.addChild(this.btnBuyAble2);
    this.skillGroup.addChild(this.btnBuyDisable1);
    this.skillGroup.addChild(this.btnBuyDisable2);
    this.skillGroup.addChild(this.coin4RedTxt);
    this.skillGroup.addChild(this.coin4YellowTxt);

    // contentGroup
    this.contentGroup.addChild(this.skillGroup);

  }

  getContextGroupInit = () => {
    // 这里因为没有heading, 所以内容不需要有offset

    this._drawFrameBells();
    this._drawFrameSkill();


  }
}


export default ModalSkills;
