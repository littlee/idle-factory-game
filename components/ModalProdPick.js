import ModalRaw from './ModalRaw.js';
import ProdPickItem from './ProdPickItem.js';

const CONFIG = {
  frameColor: 0xb4a59d,
  frameTagW: 134,
  frameTagH: 58,
  frameTagColor: 0xcb6000,
  frameTagStroke: 6,
  frameTagStrokeC: 0xffd945,
  tagImgScale: 34 / 128,
  frameWidth: 553,
  frameHeight: 396,
  gap: 100,
};

const RESO_TAGNAME_MAP = {
  ore: '铁矿',
  copper: '黄铜',
  oilBarrel: '油桶',
  plug: '电器',
  aluminium: '铝器',
  rubber: '橡胶'
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize || '24px',
    fill: color || '#3a0a00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}


// control the UI of a raw-material-frame
class ModalProdPick extends ModalRaw {
  constructor({
    game,
    headingTxt = '选择生产'
  }) {
    super(game, headingTxt);
    // has inherited this.w this.h
    this.framesList = null;
    this.reso = 'ore';
    this.tagCnName = RESO_TAGNAME_MAP[this.reso];

    this._getInit();
  }

  // 注意modal的属性名称不能和raw的collapse
  getContextGroupInit = () => {
    const OFFSET = this.headingH;
    // frame
    let left = (this.w - CONFIG.frameWidth) / 2;
    this.frameOre = this.game.make.graphics(left, OFFSET * 1.5);
    this.frameOre.beginFill(CONFIG.frameColor);
    this.frameOre.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    this.frameOre.endFill();

    // tag bg
    this.tag = this.game.make.graphics(0, 0);
    this.tag.beginFill(CONFIG.frameTagColor);
    this.tag.drawRect(0, 0, CONFIG.frameTagW, CONFIG.frameTagH);
    this.tag.endFill();
    // tag stroke
    this.tag.lineStyle(CONFIG.frameTagStroke, CONFIG.frameTagStrokeC);
    this.tag.moveTo(0, 0);
    this.tag.lineTo(CONFIG.frameTagW, 0);
    this.tag.lineTo(CONFIG.frameTagW, CONFIG.frameTagH);
    this.tag.lineTo(0, CONFIG.frameTagH);
    this.tag.lineTo(0, 0);
    this.tag.alignTo(this.frameOre, Phaser.TOP_CENTER, -10, -40);

    // tag name txt
    this.tagName = this.game.make.text(
      0,
      0,
      this.tagCnName,
      getFontStyle('28px', '', '', 'bold')
    ); // fSize, color, align, weight

    this.tagName.alignTo(
      this.tag,
      Phaser.BOTTOM_LEFT,
      -20,
      -CONFIG.frameTagH
    );

    // tag img
    this.tagImg = this.game.make.image(0, 0, `reso_${this.reso}`);
    this.tagImg.scale.x = CONFIG.tagImgScale;
    this.tagImg.scale.y = CONFIG.tagImgScale;
    this.tagImg.alignTo(this.tagName, Phaser.RIGHT_BOTTOM, 5, -5);

    // table heading background
    this.thBg = this.game.make.graphics(0, 0);
    this.thBg.beginFill(0x000000, 0.3);
    this.thBg.drawRect(0, 0, 550, 25);
    this.thBg.endFill();
    this.thBg.alignTo(this.frameOre, Phaser.TOP_LEFT, 0, -66);

    // table heading
    this.th1 = this.game.make.text(0, 0, '生产产品', getFontStyle('18px'));
    this.th2 = this.game.make.text(0, 0, '需要原料', getFontStyle('18px'));
    this.th3 = this.game.make.text(0, 0, '产品售价', getFontStyle('18px'));
    this.th4 = this.game.make.text(0, 0, '生产状态', getFontStyle('18px'));

    this.th1.alignTo(this.thBg, Phaser.TOP_LEFT, -25, -28);
    this.th2.alignTo(this.th1, Phaser.RIGHT_BOTTOM, 70, 0);
    this.th3.alignTo(this.th2, Phaser.RIGHT_BOTTOM, 70, 0);
    this.th4.alignTo(this.th3, Phaser.RIGHT_BOTTOM, 70, 0);

    this._drawItems();


    this._addAllChildren();
  }

  _drawItems = () => {
    this.item1 = new ProdPickItem({
      game: this.game,
      output: 'steel',
      prodOrder: 1
    });

    this.item2 = new ProdPickItem({
      game: this.game,
      output: 'can',
      prodOrder: 2
    });

    this.item3 = new ProdPickItem({
      game: this.game,
      output: 'drill',
      prodOrder: 3
    });

    this.item4 = new ProdPickItem({
      game: this.game,
      output: 'toaster',
      prodOrder: 4
    });


    this.item1.alignTo(this.thBg, Phaser.BOTTOM_LEFT, 0, 10);
    this.item2.alignTo(this.item1, Phaser.BOTTOM_LEFT, 0, 10);
    this.item3.alignTo(this.item2, Phaser.BOTTOM_LEFT, 0, 10);
    this.item4.alignTo(this.item3, Phaser.BOTTOM_LEFT, 0, 10);
  }

   _addAllChildren = () => {
    this.contentGroup.addChild(this.frameOre);
    this.contentGroup.addChild(this.tag);
    this.contentGroup.addChild(this.tagName);
    this.contentGroup.addChild(this.tagImg);
    this.contentGroup.addChild(this.thBg);
    this.contentGroup.addChild(this.th1);
    this.contentGroup.addChild(this.th2);
    this.contentGroup.addChild(this.th3);
    this.contentGroup.addChild(this.th4);
    // test
    this.contentGroup.addChild(this.item1);
    this.contentGroup.addChild(this.item2);
    this.contentGroup.addChild(this.item3);
    this.contentGroup.addChild(this.item4);
  };


   _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();
    this._prepAfterContentGroup();
  };
}

export default ModalProdPick;
