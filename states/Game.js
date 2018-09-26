import BtnIdleCash from '../components/BtnIdleCash';
import BtnCash from '../components/BtnCash';
import BtnSuperCash from '../components/BtnSuperCash';

import Workstation from '../components/Workstation';

import WorkerWarehouse from '../components/WorkerWarehouse';
import WorkerMarket from '../components/WorkerMarket';
import Scroller from '../components/Scroller.js';

import BellRed from '../components/BellRed';
import BellYellow from '../components/BellYellow';

import BtnUpgrade from '../components/BtnUpgrade';
import ModalLevel from '../components/ModalLevel.js';

import range from '../js/libs/_/range';

/*
关于priorityID:
-1- 让整个屏幕滑动的veil是0，屏幕中其他有自己input事件的game object是999.
-2- 让modal滑动的veil是1000， modal里头要有自己input事件的game object需要设置成 > 1000.
-3- menu以及其他fixed在屏幕的，设置成888
*/

const PRIORITY_ID = 999;

class Game extends window.Phaser.State {
  // create(): execution order inside MATTERS!!
  create() {
    // bg of warehouse of raw material
    this.bgGroup = this.game.add.group();
    // create the wall and 2 markets
    this._createWalln2markets();
    // ground 0
    this.exitGround = this.add.tileSprite(
      0,
      674,
      this.world.width,
      241,
      'ground_level_1'
    );
    this.warehouseManager = this.add.sprite(0, 0, 'mgr_warehouse');
    this.warehouseManager.alignIn(
      this.wall,
      window.Phaser.BOTTOM_CENTER,
      -80,
      80
    );
    this.marketManager = this.add.sprite(0, 0, 'mgr_market');
    this.marketManager.alignIn(this.wall, window.Phaser.BOTTOM_CENTER, 80, 80);
    // group 1-5

    const WORKSTATION_START_Y = 915;
    const WORKSTATION_HEIGHT = 339;
    this.workstationGroup = this.add.group();
    range(5).forEach(index => {
      let workstation = new Workstation(
        this.game,
        0,
        WORKSTATION_START_Y + index * WORKSTATION_HEIGHT,
        1,
        index + 1
      );
      this.workstationGroup.add(workstation);
    });

    this.bellRed = new BellRed(this.game, 80, 116);
    this.bellRed.unlock();
    this.bellRed.disable();

    this.bellYellow = new BellYellow(this.game, 550, 116);
    this.bellYellow.unlock();

    this.modalWarehose = new ModalLevel({
      game: this.game,
      scrollable: true,
      headingTxt: '233级仓库',
      opts: {
        avatarImg: 'avatar_tran_warehose',
        avatarHeading: '下一次大升级',
        avatarDes: '将在等级333时获得额外的运输工人',
        item1Icon: 'icon_max_resource',
        item1Des: '已运输最大资源'
      }
    });

    this.modalMarket = new ModalLevel({
      game: this.game,
      scrollable: true,
      headingTxt: '555级市场',
      opts: {
        avatarImg: 'avatar_tran_market',
        avatarHeading: '下一次大升级',
        avatarDes: '将在等级666时获得额外的运输工人',
        item1Icon: 'icon_money_transported',
        item1Des: '已运输最高现金'
      }
    });

    this.upBtnWarehouse = new BtnUpgrade(this.game, 0, 0);
    this.upBtnWarehouse.alignIn(this.wall, window.Phaser.LEFT_CENTER, -60, -10);
    this.upBtnWarehouse.onClick(() => {
      console.log('仓库升级按钮');
      this.modalWarehose.visible = true;
    });

    this.upBtnMarket = new BtnUpgrade(this.game, 0, 0);
    this.upBtnMarket.alignIn(this.wall, window.Phaser.RIGHT_CENTER, -50, -10);
    this.upBtnMarket.onClick(() => {
      console.log('市场升级按钮');
      this.modalMarket.visible = true;
    });

    this.workerWarehouseGroup = this.add.group();
    range(5).forEach(index => {
      let worker = new WorkerWarehouse(this.game, 50 + index * 5, 600);
      this.workerWarehouseGroup.add(worker);
      if (index > 0) {
        worker.kill();
      }
    });

    this.workerMarketGroup = this.add.group();
    range(5).forEach(index => {
      let worker = new WorkerMarket(
        this.game,
        this.game.world.width - 180 + index * 5,
        600
      );
      this.workerMarketGroup.add(worker);
      if (index > 0) {
        worker.kill();
      }
    });

    // menus should be the last to add
    this._createMenus();

    // add stuff to bg to enable scroll
    this._addAllRelatedStuff2Bg();
    // with bg fills with stull, scrolling now is all set
    let wholeGameScroller = new Scroller({
      targetToScroll: this.bgGroup,
      priority: 0 // 区别弹窗的scroll
    });
    wholeGameScroller.enableScroll();

    this._createFastScrollArrow(wholeGameScroller);
  }

