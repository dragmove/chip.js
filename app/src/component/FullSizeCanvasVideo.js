/*
 @example

 // html
 <div id="wrapper">
 <div class="canvas-video"></div>

 <div class="fixed-btns">
 <button id="btn-play">play</button>
 <button id="btn-pause">pause</button>
 <button id="btn-stop">stop</button>
 <button id="btn-seek">seek</button>
 </div>
 </div>

 // css
 #wrapper {
 position: relative;
 background: #333;
 }

 .canvas-video {
 position: relative;
 overflow: hidden;
 }

 .fixed-btns {
 position: fixed;
 top: 0;
 left: 0;
 }

 // js
 import FullSizeCanvasVideo from './component/FullSizeCanvasVideo';

 let canvasVideo = new FullSizeCanvasVideo({
 parent: $('.canvas-video'),
 videoClass: 'video',
 canvasClass: 'canvas',

 autoplay: true,
 loop: true,
 muted: false,

 width: 960,
 height: 540,
 alignX: 'center', // left, center, right
 alignY: 'center', // top, center, bottom

 fps: 30,
 videoUrl: ${video url},
 posterUrl: ${poster image url},

 contentMode: FullSizeCanvasVideo.ASPECT_FIT,

 canplayCallback: (obj) => { // iOS, Adr v
 console.log('external canplayCallback() obj :', obj);
 },

 timeupdateCallback: (obj) => { // iOS, Adr v
 //console.log('external timeupdateCallback() obj :', obj);
 },

 endedCallback: (obj) => { // iOS, Adr v
 console.log('external endedCallback() obj :', obj);
 },

 visibilitychangeCallback: (obj) => {
 console.log('extenal visibilitychangeCallback() obj :', obj);

 if(obj.documentHidden) {
 canvasVideo.pause();
 } else {
 canvasVideo.play();
 }
 }
 });
 canvasVideo.init();

 $(window).on('resize', function(evt) {
 console.log('main.js - resize. window.innerWidth, window.innerHeight :', window.innerWidth, window.innerHeight);

 $('.canvas-video').css({
 width: window.innerWidth,
 height: window.innerHeight
 });

 $('#wrapper').css({
 width: window.innerWidth,
 height: window.innerHeight
 });
 }).trigger('resize');

 // test btns
 $('#btn-play').on('click', function(evt) {
 evt.preventDefault();
 canvasVideo.play();
 });

 $('#btn-pause').on('click', function(evt) {
 evt.preventDefault();
 canvasVideo.pause();
 });

 $('#btn-stop').on('click', function(evt) {
 evt.preventDefault();
 canvasVideo.stop();
 });

 $('#btn-seek').on('click', function(evt) {
 evt.preventDefault();
 canvasVideo.seek(30);
 });
 */

class FullSizeCanvasVideo {
  constructor(options) {
    const _ = this;

    _.option = {
      parent: null,
      videoClass: 'video',
      canvasClass: 'canvas',
      width: 320,
      height: 240,
      alignX: 'center',
      alignY: 'center',

      fps: 60,
      videoUrl: '',
      posterUrl: '',

      autoplay: true,
      loop: true,
      muted: false,

      contentMode: FullSizeCanvasVideo.ASPECT_FILL, // FullSizeCanvasVideo.ASPECT_FILL, FullSizeCanvasVideo.ASPECT_FIT, FullSizeCanvasVideo.WIDTH_FIT

      canplayCallback: null,
      timeupdateCallback: null,
      endedCallback: null,

      visibilitychangeCallback: null
    };
    $.extend(_.option, options);

    _.parent = _.option.parent;

    if (_.parent.length <= 0) {
      throw new Error('FullSizeCanvasVideo Class require options have parent.');
    }

    _.$video = null;
    _.$canvas = null;

    _.video = null;
    _.canvas = null;
    _.ctx = null;

    _.isPlaying = false;
    _.lastRenderTime = 0;
    _.animationFrame = null;

    _.getVideoSize = _.getVideoContentModeFunc(_.option.contentMode);
    _.$proxyResize = $.proxy(_.resize, _);
  }

  init(obj) {
    this.setInstance();
    this.setCallbacks();
  }

  setInstance() {
    let _ = this,
      opt = _.option;

    _.$video = $(_.getVideoTpl()).css({position: 'absolute'});
    _.$canvas = $(_.getCanvasTpl()).css({position: 'absolute'});
    _.parent.append(_.$video);
    _.parent.append(_.$canvas);

    _.video = _.$video.get(0);
    _.canvas = _.$canvas.get(0);
    _.ctx = this.canvas.getContext('2d');

    if (opt.loop === true) _.video.setAttribute('loop', '');
    if (opt.muted === true) _.video.setAttribute('muted', '');
    if (opt.autoplay === true) _.video.setAttribute('autoplay', ''); // iOS video node already has "autoplay" attribute

    let size = _.getVideoSize();
    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(opt.alignX, opt.alignY, size);

    if (_.isIOS()) {
      _.$video.hide();

      _.play();
      if (!_.option.autoplay) _.pause();

    } else {
      this.$canvas.hide();

      _.$video.on('click.ui.video.fullsizecanvasvideo', (evt) => {
        _.play();
      });
    }

    $(window).on('resize.ui.fullsizecanvasvideo', _.$proxyResize);
    _.resize();
  }

