import Modal from './component/Modal';

(function ($) {
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

    // append to other element
    // modal.appendTo( element );

    // show
    // modal.show();

    // hide
    // modal.hide();

    // destroy
    // modal.destroy();
  }
}(jQuery));