/*
 @example

 // html
 <div id="wrapper">
 <div class="fullsize-video">
 </div>
 </div>

 // css
 #wrapper {
 position: relative;
 overflow: hidden;
 background: #333;
 }

 .fullsize-video {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 }

 .fullsize-video video {
 position: absolute;
 top: 0;
 left: 0;
 }

 // js
 import FullSizeVideo from './component/FullSizeVideo';

 let fullSizeVideo = new FullSizeVideo({
 videoWrap: $('.fullsize-video'),
 videoUrls: ['https://www.w3schools.com/tags/mov_bbb.mp4', 'https://www.w3schools.com/tags/mov_bbb.ogg'],
 videoWidth: 320,
 videoHeight: 176,
 alignX: 'center', // left, center, right
 alignY: 'center', // top, center, bottom

 autoplay: true,
 loop: false,
 muted: false,

 canplayCallback: (obj) => {
 console.log('canplayCallback obj :', obj);
 },
 timeupdateCallback: (obj) => {
 console.log('timeupdateCallback obj :', obj);
 },
 endedCallback: (obj) => {
 console.log('endedCallback obj :', obj);
 }
 });

 fullSizeVideo.init();

 setTimeout(function() {
 fullSizeVideo.play();
 fullSizeVideo.setVolume(0.5);
 }, 2000);

 setTimeout(function() {
 fullSizeVideo.stop();
 }, 4000);

 setTimeout(function() {
 fullSizeVideo.seek(5);
 fullSizeVideo.play();
 fullSizeVideo.setVolume(1.0);
 }, 6000);

 $(window).on('resize', function(evt) {
 $('#wrapper').css({
 width: window.innerWidth,
 height: window.innerHeight
 });
 }).trigger('resize');
 */

import { isDefined, isFunction, not, notSingleEle } from '../utils/util';

class FullSizeVideo {
  constructor(options) {
    const _ = this;

    _.option = $.extend({
      videoWrap: null,
      videoUrls: [],
      videoWidth: 320,
      videoHeight: 240,
      alignX: 'center',
      alignY: 'center',

      autoplay: true,
      loop: false,
      muted: false,

      canplayCallback: null,
      timeupdateCallback: null,
      endedCallback: null,

      global: window
    }, options);

    _.option.videoWrap = $(_.option.videoWrap);

    if (notSingleEle(_.option.videoWrap)) {
      throw new Error('FullSizeVideo Class require options has a single videoWrap.');
    }

    _.uniqueId = Date.now();

    _.global = _.option.global;

    _.video = null;

    _.proxy = {
      resizeEventHandler: null
    };
  }

  init(obj = null) {
    const _ = this;

    _.proxy.resizeEventHandler = $.proxy(_.resize, _);

    _.setInstance();

    _.setCallbacks();

    return _;
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    let videoSourceTpl = '', ext = '';
    for (let url of opt.videoUrls) {
      ext = url.split('.').pop().toLowerCase();
      videoSourceTpl += `<source src="${url}" type="video/${ext}"></source>`;
    }

    const tpl = `<video>${videoSourceTpl}</video>`;
    $(opt.videoWrap).append(tpl);

    _.video = $('video', opt.videoWrap);

    const video = _.video.get(0);
    if (opt.loop === true) video.setAttribute('loop', '');
    if (opt.muted === true) video.setAttribute('muted', '');
    if (opt.autoplay === true) video.setAttribute('autoplay', '');

    _.setResizeEventHandler(true);
  }

  setResizeEventHandler(flag) {
    const _ = this;

    if (flag === true) {
      $(_.global).on(`resize.ui.fullsizevideo.${_.uniqueId}`, _.proxy.resizeEventHandler);

    } else {
      $(_.global).off(`resize.ui.fullsizevideo.${_.uniqueId}`, _.proxy.resizeEventHandler);
    }
  }

