import Navi from './Navi';

class HorizontalScrollNavi extends Navi {
  constructor(options) {
    if (!window.Dragdealer) {
      throw new Error('HorizontalScrollNavi.js require Dragdealer.js Library.');
    }
    if (!options) return;

    let opt = {
      /*
      // Navi.js options
       btns,
       mouseoverCallback,
       mouseoutCallback,
       clickCallback,
       activateCallback,
       */

      wrap: null,
      handleClass: '',
      btnsWrap: null,
      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,
      scrollCallback: null
    };
    $.extend(opt, options);

    super(opt);

    let _ = this;

    _.option = opt;

    _.isNeedScroll = false;

    _.dragDealer = null;

    _.$proxyResize = $.proxy(_.resize, _);
  }

  init(obj) {
    super.init(obj);

    this.setInstance();
  }

  setInstance() {
    let _ = this;

    let opt = _.option;
    console.log('opt :', opt);

    _.dragDealer = new window.Dragdealer($(opt.wrap).get(0), {
      handleClass: opt.handleClass,
      disabled: opt.disabled,
      horizontal: true,
      vertical: false,
      slide: opt.slide,
      loose: opt.loose,
      speed: opt.speed,
      css3: opt.css3,
      callback: opt.scrollCallback
    });

    /*
    // TODO
    $(window).on('resize orientationchange', _.$proxyResize);
    _.resize();
    */
  }

  resize(evt) {
    // TODO
    console.log('resize');

    let _ = this;

    if(!_.dragDealer) return;

    if (_.option.btnsWrap.width() > window.innerWidth) {
      _.dragDealer.enable();

      if(!isMobile.any) {
        _.dragDealer.disable();
      }

      _.isNeedScroll = true;

    } else {
      _.dragDealer.disable();

      _.isNeedScroll = false;

      _.setDragDealerPosition(0);
    }
  }

  /*
   * public methods
   */
  // getBtns()
  // getBtn(index)
  // getActivatedIndex()
  // activate(index)

  getRatiosByOffsets(x) {
    // TODO
    return this.dragDealer.getRatiosByOffsets([x, 0]);
  }

  setDragDealerPosition(x) {
    // TODO
    let offset = this.dragDealer.getRatiosByOffsets([x, 0]);
    this.dragDealer.setValue(offset[0], offset[1]);
  }

  setValue(x, y) {
    // TODO
    this.dragDealer.setValue(x, y);
  }

  resize() {
    // TODO
  }

  enable() {
    this.dragDealer.enable();
  }

  disable() {
    this.dragDealer.disable();
  }

  destroy(obj) {
    // TODO

    super.destroy(obj);
  }

  /*
   constructor(options) {
   if(!options) return;
   super(options);

   this.timerInterval = (options.timerInterval >= 0 || typeof options.timerInterval !== 'undefined') ? options.timerInterval : 500;
   this.timer = null;
   }

   mouseoverBtnEventHandler(evt) {
   this.removeTimer();
   super.mouseoverBtnEventHandler(evt);
   }

   mouseoutBtnEventHandler(evt) {
   let _ = this;

   super.mouseoutBtnEventHandler(evt);

   _.timer = setTimeout(() => {
   _.activateByTimer(_.activateIndex);
   }, _.timerInterval);
   }

   activateByTimer(index) {
   super.activate(index);
   }

   removeTimer() {
   if(this.timer) clearTimeout(this.timer);
   this.timer = null;
   }
   */
}

export default HorizontalScrollNavi;