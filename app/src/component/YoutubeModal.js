/*
 @ example

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

 width: 100%;
 max-width: 640px;
 }

 .btn-close {
 position: absolute;
 top: 0;
 right: 0;
 background: #D50000;
 }

 .embed-responsive-video {
 position:relative;
 padding-top: 56.25%;
 background-color: #000;
 }
 .embed-responsive-video .iframe-wrap {
 position: absolute;
 overflow: hidden;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 }

 // js
 import Overlay from './component/Overlay';
 import YoutubeModal from './component/YoutubeModal';

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
 height: ''
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

 // destroy
 // youtubeModal.destroy();
 */

import Modal from './ModalHasOverlay';

class YoutubeModal extends Modal {
  constructor(options) {
    super(options);

    const _ = this;

    if (!_.option.iFrameWrapSelector) {
      throw new Error('YoutubeModal requires options have iFrameWrapSelector');
    }

    if (!_.option.youtube || !_.option.youtube.id) {
      throw new Error('YoutubeModal requires options have youtube info object');
    }

    _.iFrameWrap = null;

    _.youtubeIFrame = null;
    _.youtubeSrc = '';
  }

  /*
   * protected methods
   */
  init(obj) {
    super.init(obj);

    const _ = this;

    let opt = _.option;

    const width = (opt.youtube.width) ? opt.youtube.width : '100%',
      height = (opt.youtube.height) ? opt.youtube.height : '100%';

    _.youtubeIFrame = $(`<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${opt.youtube.id}" frameborder="0" allowfullscreen></iframe>`);
    _.youtubeSrc = _.youtubeIFrame.attr('src');

    _.iFrameWrap = $(opt.iFrameWrapSelector, _.wrap);
    _.iFrameWrap.append(_.youtubeIFrame);

    return _;
  }

  show() {
    super.show();

    const _ = this;

    if (!_.youtubeIFrame || !_.youtubeIFrame.length) return;
    _.youtubeIFrame.attr('src', _.youtubeSrc);

    return _;
  }

  hide() {
    super.hide();

    const _ = this;

    if (!_.youtubeIFrame || !_.youtubeIFrame.length) return;
    _.youtubeIFrame.attr('src', '');

    return _;
  }

  destroy(obj) {
    const _ = this;

    _.iFrameWrap = null;
    _.youtubeIFrame.attr('src', '');
    _.youtubeIFrame = null;
    _.youtubeSrc = '';

    super.destroy(obj);

    return _;
  }

  /*
   * public methods
   */
  getYoutubeIFrame() {
    return this.youtubeIFrame.get(0);
  }
}

export default YoutubeModal;