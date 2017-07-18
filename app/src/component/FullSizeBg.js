import { isDefined, not, notSingleEle } from '../utils/util';

class FullSizeBg {
  constructor(options) {
    const _ = this;

    if (not(isDefined)(options)) {
      throw new Error('require options object when create FullSizeBg instance.');
    }

    _.option = $.extend({
      imgWrap: null,
      imgWidth: 320,
      imgHeight: 240,
      alignX: 'center',
      alignY: 'center',
      global: window
    }, options);

    _.uniqueId = Date.now();

    _.global = _.option.global;

    _.option.imgWrap = $(_.option.imgWrap);

    _.img = $('img', _.option.imgWrap);

    if (notSingleEle(_.option.imgWrap) || notSingleEle(_.img)) {
      throw new Error('FullSizeBg Class require options object has a single imgWrap has a single img.');
    }

    _.proxy = {
      resizeEventHandler: null
    };
  }

  init(obj = null) {
    const _ = this;

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setResizeEventHandler(true);

    return _;
  }

  setResizeEventHandler(flag) {
    const _ = this;

    if (flag === true) {
      $(_.global).on(`resize.ui.fullsizebg.${_.uniqueId}`, _.proxy.resizeEventHandler);

    } else {
      $(_.global).off(`resize.ui.fullsizebg.${_.uniqueId}`, _.proxy.resizeEventHandler);
    }
  }

  getImageSizeAspectFill() {
    const _ = this,
      opt = _.option;

    let winWidth = _.global.innerWidth,
      winHeight = _.global.innerHeight,
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

    let winWidth = _.global.innerWidth,
      winHeight = _.global.innerHeight,
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

  destroy(obj = null) {
    const _ = this;

    _.setResizeEventHandler(false);

    _.img = null;

    _.proxy.resizeEventHandler = null;

    return _;
  }
}

export default FullSizeBg;