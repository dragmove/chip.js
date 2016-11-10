// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
 import BgCanvasVideo from './component/BgCanvasVideo';
import Movie from './component/Movie';

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
    //testBgCanvasVideo();

     testMovie();
  }

  function testMovie() {
    let backgroundMovie = new Movie({
      parent: $('.canvas-video'), //v
      videoClass: 'video', //v
      canvasClass: 'canvas', //v

      autoplay: true,
      loop: true,
      muted: false,

      width: 1920, //v
      height: 1080, //v
      alignX: 'center', //v
      alignY: 'center', //v

      fps: 30, // TODO
      videoUrl: 'http://akvod.plaync.com/RK/MOVIES/PREREGISTER3/960x540.mp4',

      posterUrl: '', // TODO
      posterAlt: '', // TODO

      canplayCallback: null, //v
      timeupdateCallback: null, //v
      endedCallback: null //v
    });
    backgroundMovie.init();

    $(window).on('resize', function(evt) {
      console.log('main.js - resize. window.innerWidth, window.innerHeight :', window.innerWidth, window.innerHeight);

      $('.canvas-video').css({
        width: window.innerWidth,
        height: window.innerHeight
      });

      $('#wrapper').css({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }).trigger('resize');
  }

  function testBgCanvasVideo() {
    let bgCanvasVideo = new BgCanvasVideo({
      parent: $('.canvas-video'), //v
      videoClass: 'video', //v
      canvasClass: 'canvas', //v

      autoplay: true,
      loop: true,
      muted: false,

      width: 1920, //v
      height: 1080, //v
      alignX: 'center',
      alignY: 'center',

      fps: 30,
      videoUrl: 'http://akvod.plaync.com/RK/MOVIES/PREREGISTER3/960x540.mp4', // 'http://vodfile.ncsoft.co.kr/ncvod/plaync/LE/CBT/motion/hero_all.mp4',
      posterUrl: '',
      posterAlt: '',

      canplayCallback: null,
      timeupdateCallback: null,
      endedCallback: null
    });
    bgCanvasVideo.init();

    $(window).on('resize', function(evt) {
      console.log('main.js - resize. window.innerWidth, window.innerHeight :', window.innerWidth, window.innerHeight);

      $('.canvas-video').css({
        width: window.innerWidth,
        height: window.innerHeight
      });

      $('#wrapper').css({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }).trigger('resize');

    // test btns
    $('#btn-play').on('click', function(evt) {
      evt.preventDefault();
      bgCanvasVideo.play();
    });

    $('#btn-pause').on('click', function(evt) {
      evt.preventDefault();
      bgCanvasVideo.pause();
    });

    $('#btn-stop').on('click', function(evt) {
      evt.preventDefault();
      bgCanvasVideo.stop();
    });

    $('#btn-seek').on('click', function(evt) {
      evt.preventDefault();
      bgCanvasVideo.seek(84);
    });

  /*
  function testNavi() {
    let navi = new Navi({
      btns: $('.navi li a'),

      mouseoverCallback: mouseoverCallback,
      mouseoutCallback: mouseoutCallback,
      clickCallback: clickCallback,
      activateCallback: activateCallback
    });
    navi.init();

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
    navi.init();

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
      videoWrap: $('.fullsize-video'),
      width: 320,
      height: 176,
      alignX: 'center',
      alignY: 'center',

      videoUrls: ['data/video_320x176.mp4'],
      
      posterUrl: 'https://images.unsplash.com/photo-1474496517593-015d8b59450d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=49563d997d36faad03833ddab8d15c0a',
      posterAlt: 'poster alt string',

      autoplay: true,
      loop: false,
      muted: true,

      canplayCallback: (obj) => {
        console.log('canplayCallback obj :', obj);
      },
      timeupdateCallback: (obj) => {
        console.log('timeupdateCallback obj :', obj);
      },
      endedCallback: (obj) => {
        console.log('endedCallback obj :', obj);
      }
    });

    fullSizeVideo.init();

    setTimeout(function() {
      fullSizeVideo.play();
    }, 2000);

    setTimeout(function() {
      fullSizeVideo.stop();
    }, 4000);

    setTimeout(function() {
      fullSizeVideo.seek(5);
      fullSizeVideo.play();
    }, 6000);

    $(window).on('resize', function(evt) {
      $('#wrapper').css({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }).trigger('resize');
  }
  */
  }
}(jQuery));