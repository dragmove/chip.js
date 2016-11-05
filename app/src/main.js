// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
// import BgCanvasVideo from './component/BgCanvasVideo';

(function($) {
  "use strict";

  $(document).ready(init);

  function init() {
    // testNavi();
    // testNaviHasTimer();
    // testImageLoader();
    // testFullSizeBg();

    testOverlay();

    // testFullSizeVideo();

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

  function testImageLoader() {
    let imgLoader = new ImageLoader({
      loadCompleteCallback: (obj) => {
        console.log('loadComplete :', obj);
        console.log('imgLoader.isFinished() :', imgLoader.isFinished());
        console.log('imgLoader.getLoadedImgs() :', imgLoader.getLoadedImgs());
      },
      loadPerCompleteCallback: (obj) => {
        console.log('loadPerComplete :', obj);
        console.log('imgLoader.isFinished() :', imgLoader.isFinished());
        console.log('imgLoader.getLoadedImgs() :', imgLoader.getLoadedImgs());
      },
      loadErrorCallback: (obj) => {
        console.log('loadError :', obj)
        console.log('imgLoader.isFinished() :', imgLoader.isFinished());
        console.log('imgLoader.getLoadedImgs() :', imgLoader.getLoadedImgs());
      }
    });

    imgLoader.start([
      'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?dpr=2&auto=compress,format&crop=entropy&fit=crop&w=767&h=511&q=80&cs=tinysrgb',
      'https://images.unsplash.com/photo-1435783099294-283725c372',
      'https://images.unsplash.com/photo-1459666644539-a9755287d6b0?dpr=2&auto=compress,format&crop=entropy&fit=crop&w=767&h=463&q=80&cs=tinysrgb'
    ]);
  }

  function testFullSizeBg() {
    let fullSizeBg = new FullSizeBg({
      imgWrap: $('.fullsize-bg'),
      imgWidth: 4592,
      imgHeight: 3064,
      alignX: 'center',
      alignY: 'center'
    });
    fullSizeBg.init();

    $(window).on('resize', function(evt) {
      $('#wrapper').css({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }).trigger('resize');
  }

  function testOverlay() {
    let overlay = new Overlay({
      class: 'overlay',
      color: '#f00',
      opacity: 0.5,
      appendTo: $('body')
    });
    overlay.init();

    overlay.show();

    setTimeout(function() {
      overlay.setCss({
        'background-color' : '#00f'
      });
    }, 1500);

    setTimeout(function() {
      overlay.hide();
    }, 3000);
  }

  function testFullSizeVideo() {
    let fullSizeVideo = new FullSizeVideo({

    });
  }

  function testBgCanvasVideo() {
    let bgCanvasVideo = new BgCanvasVideo({

    });
  }
}(jQuery));