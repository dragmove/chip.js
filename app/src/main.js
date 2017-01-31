// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
// import HorizontalSlideNavi from './component/HorizontalSlideNavi';
// import AbstractModal from './component/AbstractModal';
// import Modal from './component/Modal';

(function ($) {
  "use strict";
  $(document).ready(init);

  function init() {
    // testNavi();
    // testNaviHasTimer();
    // testImageLoader();
    // testFullSizeBg();
    // testOverlay();
    // testFullSizeVideo();
    // testFullSizeCanvasVideo();
    // testHorizontalSlideNavi();
    // testAbstractModal();
  }

  /*
  function testAbstractModal() {
    let abstractModal = new AbstractModal({
      class: 'modal',
      contents: '<div class="contents">this is contents</div><a href="#" class="btn-close">close</a>',
      appendTo: $('body'),
      closeBtnSelector: '.btn-close',

      showCallback: function () {
        console.log('showCallback :', this);
      },
      hideCallback: function () {
        console.log('hideCallback :', this);
      }
    });
    abstractModal.init();

    abstractModal.show();

    console.log('abstractModal.getNode() :', abstractModal.getNode());

    window.setTimeout(function() {
        abstractModal.appendTo( $('#wrapper') );
    }, 3000);
  }
  */
}(jQuery));