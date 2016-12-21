// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
import HorizontalScrollNavi from './component/HorizontalScrollNavi';

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
    testHorizontalScrollNavi();
  }

  function testHorizontalScrollNavi() {
    let btnsWrap = $('.slidetab__tab');

    let scrollNavi = new HorizontalScrollNavi({
      // Navi.js options
      btns: $('li a', btnsWrap),
      mouseoverCallback: mouseoverCallback,
      mouseoutCallback: mouseoutCallback,
      clickCallback: clickCallback,
      activateCallback: activateCallback,

      // HorizontalScrollNavi.js options
      wrap: $('.slidetab'),
      handleClass: 'slidetab__handle',
      btnsWrap: btnsWrap,

      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,
      scrollCallback: scrollCallback
    });
    scrollNavi.init();

    function mouseoverCallback(obj) {
      // console.log('mouseover :', obj);
    }

    function mouseoutCallback(obj) {
      // console.log('mouseout :', obj);
    }

    function clickCallback(obj) {
      console.log('click :', obj);
    }

    function activateCallback(obj) {
      console.log('activateCallback :', obj);

      let btns = $(scrollNavi.getBtns()),
        btn = $(scrollNavi.getBtn(obj.index));

      btns.removeClass('on');
      btn.addClass('on');
    }

    function scrollCallback(x, y) {
      console.log('scroll x, y :', x, y);

    }

    // TEST
    /*
     $('.test-btns a').on('click', function (evt) {
     let index = $(this).index() + 1;
     activateScrollNaviByExternal(index);
     });

     function activateScrollNaviByExternal(index) {
     if (scrollNavi) scrollNavi.activate(index);

     // move scroll navi
     if (index < 1 || index > scrollNavi.getBtns().length) return;

     let prev = (index <= 1) ? 0 : index - 1,
     next = (index > scrollNavi.getBtns().length) ? 0 : index + 1;

     if (!prev) {
     // go to left end.
     setDragDealerPosition(0, 0);
     return;
     }

     if (!next) {
     // go go right end.
     scrollNavi.setValue(1, 0);
     return;
     }

     let btn = $(scrollNavi.getBtn(prev));
     if (btn.length) setDragDealerPosition(-btn.position().left);
     }
     */

    /*
     function createCanvasMask() {
     if (!scrollNavi) {
     scrollNavi = new HorizontalScrollNavi({
     btns: $('.slidetab__tab li a'),
     mouseoverCallback: mouseoverCallback,
     mouseoutCallback: mouseoutCallback,
     clickCallback: clickCallback,
     activateCallback: activateCallback
     });
     scrollNavi.init();
     } else {
     scrollNavi.enable();
     }

     if (!isMobile.any) {
     // desktop - disable drag
     scrollNavi.disable();
     }

     isNeedScroll = true;
     }

     $(window).on('resize orientationchange', resize);
     resize();

     function resize(evt) {
     console.log('resize');

     if (btnWrap.width() > window.innerWidth) {
     createCanvasMask();
     } else {
     if (scrollNavi) {
     scrollNavi.disable();

     isNeedScroll = false;

     setDragDealerPosition(0);
     }
     }
     }

     function setDragDealerPosition(x) {
     // var offset = this.dragDealer.getRatiosByOffsets([x, 0]);
     let offset = scrollNavi.getRatiosByOffsets(x);
     scrollNavi.setValue(offset[0], offset[1]);
     }

     */
  }

}(jQuery));