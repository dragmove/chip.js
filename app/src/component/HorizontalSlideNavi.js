import Navi from './Navi';
import { isDefined, not } from '../utils/util';

class HorizontalSlideNavi extends Navi {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require option object when create HorizontalSlideNavi instance.');
    }

    let opt = $.extend(true, {
      // require Dragdealer library - https://github.com/skidding/dragdealer
      Dragdealer: null,

      /*
       // Navi.js options
       btns,
       mouseoverCallback,
       mouseoutCallback,
       mousedownCallback,
       mouseupCallback,
       clickCallback,
       activateCallback,
       */

      // HorizontalSlideNavi.js options
      wrap: null,
      handleClass: 'handle',

      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,

      dragStartCallback: null, // function(x, y)
      dragStopCallback: null, // function(x, y)
      slideEndCallback: null, // function(x, y)

      global: window
    }, options);

    opt.Dragdealer = (opt.Dragdealer) ? opt.Dragdealer : opt.global.Dragdealer;
    if (not(isDefined)(opt.Dragdealer)) {
      throw new Error('HorizontalSlideNavi.js require Dragdealer Library - https://github.com/skidding/dragdealer.');
    }

    super(opt);

    const _ = this;

    _.option = opt;

    _.uniqueId = Date.now();

    _.isDraggable = false;

    _.dragDealer = null;

    // add resize event handler to proxy object in Navi.js
    $.extend(true, _.proxy, {
      resizeEventHandler: null
    });
  }

  init(obj = null) {
    super.init(obj);

    const _ = this;

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setInstance();

    _.setResizeEventHandler(true);
    _.resize();

    return _;
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.dragDealer = new opt.Dragdealer($(opt.wrap).get(0), {
      handleClass: opt.handleClass,
      disabled: opt.disabled,
      horizontal: true,
      vertical: false,
      slide: opt.slide,
      loose: opt.loose,
      speed: opt.speed,
      css3: opt.css3,

      dragStartCallback: opt.dragStartCallback,
      dragStopCallback: opt.dragStopCallback,
      callback: opt.slideEndCallback
    });

    return _;
  }

  setResizeEventHandler(flag) {
    const _ = this,
      global = $(_.option.global);

    if (flag === true) {
      global.on(`resize.ui.horizontalslidenavi.${_.uniqueId}`, _.proxy.resizeEventHandler);

    } else {
      global.off(`resize.ui.horizontalslidenavi.${_.uniqueId}`, _.proxy.resizeEventHandler);
    }

    return _;
  }

  resize(evt) {
    const _ = this;

    if (isDefined(_.dragDealer)) {
      let opt = _.option;

      if ($(_.getHandle()).outerWidth() > $(opt.wrap).width()) {
        // console.log('can scroll');

        _.dragDealer.enable();
        _.isDraggable = true;

      } else {
        // console.log('can not scroll');

        if (_.dragDealer.disabled === false) _.dragDealer.disable();
        _.setRatioX(0);
        _.isDraggable = false;
      }
    }

    return _;
  }

  /*
   * public methods
   */
  // can use getBtns(), getBtn(index), getActivatedIndex(), activate(index) method from Navi.js

  getRatioX() {
    const offset = this.dragDealer.getValue();
    return offset[0];
  }

  getOffsetRatioByPosition(x) {
    return this.dragDealer.getRatiosByOffsets([x, 0]); // return [0, 0];
  }

  getHandle() {
    return this.dragDealer.handle;
  }

  setX(x) {
    const _ = this,
      offset = _.getOffsetRatioByPosition(x);

    _.dragDealer.setValue(offset[0], offset[1]);

    return _;
  }

  setRatioX(ratioX) {
    this.dragDealer.setValue(ratioX, 0);
    return this;
  }

  isSlidable() {
    return this.isDraggable;
  }

  enable() {
    this.dragDealer.enable();
    return this;
  }

  disable() {
    this.dragDealer.disable();
    return this;
  }

  destroy(obj = null) {
    const _ = this;

    _.setResizeEventHandler(false);

    _.isDraggable = false;

    if (isDefined(_.dragDealer)) _.dragDealer.unbindEventListeners();
    _.dragDealer = null;

    super.destroy(obj);

    return _;
  }
}

export default HorizontalSlideNavi;