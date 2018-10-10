import ModalRaw from './ModalRaw.js';

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '34px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle'
};

const DATA = {
  boostHourPerAd: 4,
  maxBoostHour: 30,
  saleBoostMultiplier: 3,
  timestamp: null,
  adAvailable: true
};

const CONFIG = {
  width: 583,
  height: 817,
  headingTxt: '广告活动',
  timesTxt: '开启广告活动后，让你的销售额提升',
  currBoostHourTxt: '效果持续',
  boostHourLeftTxt: '剩余增加时间：',
  maxBoostHourTxt: '最大增加时间：30小时 ',
  remainedTime: '3h 59m',
  bgColor: '0xb4a59d',
  barColor: '0xffbe47',
  coloredBarWidth: 62,
  coloredBarHeight: 58,
  bgWidth: 503,
  bgHeight: 278,
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize || '23px',
    fill: color || '#4d2804', // '#00FF00', 3a0a00
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}

/*
key:
1）3种状态，有广告可以看, countdown untick || 没得看。btn不一样 || 有广告可以看，countdown ticking
2）根据有无时间戳，来判断要不要run countdown，看有无available ad + 是否当前countdown时长 > 设定max值，来看要不要显示可以看ad的btn
3）要有个方法可以被调用来启动countdown
4）要有个方法可以set销售额翻的倍数
5）countdown的格式：xxh xxm xxs
6) 有countdown的时候，boost btn也要变成countdown的UI, modal里头精确到s, 但是btn UI到m。
NOTE：记下广告看完的时间戳
*/

class ModalAdCampagin extends ModalRaw {
  constructor({
    game,
    height = CONFIG.height,
    width = CONFIG.width,
    headingTxt = CONFIG.headingTxt,
    headingStyles = FONT_STYLE,
    saleBoostMultiplier = DATA.saleBoostMultiplier,
    boostHourPerAd = DATA.boostHourPerAd,
    maxBoostHour = DATA.maxBoostHour,
    remainedTime = CONFIG.remainedTime,
    scrollable
  }) {
    // parems
    super(game, headingTxt, height, width, scrollable, headingStyles);
    this.w = width;
    this.h = height;

    this.keyImg = 'ad_campaign';
    this.keyBtn = 'btn_watch_ad';
    this.remainedTime = remainedTime;

    this._data = {
      saleBoostMultiplier: saleBoostMultiplier,
      boostHourPerAd: boostHourPerAd,
      maxBoostHour: maxBoostHour,
      startTimestamp: '', // save and fetch
    };

    this._getInit();
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();
    this._prepAfterContentGroup();
  };

  getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;
    let img = this.game.make.image(this.w / 2, OFFSET, this.keyImg);
    img.anchor.setTo(0.5, 0);

    let bg = this.game.make.graphics(0, 0);
    bg.beginFill(CONFIG.bgColor, CONFIG.bgAlpha);
    bg.drawRect(0, 0, img.width, CONFIG.bgHeight);
    bg.endFill();
    bg.alignTo(img, Phaser.BOTTOM_LEFT, 0, 0);

    let desTimesTxtPart = this.game.make.text(0, 0, CONFIG.timesTxt, getFontStyle());
    desTimesTxtPart.alignTo(bg, Phaser.TOP_LEFT, -30, -65);
    this.saleBoostMultiplierTxt = this.game.make.text(0, 0, 'x' + this._data.saleBoostMultiplier, getFontStyle('50px', '#fdf404'));
    this.saleBoostMultiplierTxt.alignTo(desTimesTxtPart, Phaser.RIGHT_BOTTOM, 5, 10);

    this.currBoostHourTxt = this.game.make.text(0, 0, `${CONFIG.currBoostHourTxt} ${this._data.boostHourPerAd} 小时`, getFontStyle());
    this.currBoostHourTxt.alignTo(bg, Phaser.BOTTOM_CENTER, 0, -205);

    let currLeftTimeTxt = this.game.make.text(0, 0, CONFIG.boostHourLeftTxt, getFontStyle('16px'));
    currLeftTimeTxt.alignTo(this.currBoostHourTxt, Phaser.BOTTOM_CENTER, 0, 15);

    let bar = this.game.make.image(0, 0, 'progressBarSaleBoost');
    bar.alignTo(currLeftTimeTxt, Phaser.BOTTOM_CENTER, 0, 15);

    let coloredBar = this.game.make.graphics(0, 0);
    coloredBar.beginFill(CONFIG.barColor);
    coloredBar.drawRect(0, 0, CONFIG.coloredBarWidth, CONFIG.coloredBarHeight);
    coloredBar.endFill();
    coloredBar.alignTo(bar, Phaser.TOP_LEFT, -5, -CONFIG.coloredBarHeight - 5);

    this.countDownTxt = this.game.make.text(0, 0, this.remainedTime, getFontStyle('24px', 'white', undefined, 'normal'));
    this.countDownTxt.alignTo(bar ,Phaser.BOTTOM_CENTER, 0, -55);

    this.btn = this.game.make.image(this.w / 2, 700, this.keyBtn);
    this.btn.anchor.setTo(0.5, 0);
    this.btn.events.onInputDown.add(() => {
      console.log('点击去看广告');
    });
    // 需要有一个unavailable的key可以替换这个btn

    this.contentGroup.addChild(img);
    this.contentGroup.addChild(bg);
    this.contentGroup.addChild(desTimesTxtPart);
    this.contentGroup.addChild(this.saleBoostMultiplierTxt);
    this.contentGroup.addChild(this.currBoostHourTxt);
    this.contentGroup.addChild(currLeftTimeTxt);
    this.contentGroup.addChild(bar);
    this.contentGroup.addChild(coloredBar);
    this.contentGroup.addChild(this.countDownTxt);
    this.contentGroup.addChild(this.btn);
  };

  getData = () => {
    return this._data;
  }

  startCountdown = () => {

  }

  reboostCountdown = () => {

  }

  checkWhetherNeedReboostCountdown = () => {

  }


}

export default ModalAdCampagin;
