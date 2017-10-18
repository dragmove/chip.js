import Overlay from './component/Overlay';
import YoutubeModal from './component/YoutubeModal';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let overlay = new Overlay();
    overlay.init();

    let youtubeModal = new YoutubeModal({
      wrapClass: 'modal-wrap',
      contents: `<div class="modal">
                   <div class="embed-responsive-video">
                     <div class="iframe-wrap"></div>
                   </div>
                   <a href="#" class="btn-close">close</a>
                 </div>`,
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

      overlay: overlay,

      iFrameWrapSelector: '.iframe-wrap',
      youtube: {
        id: 'YzKLbB5B0tg',
        width: '',
        height: '',

        playerVars: {
          // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=ko#Parameters
          autoplay: 1,
          rel: 0
        }
      }
    });

    youtubeModal.init().show();

    // get node
    // console.log('youtubeModal.getNode() :', youtubeModal.getNode());

    // append to other element
    // youtubeModal.appendTo( element );

    // get youtube iframe
    // console.log('youtubeModal.getYoutubeIFrame() :', youtubeModal.getYoutubeIFrame());

    // show
    // youtubeModal.show();

    // hide
    // youtubeModal.hide();

    // change youtube iframe
    // youtubeModal.changeYoutubeIFrame('mJEZFTbxm4o'); or youtubeModal.changeYoutubeIFrame({id: 'mJEZFTbxm4o', width: 0, height: 0, playerVars: {autoplay: 1, rel: 0}});

    // destroy
    // youtubeModal.destroy();
  }
}(jQuery));