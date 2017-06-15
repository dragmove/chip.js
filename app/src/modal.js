import Modal from './component/Modal';

(function ($, global) {
  "use strict";

  $(document).ready(init);

  function init() {
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
      }
    });
    modal.init().show();

    // get node
    // console.log('modal.getNode() :', modal.getNode());
  }
}(jQuery, window));