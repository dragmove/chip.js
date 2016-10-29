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
      clickCallback: clickCallback,
      activateCallback: activateCallback
    });

    function mouseoverCallback(obj) {
      console.log('mouseover :', obj);
    }

    function mouseoutCallback(obj) {
      console.log('mouseout :', obj);
    }

    function clickCallback(obj) {
      console.log('click :', obj);
    }

    function activateCallback(obj) {
      console.log('activateCallback :', obj);

      let btns = $(navi.getBtns()),
        btn = $(navi.getBtn(obj.index));

      btns.removeClass('on');
      btn.addClass('on');
    }

    //get activated index
    console.log( 'init navi instance. then, print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );

    //activate 3rd btn
    navi.activate(3);

    //get activated index
    console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
  }

  function testNaviHasTimer() {
    let navi = new NaviHasTimer({
      btns: $('.navi li a'),

      mouseoverCallback: mouseoverCallback,
      mouseoutCallback: mouseoutCallback,
      clickCallback: clickCallback,
      activateCallback: activateCallback,

      timerInterval: 500
    });

    function mouseoverCallback(obj) {
      console.log('mouseover :', obj);
    }

    function mouseoutCallback(obj) {
      console.log('mouseout :', obj);
    }

    function clickCallback(obj) {
      console.log('click :', obj);
    }

    function activateCallback(obj) {
      console.log('activateCallback :', obj);

      let btns = $(navi.getBtns()),
        btn = $(navi.getBtn(obj.index));

      btns.removeClass('on');
      btn.addClass('on');
    }

    //get activated index
    console.log( 'init navi instance. then, print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );

    //activate 3rd btn
    navi.activate(3);

    //get activated index
    console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
  }

  function testBgCanvasVideo() {

    /*
    let bgCanvasVideo = new BgCanvasVideo({

    });
    */
  }
}(jQuery));