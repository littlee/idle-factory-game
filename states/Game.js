// eslint-disable-next-line
import regeneratorRuntime from '../js/libs/regenerator-runtime';

import BtnIdleCash from '../components/BtnIdleCash';
import BtnCash from '../components/BtnCash';
import BtnSuperCash from '../components/BtnSuperCash';

import Warehouse from '../components/Warehouse';
import Market from '../components/Market';
import Workstation, { COLLECT_TYPES } from '../components/Workstation';

import WorkerWarehouse from '../components/WorkerWarehouse';
import WorkerMarket from '../components/WorkerMarket';
import Scroller from '../components/Scroller.js';

import BellRed from '../components/BellRed';
import BellYellow from '../components/BellYellow';

import BtnUpgrade from '../components/BtnUpgrade';
import ModalLevel from '../components/ModalLevel.js';
import ModalRescources from '../components/ModalResources.js';
import ModalAdCampaign from '../components/ModalAdCampaign';
import ModalProdUpgrade from '../components/ModalProdUpgrade';

import range from '../js/libs/_/range';
import { arrayIntersect } from '../utils';

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
    this.result = true;

    this.physics.startSystem(window.Phaser.Physics.ARCADE);
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

    this.bellRed = new BellRed(this.game, 80, 116);
    this.bellRed.unlock();
    this.bellRed.disable();

    this.bellYellow = new BellYellow(this.game, 550, 116);
    this.bellYellow.unlock();

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

    // modals
    this.modalWarehose = new ModalLevel({
      game: this.game,
      type: 'warehouse',
      coupledBtn: this.upBtnWarehouse
    });

    this.modalMarket = new ModalLevel({
      game: this.game,
      coupledBtn: this.upBtnMarket
    });

    this.modalAdCampaign = new ModalAdCampaign({
      game: this.game
    });

    this.modalProdUpgrade = new ModalProdUpgrade({
      game: this.game,
      headingTxt: '生产产品升级',
    });

    // TODO: make 30 workstations
    const WORKSTATION_START_Y = 915;
    const WORKSTATION_HEIGHT = 339;
    this.workstationGroup = this.add.group();
    range(3).forEach(index => {
      let workstation = new Workstation(
        this.game,
        0,
        WORKSTATION_START_Y + index * WORKSTATION_HEIGHT,
        1,
        index + 1
      );
      this.workstationGroup.add(workstation);
    });
    this.workstationGroup.children[0].beAbleToBuy();
    this.workstationGroup.children[0].buy('cash');
    // this.workstationGroup.children[0].setCollectType(COLLECT_TYPES.PROD);
    this.workstationGroup.children[1].beAbleToBuy();
    this.workstationGroup.children[1].buy('cash');
    // this.workstationGroup.children[1].setOutput('drill');
    this.workstationGroup.children[2].beAbleToBuy();

    this.workerWarehouseGroup = this.add.group();
    range(5).forEach(index => {
      let worker = new WorkerWarehouse(
        this.game,
        50 + index * 5,
        600 + this.rnd.between(0, 20)
      );
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

    // for cash-value-responsive-UI-related
    this._updateWhateverNeed2KnowCoinValue();
  }

  update() {
    this.workerWarehouseGroup.forEachAlive(async worker => {
      if (!worker.getIsOnRoutine()) {
        let workstations = this._getBoughtStations();
        let neededKeys = this._getStationsNeededKeys(workstations);
        this.warehouse.outputGoods(neededKeys);

        let stationAmountKeyMap = this._getStationAmountKeyMap(
          neededKeys,
          workstations
        );

        let warehouseCarry = this._getWorkerWarehouseCarry(
          neededKeys,
          worker.getCapacity(),
          stationAmountKeyMap
        );
        await worker.carryFromWarehouse(warehouseCarry);
        this.warehouse.stopOutput();

        for (let i = 0; i < workstations.length; i++) {
          await worker.moveToStation(workstations[i]);
          let loadingPromises = [];
          let workerGiveRes = this._getShouldWorkerGiveAndKeys(
            worker,
            workstations[i]
          );
          let gtsRes = null;
          if (workerGiveRes.result) {
            gtsRes = worker.giveToStation(workerGiveRes.keys);
            loadingPromises.push(
              worker.giveToStationLoading(gtsRes.stayDuration)
            );
          }

          let tfsRes = null;
          let shouldTakeFromStation = this._getShouldTakeFromStation(
            worker,
            workstations,
            i
          );
          if (shouldTakeFromStation) {
            let workerStationCarry = this._getWorkerStationCarry(
              worker,
              workstations,
              i
            );
            tfsRes = worker.takeFromStation(workerStationCarry);
            workstations[i].giveToWorker(workerStationCarry.amount);
            loadingPromises.push(
              workstations[i].giveToWorkerLoading(tfsRes.stayDuration)
            );
          }

          await Promise.all(loadingPromises);

          if (gtsRes) {
            workstations[i].takeFromWorker(gtsRes.giveMap);
          }
          if (tfsRes) {
            worker.updateCarryNum();
          }
        }
        await worker.backToWarehouse(this.warehouse);
      }
    });

    this.workerMarketGroup.forEachAlive(async worker => {
      if (!worker.getIsOnRoutine()) {
        let workstations = this._getBoughtStations();
        worker.goOutFromMarket();
        for (let i = 0; i < workstations.length; i++) {
          await worker.moveToStation(workstations[i]);
          let shouldWorkerMarketTake = this._getShouldWorkerMarketTake(
            worker,
            workstations[i]
          );
          if (shouldWorkerMarketTake) {
            let takeAmount = null;
            let stationCash = workstations[i].getCashOutput();
            let workerFreeCapacity = worker.getFreeCapacity();
            if (stationCash.gt(workerFreeCapacity)) {
              takeAmount = workerFreeCapacity;
            } else {
              takeAmount = stationCash;
            }
            let tfsRes = worker.takeFromStation(takeAmount);
            workstations[i].giveToWorkerMarket(takeAmount);
            await worker.takeFromStationLoading(tfsRes.stayDuration);
          }
        }
        await worker.backToMarket();
        if (worker.getHasCarry()) {
          let sellRes = await worker.sellProd();
          this.market.sell(sellRes.amount);
        } else {
          worker.setIsOnRoutine(false);
        }
      }
    });
  }

  _getShouldWorkerMarketTake(worker, station) {
    let workerHasFreeCapacity = worker.getHasFreeCapacity();
    if (!workerHasFreeCapacity) {
      return false;
    }

    let stationHasOutputCash = station.getHasCashOutput();
    if (!stationHasOutputCash) {
      return false;
    }
    return true;
  }

  _getShouldWorkerGiveAndKeys(worker, station) {
    let keys = arrayIntersect(worker.getCarryKeys(), station.getInputKeys());
    return {
      result: keys.length > 0,
      keys
    };
  }

  _getShouldTakeFromStation(worker, stations, index) {
    let workerHasFreeCapacity = worker.getHasFreeCapacity();
    if (!workerHasFreeCapacity) {
      return false;
    }

    let currStation = stations[index];
    let stationHasOutput = currStation.getHasProdOutput();
    if (!stationHasOutput) {
      return false;
    }

    let stationOutputKey = currStation.getOutputKey();
    let stationOutputIsNeeded = false;
    for (let i = index + 1; i < stations.length; i++) {
      if (stations[i].getInputKeys().indexOf(stationOutputKey) !== -1) {
        stationOutputIsNeeded = true;
        break;
      }
    }
    return stationOutputIsNeeded;
  }

  _getBoughtStations() {
    return this.workstationGroup.children.filter(item => item.getIsBought());
  }

  _getStationsNeededKeys(stations) {
    let neededKeys = [];
    stations.forEach(sta => {
      let staInput = sta.getInputKeys();
      staInput.forEach(input => {
        if (neededKeys.indexOf(input) === -1) {
          neededKeys.push(input);
        }
      });
    });
    return arrayIntersect(neededKeys, Warehouse.RESOURCE);
  }

  _getStationAmountKeyMap(keys, stations) {
    let stationsInputs = stations.map(sta => sta.getInputKeys());

    return keys.reduce((keyMap, key) => {
      let stationNeedThisKey = stationsInputs.reduce((acc, input) => {
        if (input.indexOf(key) !== -1) {
          acc = acc + 1;
        }
        return acc;
      }, 0);
      keyMap[key] = stationNeedThisKey;

      return keyMap;
    }, {});
  }

  _getWorkerWarehouseCarry(neededKeys, capacity, staAmtKeyMap) {
    let amountPerKey = capacity.div(neededKeys.length);
    let carry = neededKeys.reduce((acc, key) => {
      acc[key] = {
        amount: amountPerKey,
        amountHu: amountPerKey.toString(),
        stationAmount: staAmtKeyMap[key]
      };
      return acc;
    }, {});
    return carry;
  }

  // 每次只会拿一种，所以不用 map
  _getWorkerStationCarry(worker, stations, index) {
    let currStation = stations[index];
    let key = currStation.getOutputKey();
    let stationProdOutput = currStation.getProdOutput();
    let workerFreeCapacity = worker.getFreeCapacity();
    let amount = stationProdOutput;
    if (stationProdOutput.gt(workerFreeCapacity)) {
      amount = workerFreeCapacity;
    }
    let amountHu = amount.toString();

    let stationAmount = 0;
    for (let i = index + 1; i < stations.length; i++) {
      if (stations[i].getInputKeys().indexOf(key) !== -1) {
        stationAmount++;
      }
    }

    return {
      key,
      amount,
      amountHu,
      stationAmount
    };
  }

  _createMenus = () => {
    // top and bottom menu bar

    // top
    this.menuTop = this.add.graphics();
    this.menuTop.beginFill(0x5a5858);
    this.menuTop.drawRect(0, 0, this.world.width, 81);
    this.menuTop.endFill();

    this.btnIdleCash = new BtnIdleCash(this.game, 0, 0);
    this.btnCash = new BtnCash(this.game, 186, 0);
    this.btnSuperCash = new BtnSuperCash(this.game, 186 * 2, 0);

    this.btnCash.onClick(() => {
      console.log('cash clicked');
    });

    // bottom
    this.menuBottom = this.add.graphics();
    this.menuBottom.beginFill(0x5a5858);
    this.menuBottom.drawRect(0, this.world.height - 81, this.world.width, 81);
    this.menuBottom.endFill();

    this.btnShop = this.add.sprite(10, this.world.height, 'btn_shop');
    this.btnShop.anchor.setTo(0, 1);
    this.btnShop.inputEnabled = true;
    this.btnShop.input.priorityID = PRIORITY_ID;
    this.btnShop.events.onInputDown.add(() => {
      console.log('click btn shop');
    });

    this.btnBlueprint = this.add.sprite(
      130,
      this.world.height,
      'btn_blueprint'
    );
    this.btnBlueprint.anchor.setTo(0, 1);
    this.btnBlueprint.inputEnabled = true;
    this.btnBlueprint.input.priorityID = PRIORITY_ID;
    this.btnBlueprint.events.onInputDown.add(() => {
      console.log('click btn blueprint');
      this.modalProdUpgrade.visible = true;
    });

    this.btnXCash = this.add.sprite(
      this.world.centerX,
      this.world.height - 10,
      'btn_x_cash'
    );
    this.btnXCash.anchor.setTo(0.5, 1);
    this.btnXCash.inputEnabled = true;
    this.btnXCash.input.priorityID = PRIORITY_ID;
    this.btnXCash.events.onInputDown.add(() => {
      console.log('click btn x cash');
      this.modalAdCampaign.visible = true;
    });

    this.btnWheelCoin = this.add.sprite(
      this.world.width - 10,
      this.world.height - 10,
      'btn_wheel_coin'
    );
    this.btnWheelCoin.anchor.setTo(1);
    this.btnWheelCoin.inputEnabled = true;
    this.btnWheelCoin.input.priorityID = PRIORITY_ID;
    this.btnWheelCoin.events.onInputDown.add(() => {
      console.log('click btn wheel coin');
    });
  };

  _addAllRelatedStuff2Bg = () => {
    this.bgGroup.addChild(this.exitGround);
    this.bgGroup.addChild(this.warehouseGround);
    this.bgGroup.addChild(this.warehouse);
    this.bgGroup.addChild(this.marketGround);
    this.bgGroup.addChild(this.market);
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

    this.warehouse = new Warehouse(this.game, 100, 450);
    this.warehouse.onClick(() => {
      this.modalRescources.visible = true;
    });

    this.modalRescources = new ModalRescources({
      game: this.game,
      headingTxt: '进口生产原料',
      resourcesTable: this.warehouse
    });

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

    this.market = new Market(this.game, 400, 400);
    this.market.onSell(amount => {
      console.log('market sell:', amount.toString());
      this.addCash(amount);
    });

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

  // 在全部object初始化后inovke
  _updateWhateverNeed2KnowCoinValue = () => {
    let currCoin = this.btnCash.getCash();
    console.log('game currCoin changed: ', currCoin.valueOf());

    // raw material's buybtns
    this.modalRescources.updateBtnBuyUI(currCoin);
    this.modalMarket.getUpdated();
    this.modalWarehose.getUpdated();
  }

  subtractCash = (decrement) => {
    this.btnCash.subtractCashAndUpdate(decrement);
    this._updateWhateverNeed2KnowCoinValue();
  }

  addCash = (increment) => {
    this.btnCash.addCashAndUpdate(increment);
    this._updateWhateverNeed2KnowCoinValue();
  }

  getCurrCoin = () => {
    return this.btnCash.getCash();
  }
}

export default Game;
