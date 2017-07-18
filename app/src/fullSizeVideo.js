import FullSizeVideo from './component/FullSizeVideo';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let fullSizeVideo = new FullSizeVideo({
      videoWrap: $('.fullsize-video'),
      videoUrls: ['https://www.w3schools.com/tags/mov_bbb.mp4', 'https://www.w3schools.com/tags/mov_bbb.ogg'],
      videoWidth: 320,
      videoHeight: 176,
      alignX: 'center', // left, center, right
      alignY: 'center', // top, center, bottom

      autoplay: true,
      loop: false,
      muted: false,

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

    setTimeout(function () {
      fullSizeVideo.play();
      fullSizeVideo.setVolume(0.5);
    }, 2000);

    setTimeout(function () {
      fullSizeVideo.stop();
    }, 4000);

    setTimeout(function () {
      fullSizeVideo.seek(5);
      fullSizeVideo.play();
      fullSizeVideo.setVolume(1.0);
    }, 6000);

    $(window).on('resize', function (evt) {
      $('#wrapper').css({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }).trigger('resize');
  }
}(jQuery));