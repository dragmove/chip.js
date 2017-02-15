/*
 @example

 // html
 <div class="slide-navi">
 <div class="handle">
 <ul class="btns">
 <li><a href="#">btn 1</a></li><li><a href="#">btn 2</a></li><li><a href="#">btn 3</a></li><li><a href="#">btn 4</a></li><li><a href="#">btn 5</a></li><li><a href="#">btn 6</a></li><li><a href="#">btn 7</a></li><li><a href="#">btn 8</a></li><li><a href="#">btn 9</a></li><li><a href="#">btn 10</a></li>
 </ul>
 </div>
 </div>

 <div class="test-btns">
 <a href="#">1</a>
 <a href="#">2</a>
 <a href="#">3</a>
 <a href="#">4</a>
 <a href="#">5</a>
 <a href="#">6</a>
 <a href="#">7</a>
 <a href="#">8</a>
 <a href="#">9</a>
 <a href="#">10</a>
 </div>

 // css
 .slide-navi {
 position: relative;
 width: 100%;
 height: 50px;
 overflow: hidden;
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
 outline: 1px solid #006666;
 }

 .slide-navi .btns li a {
 display: block;
 margin-left: 0;
 margin-right: 0;
 padding-left: 5px;
 padding-right: 5px;
 background-color: #555555;
 color: #222;
 text-align: center;
 }

 .slide-navi .btns li a.on {
 color: #f00;
 }

 // js
 import HorizontalSlideNavi from './component/HorizontalSlideNavi';

 let slideNaviWrap = $('.slide-navi'),
 btnsWrap = $('.btns', slideNaviWrap);

 let slideNavi = new HorizontalSlideNavi({
 // Navi.js options
 btns: $('li a', btnsWrap),
 mouseoverCallback: function (obj) {
 console.log('mouseover :', obj);
 },
 mouseoutCallback: function (obj) {
 console.log('mouseout :', obj);
 },
 mousedownCallback: function (obj) {
 console.log('mousedown :', obj);
 },
 mouseupCallback: function (obj) {
 console.log('mouseup :', obj);
 },
 clickCallback: function (obj) {
 console.log('click :', obj);
 },
 activateCallback: function (obj) {
 let btns = $(slideNavi.getBtns()),
 btn = $(slideNavi.getBtn(obj.index));

 btns.removeClass('on');
 btn.addClass('on');
 },

 // HorizontalSlideNavi.js options
 wrap: slideNaviWrap,
 handleClass: 'handle',
 btnsWrap: btnsWrap,

 disabled: false,
 slide: true,
 loose: true,
 speed: 0.25,
 css3: true,

 dragStartCallback: function (x, y) {
 console.log('dragStartCallback :', x, y);
 },
 dragStopCallback: function (x, y) {
 console.log('dragStopCallback :', x, y);
 },
 slideEndCallback: function (x, y) {
 console.log('scrollEnd x, y :', x, y);
 }
 });
 slideNavi.init();

 // TEST
 $('.test-btns a').on('click', function (evt) {
 let index = $(this).index() + 1;
 activateSlideNavi(index);
 });

 function activateSlideNavi(index) {
 if (slideNavi) slideNavi.activate(index);

 if (index < 1 || index > slideNavi.getBtns().length) return;

 let prev = (index <= 1) ? 0 : index - 1,
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

 let btn = $(slideNavi.getBtn(prev));
 if (btn.length) slideNavi.setX(-btn.position().left);
 }
 */

import Navi from './Navi';

class HorizontalSlideNavi extends Navi {
  constructor(options) {
    if (!options) return;

    let opt = {
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
      Dragdealer: null,

      wrap: null,
      handleClass: '',
      btnsWrap: null,

      disabled: false,
      slide: true,
      loose: true,
      speed: 0.25,
      css3: true,

      dragStartCallback: null,
      dragStopCallback: null,
      slideEndCallback: null
    };
    $.extend(opt, options);

    opt.Dragdealer = (opt.Dragdealer) ? opt.Dragdealer : window.Dragdealer;
    if(!opt.Dragdealer) {
      // https://github.com/skidding/dragdealer
      throw new Error('HorizontalSlideNavi.js require Dragdealer.js Library.');
    }

    super(opt);

    let _ = this;

    _.option = opt;

    _.$proxyResize = $.proxy(_.resize, _);

    _.isDraggable = false;

    _.dragDealer = null;
  }

  init(obj) {
    super.init(obj);

    this.setInstance();
  }

  setInstance() {
    const _ = this;

    let opt = _.option;

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

    $(window).on('resize.ui.horizontalslidenavi', _.$proxyResize);
    _.resize();
  }

  resize(evt) {
    const _ = this;

    if (!_.dragDealer) return;

    if (_.option.btnsWrap.width() > window.innerWidth) {
      // console.log('can scroll');
      _.dragDealer.enable();

      _.isDraggable = true;

    } else {
      // console.log('can not scroll');
      if(!_.dragDealer.disabled) _.dragDealer.disable();

      _.setRatioX(0);

      _.isDraggable = false;
    }

    return _;
  }

  /*
   * public methods
   */
  // getBtns()
  // getBtn(index)
  // getActivatedIndex()
  // activate(index)

  getRatioX() {
    let offset = this.dragDealer.getValue();
    return offset[0];
  }

  getOffsetRatioByPosition(x) {
    return this.dragDealer.getRatiosByOffsets([x, 0]); // return [0, 0];
  }

  getHandle() {
    return this.dragDealer.handle;
  }

  setX(x) {
    let offset = this.getOffsetRatioByPosition(x);
    this.dragDealer.setValue(offset[0], offset[1]);

    return this;
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

  destroy(obj) {
    let _ = this;

    $(window).off('resize.ui.horizontalslidenavi', _.$proxyResize);
    _.$proxyResize = null;

    _.isDraggable = false;

    if (_.dragDealer) _.dragDealer.unbindEventListeners();
    _.dragDealer = null;

    super.destroy(obj);

    return _;
  }
}

export default HorizontalSlideNavi;