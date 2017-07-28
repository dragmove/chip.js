import HorizontalSlideNavi from './HorizontalSlideNavi';
import { isDefined, isNumber, isFunction, not, allOf, truthy, nth, best, notSingleEle } from '../utils/util';

class SlideTab {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require option object when create SlideTab instance.');
    }

    let opt = $.extend(true, {
      Dragdealer: null,

      wrap: null,
      handleClass: 'handle',
      btnsWrap: null,

      responsiveBasedButtonWidth: {
        isApply: true,
        classWhenPercentageTab: 'percentage'
      },

      switchBreakpoint: Number.MAX_VALUE,

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

      resize: null,

      global: window
    }, options);

    opt.Dragdealer = (isDefined(opt.Dragdealer)) ? opt.Dragdealer : opt.global.Dragdealer;
    if (not(isDefined)(opt.Dragdealer)) {
      throw new Error('SlideTab.js require Dragdealer Library - https://github.com/skidding/dragdealer.');
    }

    const _ = this;

    _.option = opt;

    _.uniqueId = Date.now();

    _.global = _.option.global || window;

    _.wrap = null;
    _.btnsWrap = null;
    _.btnListItems = [];

    _.slideNavi = null;

    _.proxy = {
      resizeEventHandler: null
    };

    _.mode = 'slideNavi'; // 'slideNavi' or 'slideTab' by switchBreakpoint
  }

  init(obj = null) {
    const _ = this;

    _.mode = _.getMode(_.global.innerWidth);

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setInstance();

    _.setResizeEventHandler(true);

    _.resize();

    return _;
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.wrap = $(opt.wrap);
    _.btnsWrap = $(opt.btnsWrap);
    _.btnListItems = $('li', _.btnsWrap);

    if (notSingleEle(_.wrap)) throw new Error('must set only one element to SlideTab\'s "wrap" option.');

    if (isDefined(opt.responsiveBasedButtonWidth) && truthy(opt.responsiveBasedButtonWidth.isApply)) {
      // TODO - _.setResponsiveBasedButtonWidth();

    } else {
      _.setListItemsPercentageWidth(_.btnListItems, false);
    }

    _.setSlideNavi();
  }

  setListItemsPercentageWidth(listItems, flag) {
    if (not(isDefined)(listItems) || listItems.length <= 0) return;

    if (truthy(flag)) {
      const percentage = (100 / listItems.length).toFixed(4) + '%';
      listItems.css({width: percentage});

    } else {
      listItems.css({width: ''});
    }
  }

  setSlideNavi() {
    const _ = this,
      opt = _.option,
      navi = opt.horizontalSlideNavi;

    _.slideNavi = new HorizontalSlideNavi({
      Dragdealer: _.option.Dragdealer,

      // Navi.js option
      btns: $('li a', _.btnsWrap),
      mouseoverCallback: navi.mouseoverCallback,
      mouseoutCallback: navi.mouseoutCallback,
      mousedownCallback: navi.mousedownCallback,
      mouseupCallback: navi.mouseupCallback,
      clickCallback: navi.clickCallback,
      activateCallback: navi.activateCallback,

      // HorizontalSlideNavi.js option
      wrap: _.wrap,
      handleClass: opt.handleClass,

      disabled: navi.disabled,
      slide: navi.slide,
      loose: navi.loose,
      speed: navi.speed,
      css3: navi.css3,

      dragStartCallback: navi.dragStartCallback,
      dragStopCallback: navi.dragStopCallback,
      slideEndCallback: navi.slideEndCallback

    }).init();
  }

  destroySlideNavi() {
    const _ = this;

    if (isDefined(_.slideNavi)) _.slideNavi.destroy();

    _.slideNavi = null;
  }

  setResizeEventHandler(flag) {
    const _ = this;

    if (truthy(flag)) {
      $(_.global).on(`resize.ui.slidetab.${_.uniqueId}`, _.proxy.resizeEventHandler);

    } else {
      $(_.global).off(`resize.ui.slidetab.${_.uniqueId}`, _.proxy.resizeEventHandler);
    }

    return _;
  }

  resize(evt) {
    const _ = this,
      opt = _.option;

    // TODO
    /*
     if (isDefined(opt.responsiveBasedButtonWidth) && truthy(opt.responsiveBasedButtonWidth.isApply)) {
     _.setResponsiveBasedButtonWidth();
     return;
     }
     */

    if (isNumber(opt.switchBreakpoint)) {
      const mode = _.getMode(_.global.innerWidth);

      if (_.mode !== mode) {
        switch (mode) {
          case 'slideNavi' :
            _.slideNavi.enable().setRatioX(0);
            _.setListItemsPercentageWidth(_.btnListItems, false);
            break;

          case 'slideTab' :
            _.slideNavi.disable().setRatioX(0);
            _.setListItemsPercentageWidth(_.btnListItems, true);
            break;
        }

        _.mode = mode;
      }
    }

    if (isFunction(opt.resize)) opt.resize.call(_, evt);

    return _;
  }

  getMode(width) {
    const _ = this,
      opt = _.option,
      browserWidth = (isNumber(width)) ? width : _.global.innerWidth;

    if (not(isNumber)(opt.switchBreakpoint)) throw new TypeError('switchBreakpoint option type must be Number.');

    const mode = ( opt.switchBreakpoint <= browserWidth) ? 'slideTab' : 'slideNavi';
    return mode;
  }

  /*
   * public methods
   */
  getBtns() {
    return (isDefined(this.slideNavi)) ? this.slideNavi.getBtns() : [];
  }

  getBtn(index) {
    return (isDefined(this.slideNavi)) ? this.slideNavi.getBtn(index) : null;
  }

  getActivatedIndex() {
    return (isDefined(this.slideNavi)) ? this.slideNavi.getActivatedIndex() : 0;
  }

  activate(index) {
    if (isDefined(this.slideNavi)) this.slideNavi.activate(index);
  }

  setSlideNaviX(x) {
    const _ = this;

    if (allOf(isDefined(_.slideNavi), (_.mode === 'slideNavi'))) {
      _.slideNavi.setX(x);
    }
  }

  setSlideNaviRatioX(x) {
    const _ = this;

    if (allOf(isDefined(_.slideNavi), (_.mode === 'slideNavi'))) {
      _.slideNavi.setRatioX(x);
    }
  }

  destroy(obj = null) {
    const _ = this;

    _.setResizeEventHandler(false);

    if (isDefined(_.slideNavi)) {
      _.slideNavi.destroy();
      _.slideNavi = null;
    }

    _.wrap = null;
    _.btnsWrap = null;
    _.btnListItems = [];

    return _;
  }

  /*
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
   */
}

export default SlideTab;