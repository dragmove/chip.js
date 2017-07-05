import SlideTab from './component/SlideTab';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let wrap = $('.slide-tab');

    let slideTab = new SlideTab({
      Dragdealer: window.Dragdealer,

      wrap: wrap,
      handleClass: 'handle',
      btnsWrap: $('.btns', wrap),

      activateIndex: 1,

      // option. change between 'momentum scroll navi' and 'percentage navi' based on check button width.
      /*
       responsiveBasedButtonWidth: {
       isApply: true,
       classWhenPercentageTab: 'percentage'
       },

       breakpoint: {
       tablet: 640,
       pc: 960,
       max: 1260
       }
       */

      // TODO - arrange
      horizontalSlideNavi: {
        mouseoverCallback: function(obj) { console.log('mouseoverCallback :', obj) },
        mouseoutCallback: function(obj) { console.log('mouseoutCallback :', obj) },
        mousedownCallback: function(obj) { console.log('mousedownCallback :', obj) },
        mouseupCallback: function(obj) { console.log('mouseupCallback :', obj) },
        clickCallback: function(obj) { console.log('clickCallback :', obj) },
        activateCallback: function(obj) { console.log('activateCallback :', obj) },

        disabled: false,
        slide: true,
        loose: true,
        speed: 0.25,
        css3: true,

        dragStartCallback: function(x, y) { console.log('dragStartCallback :', x, y) },
        dragStopCallback: function(x, y) { console.log('dragStopCallback :', x, y) },
        slideEndCallback: function(x, y) { console.log('slideEndCallback :', x, y) }
      }

    });
    slideTab.init();
  }

}(jQuery));