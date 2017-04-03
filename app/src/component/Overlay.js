/*
 @example

 // js
 import Overlay from './component/Overlay';

 let overlay = new Overlay({
 clickCallback: function(evt) {
 console.log('evt :', evt);
 }
 });
 overlay.init();

 overlay.show();
 */

class Overlay {
  constructor(options) {
    let _ = this;

    _.option = {
      class: 'overlay',
      color: '#000',
      opacity: 0.5,
      appendTo: $('body'),
      clickCallback: null
    };
    $.extend(_.option, options);

    _.node = null;
    _.parentNode = _.option.appendTo;
  }

  /*
   * public methods
   */
  init(obj) {
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

    _.hide();

    _.setNodeEventHandler(true);

    return _;
  }

  setNodeEventHandler(flag) {
    const _ = this;

    if (!_.option || !_.option.clickCallback) return;

    if (flag) {
      if (_.option.clickCallback) _.node.on('click.ui.overlay', $.proxy(_.option.clickCallback, _));
    } else {
      if (_.option.clickCallback) _.node.off('click.ui.overlay', $.proxy(_.option.clickCallback, _));
    }

    return _;
  }

  getNode() {
    return this.node;
  }

  setCss(obj) {
    let _ = this;

    if (!_.node.length) return;
    _.node.css(obj);

    return _;
  }

  appendTo(element) {
    let _ = this;

    _.parentNode = _.option.appendTo = $(element);
    _.parentNode.append(_.node);

    return _;
  }

  show() {
    this.node.show();

    return this;
  }

  hide() {
    this.node.hide();

    return this;
  }

  destroy(obj) {
    let _ = this;

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