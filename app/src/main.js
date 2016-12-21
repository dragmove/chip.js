// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';
import HorizontalScrollNavi from './component/HorizontalScrollNavi';

(function($) {
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
    let scrollNavi = new HorizontalScrollNavi({
      // TODO
    });
    scrollNavi.init();
  }
}(jQuery));