  _createMenus = () => {
    // top and bottom menu bar
    this.menuTop = this.add.graphics();
    this.menuTop.beginFill(0x282c30);
    this.menuTop.drawRect(0, 0, this.world.width, 81);
    this.menuTop.endFill();

    this.btnIdleCash = new BtnIdleCash(this.game, 0, 0);
    this.btnCash = new BtnCash(this.game, 186, 0);
    this.btnSuperCash = new BtnSuperCash(this.game, 186 * 2, 0);

    this.menuBottom = this.add.graphics();
    this.menuBottom.beginFill(0x282c30);
    this.menuBottom.drawRect(0, this.world.height - 81, this.world.width, 81);
    this.menuBottom.endFill();
  };

  _addAllRelatedStuff2Bg = () => {
    this.bgGroup.addChild(this.exitGround);
    this.bgGroup.addChild(this.warehouseGround);
    this.bgGroup.addChild(this.warehouseTable);
    this.bgGroup.addChild(this.marketGround);
    this.bgGroup.addChild(this.marketTruck);
    this.bgGroup.addChild(this.wall);
    this.bgGroup.addChild(this.warehouseManager);
    this.bgGroup.addChild(this.marketManager);
    this.bgGroup.addChild(this.bellRed);
    this.bgGroup.addChild(this.bellYellow);
    this.bgGroup.addChild(this.upBtnMarket);
    this.bgGroup.addChild(this.upBtnWarehouse);

    this.bgGroup.addChild(this.workstationGroup);

    this.bgGroup.addChild(this.workerWarehouseGroup);
    this.bgGroup.addChild(this.workerMarketGroup);
  };

  _createWalln2markets = () => {
    this.warehouseGround = this.add.graphics();
    this.warehouseGround.beginFill(0x78fc82);
    this.warehouseGround.drawRect(0, 0, this.world.width / 2, 674);
    this.warehouseGround.endFill();

    this.warehouseTable = this.add.sprite(100, 650, 'warehouse_table');
    this.warehouseTable.anchor.setTo(0, 1);

    // bg of selling
    this.marketGround = this.add.graphics();
    this.marketGround.beginFill(0xfc7b2d);
    this.marketGround.drawRect(
      this.world.centerX,
      0,
      this.world.width / 2,
      674
    );
    this.marketGround.endFill();

    this.marketTruck = this.add.sprite(
      this.world.width - 30,
      700,
      'market_truck'
    );
    this.marketTruck.anchor.setTo(1);

    // wall behind the above two
    this.wall = this.add.sprite(this.world.centerX, 81, 'wall');
    this.wall.anchor.setTo(0.5, 0);
    // this.wall.visible = false;
  };

  _createFastScrollArrow = scroller => {
    // this.arrowFastDown should scroll to a internal-shared data, use hitArea to enlarge the clickable area if needed
    this.arrowFastUp = this.add.image(
      40,
      (this.game.camera.view.height / 13) * 10.5,
      'arrow_fast_scroll'
    );
    this.arrowFastDown = this.add.image(
      40,
      (this.game.camera.view.height / 13) * 11.5,
      'arrow_fast_scroll'
    );
    this.arrowFastUp.scale.x = this.arrowFastDown.scale.x = 0.25;
    this.arrowFastUp.scale.y = -0.25;
    this.arrowFastDown.scale.y = 0.25;

    this.arrowFastUp.inputEnabled = true;
    this.arrowFastDown.inputEnabled = true;
    this.arrowFastUp.input.priorityID = PRIORITY_ID;
    this.arrowFastDown.input.priorityID = PRIORITY_ID;
    this.arrowFastUp.events.onInputUp.add(scroller.scrollToTop);
    this.arrowFastDown.events.onInputUp.add(scroller.scrollTo.bind(this, 1000));
  };
}

export default Game;
