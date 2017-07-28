import HorizontalSlideNavi from './HorizontalSlideNavi';
import { isDefined, isNotDefined, isNumber, isFunction, not, each, allOf, anyOf, truthy, best, pipeline, notSingleEle } from '../utils/util';

class SlideTab {
  constructor(options) {
    if (isNotDefined(options)) {
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
        mouseoverCallback: null, // function(obj) {}
        mouseoutCallback: null, // function(obj) {}
        mousedownCallback: null, // function(obj) {}
        mouseupCallback: null, // function(obj) {}
        clickCallback: null, // function(obj) {}
        activateCallback: null, // function(obj) {}

        disabled: false,
        slide: true,
        loose: true,
        speed: 0.25,
        css3: true,

        dragStartCallback: null, // function(x, y) {}
        dragStopCallback: null, // function(x, y) {}
        slideEndCallback: null // function(x, y) {}
      },

      resize: null, // function(evt) { scope }

      global: window
    }, options);

    opt.Dragdealer = (isDefined(opt.Dragdealer)) ? opt.Dragdealer : opt.global.Dragdealer;
    if (isNotDefined(opt.Dragdealer)) {
      throw new Error('SlideTab.js require Dragdealer Library - https://github.com/skidding/dragdealer.');
    }

    const _ = this;

    _.const = {
      SLIDE_NAVI: 'slideNavi',
      SLIDE_TAP: 'slideTab'
    };

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

    _.mode = ''; // 'slideNavi' or 'slideTab' by switchBreakpoint
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

    _.setSlideNavi();

    if (isDefined(opt.responsiveBasedButtonWidth) && truthy(opt.responsiveBasedButtonWidth.isApply)) {
      _.setResponsiveBasedButtonWidth();

    } else {
      _.switchMode(_.mode);
    }
  }

  setResponsiveBasedButtonWidth() {
    const _ = this,
      opt = _.option,
      tabClass = opt.responsiveBasedButtonWidth.classWhenPercentageTab,
      wrapWidth = _.wrap.outerWidth()

    // back to original buttons.
    _.setListItemsPercentageWidth(_.btnListItems, false);
    _.wrap.removeClass(tabClass);

    // set percentage buttons or not. based expected average buttons width.
    const btnWidthMax = _.getBtnWidthMax(_.btnListItems),
      expectedAverageBtnWidth = ( wrapWidth / _.btnListItems.length );

    if (btnWidthMax <= expectedAverageBtnWidth) {
      // console.log('can set buttons same percentage width');

      _.switchMode(_.const.SLIDE_TAP);
      _.wrap.addClass(tabClass);

    } else {
      // console.log('one button max width > percentage button width. can not set buttons same percentage width');

      _.switchMode(_.const.SLIDE_NAVI);

      // recalculate based on positioned layout.
      if (wrapWidth > $(_.slideNavi.getHandle()).outerWidth()) _.slideNavi.disable().setX(0);
    }
  }

  getBtnWidthMax(btns) {
    if (anyOf(isNotDefined(btns), btns.length <= 0)) return 0;

    const buttons = Array.prototype.slice.call(btns);

    const maxBtnWidth = pipeline(buttons, (btnArr) => {
      let btnWidths = [];

      each(btnArr, (btn) => {
        btnWidths.push($(btn).outerWidth());
      });

      return btnWidths;

    }, (widths) => {
      return best((x, y) => x > y, widths);
    });

    return maxBtnWidth;
  }

  setListItemsPercentageWidth(listItems, flag) {
    if (isNotDefined(listItems) || listItems.length <= 0) return;

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

  setResizeEventHandler(flag) {
    const _ = this;

    if (truthy(flag)) {
      $(_.global).on(`resize.ui.slidetab.${_.uniqueId}`, _.proxy.resizeEventHandler);

    } else {
      $(_.global).off(`resize.ui.slidetab.${_.uniqueId}`, _.proxy.resizeEventHandler);
    }

    return _;
  }

  resize(evt = null) {
    const _ = this,
      opt = _.option,
      breakpoint = opt.switchBreakpoint;

    if (isDefined(opt.responsiveBasedButtonWidth) && truthy(opt.responsiveBasedButtonWidth.isApply)) {
      _.setResponsiveBasedButtonWidth();

    } else {
      if (allOf(isNumber(breakpoint), (breakpoint >= 0), (breakpoint < Number.MAX_VALUE))) {
        const mode = _.getMode(_.global.innerWidth);

        if (_.mode !== mode) {
          _.switchMode(mode);
          _.mode = mode;
        }
      }
    }

    if (isFunction(opt.resize)) opt.resize.call(_, evt);

    return _;
  }

  switchMode(modeName) {
    const _ = this;

    switch (modeName) {
      case _.const.SLIDE_NAVI :
        _.slideNavi.enable().setRatioX(0);
        _.setListItemsPercentageWidth(_.btnListItems, false);
        break;

      case _.const.SLIDE_TAP :
        _.slideNavi.disable().setRatioX(0);
        _.setListItemsPercentageWidth(_.btnListItems, true);
        break;
    }
  }

  getMode(width) {
    const _ = this,
      opt = _.option,
      browserWidth = (isNumber(width)) ? width : _.global.innerWidth;

    if (not(isNumber)(opt.switchBreakpoint)) throw new TypeError('switchBreakpoint option type must be Number.');

    const mode = ( opt.switchBreakpoint <= browserWidth) ? _.const.SLIDE_TAP : _.const.SLIDE_NAVI;
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

    if (allOf(isDefined(_.slideNavi), (_.mode === _.const.SLIDE_NAVI))) {
      _.slideNavi.setX(x);
    }
  }

  setSlideNaviRatioX(x) {
    const _ = this;

    if (allOf(isDefined(_.slideNavi), (_.mode === _.const.SLIDE_NAVI))) {
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
}

export default SlideTab;