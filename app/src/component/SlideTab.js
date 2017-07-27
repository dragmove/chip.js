import HorizontalSlideNavi from './HorizontalSlideNavi';
import { isDefined, not, truthy, best, pipeline } from '../utils/util';

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

    // _.activateIndex = 0; // TODO - remove

    _.proxy = {
      resizeEventHandler: null
    };
  }

  init(obj = null) {
    const _ = this;

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setInstance();


    // TODO
    return _;




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

    if (_.wrap.length > 1) throw new Error('must set only one element to SlideTab\'s "wrap" option.');

    if (isDefined(opt.responsiveBasedButtonWidth) && truthy(opt.responsiveBasedButtonWidth.isApply)) {
      // TODO - _.setResponsiveBasedButtonWidth();

    } else {
      _.setListItemsPercentageWidth(_.btnListItems, false);
    }

    _.setSlideNavi();

    // TODO - remove
    // _.slideNavi.activate(opt.activateIndex);
    // _.activateIndex = opt.activateIndex;
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

        // TODO - remove
        // _.slideNavi.activate(_.activateIndex);
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
      btnsWrap: _.btnsWrap, // TODO - remove

      disabled: navi.disabled,
      slide: navi.slide,
      loose: navi.loose,
      speed: navi.speed,
      css3: navi.css3,

      dragStartCallback: navi.dragStartCallback,
      dragStopCallback: navi.dragStopCallback,
      slideEndCallback: navi.slideEndCallback

      // TODO - arrange
      /*
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

        const btns = $(_.slideNavi.getBtns()),
          btn = $(_.slideNavi.getBtn(obj.index));

        btns.removeClass('on');
        btn.addClass('on');

        _.activateIndex = obj.index;
      }
      */




    }).init();
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

    if (isDefined(_.slideNavi)) _.slideNavi.destroy();

    _.slideNavi = null;
  }

  setResizeEventHandler(flag) {
    const _ = this,
      global = $(_.global);

    if (truthy(flag)) {
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

    if (isDefined(opt.responsiveBasedButtonWidth) && truthy(opt.responsiveBasedButtonWidth.isApply)) {
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
      if (not(isDefined)(_.slideNavi)) {
        _.setSlideNavi();

        // TODO - remove
        // _.slideNavi.activate(_.activateIndex);
      }

      _.setListItemsPercentageWidth(_.btnListItems, false);
    }
  }

  getBtns() {
    return this.slideNavi.getBtns();
  }

  getBtn(index) {
    return this.slideNavi.getBtn(index);
  }

  getActivatedIndex() {
    return this.slideNavi.getActivatedIndex();
  }

  activate(index) {
    this.slideNavi.activate(index);
  }

  destroy(obj = null) {
    const _ = this;

    _.setResizeEventHandler(false);

    _.slideNavi.destroy();
    _.slideNavi = null;

    _.wrap = null;
    _.btnsWrap = null;
    _.btnListItems = [];

    // _.activateIndex = 0; // TODO - remove

    return _;
  }
}

export default SlideTab;