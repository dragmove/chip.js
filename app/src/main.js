// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
import HorizontalSlideNavi from './component/HorizontalSlideNavi';

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
    testHorizontalSlideNavi();
  }

  function testHorizontalSlideNavi() {
    let slideNaviWrap = $('.slide-navi'),
      btnsWrap = $('.btns', slideNaviWrap);

    let slideNavi = new HorizontalSlideNavi({
      // Navi.js options
      btns: $('li a', btnsWrap),
      mouseoverCallback: function (obj) {
        console.log('mouseover :', obj);
      },
      mouseoutCallback: function (obj) {
        console.log('mouseout :', obj);
      },
      mousedownCallback: function (obj) {
        console.log('mousedown :', obj);
      },
      mouseupCallback: function (obj) {
        console.log('mouseup :', obj);
      },
      clickCallback: function (obj) {
        console.log('click :', obj);
      },
      activateCallback: function (obj) {
        let btns = $(slideNavi.getBtns()),
          btn = $(slideNavi.getBtn(obj.index));

        btns.removeClass('on');
        btn.addClass('on');
      },

      // HorizontalSlideNavi.js options
      wrap: slideNaviWrap,
      handleClass: 'handle',
      btnsWrap: btnsWrap,

      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,

      dragStartCallback: function (x, y) {
        console.log('dragStartCallback :', x, y);
      },
      dragStopCallback: function (x, y) {
        console.log('dragStopCallback :', x, y);
      },
      slideEndCallback: function (x, y) {
        console.log('scrollEnd x, y :', x, y);
      }
    });
    slideNavi.init();

    // TEST
    $('.test-btns a').on('click', function (evt) {
      let index = $(this).index() + 1;
      activateSlideNavi(index);
    });

    function activateSlideNavi(index) {
      if (slideNavi) slideNavi.activate(index);

      if (index < 1 || index > slideNavi.getBtns().length) return;

      let prev = (index <= 1) ? 0 : index - 1,
        next = (index > slideNavi.getBtns().length) ? 0 : index + 1;

      if (!prev) {
        // go to left end.
        slideNavi.setRatioX(0);
        return;
      }

      if (!next) {
        // go go right end.
        slideNavi.setRatioX(1);
        return;
      }

      let btn = $(slideNavi.getBtn(prev));
      if (btn.length) slideNavi.setX(-btn.position().left);
    }
  }

}(jQuery));