import HorizontalSlideNavi from './HorizontalSlideNavi';
import { isDefined, not, each, best, pipeline } from '../utils/util';

class SlideTab {
  constructor(options) {
    const _ = this;

    if (not(isDefined)(options)) {
      throw new Error('require option object when create SlideTab instance.');
    }

    let opt = {
      Dragdealer: null,

      wrap: null,
      handleClass: 'handle',
      btnsWrap: null,

      activateIndex: 0,

      responsiveBasedButtonWidth: {
        isApply: true,
        classWhenPercentageTab: 'percentage'
      },

      breakpoint: {
        tablet: 640,
        pc: 960,
        max: 1260
      },

      // TODO - arrange
      horizontalSlideNavi: {
        mouseoverCallback: null, // function(obj) { console.log('mouseoverCallback :', obj) },
        mouseoutCallback: null, // function(obj) { console.log('mouseoutCallback :', obj) },
        mousedownCallback: null, // function(obj) { console.log('mousedownCallback :', obj) },
        mouseupCallback: null, // function(obj) { console.log('mouseupCallback :', obj) },
        clickCallback: null, // function(obj) { console.log('clickCallback :', obj) },
        activateCallback: null, // function(obj) { console.log('activateCallback :', obj) },

        disabled: false,
        slide: true,
        loose: true,
        speed: 0.25,
        css3: true,

        dragStartCallback: null, // function(x, y) { console.log('dragStartCallback :', x, y) },
        dragStopCallback: null, // function(x, y) { console.log('dragStopCallback :', x, y) },
        slideEndCallback: null // function(x, y) { console.log('slideEndCallback :', x, y) }
      },

      global: window
    };
    $.extend(true, opt, options);

    opt.Dragdealer = (opt.Dragdealer) ? opt.Dragdealer : opt.global.Dragdealer;
    if (!opt.Dragdealer) {
      throw new Error('SlideTab.js require Dragdealer Library - https://github.com/skidding/dragdealer');
    }

    _.option = opt;

    _.uniqueId = Date.now();

    _.global = _.option.global || window;

    _.wrap = null;
    _.btnsWrap = null;
    _.btnListItems = [];

    _.slideNavi = null;

    _.activateIndex = 0;

    _.proxy = {
      resizeEventHandler: null
    };
  }

  init(obj = null) {
    const _ = this;

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setInstance();


    // TODO
    return;


    _.setResizeEventHandler(true);
    _.resize();
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.wrap = $(opt.wrap);
    _.btnsWrap = $(opt.btnsWrap);
    _.btnListItems = $('li', _.btnsWrap);

    if (_.wrap.length > 1) {
      throw new Error('must set only one element to SlideTab\'s "wrap" option.');
    }


    /*
     // TODO
     if (isDefined(opt.responsiveBasedButtonWidth) && opt.responsiveBasedButtonWidth.isApply === true) {
     _.setResponsiveBasedButtonWidth();

     } else {
     _.setListItemsPercentageWidth(_.btnListItems, false);
     }
     */

    _.setSlideNavi();

    _.slideNavi.activate(opt.activateIndex);
    _.activateIndex = opt.activateIndex;
  }

  setResponsiveBasedButtonWidth() {
    const _ = this,
      opt = _.option,
      wrapWidth = _.wrap.outerWidth();

    // back to original buttons.
    const percentageTabClass = opt.responsiveBasedButtonWidth.classWhenPercentageTab;
    _.wrap.removeClass(percentageTabClass);

    _.setListItemsPercentageWidth(_.btnListItems, false);

    // set percentage buttons or not. based expected average buttons width.
    const btnWidthMax = _.getBtnWidthMax(_.btnListItems),
      expectedAverageBtnWidth = ( wrapWidth / _.btnListItems.length );
    // console.log('btnWidthMax, expectedAverageBtnWidth :', btnWidthMax, expectedAverageBtnWidth);

    if (btnWidthMax <= expectedAverageBtnWidth) {
      // console.log('can set percentage buttons.');

      _.destroySlideNavi();
      _.setListItemsPercentageWidth(_.btnListItems, true);
      _.wrap.addClass(percentageTabClass);

    } else {
      // console.log('one button max width > percentage button width.');

      if (not(isDefined)(_.slideNavi)) {
        _.setSlideNavi();
        _.slideNavi.activate(_.activateIndex);
      }

      // recalculate based on positioned layout.
      if (wrapWidth > $(_.slideNavi.getHandle()).outerWidth()) {
        _.slideNavi.disable().setX(0);

        // if (btnWidthMax <= expectedAverageBtnWidth) {
        // console.log('slide exist. btnWidthMax <= expectedAverageBtnWidth');
        // _.destroySlideNavi();
        // _.setListItemsPercentageWidth(_.btnListItems, true);
        // _.wrap.addClass(percentageTabClass);
        //
        // } else {
        // console.log('slide exist. btnWidthMax > expectedAverageBtnWidth');
        // _.slideNavi.disable().setX(0);
        // }

      } else {
        _.slideNavi.enable();
      }
    }
  }

