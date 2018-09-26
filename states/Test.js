import Scroller from '../components/Scroller.js';
// import ModalRaw from '../components/ModalRaw.js';
import ModalLevel from '../components/ModalLevel.js';
import ModalRescources from '../components/ModalResources.js';

class Game extends window.Phaser.State {
  create() {
    // main page
    let wall = this.add.tileSprite(
      0,
      0,
      this.world.width,
      this.world.height * 3,
      'test_wall'
    );
    let topIndicator = this.add.image(this.game.world.centerX, 0, 'arrow');
    let bottomIndicator = this.add.image(this.game.world.centerX, wall.height, 'arrow');
    bottomIndicator.anchor.set(0, 1);
    this.bgGroup = this.add.group();
    this.bgGroup.addChild(wall);
    this.bgGroup.addChild(topIndicator);
    this.bgGroup.addChild(bottomIndicator);

    let bgScroller = new Scroller({
      targetToScroll: this.bgGroup,
      priority: 0,
    });
    bgScroller.enableScroll();

    // arrow for tweening control
    let arrowUp = this.add.image(10, 3 / 10 * this.game.height, 'arrow');
    let arrowDown = this.add.image(10, 3 / 8 * this.game.height, 'arrow');
    arrowDown.scale.y = -1;
    this.arrowGroup = this.add.group();
    this.arrowGroup.fixToCamera = true;
    this.arrowGroup.scale.x = 2;
    this.arrowGroup.scale.y = 2;
    this.arrowGroup.addChild(arrowUp);
    this.arrowGroup.addChild(arrowDown);
    this.arrowGroup.setAllChildren('inputEnabled', true);
    arrowUp.events.onInputDown.add(() => {
      console.log('scroll to top');
      bgScroller.scrollToTop();
    });
    arrowDown.events.onInputDown.add(() => {
      console.log('scroll to a specified pos');
      bgScroller.scrollTo(1000);
    });

    // rules modal
    this.panelGroup = this.add.group();
    this.panelGroup.visible = false;
    this.txtGroup = this.add.group();
    let panel = this.add.image(this.game.world.centerX, this.game.world.centerY, 'test_panel');
    panel.anchor.set(0.5, 0.5);

    let txt = this.add.image(this.game.world.centerX + 35, this.game.world.centerY - 30, 'test_txt');
    txt.anchor.set(0.5, 0);
    txt.mask = this.game.add.graphics();
    txt.mask.drawRect(txt.x - txt.width / 2, txt.y, txt.width, 360);
    this.txtGroup.addChild(txt);
    this.panelGroup.addChild(panel);
    this.panelGroup.addChild(this.txtGroup);

    let txtScroller = new Scroller({
      targetToScroll: this.txtGroup,
      mask: {
        height: 360,
        width: txt.width
      }
    });
    txtScroller.enableScroll();

    // modal
    let modal = new ModalRescources({
      game: this.game,
      scrollable: true,
      headingTxt: '进口生产原料',
    });

    // modal
    // let modal = new ModalLevel({
    //   game: this.game,
    //   scrollable: true,
    //   headingTxt: '233级仓库',
    //   opts: {
    //     avatarImg: 'avatar_tran_warehose',
    //     avatarHeading: '下一次大升级',
    //     avatarDes: '将在等级333时获得额外的运输工人',
    //     item1Icon: 'icon_max_resource',
    //     item1Des: '已运输最大资源'
    //   }
    // });

    // btn-egg
    modal.visible = true;
    let icon = this.add.image(this.game.width, 100, 'test_iconEgg');
    icon.anchor.set(1, 0);
    icon.inputEnabled = true;
    icon.events.onInputDown.add(() => {
      console.log('egg is clicked');
      modal.visible = true;
    });


    // let sprite

  }

  update() {
    // this.bg.tilePosition.y += 1;
  }

  render() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    // this.game.debug.bodyInfo(sprite, 32, 32);
  }
}

export default Game;
