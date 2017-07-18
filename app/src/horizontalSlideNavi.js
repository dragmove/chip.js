import HorizontalSlideNavi from './component/HorizontalSlideNavi';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    // set HorizontalSlideNavi extends Navi
    let slideNaviWrap = $('.slide-navi');

    let slideNavi = new HorizontalSlideNavi({
      Dragdealer: window.Dragdealer,

      // Navi options
      btns: $('.btns li a', slideNaviWrap),
      mouseoverCallback: function (obj) {
        // console.log('mouseover :', obj);
      },
      mouseoutCallback: function (obj) {
        // console.log('mouseout :', obj);
      },
      mousedownCallback: function (obj) {
        // console.log('mousedown :', obj);
      },
      mouseupCallback: function (obj) {
        // console.log('mouseup :', obj);
      },
      clickCallback: function (obj) {
        // console.log('click :', obj);
      },
      activateCallback: function (obj) {
        let btns = $(slideNavi.getBtns()),
          btn = $(slideNavi.getBtn(obj.index));

        btns.removeClass('on');
        btn.addClass('on');
      },

      // HorizontalSlideNavi options
      wrap: slideNaviWrap,
      handleClass: 'handle',

      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,

      dragStartCallback: function (x, y) {
        // console.log('dragStartCallback :', x, y);
      },
      dragStopCallback: function (x, y) {
        // console.log('dragStopCallback :', x, y);
      },
      slideEndCallback: function (x, y) {
        // console.log('scrollEnd x, y :', x, y);
      }
    });
    slideNavi.init();

    // control HorizontalSlideNavi by external
    $('#test-btns a').on('click', function (evt) {
      evt.preventDefault();

      const index = $('#test-btns a').index(this) + 1;
      activateSlideNavi(index);
    });

    function activateSlideNavi(index) {
      if (slideNavi) slideNavi.activate(index);

      if (index < 1 || index > slideNavi.getBtns().length) return;

      const prev = (index <= 1) ? 0 : index - 1,
        next = (index > slideNavi.getBtns().length) ? 0 : index + 1;

      if (!prev) {
        // go to left end.
        slideNavi.setRatioX(0);
        return;
      }

      if (!next) {
        // go go right end.
        slideNavi.setRatioX(1);
        return;
      }

      const btn = $(slideNavi.getBtn(prev));
      if (btn.length) slideNavi.setX(-btn.position().left);
    }
  }
}(jQuery));