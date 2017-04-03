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
// import YoutubeModal from './component/YoutubeModal';
// import Dropdown from './component/Dropdown';

(function ($) {
  "use strict";
  $(document).ready(init);

  function init() {
    window.createOverlay = createOverlay;

    // testNavi();
    // testNaviHasTimer();
    // testImageLoader();
    // testFullSizeBg();
    // testOverlay();
    // testFullSizeVideo();
    // testFullSizeCanvasVideo();
    // testHorizontalSlideNavi();
    // testAbstractModal();
    // testModal();
    // testYoutubeModal();
    // testDropdown();
  }

  function createOverlay() {
    let overlay = new Overlay({
      clickCallback: function (evt) {
        console.log('evt :', evt);
      }
    });
    overlay.init();

    return overlay;
  }

  /*
   function testYoutubeModal() {
   let overlay = new Overlay();
   overlay.init();

   let youtubeModal = new YoutubeModal({
   wrapClass: 'modal-wrap',
   contents: `<div class="modal">
   <div class="embed-responsive-video">
   <div class="iframe-wrap">
   </div>
   </div>
   <a href="#" class="btn-close">close</a>
   </div>`,
   appendTo: $('body'),
   closeBtnSelector: '.btn-close',

   isCloseByClickOutside: true,
   isCloseByEscKey: true,

   showCallback: function () {
   // console.log('showCallback :', this);
   },
   hideCallback: function () {
   // console.log('hideCallback :', this);
   },

   overlay: overlay,

   iFrameWrapSelector: '.iframe-wrap',
   youtube: {
   id: 'YzKLbB5B0tg',
   width: '',
   height: ''
   }
   });
   youtubeModal.init().show();
   }
   */
}(jQuery));