import ModalRaw from './ModalRaw.js';
import LevelUpgradeItem from './LevelUpgradeItem.js';
import PanelUpgrade from './PanelUpgrade.js';

const LEVEL = {
  aWidth: 537,
  aHeight: 178,
  desHeight: 85
};

const config = {
  FRAME_RGB: 0xE1D6CC,
  FRAME_LINE_WIDTH: 1,
  FRAME_LINE_COLOR: 0x000000,
  FRAME_LINE_ALPHA: 0.7,
  OPTS_W: {
    avatarImg: 'avatar_tran_warehose',
    avatarHeading: '下一次大升级',
    avatarDes: '将在等级333时获得额外的运输工人',
    item1Icon: 'icon_max_resource',
    item1Des: '已运输最大资源'
  },
  OPTS_M: {
    avatarImg: 'avatar_tran_market',
    avatarHeading: '下一次大升级',
    avatarDes: '将在等级666时获得额外的运输工人',
    item1Icon: 'icon_money_transported',
    item1Des: '已运输最高现金'
  }
};

function getFontStyle (fSize, color, align, weight) {
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
opts = {
  avatarImg: <key>,
  avatarHeading: string,
  avatarDes: string,
  item1Icon: <key>,
  item1Des: string
}
*/

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
  constructor({game, scrollable, opts, type = 'market', coupledBtn = null}) {
    // parems
    // super(game, headingTxt, undefined, undefined, scrollable);
    super(game, undefined, undefined, scrollable);
    this.opts = type === 'market' ? config.OPTS_M : config.OPTS_W;
    this.headingPart = type === 'market' ? '级市场' : type === 'warehouse' ? '级仓库' : '工人';
    this.type = type;
    this.coupledBtn = coupledBtn;


    this._getInit();
  }

  _getInit = () => {
    this._positionModal();
    this._createOuterVeil();
    this.DrawSubGroupStuff();

    this._setMask4ContentGroup();
    /* real content goes here */
    this.getContextGroupInit();

    this._addStuff2SubGroup();
    this._addStuff2Modal();

    this._boostInputPriority4Children();
    // prep for scrolling, should be called after contentGroup is all set
    this._getScrollWhenNeeded();
  }

  DrawSubGroupStuff = () => {
    /* frame, heading, btn_close*/
    // frame
    this.frame = this.game.make.graphics(0, 0); // graphics( [x] [, y] )
    this.frame.beginFill(config.FRAME_RGB);
    this.frame.drawRect(0, 0, this.w, this.h);
    this.frame.endFill();
    this.frame.lineStyle(config.FRAME_LINE_WIDTH, config.FRAME_LINE_COLOR, config.FRAME_LINE_ALPHA);
    this.frame.moveTo(0, 0);
    this.frame.lineTo(this.w, 0);
    this.frame.lineTo(this.w, this.h);
    this.frame.lineTo(0, this.h);
    this.frame.lineTo(0, 0);

    // btn_close ...should be a sprite rather than img
    this.btnClose = this.game.make.button(this.w - 1, 0 + 1, 'btn_close', this._handleClose);
    this.btnClose.anchor.set(1, 0);

    this.heading = this.game.make.text(0, 0, this.game.share[this.type].level + this.headingPart, this.headingStyles);
    this.heading.setTextBounds(0, 0, this.w - this.btnClose.width, this.headingH);
  }

  getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;
    this.avatarBg = this.game.make.graphics((this.w - LEVEL.aWidth) / 2, OFFSET); // graphics( [x] [, y] )
    this.avatarBg.beginFill(0x000000, 0.1);
    this.avatarBg.drawRect(0, 0, LEVEL.aWidth, LEVEL.aHeight);
    this.avatarBg.endFill();

    this.avatarGroup = this.game.add.group(this.avatarBg);
    this.avatar = this.game.make.image(40, 110, this.opts.avatarImg);
    this.avatarHeading = this.game.make.text(60 + this.avatar.width, 120, this.opts.avatarHeading, getFontStyle('24px'));
    this.avatarDesBg = this.game.make.graphics(0, 0);
    this.avatarDesBg.beginFill(0x000000, 0.1);
    this.avatarDesBg.drawRect(0, 0, 339, 30);
    this.avatarDesBg.endFill();
    this.avatarDesBg.alignTo(this.avatarHeading, Phaser.BOTTOM_LEFT, 0, 10);
    this.avatarDesTxt = this.game.make.text(0, 0, this.opts.avatarDes, getFontStyle('18px', 'white'));
    this.avatarDesTxt.setTextBounds(0, 0, 339, 30); // 同上
    this.avatarDesTxt.alignTo(this.avatarDesBg, Phaser.Phaser.TOP_LEFT, 0, -28);

    this.avatarBar = this.game.make.graphics(0, 0);
    this.avatarBar.beginFill(0x3A0A00, 0.8);
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
    if (this.type === 'market' || this.type === 'warehouse') {
      // gap 17
      this.item1 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: this.opts.item1Icon,
        txt: this.opts.item1Des,
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290,
        levelType: this.type,
        itemName: 'maxTransported'
      });
      this.item2 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_transporter',
        txt: '运输工',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 + 17,
        levelType: this.type,
        itemName: 'transportCount'
      });

      this.item3 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_transporter_capacity',
        txt: '运输工能力',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 * 2 + 17 * 2,
        levelType: this.type,
        itemName: 'transCapacity'
      });

      this.item4 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_loading_speed',
        txt: '运输工载运能力',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 * 3 + 17 * 3,
        levelType: this.type,
        itemName: 'loadingSpeed'
      });

      this.item5 = new LevelUpgradeItem({
        game: this.game,
        parent: this.mainGroup,
        key: 'icon_walk_speed',
        txt: '运输工行走速度',
        x: (this.w - LEVEL.aWidth) / 2,
        y: 290 + 85 * 4 + 17 * 4,
        levelType: this.type,
        itemName: 'walkSpeed'
      });
    } else {
      // this.needTxt = this.game.make.text((this.w - LEVEL.aWidth) / 2, 290, '需要', getFontStyle('30px'));
      // let need1 = new LevelUpgradeItem({
      //   game: this.game,
      //   parent: this.mainGroup,
      //   key: 'icon_ore',
      //   txt: '铁矿',
      //   x: (this.w - LEVEL.aWidth) / 2,
      //   y: 330,
      //   currTxt: '58aa',
      //   futureTxt: '+55aa'
      // });

      // this.prodTxt = this.game.make.text((this.w - LEVEL.aWidth) / 2, 330 + 85 + 27, '生产', getFontStyle('30px'));
      // let prod = new LevelUpgradeItem({
      //   game: this.game,
      //   parent: this.mainGroup,
      //   key: 'icon_ore',
      //   txt: '铁矿',
      //   x: (this.w - LEVEL.aWidth) / 2,
      //   y: 330 + 27 + 40 + 85,
      //   currTxt: '58aa/分',
      //   futureTxt: '+55aa/分'
      // });
      // let iconPower = new LevelUpgradeItem({
      //   game: this.game,
      //   parent: this.mainGroup,
      //   key: 'icon_power',
      //   txt: '生产力',
      //   x: (this.w - LEVEL.aWidth) / 2,
      //   y: 330 + 27 + 40 + 85 * 2 + 20,
      //   currTxt: '58aa/分',
      //   futureTxt: '+55aa/分'
      // });


      // this.mainGroup.addChild(this.needTxt);
      // this.mainGroup.addChild(this.prodTxt);
    }

    this.upgradePanel = new PanelUpgrade({
      game: this.game,
      parent: this.contentGroup,
      veilHeight: this.h - this.headingH,
      levelType: this.type,
      cb: this._handleUpgradation,
      cb4btns: this._handleLevelBtnsChoosing,
    });

    this.contentGroup.addChild(this.avatarBg);
    this.contentGroup.addChild(this.avatarGroup);
    this.contentGroup.addChild(this.mainGroup);
  }

  // 点击level升级之后所有要处理的更新
  _handleUpgradation = () => {
    let currLevel = this.game.share[this.type].level;
    this.coupledBtn.setLevel(currLevel.toString());
    this.heading.setText(currLevel + this.headingPart, true);
    this._handleLevelBtnsChoosing();
  }

  // 点击 x1 x10 ... btns时候, 需要一起更新的东西【需要的coin数值不归在这里更新】
  _handleLevelBtnsChoosing = () => {
    if (this.type === 'market' || this.type === 'warehouse') {
      this.item1.getDesUpdated();
      this.item2.getDesUpdated();
      this.item3.getDesUpdated();
      this.item4.getDesUpdated();
      this.item5.getDesUpdated();
    }
  }

  getUpdated = () => {
    try {
      this.upgradePanel.updateLevelUpgradeBtnUI();
      return true;
    } catch(ex) {
      console.log('game state update() err');
      console.log(ex);
      return false;
    }
  }
}

export default ModalLevel;
