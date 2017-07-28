import SlideTab from './component/SlideTab';
import { isDefined, not } from './utils/util';

(function ($) {
  'use strict';

  let isNotDefined = not(isDefined);

  let sildeTabBasedBreakpoint = null,
    sildeTabBasedButtonWidth = null;

  $(document).ready(init);

  function init() {
    responsiveBasedBreakpoint();
    responsiveBasedButtonWidth();
  }

  function responsiveBasedBreakpoint() {
    var wrap = $('.responsive-based-breakpoint');

    sildeTabBasedBreakpoint = new SlideTab({
      Dragdealer: window.Dragdealer,

      wrap: wrap,
      handleClass: 'handle',
      btnsWrap: $('.btns', wrap),

      // option - switch between 'momentum slide navi' and 'percentage tab' based on width of buttons.
      // if switchBreakpoint.isApply is true, ignore calculation based on "switchBreakpoint" option.
      // if switchBreakpoint.isApply is false, apply calculation based on "switchBreakpoint" option.
      responsiveBasedButtonWidth: {
        isApply: false, // default true
        classWhenPercentageTab: 'percentage'
      },

      // option - switch between 'momentum slide navi' and 'percentage tab' based on browser inner width.
      // if browser inner width < switchBreakpoint, set 'momentum slide navi' mode.
      // if browser inner width >= switchBreakpoint, set 'percentage tab' mode.
      switchBreakpoint: 640,

      horizontalSlideNavi: {
        mouseoverCallback: function (obj) {
          //console.log('mouseoverCallback :', obj);
        },
        mouseoutCallback: function (obj) {
          //console.log('mouseoutCallback :', obj);
        },
        mousedownCallback: function (obj) {
          //console.log('mousedownCallback :', obj);
        },
        mouseupCallback: function (obj) {
          //console.log('mouseupCallback :', obj);
        },
        clickCallback: function (obj) {
          //console.log('clickCallback :', obj);
        },
        activateCallback: function (obj) {
          if (isNotDefined(obj)) return;

          const btns = $(sildeTabBasedBreakpoint.getBtns()),
            btn = $(sildeTabBasedBreakpoint.getBtn(obj.index));

          btns.removeClass('on');
          btn.addClass('on');

          var activatedIndex = obj.index;
          setSlideNaviPos(sildeTabBasedBreakpoint, activatedIndex);
        },

        disabled: false,
        slide: true,
        loose: true,
        speed: 0.25,
        css3: true,

        dragStartCallback: function (x, y) {
          //console.log('dragStartCallback :', x, y)
        },
        dragStopCallback: function (x, y) {
          //console.log('dragStopCallback :', x, y)
        },
        slideEndCallback: function (x, y) {
          //console.log('slideEndCallback :', x, y)
        }
      },

      resize: function (evt) {
        var activatedIndex = this.getActivatedIndex();
        setSlideNaviPos(sildeTabBasedBreakpoint, activatedIndex);
      }
    }).init();
  }

  function responsiveBasedButtonWidth() {
    var wrap = $('.responsive-based-button-width');

    sildeTabBasedButtonWidth = new SlideTab({
      Dragdealer: window.Dragdealer,

      wrap: wrap,
      handleClass: 'handle',
      btnsWrap: $('.btns', wrap),

      // option - switch between 'momentum slide navi' and 'percentage tab' based on width of buttons.
      // if switchBreakpoint.isApply is true, ignore calculation based on "switchBreakpoint" option.
      // if switchBreakpoint.isApply is false, apply calculation based on "switchBreakpoint" option.
      responsiveBasedButtonWidth: {
        isApply: true, // default true
        classWhenPercentageTab: 'percentage'
      },

      // option - switch between 'momentum slide navi' and 'percentage tab' based on browser inner width.
      // if browser inner width < switchBreakpoint, set 'momentum slide navi' mode.
      // if browser inner width >= switchBreakpoint, set 'percentage tab' mode.
      // switchBreakpoint: 640,

      horizontalSlideNavi: {
        mouseoverCallback: function (obj) {
          //console.log('mouseoverCallback :', obj);
        },
        mouseoutCallback: function (obj) {
          //console.log('mouseoutCallback :', obj);
        },
        mousedownCallback: function (obj) {
          //console.log('mousedownCallback :', obj);
        },
        mouseupCallback: function (obj) {
          //console.log('mouseupCallback :', obj);
        },
        clickCallback: function (obj) {
          //console.log('clickCallback :', obj);
        },
        activateCallback: function (obj) {
          if (isNotDefined(obj)) return;

          const btns = $(sildeTabBasedButtonWidth.getBtns()),
            btn = $(sildeTabBasedButtonWidth.getBtn(obj.index));

          btns.removeClass('on');
          btn.addClass('on');

          var activatedIndex = obj.index;
          setSlideNaviPos(sildeTabBasedButtonWidth, activatedIndex);
        },

        disabled: false,
        slide: true,
        loose: true,
        speed: 0.25,
        css3: true,

        dragStartCallback: function (x, y) {
          //console.log('dragStartCallback :', x, y)
        },
        dragStopCallback: function (x, y) {
          //console.log('dragStopCallback :', x, y)
        },
        slideEndCallback: function (x, y) {
          //console.log('slideEndCallback :', x, y)
        }
      },

      resize: function (evt) {
        var activatedIndex = this.getActivatedIndex();
        setSlideNaviPos(sildeTabBasedButtonWidth, activatedIndex);
      }
    }).init();
  }

  function setSlideNaviPos(slideTab, index) {
    if (index < 1 || index > slideTab.getBtns().length) return;

    const prev = (index <= 1) ? 0 : index - 1,
      next = (index > slideTab.getBtns().length) ? 0 : index + 1;

    if (!prev) {
      // go to left end.
      slideTab.setSlideNaviRatioX(0);
      return;
    }

    if (!next) {
      // go go right end.
      slideTab.setSlideNaviRatioX(1);
      return;
    }

    const btn = $(slideTab.getBtn(prev));
    if (btn.length) slideTab.setSlideNaviX(-btn.position().left);
  }
}(jQuery));