  setCallbacks() {
    const _ = this,
      opt = _.option,
      video = _.video.get(0),
      isVideoHasOnended = video.hasOwnProperty('onended');

    if (isFunction(opt.canplayCallback)) {
      $(video).on('canplay.ui.video.fullsizevideo', (evt) => {
        opt.canplayCallback.call(null, {
          event: evt
        });
      });
    }

    if (isFunction(opt.timeupdateCallback) || (!isVideoHasOnended && isFunction(opt.endedCallback))) {
      $(video).on('timeupdate.ui.video.fullsizevideo', (evt) => {
        if (isFunction(opt.timeupdateCallback)) {
          opt.timeupdateCallback.call(null, {
            event: evt,
            currentTime: video.currentTime,
            duration: video.duration
          });
        }

        if (isFunction(opt.endedCallback) && (video.currentTime >= video.duration)) {
          opt.endedCallback.call(null, {
            event: evt,
            currentTime: video.currentTime,
            duration: video.duration
          });
        }
      });
    }

    if (isVideoHasOnended && isFunction(opt.endedCallback)) {
      $(video).on('ended.ui.video.fullsizevideo', (evt) => {
        opt.endedCallback.call(null, {
          event: evt,
          currentTime: video.currentTime,
          duration: video.duration
        });
      });
    }
  }

  getVideoSizeAspectFill() {
    const _ = this,
      opt = _.option;

    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      modifiedSizeW = winWidth,
      modifiedSizeH = Math.ceil((winWidth / opt.videoWidth) * opt.videoHeight);

    if (modifiedSizeH < winHeight) {
      modifiedSizeW = Math.ceil((winHeight / opt.videoHeight) * opt.videoWidth);
      modifiedSizeH = winHeight;
    }

    return {
      width: modifiedSizeW,
      height: modifiedSizeH
    };
  }

  setWrapAlign(alignX, alignY, modifiedSize) {
    const _ = this;

    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      left = 0,
      top = 0;

    switch (alignX) {
      case 'left' :
        left = 0;
        break;

      case 'center' :
        left = Math.round((winWidth - modifiedSize.width) / 2);
        break;

      case 'right' :
        left = Math.round(winWidth - modifiedSize.width);
        break;
    }

    switch (alignY) {
      case 'top' :
        top = 0;
        break;

      case 'center' :
        top = Math.round((winHeight - modifiedSize.height) / 2);
        break;

      case 'bottom' :
        top = Math.round(winHeight - modifiedSize.height);
        break;
    }

    _.option.videoWrap.css({
      left: left,
      top: top
    });

    return _;
  }

  resize(evt) {
    const _ = this,
      size = _.getVideoSizeAspectFill();

    _.video.width(size.width).height(size.height);

    _.setWrapAlign(_.option.alignX, _.option.alignY, size);

    return _;
  }

  play() {
    const _ = this;
    if (not(isDefined)(_.video) || notSingleEle(_.video)) return _;

    const video = _.video.get(0);
    video.play();

    return _;
  }

  pause() {
    const _ = this;
    if (not(isDefined)(_.video) || notSingleEle(_.video)) return _;

    const video = _.video.get(0);
    video.pause();

    return _;
  }

  stop() {
    const _ = this;
    if (not(isDefined)(_.video) || notSingleEle(_.video)) return _;

    const video = _.video.get(0);
    video.pause();
    video.currentTime = 0;

    return _;
  }

  seek(second) {
    const _ = this;
    if (not(isDefined)(_.video) || notSingleEle(_.video)) return _;

    const video = _.video.get(0);
    video.currentTime = second;

    return _;
  }

  setVolume(number) {
    const _ = this;

    if (number < 0 || number > 1) {
      throw new Error('require a number between 0.0 and 1.0.');
    }

    if (not(isDefined)(_.video) || notSingleEle(_.video)) return _;

    const video = _.video.get(0);
    video.volume = number;

    return _;
  }

  getVolume() {
    const _ = this;

    if (not(isDefined)(_.video) || notSingleEle(_.video)) return null;

    const video = _.video.get(0);
    return video.volume;
  }

  getVideoNode() {
    return this.video;
  }

  destroy(obj = null) {
    let _ = this,
      video = _.video.get(0);

    _.pause();

    $(video).off('canplay.ui.video.fullsizevideo');
    $(video).off('timeupdate.ui.video.fullsizevideo');
    $(video).off('ended.ui.video.fullsizevideo');

    _.setResizeEventHandler(false);

    _.proxy.resizeEventHandler = null;

    _.video = null;

    return _;
  }
}

export default FullSizeVideo;