/*
 @example

 // css
 .modal-wrap {
 position: fixed;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 }

 .modal {
 position: relative;
 display: block;
 margin: 0 auto;
 top: 50%;

 -webkit-transform: translateY(-50%);
 -moz-transform: translateY(-50%);
 -ms-transform: translateY(-50%);
 -o-transform: translateY(-50%);
 transform: translateY(-50%);

 width: 200px;
 height: 200px;
 background: #3F51B5;
 }

 .btn-close {
 position: absolute;
 top: 0;
 right: 0;
 background: #D50000;
 }

 // js
 let abstractModal = new AbstractModal({
 wrapClass: 'modal-wrap',
 contents: '<div class="modal"><p>contents</p><a href="#" class="btn-close">close</a></div>',
 appendTo: $('body'),
 closeBtnSelector: '.btn-close',
 isCloseByClickOutside: true,
 isCloseByEscKey: true,

 showCallback: function () {
 console.log('showCallback :', this);
 },
 hideCallback: function () {
 console.log('hideCallback :', this);
 }
 });
 abstractModal.init();

 abstractModal.show();

 console.log('abstractModal.getNode() :', abstractModal.getNode());
 */

class AbstractModal {
  constructor(options) {
    const _ = this;

    _.option = {
      wrapClass: 'modal-wrap',
      contents: '',
      appendTo: $('body'),
      closeBtnSelector: '',
      isCloseByClickOutside: true,
      isCloseByEscKey: true,
      showCallback: null,
      hideCallback: null
    };
    $.extend(_.option, options);

    _.wrap = null;
    _.contents = null;
    _.parentNode = _.option.appendTo;
    _.closeBtn = null;

    _.isShow = false;
  }

  /*
   * public methods
   */
  init(obj) {
    const _ = this;

    console.log('abstract modal init');

    _.wrap = $(document.createElement('div')).addClass(_.option.wrapClass);
    _.wrap.hide();

    _.contents = $(_.option.contents);
    _.wrap.html(_.contents);

    _.parentNode.append(_.wrap);

    _.closeBtn = $(_.option.closeBtnSelector);
    if (_.closeBtn.length) _.setCloseBtnEventHandler(true);

    if (_.option.isCloseByClickOutside) _.setWrapEventHandler(true);
    if (_.option.isCloseByEscKey) _.setEscKeyEventHandler(true);
  }

  setCloseBtnEventHandler(flag) {
    const _ = this;

    if (flag) {
      _.closeBtn.on('click.ui.modal', $.proxy(_.closeBtnEventHandler, _));
    } else {
      _.closeBtn.off('click.ui.modal', $.proxy(_.closeBtnEventHandler, _));
    }
  }

  setWrapEventHandler(flag) {
    const _ = this;

    if (flag) {
      _.wrap.on('click.ui.modal', $.proxy(_.wrapEventHandler, _));
    } else {
      _.wrap.off('click.ui.modal', $.proxy(_.wrapEventHandler, _));
    }
  }

  setEscKeyEventHandler(flag) {
    const _ = this;

    if (flag) {
      $(document).on('keydown.ui.modal', $.proxy(_.escKeyEventHandler, _));
    } else {
      $(document).off('keydown.ui.modal', $.proxy(_.escKeyEventHandler, _));
    }
  }

  closeBtnEventHandler(evt) {
    evt.preventDefault();

    switch (evt.type) {
      case 'click' :
        this.hide();
        break;
    }
  }

  wrapEventHandler(evt) {
    const _ = this;

    switch (evt.type) {
      case 'click' :
        if (!_.option.isCloseByClickOutside) return;

        if (evt.target === _.contents.get(0) || $.contains(_.contents.get(0), evt.target)) return;
        _.hide();

        break;
    }
  }

  escKeyEventHandler(evt) {
    switch (evt.type) {
      case 'keydown' :
        if (evt.keyCode === 27) this.hide();
        break;
    }
  }

  getNode() {
    return this.wrap;
  }

  appendTo(element) {
    const _ = this;

    _.parentNode = _.option.appendTo = $(element);
    _.parentNode.append(_.wrap);
  }

  show() {
    const _ = this;

    if (_.isShow) return;
    _.isShow = true;

    if (_.option.showCallback) _.option.showCallback.call(_, null);
    _.wrap.show();
  }

  hide() {
    const _ = this;

    if (!_.isShow) return;
    _.isShow = false;

    if (_.option.hideCallback) _.option.hideCallback.call(_, null);
    _.wrap.hide();
  }

  destroy(obj) {
    const _ = this;

    _.setCloseBtnEventHandler(false);
    _.setWrapEventHandler(false);
    _.setEscKeyEventHandler(false)

    _.wrap = null;
    _.parentNode = null;
    _.closeBtn = null;
  }
}

export default AbstractModal;