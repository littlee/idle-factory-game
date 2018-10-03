function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '18px',
    fill: color || '#3A0A00', // '#00FF00', 3a0a00
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

const CONFIG = {
  prodStrokeWidth: 4,
  prodRegularStrokeColor: 0x03832e,  // 0x03832e
  prodHighlightedStrokeColor: 0X39ec43,
  bubbleColor: 0x004818,
  clockScaleFactor: 0.4,
  countDownDuration: '2h30m',
};

class ProductUpgradeItem extends window.Phaser.Group {
  constructor({game, x, y, product, prodTexture = 'base', countDownDuration = CONFIG.countDownDuration, bought = false}) {
    super(game);

    this.prodTexture = prodTexture;
    this.product = product;
    this.countDownDuration = countDownDuration;
    this.bought = bought;
    this.posX = x;
    this.posY = y;

    this._getInit();
    this._addAllChildren();
  }

  _getInit = () => {
    this.x = this.posX;
    this.y = this.posY;
    let keyBg = 'bg_base';  // map 出来
    let keyProdWithTexture = 'prod_steel_jade';  // map 出来
    this.bg = this.game.make.image(0, 0, keyBg);
    this.bg.anchor.setTo(0.5, 0.5);
    this.prodImg = this.game.make.image(0, 0, keyProdWithTexture);
    this.prodImg.anchor.setTo(0.5, 0.5);

    this.outerLine = this.game.make.graphics(0, 0);
    this.outerLine.alignTo(this.bg);
    this.outerLine.lineStyle(CONFIG.prodStrokeWidth, CONFIG.prodHighlightedStrokeColor);
    this.outerLine.lineTo(this.bg.width, 0);
    this.outerLine.lineTo(this.bg.width, this.bg.height);
    this.outerLine.lineTo(0, this.bg.height);
    this.outerLine.lineTo(0, 0);
    this.outerLine.visible = false;

    // 小蒙层
    this.countDownGroup = this.game.make.group();
    this.ownVeil = this.game.make.graphics(0, 0);
    this.ownVeil.alignTo(this.bg);
    this.ownVeil.beginFill(0x000000, 0.6);
    this.ownVeil.drawRect(0, 0, this.bg.width, this.bg.height);
    this.ownVeil.endFill();

    this.clock = this.game.make.image(0, 0, 'clock_yellow');
    this.clock.scale.x = CONFIG.clockScaleFactor;
    this.clock.scale.y = CONFIG.clockScaleFactor;
    this.clock.alignTo(this.bg, Phaser.TOP_CENTER, 0, -46);

    this.countDownTxt = this.game.make.text(0, 0, '2h30m', getFontStyle('20px', 'white'));
    this.countDownTxt.alignTo(this.clock, Phaser.BOTTOM_CENTER, 0, 0);
    this.countDownGroup.addChild(this.ownVeil);
    this.countDownGroup.addChild(this.clock);
    this.countDownGroup.addChild(this.countDownTxt);


    // percent tag && btn*buy
    this.bubble = this.game.make.image(0, 0, 'bubble_percentage');
    this.bubble.alignTo(this.bg, Phaser.TOP_LEFT, 0, -3);
    this.bubbleTxt = this.game.make.text(0, 0, '30%', getFontStyle(undefined, 0x004818, undefined, 'bold'));
    this.bubbleTxt.alignTo(this.bg, Phaser.TOP_LEFT, -30, 0);

    this.btnBuyGroup = this.game.make.group();
    this.btnBuy = this.game.make.image(0, 0, 'btn_research_update');
    this.btnBuy.alignTo(this.bg, Phaser.BOTTOM_LEFT, 2, 0);
    this.btnBuyTxt = this.game.make.text(0, 0, '233ac', getFontStyle(undefined, 'white'));
    this.btnBuyTxt.alignTo(this.bg,Phaser.BOTTOM_LEFT, -30, 2);
    this.btnBuyGroup.addChild(this.btnBuy);
    this.btnBuyGroup.addChild(this.btnBuyTxt);
    this.btnBuyGroup.setAllChildren('inputEnabled', true);
    this.btnBuyGroup.setAllChildren('input.priorityID', 1001);
    this.btnBuyGroup.onChildInputDown.add(() => {
      this.outerLine.visible = true;
      this.btnBuyGroup.visible = false;
      this.btnSkipGroup.visible = true;
    });

    this.btnSkipGroup = this.game.make.group();
    this.btnSkip = this.game.make.image(0, 0, 'btn_research_skip');
    this.btnSkip.alignTo(this.bg, Phaser.BOTTOM_LEFT, 2, 0);
    this.btnSkipTxt = this.game.make.text(0, 0, '233ac', getFontStyle(undefined, 'white'));
    this.btnSkipTxt.alignTo(this.bg,Phaser.BOTTOM_LEFT, -30, 2);
    this.btnSkipGroup.addChild(this.btnSkip);
    this.btnSkipGroup.addChild(this.btnSkipTxt);
    this.btnSkipGroup.setAllChildren('inputEnabled', true);
    this.btnSkipGroup.setAllChildren('input.priorityID', 1001);
    this.btnSkipGroup.visible = false;
    this.btnSkipGroup.onChildInputDown.add(() => {
      // 其他的大蒙层消失，自己的小蒙层也消失，倒计时也消失
      this.btnSkipGroup.visible = false;
      this.countDownGroup.visible = false;
    });
  }

  _addAllChildren = () => {
    console.log('adding');
    this.addChild(this.bg);
    this.addChild(this.prodImg);
    this.addChild(this.outerLine);
    this.addChild(this.countDownGroup);
    this.addChild(this.bubble);
    this.addChild(this.bubbleTxt);
    this.addChild(this.btnBuyGroup);
    this.addChild(this.btnSkipGroup);
  }
}

export default ProductUpgradeItem;
