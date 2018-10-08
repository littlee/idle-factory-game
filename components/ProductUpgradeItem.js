import moment from '../js/libs/moment.min.js';

const CONFIG = {
  prodStrokeWidth: 4,
  prodRegularStrokeColor: 0x03832e, // 0x03832e
  prodHighlightedStrokeColor: 0x39ec43,
  bubbleColor: 0x004818,
  clockScaleFactor: 0.4,
  pieActivatedTimestamp: null, // null 升级过1538820968140
  countDownDuration: '30s',
  pieColor: 0x000000,
  pieAlpha: 0.7,
  incrementPercentage: '40%',
};

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

function getRadius(rectWidth, rectHeight = null) {
  let side = null;
  if (rectHeight === null || rectWidth === rectHeight) {
    side = rectWidth;
  } else {
    side = Math.max(rectWidth, rectHeight);
  }
  return 2 * side * Math.cos((1 / 4) * Math.PI);
}

function getCenter(x, y, squareLength) {
  return {
    x: x + (1 / 2) * squareLength,
    y: x + (1 / 2) * squareLength
  };
}

function formatRemainedSecond(secs) {
  // console.log('remained secs: ', secs);
  let hours = Math.floor(secs / 3600);
  secs = secs % 3600;
  let minutes = Math.floor(secs / 60);
  secs = secs % 60;
  let seconds = secs;
  if (hours > 0) {
    return `${hours}h${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
/*
key:
主要需要传入
1)product的名称；
2)product的材质,material;
3)product被点击升级时候的timestamp;
4)product的增值百分比
5)product完成升级需要的duration
初始化界面显示：
默认显示btn_buy和countdown信息，且stroke为透明；但是
btns的显示&countdown信息&stroke的显示会随之根据this.pieActivatedTimestamp和当前时间的difference推算出item所处的状态，再进行UI调整。
再进行behavior的启动，在需要的情况下。
*/
class ProductUpgradeItem extends window.Phaser.Group {
  constructor({
    game,
    parent,
    x,
    y,
    product,
    prodTexture = 'base',
    countDownDuration = CONFIG.countDownDuration,
    pieActivatedTimestamp = CONFIG.pieActivatedTimestamp,
    incrementPercentage = CONFIG.incrementPercentage,
  }) {
    super(game, parent);

    this.prodTexture = prodTexture;
    this.product = product;
    this.posX = x;
    this.posY = y;

    this.keyBg = `bg_${prodTexture}`;
    this.keyProdWithTexture = prodTexture === 'base' ? `prod_${product}` : `prod_${product}_${prodTexture}`;

    this.timer = null;
    this.txtTimer = null;
    this.drawCount = 0;
    this.durationInMiliSeconds = 0;
    this.remainedMiliSeconds = null;

    this.highlighted = false;
    this.upgraded = false;

    this._data = {
      countDownDuration: countDownDuration,
      pieActivatedTimestamp: pieActivatedTimestamp,
      step: null,
      incrementPercentage: incrementPercentage
    };

    this._getInit();
    this._computePieDrawingFrequencyNStuff(this._data.countDownDuration);
    this._check2ShowPieDisappearingProcess();
  }

  _getInit = () => {
    this.x = this.posX;
    this.y = this.posY;
    this.bg = this.game.make.image(0, 0, this.keyBg);
    this.bg.anchor.setTo(0.5, 0.5);
    this.prodImg = this.game.make.image(0, 0, this.keyProdWithTexture);
    this.prodImg.anchor.setTo(0.5, 0.5);

    this.stroke = this.game.make.graphics(0, 0);
    this.stroke.alignTo(this.bg);
    this.stroke.lineStyle(
      CONFIG.prodStrokeWidth,
      CONFIG.prodRegularStrokeColor,
      0
    );
    this.stroke.lineTo(this.bg.width, 0);
    this.stroke.lineTo(this.bg.width, this.bg.height);
    this.stroke.lineTo(0, this.bg.height);
    this.stroke.lineTo(0, 0);

    // coundown 相关
    this.countDownGroup = this.game.make.group();
    // mask 为了countdown的逐渐画pie
    let mask = this.game.make.graphics(0, 0);
    mask.alignTo(this.bg);
    mask.beginFill(0x000000, 0.01);
    mask.drawRect(0, 0, this.bg.width, this.bg.height);
    mask.endFill();
    this.countDownGroup.mask = mask;

    let pieCenter = getCenter(0, 0, this.bg.width);
    let pieRadius = getRadius(this.bg.width, this.bg.height);
    this.countDownPie = this.game.make.graphics(0, 0);
    this.countDownPie.alignTo(this.bg);
    this.countDownPie.beginFill(CONFIG.pieColor, CONFIG.pieAlpha);
    this.countDownPie.arc(
      pieCenter.x,
      pieCenter.y,
      pieRadius,
      Phaser.Math.degToRad(280),
      Phaser.Math.degToRad(-90),
      true
    );
    this.countDownPie.endFill();

    this.clock = this.game.make.image(0, 0, 'clock_yellow');
    this.clock.scale.x = CONFIG.clockScaleFactor;
    this.clock.scale.y = CONFIG.clockScaleFactor;
    this.clock.alignTo(this.bg, Phaser.TOP_CENTER, 0, -46);

    this.countDownTxt = this.game.make.text(
      0,
      0,
      this._data.countDownDuration,
      getFontStyle('20px', 'white')
    );
    this.countDownTxt.alignTo(this.clock, Phaser.BOTTOM_LEFT, this.bg.width * 0.3, 5);
    this.countDownTxt.setTextBounds(0, 0, this.bg.width, 25);

    this.countDownGroup.addChild(mask);
    this.countDownGroup.addChild(this.countDownPie);
    this.countDownGroup.addChild(this.clock);
    this.countDownGroup.addChild(this.countDownTxt);

    // percent tag
    this.bubble = this.game.make.image(0, 0, 'bubble_percentage');
    this.bubble.alignTo(this.bg, Phaser.TOP_LEFT, 0, -3);
    this.bubbleTxt = this.game.make.text(
      0,
      0,
      this._data.incrementPercentage,
      getFontStyle(undefined, 0x004818, undefined, 'bold')
    );
    this.bubbleTxt.alignTo(this.bg, Phaser.TOP_LEFT, -30, 0);

    // btn*buy
    this.btnBuyGroup = this.game.make.group();
    this.btnBuy = this.game.make.image(0, 0, 'btn_research_update');
    // this.btnBuy.alignTo(this.bg, Phaser.BOTTOM_LEFT, 2, 0);
    this.btnBuy.alignTo(this.bg, Phaser.BOTTOM_CENTER, 0, 0);
    this.btnBuyTxt = this.game.make.text(
      0,
      0,
      '233ac',
      getFontStyle(undefined, 'white')
    );
    this.btnBuyTxt.alignTo(this.bg, Phaser.BOTTOM_LEFT, -30, 2);
    this.btnBuyGroup.addChild(this.btnBuy);
    this.btnBuyGroup.addChild(this.btnBuyTxt);
    this.btnBuyGroup.setAllChildren('inputEnabled', true);
    this.btnBuyGroup.setAllChildren('input.priorityID', 1001);
    this.btnBuyGroup.onChildInputDown.add(this._handleBtnBuyClicked);

    // btn*skip
    this.btnSkipGroup = this.game.make.group();
    this.btnSkip = this.game.make.image(0, 0, 'btn_research_skip');
    // this.btnSkip.alignTo(this.bg, Phaser.BOTTOM_LEFT, 2, 0);
    this.btnSkip.alignTo(this.bg, Phaser.BOTTOM_CENTER, 0, 0);
    this.btnSkipTxt = this.game.make.text(
      0,
      0,
      '233ac',
      getFontStyle(undefined, 'white')
    );
    this.btnSkipTxt.alignTo(this.bg, Phaser.BOTTOM_LEFT, -30, 2);
    this.btnSkipGroup.addChild(this.btnSkip);
    this.btnSkipGroup.addChild(this.btnSkipTxt);
    this.btnSkipGroup.setAllChildren('inputEnabled', true);
    this.btnSkipGroup.setAllChildren('input.priorityID', 1001);
    this.btnSkipGroup.visible = false;

    this.btnSkipGroup.onChildInputDown.add(this._handleBtnSkipClicked);

    this._addAllChildren();
  };

  _addAllChildren = () => {
    this.addChild(this.bg);
    this.addChild(this.prodImg);
    this.addChild(this.stroke);
    this.addChild(this.countDownGroup);
    this.addChild(this.bubble);
    this.addChild(this.bubbleTxt);
    this.addChild(this.btnBuyGroup);
    this.addChild(this.btnSkipGroup);
  };

  _handleBtnBuyClicked = () => {
    this.makeStrokeHighlightedOnly();
    this.btnBuyGroup.visible = false;
    this.btnSkipGroup.visible = true;

    // 外加让parent去掉原本是hightlighted的item的stroke
    this.parent.setProperHighlightedChild();
    this.parent.handleOwnItemBeingActivated();

    this._data.pieActivatedTimestamp = moment.utc().format('x');
    this._updateDurationTxtUI();
    this.txtTimer = setInterval(this._updateDurationTxtUI, 990);
    this._reDrawPie();
    this.timer = setInterval(this._reDrawPie, this._data.step * 1000);

    console.log('coin减少相应的值');
  }

  _handleBtnSkipClicked = () => {
    /*
    1）其他的大蒙层消失，自己的小蒙层也消失，倒计时也消失。
    2) 下一个item的btns出现
    3）workstation上面的product UI变化，外加卖出价格变化
    */
    this.btnSkipGroup.visible = false;
    this.countDownGroup.visible = false;
    this.upgraded = true;
    clearInterval(this.timer);
    clearInterval(this.txtTimer);
    this.updateProdUIAndValue();
    this.parent.makeNextItemBtnsShowUp();

    this.parent.handleNoneActivatedItem();
  }


  _check2ShowPieDisappearingProcess = () => {
    if (this._data.pieActivatedTimestamp === null) {
      return false;
    } else {
      let now = moment.utc().format('x');
      let diff = now - this._data.pieActivatedTimestamp;
      if (diff > this.durationInMiliSeconds) {
        // NOTE: 这里不会自动highlight
        this.upgraded = true;
        this.btnSkipGroup.visible = false;
        this.btnBuyGroup.visible = false;
        this.countDownGroup.visible = false;
      } else {
        this.highlighted = true;
        let remainedSeconds = Math.round((this.durationInMiliSeconds - diff) / 1000);
        this.remainedMiliSeconds = remainedSeconds * 1000;
        // format to new durationTxt to display
        let formattedRemainedTimeTxt = formatRemainedSecond(remainedSeconds);
        this._reBoostPieDrawing(formattedRemainedTimeTxt, diff);
      }
      this._decideStrokeColor();
    }
  };

  _reBoostPieDrawing = (formattedRemainedTimeTxt, elapsedMiliseconds) => {
    this.btnBuyGroup.visible = false;
    this.btnSkipGroup.visible = true;
    this.countDownTxt.setText(formattedRemainedTimeTxt);
    this.drawCount = Math.round(elapsedMiliseconds / (this._data.step * 1000));
    console.log('drawCount:', this.drawCount);
    this._reDrawPie();
    this._updateDurationTxtUI();
    this.timer = setInterval(this._reDrawPie, this._data.step * 1000);
    this.txtTimer = setInterval(this._updateDurationTxtUI, 990);
  }

  _computePieDrawingFrequencyNStuff = durationTxt => {
    // xxm || xxs|| xxmxxs || xxhxxm
    let hours, minutes, seconds;
    let tmp = durationTxt.split(/[hms]/);
    if (tmp.length === 3 && durationTxt.indexOf('h') > -1) {
      hours = Number(tmp[0]);
      minutes = Number(tmp[1]);
      seconds = (hours * 60 + minutes) * 60;
    } else if (tmp.length === 3 && durationTxt.indexOf('s') > -1) {
      hours = NaN;
      minutes = Number(tmp[0]);
      seconds = minutes * 60 + Number(tmp[1]);
    } else if (tmp.length === 2 && durationTxt.indexOf('m') > -1) {
      hours = NaN;
      minutes = Number(tmp[0]);
      seconds = minutes * 60;
    } else if (tmp.length === 2 && durationTxt.indexOf('s') > -1) {
      hours = NaN;
      minutes = NaN;
      seconds = Number(tmp[0]);
    }
    this._data.step = seconds / 360;
    this.durationInMiliSeconds = seconds * 1000;
    // console.log('this.durationInMiliSeconds: ', this.durationInMiliSeconds);
  };

  _reDrawPie = () => {
    // 在画完之后，停掉两timer，更新prod UI&value
    this.drawCount++;
    // console.log('drawCount:', this.drawCount);
    let startedDeg = -90; // -90
    let endDeg = -90 + this.drawCount;
    let pieCenter = getCenter(0, 0, this.bg.width);
    let pieRadius = getRadius(this.bg.width, this.bg.height);
    if (endDeg > 270) {
      this._handleBtnSkipClicked();
      return false;
    }
    this.countDownPie.clear();
    this.countDownPie.beginFill(CONFIG.pieColor, CONFIG.pieAlpha);
    this.countDownPie.arc(
      pieCenter.x,
      pieCenter.y,
      pieRadius,
      Phaser.Math.degToRad(startedDeg),
      Phaser.Math.degToRad(endDeg),
      true
    );
    this.countDownPie.endFill();
  };

  _updateDurationTxtUI = () => {
    this.remainedMiliSeconds = this.remainedMiliSeconds === null ? this.durationInMiliSeconds : this.remainedMiliSeconds;
    // adjust frequency based on this.remainedMiliSeconds
    this.remainedMiliSeconds -= 1000;
    if (this.remainedMiliSeconds < 1000) {
      clearInterval(this.txtTimer);
      return false;
    }
    let timeString = formatRemainedSecond(Math.round(this.remainedMiliSeconds / 1000));
    this.countDownTxt.setText(timeString);
    this.parent.parent.modal.handleCountdown4AllFrames(timeString);
  }

  _decideStrokeColor = () => {
    // 3 个状态：透明 || regular || highlighted
    let color = null;
    if (this.highlighted === false && this.upgraded === false) {
      // console.log('未升级');
      return false;
    } else if (this.highlighted === true) {
      color = CONFIG.prodHighlightedStrokeColor;
      // console.log('升级中或者处于最新升级状态');
    } else if (this.upgraded === true) {
      // console.log('升级过');
      color = CONFIG.prodRegularStrokeColor;
    }
    this.stroke.clear();
    this.stroke.lineStyle(
      CONFIG.prodStrokeWidth,
      color
    );
    this.stroke.lineTo(this.bg.width, 0);
    this.stroke.lineTo(this.bg.width, this.bg.height);
    this.stroke.lineTo(0, this.bg.height);
    this.stroke.lineTo(0, 0);
  }

  getIncrementPercentage = () => {
    return this._data.incrementPercentage;
  }

  getHighlightedValue = () => {
    return this.highlighted;
  }

  getUpgradedValue = () => {
    return this.upgraded;
  }

  setHighlighted = (param) => {
    this.highlighted = param;
  }

  makeStrokeHighlightedOnly = () => {
    this.highlighted = true;

    this.stroke.clear();
    this.stroke.lineStyle(
      CONFIG.prodStrokeWidth,
      CONFIG.prodHighlightedStrokeColor
    );
    this.stroke.lineTo(this.bg.width, 0);
    this.stroke.lineTo(this.bg.width, this.bg.height);
    this.stroke.lineTo(0, this.bg.height);
    this.stroke.lineTo(0, 0);
  }

  makeStrokeRegularAndStuff = () => {
    this.highlighted = false;
    this.upgraded = true;

    this.stroke.clear();
    this.stroke.lineStyle(
      CONFIG.prodStrokeWidth,
      CONFIG.prodRegularStrokeColor
    );
    this.stroke.lineTo(this.bg.width, 0);
    this.stroke.lineTo(this.bg.width, this.bg.height);
    this.stroke.lineTo(0, this.bg.height);
    this.stroke.lineTo(0, 0);
  }

  closeBtns = () => {
    this.btnBuyGroup.visible = false;
    this.btnSkipGroup.visible = false;
  }

  reopenBtns = () => {
    this.btnBuyGroup.visible = true;
    this.btnSkipGroup.visible = false;
  }

  makeBtnsPriorityZero = () => {
    this.btnSkipGroup.setAllChildren('input.priorityID', -1);
    this.btnBuyGroup.setAllChildren('input.priorityID', -1);
  }

  makeBtnsPriorityBack2Initial = () => {
    this.btnSkipGroup.setAllChildren('input.priorityID', 1001);
    this.btnBuyGroup.setAllChildren('input.priorityID', 1001);
  }

  updateProdUIAndValue = () => {
    console.log('upgraded is done, UI and value should be changed');
  }

}

export default ProductUpgradeItem;
