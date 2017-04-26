// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
import Overlay from './component/Overlay';
import Dropdown from './component/Dropdown';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
// import HorizontalSlideNavi from './component/HorizontalSlideNavi';
// import AbstractModal from './component/AbstractModal';
// import Modal from './component/Modal';
// import YoutubeModal from './component/YoutubeModal';

(function ($) {
  "use strict";
  $(document).ready(init);

  function init() {
    window.createOverlay = createOverlay;
    window.createDropdown = createDropdown;

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
    }).init();

    /*
     * overlay public methods
     */
    // set node event handler
    // overlay.setNodeEventHandler(true/false);

    // get node
    // console.log(overlay.getNode());

    // set css
    // overlay.setCss({'background-color': '#f00', ...});

    // append to other element
    // overlay.appendTo(parent element);

    // show overlay
    // overlay.show();

    // hide overlay
    // overlay.hide();

    // destroy overlay
    // overlay.destroy();

    return overlay;
  }

  function createDropdown() {
    let dropdown = new Dropdown({
      wrap: $('.dropdown'),
      activateCallback: function (obj) {
        console.log('activateCallback - obj :', obj); // { btns, btn, title, index, prevIndex }
      },
      activateIndex: 0, // default is 0.
      titleBtnClass: 'select', // default is 'select'
      optionWrapClass: 'option', // default is 'option'
      activateOptionClass: 'selected', // default is 'selected'

      openCallback: function (obj) {
        console.log('openCallback - obj :', obj); // { title, index }
      },
      closeCallback: function (obj) {
        console.log('closeCallback - obj :', obj); // { title, index }
      },

      isCloseByClickOutside: true, // default is true
      isDisableClass: 'disabled' // default is 'disabled'
    }).init();

    return dropdown;
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