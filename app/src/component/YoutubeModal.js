import Modal from './ModalHasOverlay';
import {isString, isObject, not} from '../utils/util';

class YoutubeModal extends Modal {
  constructor(options) {
    super(options);

    const _ = this;

    if (not(isString)(_.option.iFrameWrapSelector)) {
      throw new TypeError('YoutubeModal requires options have iFrameWrapSelector.');
    }

    if (not(isObject)(_.option.youtube)) {
      throw new TypeError('YoutubeModal requires options have youtube info object.');
    }

    if (not(isString)(_.option.youtube.id) || _.option.youtube.id.length <= 0) {
      throw new TypeError('YoutubeModal requires options have youtube info object has youtube id.');
    }

    _.iFrameWrap = null;

    _.youtubeIFrame = null;
    _.youtubeSrc = '';
  }

  /*
   * protected methods
   */
  init(obj = null) {
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

  destroy(obj = null) {
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