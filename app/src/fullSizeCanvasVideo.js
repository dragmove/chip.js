import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let canvasVideo = new FullSizeCanvasVideo({
      parent: $('.canvas-video'),
      videoClass: 'video',
      canvasClass: 'canvas',
      width: 320,
      height: 176,
      alignX: 'center', // left, center, right
      alignY: 'center', // top, center, bottom

      fps: 30,
      videoUrl: 'https://www.w3schools.com/tags/mov_bbb.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1474496517593-015d8b59450d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=49563d997d36faad03833ddab8d15c0a',

      contentMode: FullSizeCanvasVideo.ASPECT_FIT, // FullSizeCanvasVideo.ASPECT_FILL, FullSizeCanvasVideo.ASPECT_FIT, FullSizeCanvasVideo.WIDTH_FIT

      autoplay: true,
      loop: true,
      muted: false,

      canplayCallback: (obj) => { // iOS, Android v
        console.log('external canplayCallback() obj :', obj);
      },

      timeupdateCallback: (obj) => { // iOS, Android v
        //console.log('external timeupdateCallback() obj :', obj);
      },

      endedCallback: (obj) => { // iOS, Android v
        console.log('external endedCallback() obj :', obj);
      },

      visibilitychangeCallback: (obj) => {
        console.log('extenal visibilitychangeCallback() obj :', obj);

        if (obj.documentHidden) {
          canvasVideo.pause();
        } else {
          canvasVideo.play();
        }
      }
    });
    canvasVideo.init();

    $(window).on('resize', function (evt) {
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
    $('#btn-play').on('click', function (evt) {
      evt.preventDefault();
      canvasVideo.play();
    });

    $('#btn-pause').on('click', function (evt) {
      evt.preventDefault();
      canvasVideo.pause();
    });

    $('#btn-stop').on('click', function (evt) {
      evt.preventDefault();
      canvasVideo.stop();
    });

    $('#btn-seek').on('click', function (evt) {
      evt.preventDefault();
      canvasVideo.seek(3);
    });
  }
}(jQuery));