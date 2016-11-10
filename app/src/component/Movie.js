class Movie{
  constructor(options) {
    let _ = this;

    _.option = {
      parent: null,
      videoClass: 'video',
      canvasClass: 'canvas',
      width: 960,
      height: 540,
      alignX: 'center',
      alignY: 'center',

      fps: 30, // TODO
      videoUrl : '',
      posterUrl: '', // TODO
      posterAlt: '', // TODO

      autoplay: true,
      loop: true,
      muted: false,

      canplayCallback: null, //v
      timeupdateCallback: null, //v
      endedCallback: null //v
    };
    Object.assign(_.option, options);

    _.parent = _.option.parent;

    if (_.parent.length <= 0) {
      throw new Error('BgCanvasVideo Class require options have parent.');
      return;
    }

    _.$video = null;
    _.$canvas = null;

    _.video = null;
    _.canvas = null;
    _.ctx = null;

    _.playing = false;

    _.lastRenderTime = 0;
    _.animationFrame = null;

    _.$proxyResize = $.proxy(_.resize, _);
  }

  init(obj) {
    this.setInstance();
  }

  setInstance() {
    let _ = this,
      opt = _.option;

    _.$video = $( _.getVideoTpl() );
    _.$canvas = $( _.getCanvasTpl() );
    _.parent.append( _.$video );
    _.parent.append( _.$canvas );

    _.video = _.$video.get(0);
    _.canvas = _.$canvas.get(0);
    _.ctx = this.canvas.getContext( '2d' );

    if (opt.loop === true) _.video.setAttribute('loop', '');
    if (opt.muted === true) _.video.setAttribute('muted', '');
    if (opt.autoplay === true) _.video.setAttribute('autoplay', '');

    let size = _.getVideoSizeAspectFill();
    this.setVideoSize(size.width, size.height);
    this.setCanvasSize(size.width, size.height);
    this.setWrapAlign(opt.alignX, opt.alignY, size);

    if( _.isIOS() ) {
      this.$video.hide();

      this.video.addEventListener('timeupdate', () => {
        this.drawVideoToCanvas();
      });

      this.video.addEventListener('canplay', () => {
        this.drawVideoToCanvas();
      });

      if (this.video.readyState >= 2) {
        this.drawVideoToCanvas();
      }

      if(this.option.autoplay) this.play();

    } else {
      this.$canvas.hide();
    }

    $(window).on('resize', _.$proxyResize);
    _.resize();

    $(document).on( 'webkitvisibilitychange', function() {
      /*
       if ( document[ 'webkitHidden' ] ) {
       this.pause();
       } else {
       this.play();
       }
       */
    });
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

    this.setVideoPosition({ left: left, top: top });
    this.setCanvasPosition({ left: left, top: top })
  }

  setVideoPosition(cssObj) {
    this.$video.css(cssObj);
  }

  setCanvasPosition(cssObj) {
    this.$canvas.css(cssObj);
  }

  setVideoSize(width, height) {
    this.$video.width( width );
    this.$video.height( height );
  }

  setCanvasSize(width, height) {
    let _ = this;

    _.width = width;
    _.height = height;

    if( _.isIOS() ){
      _.ctx.canvas.width = width;
      _.ctx.canvas.height = height;
      _.$canvas.attr({width: width, height: height});
    }
  }

  resize(evt) {
    let _ = this,
      size = _.getVideoSizeAspectFill();

    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);

    if( _.isIOS() ) _.drawVideoToCanvas();
  }





  // todo
  play () {
    if( this.isIOS() ){
      this.lastRenderTime = Date.now();
      this.playing = true;
      this.loopAnimationFrame();
    }else{
      this.playing = true;
      this.$video.get( 0 ).play();
    }
  }

  // todo
  pause() {
    if( this.isIOS() ){
      this.playing = false;
    }else{
      this.playing = false;
      this.$video.get( 0 ).pause();
    }
  }

  stop() {
    // todo
  }

  seek(second) {
    // todo
  }




  drawVideoToCanvas() {
    let _ = this;
    _.ctx.drawImage(_.video, 0, 0, _.$video.width(), _.$video.height());
  }

  loopAnimationFrame() {
    let _ = this;

    let now = Date.now(),
      elapsedTime = ( now - _.lastRenderTime ) / 1000;
    console.log('elapsedTime :', elapsedTime);

    // Render
    if( elapsedTime >= (1 / _.option.fps) ) {
      _.video.currentTime = _.video.currentTime + elapsedTime;
      _.lastRenderTime = now;
    }

    if (_.video.currentTime >= _.video.duration) {
      _.playing = false;

      if (_.option.loop === true) {
        _.video.currentTime = 0;
        _.play();
      }
    }

    if ( _.playing ) {
      _.animationFrame = requestAnimationFrame( () => {
        _.loopAnimationFrame();
      });
    } else {
      cancelAnimationFrame( _.animationFrame );
      _.animationFrame = null;
    }
  }

  getVideoTpl () {
    let _ = this,
      opt = _.option;

    let videoSourceTpl = '',
      ext = opt.videoUrl.split('.').pop().toLowerCase();
    videoSourceTpl += `<source src="${opt.videoUrl}" type="video/${ext}"></source>`;

    let tpl = `<video class="${opt.videoClass}" poster="${opt.posterUrl}">${videoSourceTpl}</video>`;
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
    return /iPad|iPhone|iPod/.test( navigator.platform );
  }
}

export default Movie;