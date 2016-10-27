// import Navi from './component/Navi';
import NaviHasTimer from './component/NaviHasTimer';
// import BgCanvasVideo from './component/BgCanvasVideo';

(function($) {
  "use strict";

  $(document).ready(init);

  function init() {
    // testNavi();
    testNaviHasTimer();
    // testBgCanvasVideo();
  }

  function testNavi() {
    let navi = new Navi({
      btns: $('.navi li a'),

      mouseoverCallback: mouseoverCallback,
      mouseoutCallback: mouseoutCallback,
      clickCallback: clickCallback
    });

    function mouseoverCallback(_obj) {
      console.log('mouseover :', _obj);
    }

    function mouseoutCallback(_obj) {
      console.log('mouseout :', _obj);
    }

    function clickCallback(_obj) {
      console.log('click :', _obj);
    }

    //activate 3rd btn
    navi.activate(3);

    //get activated index
    console.log( 'init navi instance. then, print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );

    //get activated index
    console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
  }

  function testNaviHasTimer() {
    let navi = new NaviHasTimer({
      btns: $('.navi li a'),

      mouseoverCallback: mouseoverCallback,
      mouseoutCallback: mouseoutCallback,
      clickCallback: clickCallback,
    });

    function mouseoverCallback(_obj) {
      console.log('mouseover :', _obj);
    }

    function mouseoutCallback(_obj) {
      console.log('mouseout :', _obj);
    }

    function clickCallback(_obj) {
      console.log('click :', _obj);
    }

    //activate 3rd btn
    navi.activate(3);

    navi.destroy();
  }

  function testBgCanvasVideo() {

    /*
    let bgCanvasVideo = new BgCanvasVideo({

    });
    */
  }
}(jQuery));