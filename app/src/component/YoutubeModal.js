import Modal from './ModalHasOverlay';
import {isDefined, isString, isObject, not, getUriCombinedParams} from '../utils/util';

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

    const w = (opt.youtube.width) ? opt.youtube.width : '100%',
      h = (opt.youtube.height) ? opt.youtube.height : '100%';

    let url = `https://www.youtube.com/embed/${opt.youtube.id}`;

    if (isObject(opt.youtube.playerVars)) {
      // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=ko#Parameters
      url = getUriCombinedParams(url, opt.youtube.playerVars);
    }

    _.youtubeIFrame = $(`<iframe width="${w}" height="${h}" src="${url}" frameborder="0" allowfullscreen></iframe>`);
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
  changeYoutubeIFrame(youtube = {id: '', width: 0, height: 0, playerVars: {}}) {
    const _ = this;

    if (not(isDefined)(youtube)) return _;

    let opt = _.option;

    if (isString(youtube)) {
      // user input only youtubeId
      opt.youtube.id = youtube;

    } else if (isObject(youtube)) {
      // user input youtube options
      opt.youtube = $.extend(true, opt.youtube, youtube);
    }

    if (_.youtubeIFrame) _.youtubeIFrame.remove();

    const w = (opt.youtube.width) ? opt.youtube.width : '100%',
      h = (opt.youtube.height) ? opt.youtube.height : '100%';

    let url = `https://www.youtube.com/embed/${opt.youtube.id}`;

    if (isObject(opt.youtube.playerVars)) {
      // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=ko#Parameters
      url = getUriCombinedParams(url, opt.youtube.playerVars);
    }

    _.youtubeIFrame = $(`<iframe width="${w}" height="${h}" src="${url}" frameborder="0" allowfullscreen></iframe>`);
    _.youtubeSrc = _.youtubeIFrame.attr('src');

    _.iFrameWrap = $(opt.iFrameWrapSelector, _.wrap);
    _.iFrameWrap.append(_.youtubeIFrame);

    return _;
  }

  getYoutubeIFrame() {
    return this.youtubeIFrame.get(0);
  }

  getYoutubeId() {
    const _ = this,
      opt = _.option;

    if (!opt.youtube || !opt.youtube.id) return '';
    return opt.youtube.id;
  }
}

export default YoutubeModal;