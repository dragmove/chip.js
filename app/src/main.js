// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
// import HorizontalSlideNavi from './component/HorizontalSlideNavi';
import AbstractModal from './component/AbstractModal';

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
    testAbstractModal();
  }

  function testAbstractModal() {
    let abstractModal = new AbstractModal({
      class: 'modal',
      contents: '<div class="contents">this is contents</div><a href="#" class="btn-close">close</a>',

      appendTo: $('body'),
      openCallback: function() {
        console.log('openCallback :', this);
      },

      closeBtnSelector: '.btn-close',
      closeCallback: function() {
        console.log('closeCallback :', this);
      }
    });
    abstractModal.init();

    abstractModal.open();

    console.log('abstractModal.getNode() :', abstractModal.getNode());

    window.setTimeout(function() {
        abstractModal.open();
    }, 3000);
  }

}(jQuery));