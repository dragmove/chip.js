import { isDefined, isFunction, not } from '../utils/util';

class Overlay {
  constructor(options) {
    const _ = this;

    _.option = $.extend({
      class: 'overlay',
      color: '#000',
      opacity: 0.5,
      appendTo: $('body'),
      clickCallback: null
    }, options);

    _.node = null;

    _.parentNode = _.option.appendTo;

    _.proxy = {
      clickOverlayEventHandler: null
    };
  }

  /*
   * public methods
   */
  init(obj = null) {
    const _ = this;

    _.node = $(document.createElement('div')).addClass(_.option.class);
    _.node.css({
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      'background-color': _.option.color,
      opacity: _.option.opacity,
      filter: `alpha(opacity=${_.option.opacity * 100})`
    });

    _.parentNode.append(_.node);

    _.proxy.clickOverlayEventHandler = (isFunction(_.option.clickCallback)) ? $.proxy(_.option.clickCallback, _) : null;

    _.hide();

    _.setNodeEventHandler(true);

    return _;
  }

  setNodeEventHandler(flag) {
    const _ = this;

    if (not(isFunction)(_.option.clickCallback)) return _;

    if (flag === true) {
      _.node.on('click.ui.overlay', _.proxy.clickOverlayEventHandler);

    } else {
      _.node.off('click.ui.overlay', _.proxy.clickOverlayEventHandler);
    }

    return _;
  }

  getNode() {
    return this.node;
  }

  setCss(obj) {
    const _ = this;

    if (_.node.length > 0) _.node.css(obj);

    return _;
  }

  appendTo(element) {
    const _ = this;

    _.parentNode = _.option.appendTo = $(element);
    _.parentNode.append(_.node);

    return _;
  }

  show() {
    const _ = this;

    if (_.node.length > 0) _.node.show();

    return _;
  }

  hide() {
    const _ = this;

    if (_.node.length > 0) _.node.hide();

    return _;
  }

  destroy(obj = null) {
    const _ = this;

    obj = $.extend({
      isRemoveNode: true
    }, obj);

    _.setNodeEventHandler(false);

    if (obj.isRemoveNode) $(_.node).remove();

    _.option = null;
    _.node = null;
    _.parentNode = null;

    return _;
  }
}

export default Overlay;