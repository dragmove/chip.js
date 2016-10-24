import Navi from './component/Navi';
import BgCanvasVideo from './component/BgCanvasVideo';

(function($) {
  "use strict";

  $(document).ready(init);

  function init() {
    testNavi();
    testBgCanvasVideo();
  }

  function testNavi() {
    let navi = new Navi({
      btns: $('.navi li a'),
      activateCallback: activateNaviCallback
    });

    function activateNaviCallback(_obj) {
      console.log('activateNaviCallback - _obj :', _obj);
    }

    //activate 3rd btn
    navi.activate(3);

    //get activated index
    console.log( 'init navi instance. then, print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );

    //get activated index
    console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
  }

  function testBgCanvasVideo() {
    let bgCanvasVideo = new BgCanvasVideo({
      
    });
  }
}(jQuery));