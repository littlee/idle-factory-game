// import Scroller from '../components/Scroller.js';
// import ModalRaw from '../components/ModalRaw.js';
// import ModalLevel from '../components/ModalLevel.js';
// import ModalRescources from '../components/ModalResources.js';
// import ModalAdCampaign from '../components/ModalAdCampaign';
// import ModalProdUpgrade from '../components/ModalProdUpgrade';
// import ModalSkills from '../components/ModalSkills';
// import ModalOffline from '../components/ModalOffline.js';
// import ModalProdPick from '../components/ModalProdPick.js';


class Game extends window.Phaser.State {
  create() {
    // main page

    // // modal
    // let modal = new ModalAdCampaign({
    //   game: this.game,
    //   scrollable: true,
    // });

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

    // let modal = new ModalLevel({
    //   game: this.game,
    //   scrollable: true,
    //   headingTxt: '233级生产线',
    //   opts: {
    //     avatarImg: 'avatar_worker',
    //     avatarHeading: '下一次大升级',
    //     avatarDes: '在等级达到175时会有巨大生产力的提升',
    //     item1Icon: 'icon_max_resource',
    //     item1Des: '已运输最大资源'
    //   },
    //   worker: true
    // });

    // let modal = new ModalProdUpgrade({
    //   game: this.game,
    //   headingTxt: '生产产品升级',
    // });


    // let modal = new ModalOffline({
    //   game: this.game,
    // });


    // // btn-egg
    // modal.visible = true;
    // let icon = this.add.image(this.game.width, 100, 'test_iconEgg');
    // icon.anchor.set(1, 0);
    // icon.inputEnabled = true;
    // icon.events.onInputDown.add(() => {
    //   console.log('egg is clicked');
    //   modal.visible = true;
    // });
    console.log('being here');

    // let sprite
    this.state.start('Start');

  }

  update() {
    // this.bg.tilePosition.y += 1;
  }

  render() {
    // this.game.debug.cameraInfo(this.game.camera, 32, 32);
    // this.game.debug.bodyInfo(sprite, 32, 32);
  }
}

export default Game;
