/*
 @example

 // html
 <div id="wrapper">
 <div class="fullsize-bg">
 <img src="https://images.unsplash.com/photo-1474496517593-015d8b59450d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=49563d997d36faad03833ddab8d15c0a" alt="">
 </div>
 </div>

 // css
 #wrapper {
 position: relative;
 overflow: hidden;
 background: #333;
 }

 .fullsize-bg {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 }

 // js
 import FullSizeBg from './component/FullSizeBg';

 let fullSizeBg = new FullSizeBg({
 imgWrap: $('.fullsize-bg'),
 imgWidth: 4592,
 imgHeight: 3064,
 alignX: 'center', // left, center, right
 alignY: 'center' // top, center, bottom
 });
 fullSizeBg.init();

 $(window).on('resize', function (evt) {
 $('#wrapper').css({
 width: window.innerWidth,
 height: window.innerHeight
 });
 }).trigger('resize');
 */

class FullSizeBg {
  constructor(options) {
    const _ = this;

    _.uniqueId = Date.now();

    _.option = {
      imgWrap: null,
      imgWidth: 320,
      imgHeight: 240,
      alignX: 'center',
      alignY: 'center'
    };
    $.extend(_.option, options);

    _.option.imgWrap = $(_.option.imgWrap);
    if (_.option.imgWrap.length <= 0) {
      throw new Error('FullSizeBg Class require options have imgWrap');
    }

    _.img = $('img', _.option.imgWrap);

    _.$proxyResize = $.proxy(_.resize, _);
  }

  init(obj) {
    const _ = this;

    $(window).on(`resize.ui.fullsizebg.${_.uniqueId}`, _.$proxyResize);

    return _;
  }

  getImageSizeAspectFill() {
    const _ = this,
      opt = _.option;

    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      modifiedSizeW = winWidth,
      modifiedSizeH = Math.ceil((winWidth / opt.imgWidth) * opt.imgHeight);

    if (modifiedSizeH < winHeight) {
      modifiedSizeW = Math.ceil((winHeight / opt.imgHeight) * opt.imgWidth);
      modifiedSizeH = winHeight;
    }

    return {
      width: modifiedSizeW,
      height: modifiedSizeH
    };
  }

  setWrapAlign(alignX, alignY, modifiedSize) {
    const _ = this;

    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      left = 0,
      top = 0;

    switch (alignX) {
      case 'left' :
        left = 0;
        break;

      case 'center' :
        left = Math.round((winWidth - modifiedSize.width) / 2);
        break;

      case 'right' :
        left = Math.round(winWidth - modifiedSize.width);
        break;
    }

    switch (alignY) {
      case 'top' :
        top = 0;
        break;

      case 'center' :
        top = Math.round((winHeight - modifiedSize.height) / 2);
        break;

      case 'bottom' :
        top = Math.round(winHeight - modifiedSize.height);
        break;
    }

    _.option.imgWrap.css({
      left: left,
      top: top
    });

    return _;
  }

  resize(evt) {
    const _ = this,
      size = _.getImageSizeAspectFill();

    _.img.width(size.width).height(size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);

    return _;
  }

  destroy(obj) {
    const _ = this;

    $(window).off(`resize.ui.fullsizebg.${_.uniqueId}`, _.$proxyResize);

    _.img = null;

    _.$proxyResize = null;

    return _;
  }
}

export default FullSizeBg;