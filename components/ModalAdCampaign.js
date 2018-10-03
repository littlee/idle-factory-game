import ModalRaw from './ModalRaw.js';

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '34px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle'
};

const CONFIG = {
  width: 583,
  height: 817,
  headingTxt: '广告活动',
  timesTxt: '开启广告活动后，让你的销售额提升',
  currBoostHourTxt: '效果持续',
  boostHourLeftTxt: '剩余增加时间：',
  maxBoostHourTxt: '最大增加时间：30小时 ',
  saleBoostTimes: '3',
  currBoostHour: '4',
  maxBoostHour: '30',
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
1）两种状态，有广告可以看 || 没得看。btn不一样。
2）看完回来在给定时间内，卖出的价格x2
NOTE：记下广告看完的时间戳
*/

class ModalAdCampagin extends ModalRaw {
  constructor({
    game,
    height = CONFIG.height,
    width = CONFIG.width,
    headingTxt = CONFIG.headingTxt,
    headingStyles = FONT_STYLE,
    saleBoostTimes = CONFIG.saleBoostTimes,
    currBoostHour = CONFIG.currBoostHour,
    maxBoostHour = CONFIG.maxBoostHour,
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
      saleBoostTimes: saleBoostTimes,
      currBoostHour: currBoostHour,
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
    let saleBoostTimes = this.game.make.text(0, 0, 'x' + this._data.saleBoostTimes, getFontStyle('50px', '#fdf404'));
    saleBoostTimes.alignTo(desTimesTxtPart, Phaser.RIGHT_BOTTOM, 5, 10);

    let currBoostHourTxt = this.game.make.text(0, 0, `${CONFIG.currBoostHourTxt} ${this._data.currBoostHour} 小时`, getFontStyle());
    currBoostHourTxt.alignTo(bg, Phaser.BOTTOM_CENTER, 0, -205);

    let currLeftTimeTxt = this.game.make.text(0, 0, CONFIG.boostHourLeftTxt, getFontStyle('16px'));
    currLeftTimeTxt.alignTo(currBoostHourTxt, Phaser.BOTTOM_CENTER, 0, 15);

    let bar = this.game.make.image(0, 0, 'progressBarSaleBoost');
    bar.alignTo(currLeftTimeTxt, Phaser.BOTTOM_CENTER, 0, 15);

    let coloredBar = this.game.make.graphics(0, 0);
    coloredBar.beginFill(CONFIG.barColor);
    coloredBar.drawRect(0, 0, CONFIG.coloredBarWidth, CONFIG.coloredBarHeight);
    coloredBar.endFill();
    coloredBar.alignTo(bar, Phaser.TOP_LEFT, -5, -CONFIG.coloredBarHeight - 5);

    let countDownTxt = this.game.make.text(0, 0, this.remainedTime, getFontStyle('24px', 'white', undefined, 'normal'));
    countDownTxt.alignTo(bar ,Phaser.BOTTOM_CENTER, 0, -55);

    let btn = this.game.make.image(this.w / 2, 700, this.keyBtn);
    btn.anchor.setTo(0.5, 0);
    btn.events.onInputDown.add(() => {
      console.log('点击去看广告');
    });
    // 需要有一个unavailable的key可以替换这个btn

    this.contentGroup.addChild(img);
    this.contentGroup.addChild(bg);
    this.contentGroup.addChild(desTimesTxtPart);
    this.contentGroup.addChild(saleBoostTimes);
    this.contentGroup.addChild(currBoostHourTxt);
    this.contentGroup.addChild(currLeftTimeTxt);
    this.contentGroup.addChild(bar);
    this.contentGroup.addChild(coloredBar);
    this.contentGroup.addChild(countDownTxt);
    this.contentGroup.addChild(btn);
  };

  getData = () => {
    return this._data;
  }
}

export default ModalAdCampagin;
