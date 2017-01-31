/*
 @example

 // js
 let abstractModal = new AbstractModal({
 class: 'modal',
 contents: '<div class="contents">this is contents</div><a href="#" class="btn-close">close</a>',
 appendTo: $('body'),
 closeBtnSelector: '.btn-close',

 showCallback: function() {
 console.log('showCallback :', this);
 },
 hideCallback: function() {
 console.log('hideCallback :', this);
 }
 });
 abstractModal.init();

 abstractModal.show();

 console.log('abstractModal.getNode() :', abstractModal.getNode());
 */

class AbstractModal {
  constructor(options) {
    let _ = this;

    _.option = {
      class: 'modal',
      contents: '',
      appendTo: $('body'),
      closeBtnSelector: '',
      showCallback: null,
      hideCallback: null
    };
    $.extend(_.option, options);

    _.node = null;
    _.parentNode = _.option.appendTo;
    _.closeBtn = null;

    _.isShow = false;
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

    this.hide();
  }

  getNode() {
    return this.node;
  }

  appendTo(element) {
    let _ = this;

    _.parentNode = _.option.appendTo = $(element);
    _.parentNode.append(_.node);
  }

  show() {
    let _ = this;

    if (_.isShow) return;
    _.isShow = true;

    if (_.option.showCallback) _.option.showCallback.call(_, null);
    _.node.show();
  }

  hide() {
    let _ = this;

    if (!_.isShow) return;
    _.isShow = false;

    if (_.option.hideCallback) _.option.hideCallback.call(_, null);
    _.node.hide();
  }

  destroy(obj) {
    let _ = this;

    _.setCloseBtnEventHandler(false);

    _.node = null;
    _.parentNode = null;
    _.closeBtn = null;
  }
}

export default AbstractModal;