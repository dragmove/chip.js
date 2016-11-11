class FullSizeCanvasVideo {
  constructor(options) {
    let _ = this;

    _.option = {
      parent: null,
      videoClass: 'video',
      canvasClass: 'canvas',
      width: 320,
      height: 240,
      alignX: 'center',
      alignY: 'center',

      fps: 30, // TODO
      videoUrl: '',
      posterUrl: '',

      autoplay: true,
      loop: true,
      muted: false,

      canplayCallback: null,
      timeupdateCallback: null,
      endedCallback: null,

      visibilitychangeCallback: null
    };
    Object.assign(_.option, options);

    _.parent = _.option.parent;

    if (_.parent.length <= 0) {
      throw new Error('FullSizeCanvasVideo Class require options have parent.');
      return;
    }

    _.$video = null;
    _.$canvas = null;

    _.video = null;
    _.canvas = null;
    _.ctx = null;

    _.isPlaying = false;
    _.lastRenderTime = 0;
    _.animationFrame = null;

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

    let size = _.getVideoSizeAspectFill();
    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(opt.alignX, opt.alignY, size);

    let isVideoHasOnended = _.video.hasOwnProperty('onended');
    if (_.isIOS()) {
      _.$video.hide();

      _.play();
      if (!_.option.autoplay) _.pause();

    } else {
      this.$canvas.hide();

      _.$video.on('click', (evt) => {
        _.play();
      });
    }

    $(window).on('resize', _.$proxyResize);
    _.resize();
  }

  setCallbacks() {
    let _ = this,
      opt = _.option,
      isVideoHasOnended = _.video.hasOwnProperty('onended');

    if (_.isIOS()) {
      _.$video.on('canplay', (evt) => {
        _.drawVideoToCanvas();
        if (opt.canplayCallback) {
          opt.canplayCallback.call(null, {
            event: evt,
            video: _.video
          });
        }
      });

      _.$video.on('timeupdate', (evt) => {
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
      _.$video.on('canplay', (evt) => {
        if (opt.canplayCallback) {
          opt.canplayCallback.call(null, {
            event: evt,
            video: _.video
          });
        }
      });

      if (opt.timeupdateCallback || (!isVideoHasOnended && opt.endedCallback)) {
        _.$video.on('timeupdate', (evt) => {
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
        // TODO - no browser support 'ended' event now.
        $(video).on('ended', (evt) => {
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
      // todo - pc v
      let hidden, visibilityState, visibilityChange;
      if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityState = 'visibilityState';
        visibilityChange = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityState = 'msVisibilityState';
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityState = 'webkitVisibilityState';
        visibilityChange = 'webkitvisibilitychange';
      }

      $(document).on(visibilityChange, (evt) => {
        console.log('visibilitychange :', evt);
        console.log('hidden', document[hidden]);
        console.log('visibilityState', document[visibilityState]); // visible, hidden, prerender, unloaded

        opt.visibilitychangeCallback.call(null, {
          event: evt,
          video: _.video,
          documentHidden: document[hidden],
          documentVisibilityState: document[visibilityState]
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
    this.setCanvasPosition({left: left, top: top})
  }

  setVideoPosition(cssObj) {
    this.$video.css(cssObj);
  }

  setCanvasPosition(cssObj) {
    this.$canvas.css(cssObj);
  }

  setVideoSize(width, height) {
    this.$video.width(width);
    this.$video.height(height);
  }

  setCanvasSize(width, height) {
    let _ = this;

    if (_.isIOS()) {
      _.ctx.canvas.width = width;
      _.ctx.canvas.height = height;
      _.$canvas.attr({width: width, height: height});
    }
  }

  drawVideoToCanvas() {
    let _ = this;
    _.ctx.drawImage(_.video, 0, 0, _.$video.width(), _.$video.height());
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
    let _ = this,
      size = _.getVideoSizeAspectFill();

    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);

    if (_.isIOS()) _.drawVideoToCanvas();
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
    //let tpl = `<video class="${opt.videoClass}" muted="true" loop="true" autoplay="true" poster="">${videoSourceTpl}</video>`;

    return tpl;
  }

  getCanvasTpl() {
    return `<canvas class="${this.option.canvasClass}"></canvas>`;
  }

  getVideoSizeAspectFill() {
    let _ = this,
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

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.platform);
  }

  play() {
    let _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.lastRenderTime = Date.now();
      _.isPlaying = true;
      _.loopAnimationFrameIOS();
    } else {
      _.isPlaying = true;
      _.video.play();
    }
  }

  pause() {
    let _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.isPlaying = false;
    } else {
      _.isPlaying = false;
      _.video.pause();
    }
  }

  stop() {
    let _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.pause();
      _.seek(0);
    } else {
      _.video.pause();
      _.video.currentTime = 0;
    }
  }

  seek(second) {
    let _ = this;
    if (!_.video) return;

    if (_.isIOS()) {
      _.video.currentTime = second;
    } else {
      _.video.currentTime = second;
    }
  }
}

export default FullSizeCanvasVideo;