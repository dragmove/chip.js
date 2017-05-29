import ModalHasOverlay from './ModalHasOverlay';
import isMobile from '../../vendor/isMobile-v0.4.1/isMobile.min.js';

class PositionalModal extends ModalHasOverlay {
  constructor(options) {
    super(options);

    const _ = this;

    _.option = $.extend(true, {
      global: window
    }, _.option);

    _.global = _.option.global;
  }

  /*
   * protected methods
   */
  init(obj) {
    super.init(obj);

    const _ = this;

    // set base css
    _.wrap.css({
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    });

    _.contents.css({
      position: 'relative',
      top: _.global.innerHeight / 2,
      transform: 'translateY(-50%)'
    });

    if (isMobile.any) {
      _.setMobileEnvironment();
    }

    // add proxy
    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setResizeEventHandler(true);

    _.resize();
  }

  show() {
    super.show();

    this.resize();

    return this;
  }

  destroy(obj) {
    const _ = this;

    $(_.global)
      .off('resize.ui.positionalmodal')
      .off('orientationchange.ui.positionalmodal');

    super.destroy(obj);

    return _;
  }

  /*
   * private methods
   */
  setMobileEnvironment() {
    this.wrap.addClass('mobile');
  }

  setContentToCenterVertically() {
    this.contents.css({top: this.global.innerHeight / 2});
  }

  setResizeEventHandler(flag) {
    const _ = this;

    if (!_.wrap) return;

    const global = $(_.global);

    if (flag) {
      global
        .on('resize.ui.positionalmodal', _.proxy.resizeEventHandler)
        .on('orientationchange.ui.positionalmodal', _.proxy.resizeEventHandler);

    } else {
      global
        .off('resize.ui.positionalmodal', _.proxy.resizeEventHandler)
        .off('orientationchange.ui.positionalmodal', _.proxy.resizeEventHandler);
    }

    return _;
  }

  resize(evt) {
    const _ = this;

    // resize contentToResizeHeight element.
    if (_.global.innerHeight < _.contents.height()) {
      _.wrap
        .css({position: 'absolute'})
        .addClass('is-exceed-vertically');

      _.contents.css({
        top: 0,
        transform: 'translateY(0)'
      });

    } else {
      _.wrap
        .css({position: 'fixed'})
        .removeClass('is-exceed-vertically');

      _.contents.css({
        top: _.global.innerHeight / 2,
        transform: 'translateY(-50%)'
      });
    }
  }
}

export default PositionalModal;