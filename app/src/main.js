// import Navi from './component/Navi';
// import NaviHasTimer from './component/NaviHasTimer';
// import ImageLoader from './component/ImageLoader';
// import FullSizeBg from './component/FullSizeBg';
// import Overlay from './component/Overlay';
// import FullSizeVideo from './component/FullSizeVideo';
import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';

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
    testFullSizeCanvasVideo();
  }

  function testFullSizeCanvasVideo() {
    let canvasVideo = new FullSizeCanvasVideo({
      parent: $('.canvas-video'),
      videoClass: 'video',
      canvasClass: 'canvas',

      autoplay: true,
      loop: true,
      muted: false,

      width: 1920,
      height: 1080,
      alignX: 'center',
      alignY: 'center',

      fps: 30, // TODO
      videoUrl: 'http://akvod.plaync.com/RK/MOVIES/PREREGISTER3/960x540.mp4',
      posterUrl: './img/poster.jpg',

      canplayCallback: (obj) => { // iOS, Adr v
        console.log('external canplayCallback() obj :', obj);
      },

      timeupdateCallback: (obj) => { // iOS, Adr v
        //console.log('external timeupdateCallback() obj :', obj);
      },

      endedCallback: (obj) => { // iOS, Adr v
        console.log('external endedCallback() obj :', obj);
      },

      visibilitychangeCallback: (obj) => {
        console.log('extenal visibilitychangeCallback() obj :', obj);

        if(obj.documentHidden) {
          canvasVideo.pause();
        } else {
          canvasVideo.play();
        }
      }
    });
    canvasVideo.init();

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
      canvasVideo.play();
    });

    $('#btn-pause').on('click', function(evt) {
      evt.preventDefault();
      canvasVideo.pause();
    });

    $('#btn-stop').on('click', function(evt) {
      evt.preventDefault();
      canvasVideo.stop();
    });

    $('#btn-seek').on('click', function(evt) {
      evt.preventDefault();
      canvasVideo.seek(30);
    });
  }
}(jQuery));