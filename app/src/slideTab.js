/*
 <div class="slide-tab">
 <div class="handle">
 <ul class="btns">
 <li><a href="#">genji</a></li>
 <li><a href="#">mccree</a></li>
 <li><a href="#">pharah</a></li>
 <li><a href="#">reaper</a></li>
 <li><a href="#">soldier-76</a></li>
 <li><a href="#">sombra</a></li>
 <li><a href="#">tracer</a></li>
 <li><a href="#">bastion</a></li>
 <li><a href="#">hanzo</a></li>
 <li><a href="#">junkrat</a></li>
 </ul>
 </div>
 </div>
 */

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

      responsiveBasedButtonWidth: {
        isApply: false,
        classWhenPercentageTab: 'percentage'
      },

      breakpoint: {
        tablet: 640,
        pc: 960,
        max: 1260
      },

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
        mouseoverCallback: function (obj) {
          console.log('mouseoverCallback :', obj)
        },
        mouseoutCallback: function (obj) {
          console.log('mouseoutCallback :', obj)
        },
        mousedownCallback: function (obj) {
          console.log('mousedownCallback :', obj)
        },
        mouseupCallback: function (obj) {
          console.log('mouseupCallback :', obj)
        },
        clickCallback: function (obj) {
          console.log('clickCallback :', obj)
        },
        activateCallback: function (obj) {
          const btns = $(slideTab.getBtns()),
            btn = $(slideTab.getBtn(obj.index));

          btns.removeClass('on');
          btn.addClass('on');
        },

        disabled: false,
        slide: true,
        loose: true,
        speed: 0.25,
        css3: true,

        dragStartCallback: function (x, y) {
          console.log('dragStartCallback :', x, y)
        },
        dragStopCallback: function (x, y) {
          console.log('dragStopCallback :', x, y)
        },
        slideEndCallback: function (x, y) {
          console.log('slideEndCallback :', x, y)
        }
      }
    }).init();

    // activate 3rd btn
    slideTab.activate(3);
  }
}(jQuery));