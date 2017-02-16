// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
// import HorizontalSlideNavi from './component/HorizontalSlideNavi';
// import AbstractModal from './component/AbstractModal';
// import Modal from './component/Modal';
// import YoutubeModal from './component/YoutubeModal';
import Dropdown from './component/Dropdown';

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
    // testModal();
    // testYoutubeModal();
    testDropdown();
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

   iframeWrapSelector: '.iframe-wrap',
   youtube: {
   id: 'YzKLbB5B0tg',
   width: '',
   height: ''
   }
   });
   youtubeModal.init().show();

   console.log('youtubeModal.getNode() :', youtubeModal.getNode());

   console.log(youtubeModal.getYoutubeIFrame());
   }
   */

  function testDropdown() {
    let activateIndex = 3;

    var dropdown = new Dropdown({
      wrap: $('.dropdown'),
      activateIndex: activateIndex,

      titleBtnClass: 'btn-title',
      titleClass: 'title',
      menuClass: 'menu',
      activateMenuClass: 'on',

      activateCallback: function (obj) {
        console.log('activateCallback - obj :', obj); // { btns, btn, title, index, prevIndex }
      },
      openCallback: function (obj) {
        console.log('openCallback - obj :', obj); // { title, index }
      },
      closeCallback: function (obj) {
        console.log('closeCallback - obj :', obj); // { title, index }
      },

      isCloseByClickOutside: true
    });
    dropdown.init();

    /*
     * dropdown public methods
     */
    // get title.
    // console.log('dropdown.getTitle() :', dropdown.getTitle());

    // get activated index.
    // console.log( 'dropdown.getActivatedIndex() :', dropdown.getActivatedIndex() );

    // activate dropdown menu.
    // dropdown.activate(3);

    // open dropdown. and, call openCallback
    // dropdown.open();

    // close dropdown. and, call closeCallback
    // dropdown.close();

    // destroy
    // dropdown.destroy();
  }
}(jQuery));