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
  bgColor: '0xb4a59d',
  barColor: '0x6c4028',
  bgWidth: 503,
  bgHeight: 278,
  barWidth: 416,
  barHeight: 63
};

class ModalAdCampagin extends ModalRaw {
  constructor({
    game,
    height = CONFIG.height,
    width = CONFIG.width,
    headingTxt = CONFIG.headingTxt,
    headingStyles = FONT_STYLE,
    scrollable
  }) {
    // parems
    super(game, headingTxt, height, width, scrollable, headingStyles);
    this.w = width;
    this.h = height;

    this.keyImg = 'ad_campaign';
    this.keyBtn = 'btn_watch_ad';

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
    bg.drawRect(0, 0, CONFIG.bgWidth, CONFIG.bgHeight);
    bg.endFill();
    bg.alignTo(img, Phaser.BOTTOM_LEFT, 5, 10);

    let btn = this.game.make.image(this.w / 2, 700, this.keyBtn);
    btn.anchor.setTo(0.5, 0);
    btn.events.onInputDown.add(() => {
      console.log('要去看广告: ', btn.input.priorityID);
    });

    this.contentGroup.addChild(img);
    this.contentGroup.addChild(bg);
    this.contentGroup.addChild(btn);
  };
}

export default ModalAdCampagin;
