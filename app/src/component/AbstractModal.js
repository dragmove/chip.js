/*
 @example

 */

class AbstractModal {
  constructor(options) {
    let _ = this;

    _.option = {
      class: 'modal',
      contents: '',

      appendTo: $('body'),
      openCallback: null,

      closeBtnSelector: '',
      closeCallback: null
    };
    $.extend(_.option, options);

    _.isOpen = false;

    _.node = null;
    _.parentNode = _.option.appendTo;

    _.closeBtn = null;
  }

  /*
   * public methods
   */
  init(obj) {
    let _ = this;

    _.node = $(document.createElement('div')).addClass(_.option.class);
    _.node.hide();

    _.node.html(_.option.contents);
    _.parentNode.append(_.node);

    _.closeBtn = $(_.option.closeBtnSelector);
    if (_.closeBtn.length) {
      _.setCloseBtnEventHandler(true);
    }
  }

  setCloseBtnEventHandler(flag) {
    let _ = this;

    if (flag) {
      _.closeBtn.on('click.ui.modal', $.proxy(_.closeBtnEventHandler, _));
    } else {
      _.closeBtn.off('click.ui.modal', $.proxy(_.closeBtnEventHandler, _));
    }
  }

  closeBtnEventHandler(evt) {
    evt.preventDefault();

    this.close();
  }

  getNode() {
    return this.node;
  }

  open() {
    let _ = this;

    if (_.isOpen) return;
    _.isOpen = true;

    if (_.option.openCallback) _.option.openCallback.call(_, null);
    _.node.show();
  }

  close() {
    let _ = this;

    if (!_.isOpen) return;
    _.isOpen = false;

    if (_.option.closeCallback) _.option.closeCallback.call(_, null);
    _.node.hide();
  }

  destroy(obj) {
    let _ = this;

    // TODO
  }
}

export default AbstractModal;