  setCallbacks() {
    let _ = this,
      opt = _.option,
      isVideoHasOnended = _.video.hasOwnProperty('onended');

    if (_.isIOS()) {
      _.$video.on('canplay.ui.video.fullsizecanvasvideo', (evt) => {
        _.drawVideoToCanvas();
        if (opt.canplayCallback) {
          opt.canplayCallback.call(null, {
            event: evt,
            video: _.video
          });
        }
      });

      _.$video.on('timeupdate.ui.video.fullsizecanvasvideo', (evt) => {
        _.drawVideoToCanvas();

        if (opt.timeupdateCallback) {
          opt.timeupdateCallback.call(null, {
            event: evt,
            video: _.video,
            currentTime: _.video.currentTime,
            duration: _.video.duration
          });
        }
      });

    } else {
      _.$video.on('canplay.ui.video.fullsizecanvasvideo', (evt) => {
        if (opt.canplayCallback) {
          opt.canplayCallback.call(null, {
            event: evt,
            video: _.video
          });
        }
      });

      if (opt.timeupdateCallback || (!isVideoHasOnended && opt.endedCallback)) {
        _.$video.on('timeupdate.ui.video.fullsizecanvasvideo', (evt) => {
          if (opt.timeupdateCallback) {
            opt.timeupdateCallback.call(null, {
              event: evt,
              video: _.video,
              currentTime: _.video.currentTime,
              duration: _.video.duration
            });
          }

          if (opt.endedCallback && (_.video.currentTime >= _.video.duration)) {
            if (opt.loop === true) return;

            _.isPlaying = false;

            opt.endedCallback.call(null, {
              event: evt,
              video: _.video,
              currentTime: _.video.currentTime,
              duration: _.video.duration
            });
          }
        });
      }

      if (isVideoHasOnended && opt.endedCallback) {
        // TODO - no browser support 'ended' event now. 2016.11.15
        _.$video.on('ended.ui.video.fullsizecanvasvideo', (evt) => {
          _.isPlaying = false;

          opt.endedCallback.call(null, {
            event: evt,
            video: _.video,
            currentTime: _.video.currentTime,
            duration: _.video.duration
          });
        });
      }
    }

    if (opt.visibilitychangeCallback) {
      let hidden, visibilityState, visibilityChange;

      if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityState = 'visibilityState';
        visibilityChange = 'visibilitychange';

      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityState = 'webkitVisibilityState';
        visibilityChange = 'webkitvisibilitychange';

      } else if (typeof document.mozHidden !== 'undefined') {
        hidden = 'mozHidden';
        visibilityState = 'mozVisibilityState';
        visibilityChange = 'mozvisibilitychange';

      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityState = 'msVisibilityState';
        visibilityChange = 'msvisibilitychange';

      } else if (typeof document.oHidden !== 'undefined') {
        hidden = 'oHidden';
        visibilityState = 'oVisibilityState';
        visibilityChange = 'ovisibilitychange';
      }

      $(document).on(visibilityChange, (evt) => {
        opt.visibilitychangeCallback.call(null, {
          event: evt,
          video: _.video,
          documentHidden: document[hidden],
          documentVisibilityState: document[visibilityState] // visible, hidden, prerender, unloaded
        });
      });
    }
  }

  setWrapAlign(alignX, alignY, modifiedSize) {
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

    this.setVideoPosition({left: left, top: top});
    this.setCanvasPosition({left: left, top: top});

    return this;
  }

  setVideoPosition(cssObj) {
    this.$video.css(cssObj);

    return this;
  }

  setCanvasPosition(cssObj) {
    this.$canvas.css(cssObj);

    return this;
  }

  setVideoSize(width, height) {
    const _ = this;

    _.$video.width(width);
    _.$video.height(height);

    return _;
  }

  setCanvasSize(width, height) {
    const _ = this;

    if (_.isIOS()) {
      _.ctx.canvas.width = width;
      _.ctx.canvas.height = height;
      _.$canvas.attr({width: width, height: height});
    }

    return _;
  }

  drawVideoToCanvas() {
    let _ = this;

    _.ctx.drawImage(_.video, 0, 0, _.$video.width(), _.$video.height());

    return _;
  }

  loopAnimationFrameIOS() {
    let _ = this,
      opt = _.option;

    let now = Date.now(),
      elapsedTime = ( now - _.lastRenderTime ) / 1000;

    if (elapsedTime >= (1 / _.option.fps)) {
      _.video.currentTime = _.video.currentTime + elapsedTime;
      _.lastRenderTime = now;
    }

    if (_.video.currentTime >= _.video.duration) {
      _.isPlaying = false;

      if (opt.loop === true) {
        _.seek(0);
        _.play();
      } else {
        opt.endedCallback.call(null, {
          event: null,
          video: _.video,
          currentTime: _.video.currentTime,
          duration: _.video.duration
        });

        _.stop();
      }
    }

    if (_.isPlaying) {
      _.animationFrame = requestAnimationFrame(() => {
        _.loopAnimationFrameIOS();
      });
    } else {
      cancelAnimationFrame(_.animationFrame);
      _.animationFrame = null;
    }
  }

  resize(evt) {
    const _ = this,
      size = _.getVideoSize();

    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);

    if (_.isIOS()) _.drawVideoToCanvas();

    return _;
  }

  getVideoTpl() {
    let _ = this,
      opt = _.option;

    let videoSourceTpl = '',
      ext = opt.videoUrl.split('.').pop().toLowerCase();
    videoSourceTpl += `<source src="${opt.videoUrl}" type="video/${ext}"></source>`;

    let tpl = `<video class="${opt.videoClass}" poster="${opt.posterUrl}">${videoSourceTpl}</video>`;
    if (_.isIOS()) {
      tpl = `<video class="${opt.videoClass}" poster="${opt.posterUrl}" autoplay>${videoSourceTpl}</video>`;
    }

    return tpl;
  }

  getCanvasTpl() {
    return `<canvas class="${this.option.canvasClass}"></canvas>`;
  }

  getVideoSizeAspectFill() {
    const _ = this,
      opt = _.option;

    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      modifiedSizeW = winWidth,
      modifiedSizeH = Math.ceil((winWidth / opt.width) * opt.height);

    if (modifiedSizeH < winHeight) {
      modifiedSizeW = Math.ceil((winHeight / opt.height) * opt.width);
      modifiedSizeH = winHeight;
    }

    return {
      width: modifiedSizeW,
      height: modifiedSizeH
    };
  }

  getVideoSizeAspectFit() {
    const _ = this,
      opt = _.option;

    let ratio = Math.min((window.innerWidth / opt.width), (window.innerHeight / opt.height));
    let modifiedSizeW = Math.ceil(opt.width * ratio),
      modifiedSizeH = Math.ceil(opt.height * ratio);

    return {
      width: modifiedSizeW,
      height: modifiedSizeH
    };
  }

  getVideoSizeWidthFit() {
    const _ = this,
      opt = _.option;

    let winWidth = window.innerWidth,
      modifiedSizeW = winWidth,
      modifiedSizeH = Math.ceil((winWidth / opt.width) * opt.height);

    return {
      width: modifiedSizeW,
      height: modifiedSizeH
    };
  }

  getVideoContentModeFunc(contentMode) {
    let func = null;

    switch (contentMode) {
      case FullSizeCanvasVideo.ASPECT_FILL :
        func = this.getVideoSizeAspectFill;
        break;

      case FullSizeCanvasVideo.ASPECT_FIT :
        func = this.getVideoSizeAspectFit;
        break;

      case FullSizeCanvasVideo.WIDTH_FIT :
        func = this.getVideoSizeWidthFit;
        break;
    }

    return func;
  }

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.platform);
  }

  play() {
    const _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.lastRenderTime = Date.now();
      _.isPlaying = true;
      _.loopAnimationFrameIOS();
    } else {
      _.isPlaying = true;
      _.video.play();
    }

    return _;
  }

  pause() {
    const _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.isPlaying = false;
    } else {
      _.isPlaying = false;
      _.video.pause();
    }

    return _;
  }

  stop() {
    const _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.pause();
      _.seek(0);
    } else {
      _.video.pause();
      _.video.currentTime = 0;
    }

    return _;
  }

  seek(second) {
    const _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.video.currentTime = second;
    } else {
      _.video.currentTime = second;
    }

    return _;
  }

  destroy(obj) {
    const _ = this;
    _.stop();

    if (_.isIOS()) {
      _.$video.off('canplay.ui.video.fullsizecanvasvideo');
      _.$video.off('timeupdate.ui.video.fullsizecanvasvideo');

    } else {
      _.$video.off('click.ui.video.fullsizecanvasvideo');
      _.$video.off('canplay.ui.video.fullsizecanvasvideo');
      _.$video.off('timeupdate.ui.video.fullsizecanvasvideo');
      _.$video.off('ended.ui.video.fullsizecanvasvideo'); // TODO - no browser support 'ended' event now. 2016.11.15
    }

    $(window).off('resize.ui.fullsizecanvasvideo');

    _.parent = null;

    _.$video = null;
    _.$canvas = null;

    _.video = null;
    _.canvas = null;
    _.ctx = null;

    _.isPlaying = false;
    _.lastRenderTime = 0;
    _.animationFrame = null;

    _.getVideoSize = null;
    _.$proxyResize = null;

    return _;
  }
}
FullSizeCanvasVideo.ASPECT_FILL = 'ASPECT_FILL';
FullSizeCanvasVideo.ASPECT_FIT = 'ASPECT_FIT';
FullSizeCanvasVideo.WIDTH_FIT = 'WIDTH_FIT';

export default FullSizeCanvasVideo;