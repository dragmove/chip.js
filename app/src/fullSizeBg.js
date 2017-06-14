import FullSizeBg from './component/FullSizeBg';

(function ($, global) {
  "use strict";

  $(document).ready(init);

  function init() {
    let fullSizeBg = new FullSizeBg({
      imgWrap: $('.fullsize-bg'),
      imgWidth: 4592,
      imgHeight: 3064,
      alignX: 'center', // left, center, right
      alignY: 'center' // top, center, bottom
    });
    fullSizeBg.init();

    $(window).on('resize', function (evt) {
      $('#wrapper').css({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }).trigger('resize');
  }

}(jQuery, window));