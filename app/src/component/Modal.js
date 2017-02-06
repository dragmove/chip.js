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
 let overlay = new Overlay();
 overlay.init();

 let modal = new Modal({
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
 },

 overlay: overlay
 });
 modal.init();

 modal.show();

 console.log('modal.getNode() :', modal.getNode());
 */

import AbstractModal from './AbstractModal';

class Modal extends AbstractModal {
  constructor(options) {
    super(options);

    const _ = this;

    _.overlay = (_.option.overlay) ? _.option.overlay : null;
  }

  /*
   * protected methods
   */
  init(obj) {
    super.init(obj);

    console.log('modal init');
  }

  show() {
    super.show();

    if (this.overlay) this.overlay.show();
  }

  hide() {
    super.hide();

    if (this.overlay) this.overlay.hide();
  }

  destroy(obj) {
    super.destroy(obj);

    const _ = this;

    if (_.overlay) {
      _.overlay.destroy(obj);
      _.overlay = null;
    }
  }

  /*
   * public methods
   */
  getOverlay() {
    return this.overlay;
  }
}

export default Modal;