  setListItemsPercentageWidth(listItems, flag) {
    if (!listItems || listItems.length <= 0) return;

    if (flag === true) {
      const percentage = (100 / listItems.length).toFixed(4) + '%';
      listItems.css({width: percentage});

    } else {
      listItems.css({width: ''});
    }
  }

  setSlideNavi() {
    const _ = this,
      opt = _.option;

    _.slideNavi = new HorizontalSlideNavi({
      Dragdealer: _.option.Dragdealer,

      // Navi.js option
      btns: $('li a', _.btnsWrap),






      // TODO - test all
      mouseoverCallback: opt.horizontalSlideNavi.mouseoverCallback,
      mouseoutCallback: opt.horizontalSlideNavi.mouseoutCallback,
      mousedownCallback: opt.horizontalSlideNavi.mousedownCallback,
      mouseupCallback: opt.horizontalSlideNavi.mouseupCallback,
      clickCallback: opt.horizontalSlideNavi.clickCallback,
      activateCallback: opt.horizontalSlideNavi.activateCallback,

      // HorizontalSlideNavi.js option
      wrap: _.wrap,
      handleClass: _.option.handleClass,
      btnsWrap: _.btnsWrap,

      disabled: _.option.horizontalSlideNavi.disabled,
      slide: _.option.horizontalSlideNavi.slide,
      loose: _.option.horizontalSlideNavi.loose,
      speed: _.option.horizontalSlideNavi.speed,
      css3: _.option.horizontalSlideNavi.css3,

      dragStartCallback: _.option.horizontalSlideNavi.dragStartCallback,
      dragStopCallback: _.option.horizontalSlideNavi.dragStopCallback,
      slideEndCallback: _.option.horizontalSlideNavi.slideEndCallback

      /*
      // TODO - arrange
       clickCallback: function (obj) {
       if (!obj || !obj.btn) return;

       const btn = $(obj.btn),
       href = btn.attr('href'),
       target = btn.attr('target') || '_self';

       if (!href || href === '#') {
       obj.event.preventDefault();
       return;
       }

       if (target === '_self') {
       _.global.location.href = href;
       } else {
       _.global.open(href, target);
       }
       },

       activateCallback: function (obj) {
       console.log('activateCallback :', obj);

       let btns = $(_.slideNavi.getBtns()),
       btn = $(_.slideNavi.getBtn(obj.index));

       btns.removeClass('on');
       btn.addClass('on');

       _.activateIndex = obj.index;
       },
       */
    });
    _.slideNavi.init();
  }

  getBtnWidthMax(btns) {
    if (not(isDefined)(btns) || btns.length <= 0) return 0;

    btns = Array.prototype.slice.call(btns);

    const maxBtnWidth = pipeline(btns, (btnArr) => {
      let btnWidths = [];
      for (let i = 0, max = btnArr.length; i < max; i++) {
        btnWidths.push($(btnArr[i]).outerWidth());
      }

      return btnWidths;

    }, (widths) => {
      return best(function (x, y) {
        return x > y;
      }, widths);
    });

    return maxBtnWidth;
  }

  destroySlideNavi() {
    const _ = this;

    if (_.slideNavi) _.slideNavi.destroy();
    _.slideNavi = null;
  }

  setResizeEventHandler(flag) {
    const _ = this,
      global = $(_.global);

    if (flag === true) {
      global.on(`resize.ui.slidetab.${_.uniqueId}`, _.proxy.resizeEventHandler);

    } else {
      global.off(`resize.ui.slidetab.${_.uniqueId}`, _.proxy.resizeEventHandler);
    }

    return _;
  }

  resize(evt) {
    const _ = this,
      opt = _.option,
      breakpoint = opt.breakpoint;

    if (isDefined(opt.responsiveBasedButtonWidth) && opt.responsiveBasedButtonWidth.isApply === true) {
      _.setResponsiveBasedButtonWidth();
      return;
    }

    if (!breakpoint) return;
    if (isDefined(breakpoint.max) && _.global.innerWidth >= breakpoint.max) {
      _.destroySlideNavi();
      _.setListItemsPercentageWidth(_.btnListItems, true);

    } else if (isDefined(breakpoint.pc) && _.global.innerWidth >= breakpoint.pc) {
      _.destroySlideNavi();
      _.setListItemsPercentageWidth(_.btnListItems, true);

    } else if (isDefined(breakpoint.tablet) && _.global.innerWidth >= breakpoint.tablet) {
      _.destroySlideNavi();
      _.setListItemsPercentageWidth(_.btnListItems, true);

    } else {
      if (!_.slideNavi) {
        _.setSlideNavi();
        _.slideNavi.activate(_.activateIndex);
      }
      _.setListItemsPercentageWidth(_.btnListItems, false);
    }
  }

  destroy(obj = null) {
    const _ = this;

    _.setResizeEventHandler(false);

    _.slideNavi.destroy();
    _.slideNavi = null;

    _.wrap = null;
    _.btnsWrap = null;
    _.btnListItems = [];

    _.activateIndex = 0;

    return _;
  }
}

export default SlideTab;