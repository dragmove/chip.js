/*
 @example

 // html
 <div class="slide-navi">
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

 <style>
 #test-btns {
 margin-top: 10px;
 }

 #test-btns a {
 cursor: pointer;
 color: #333;
 }

 #test-btns a:hover {
 color: #f43142;
 }
 </style>

 <div id="test-btns">
 <a>1</a>
 <a>2</a>
 <a>3</a>
 <a>4</a>
 <a>5</a>
 <a>6</a>
 <a>7</a>
 <a>8</a>
 <a>9</a>
 <a>10</a>
 </div>

 // css
 .slide-navi {
 position: relative;
 width: 100%;
 height: 50px;
 overflow: hidden;
 border-bottom: 1px solid rgba(0, 0, 0, 0.5);
 }

 .slide-navi .handle {
 position: absolute;
 top: 0;
 left: 0;
 }

 .slide-navi .btns {
 display: block;
 position: relative;
 margin: 0;
 padding: 0;
 font-size: 0;
 white-space: nowrap;
 }

 .slide-navi .btns:after {
 content: "";
 display: block;
 clear: both;
 }

 .slide-navi .btns li {
 display: inline-block;
 height: 50px;
 line-height: 50px;
 }

 .slide-navi .btns li a {
 display: block;
 margin-left: 0;
 margin-right: 0;
 padding-left: 8px;
 padding-right: 8px;
 color: #333;
 font-size: 15px;
 font-weight: bold;
 text-align: center;
 text-decoration: none;
 }

 .slide-navi .btns li a.on {
 color: #f43142;
 }

 // js
 import HorizontalSlideNavi from './component/HorizontalSlideNavi';

 // set HorizontalSlideNavi extends Navi
 let slideNaviWrap = $('.slide-navi'),
 btnsWrap = $('.btns', slideNaviWrap);

 let slideNavi = new HorizontalSlideNavi({
 Dragdealer: window.Dragdealer,

 // Navi options
 btns: $('li a', btnsWrap),

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
 btnsWrap: btnsWrap,

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
 */

import Navi from './Navi';
import { isDefined, not } from '../utils/util';

class HorizontalSlideNavi extends Navi {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require option object when create HorizontalSlideNavi instance.');
    }

    let opt = {
      // require Dragdealer library
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
      btnsWrap: null,

      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,

      dragStartCallback: null, // function(x, y)
      dragStopCallback: null, // function(x, y)
      slideEndCallback: null, // function(x, y)

      global: window
    };
    $.extend(true, opt, options);

    opt.Dragdealer = (opt.Dragdealer) ? opt.Dragdealer : opt.global.Dragdealer;
    if (not(isDefined)(opt.Dragdealer)) {
      throw new Error('HorizontalSlideNavi.js require Dragdealer Library - https://github.com/skidding/dragdealer');
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