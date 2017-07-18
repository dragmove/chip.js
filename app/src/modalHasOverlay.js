import Overlay from './component/Overlay';
import ModalHasOverlay from './component/ModalHasOverlay';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let overlay = new Overlay();
    overlay.init();

    let modal = new ModalHasOverlay({
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
    modal.init().show();

    // get node
    // console.log('modal.getNode() :', modal.getNode());
  }
}(jQuery));