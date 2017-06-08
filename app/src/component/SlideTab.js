import HorizontalSlideNavi from '../navi/HorizontalSlideNavi';
import { isDefined } from '../../utils/util';
import { BREAKPOINTS } from '../../model/model';

class SlideTab {
  constructor(options) {
    const _ = this;
    if (!options) return;

    _.option = $.extend(true, {
      wrap: null,

      activateIndex: 0,

      responsiveBasedButtonWidth: {
        isApply: true,
        classWhenPercentageTab: 'percentage'
      },

      breakpoint: BREAKPOINTS,

      global: window
    }, options);

    // import Dragdealer
    _.Dragdealer = require('../../vendor/dragdealer-v0.9.8/dragdealer');

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

  init(obj) {
    const _ = this;
    if (!_.option) return;

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setInstance();

    _.setResizeEventHandler(true);
    _.resize();
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.wrap = $(opt.wrap);
    _.btnsWrap = $('.btns', _.wrap);
    _.btnListItems = $('li', _.btnsWrap);

    if (_.wrap.length > 1) {
      throw new Error(`must set only one element to SlideTab's "wrap" option.`);
      return;
    }

    if (isDefined(opt.responsiveBasedButtonWidth) && opt.responsiveBasedButtonWidth.isApply === true) {
      _.setResponsiveBasedButtonWidth();
    } else {
      _.setListItemsPercentageWidth(_.btnListItems, false);
    }

    _.setSlideNavi();
    _.slideNavi.activate(opt.activateIndex);
    _.activateIndex = opt.activateIndex;
  }

  setResponsiveBasedButtonWidth() {
    const _ = this,
      opt = _.option,
      wrapWidth = _.wrap.outerWidth();

    // back to original buttons.
    let percentageTabClass = opt.responsiveBasedButtonWidth.classWhenPercentageTab;
    _.wrap.removeClass(percentageTabClass);
    _.setListItemsPercentageWidth(_.btnListItems, false);

    // set percentage buttons or not. based expected average buttons width.
    let btnWidthMax = _.getBtnWidthMax(_.btnListItems),
      expectedAverageBtnWidth = ( wrapWidth / _.btnListItems.length );
    // console.log('btnWidthMax, expectedAverageBtnWidth :', btnWidthMax, expectedAverageBtnWidth);

    if (btnWidthMax <= expectedAverageBtnWidth) {
      // console.log('can set percentage buttons.');

      _.destroySlideNavi();
      _.setListItemsPercentageWidth(_.btnListItems, true);
      _.wrap.addClass(percentageTabClass);

    } else {
      // console.log('one button max width > percentage button width.');

      if (!_.slideNavi) {
        _.setSlideNavi();
        _.slideNavi.activate(_.activateIndex);
      }

      // recalculate based on positioned layout.
      if (wrapWidth > $(_.slideNavi.getHandle()).outerWidth()) {
        _.slideNavi.disable().setX(0);

        /*
         if (btnWidthMax <= expectedAverageBtnWidth) {
         console.log('slide exist. btnWidthMax <= expectedAverageBtnWidth');
         _.destroySlideNavi();
         _.setListItemsPercentageWidth(_.btnListItems, true);
         _.wrap.addClass(percentageTabClass);

         } else {
         console.log('slide exist. btnWidthMax > expectedAverageBtnWidth');
         _.slideNavi.disable().setX(0);
         }
         */
      } else {
        _.slideNavi.enable();
      }
    }
  }

  setListItemsPercentageWidth(listItems, flag) {
    if (!listItems || listItems.length <= 0) return;

    if (flag) {
      let percentage = (100 / listItems.length).toFixed(4) + '%';
      listItems.css({width: percentage});
    } else {
      listItems.css({width: ''});
    }
  }

  setSlideNavi() {
    const _ = this;

    _.slideNavi = new HorizontalSlideNavi({
      Dragdealer: _.Dragdealer,

      // Navi.js option
      btns: $('li a', _.btnsWrap),
      /*
       mouseoverCallback: function (obj) {
       },
       mouseoutCallback: function (obj) {
       },
       mousedownCallback: function (obj) {
       },
       mouseupCallback: function (obj) {
       },
       */

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
        let btns = $(_.slideNavi.getBtns()),
          btn = $(_.slideNavi.getBtn(obj.index));

        btns.removeClass('on');
        btn.addClass('on');

        _.activateIndex = obj.index;
      },

      // HorizontalSlideNavi.js option
      wrap: _.wrap,
      handleClass: 'handle',
      btnsWrap: _.btnsWrap

      /*
       disabled: false,
       slide: true,
       loose: true,
       speed: 0.25,
       css3: true,

       dragStartCallback: function (x, y) {
       },
       dragStopCallback: function (x, y) {
       },
       slideEndCallback: function (x, y) {
       }
       */
    });
    _.slideNavi.init();
  }

  getBtnWidthMax(btns) {
    const _ = this;
    if (!btns || btns.length <= 0) return 0;

    let btnWidths = [];
    for (let i = 0, max = btns.length; i < max; i++) {
      btnWidths.push($(btns[i]).outerWidth());
    }

    // sort by descending order
    btnWidths.sort((a, b) => {
      return b - a;
    });

    return btnWidths[0];
  }

  destroySlideNavi() {
    const _ = this;
    if (_.slideNavi) _.slideNavi.destroy();
    _.slideNavi = null;
  }

  setResizeEventHandler(flag) {
    const _ = this,
      global = $(_.global);

    if (flag) {
      global.on('resize.ui.slidetab', _.proxy.resizeEventHandler);
    } else {
      global.off('resize.ui.slidetab', _.proxy.resizeEventHandler);
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

  destroy(obj) {
    let _ = this;

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