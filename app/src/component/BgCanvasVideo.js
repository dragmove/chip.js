class BgCanvasVideo {
  constructor(options) {
    let _ = this;

    _.option = {
      parent: null, //v
      videoClass: 'video', //v
      canvasClass: 'canvas', //v

      width: 320, //v
      height: 240, //v
      alignX: 'center',
      alignY: 'center',

      fps: 30,
      videoUrl: '', //v
      posterUrl: '', // TODO
      posterAlt: '', // TODO

      autoplay: false, //v
      loop: false, //v
      muted: false, //v

      canplayCallback: null, //v
      timeupdateCallback: null, //v
      endedCallback: null //v
    };
    Object.assign(_.option, options);

    _.parent = $(_.option.parent);

    if (_.parent.length <= 0) {
      throw new Error('BgCanvasVideo Class require options have parent.');
      return;
    }

    _.video = null;
    _.canvas = null;
    _.ctx = null;

    _.isIOS = /iPad|iPhone|iPod/i.test(navigator.platform);
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

    _.parent.append( $(_.getVideoTpl()) );
    _.parent.append( $(_.getCanvasTpl()) );

    _.video = $(`.${_.option.videoClass}`, _.parent);
    _.canvas = $(`.${_.option.canvasClass}`, _.parent);
    _.ctx = _.canvas.get(0).getContext('2d');

    let video = _.video.get(0);
    //video.load();

    if (opt.loop === true) video.setAttribute('loop', '');
    if (opt.muted === true) video.setAttribute('muted', '');
    if (opt.autoplay === true) video.setAttribute('autoplay', '');

    let size = _.getVideoSizeAspectFill();
    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);

    if( _.isIOS ) {
       _.video.hide();
      if (opt.autoplay) _.play();
    } else {
      _.canvas.hide();
    }

    $(window).on('resize', _.$proxyResize);
    _.resize();
  }



  setCallbacks() {
    let _ = this,
      opt = _.option,
      video = _.video.get(0),
      isVideoHasOnended = video.hasOwnProperty('onended');

    $(video).on('canplay', (evt) => {
      _.drawVideoToCanvas();

      if (opt.canplayCallback) {
        opt.canplayCallback.call(null, {
          event: evt
        });
      }
    });

    $(video).on('timeupdate', (evt) => {
      _.drawVideoToCanvas();

      if (opt.timeupdateCallback) {
        opt.timeupdateCallback.call(null, {
          event: evt,
          currentTime: video.currentTime,
          duration: video.duration
        });
      }

      if(!isVideoHasOnended && opt.endedCallback) {
        if (opt.endedCallback && (video.currentTime >= video.duration)) {
          opt.endedCallback.call(null, {
            event: evt,
            currentTime: video.currentTime,
            duration: video.duration
          });

          if(opt.loop === true) {
            _.seek(0);
            _.play();
          } else {
            _.stop();
          }
        }
      }
    });

    if (isVideoHasOnended && opt.endedCallback) {
      $(video).on('ended', (evt) => {
        opt.endedCallback.call(null, {
          event: evt,
          currentTime: video.currentTime,
          duration: video.duration
        });

        if(opt.loop === true) {
          _.seek(0);
          _.play();
        } else {
          _.stop();
        }
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

    this.setVideoPosition({ left: left, top: top });
    this.setCanvasPosition({ left: left, top: top })
  }

  setVideoPosition(cssObj) {
    this.video.css(cssObj);
  }

  setCanvasPosition(cssObj) {
    this.canvas.css(cssObj);
  }

  setVideoSize(width, height) {
    this.video.attr({width: width, height: height});
  }

  setCanvasSize(width, height) {
    let _ = this;
    _.ctx.canvas.width = width;
    _.ctx.canvas.height = height;
    _.canvas.attr({width: width, height: height});
  }

  resize(evt) {
    let _ = this,
      size = _.getVideoSizeAspectFill();

    _.setVideoSize(size.width, size.height);
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);
  }



  play() {
    let _ = this;
    _.isPlaying = true;

    if( _.isIOS ) {
      _.lastRenderTime = Date.now();
      _.loopAnimationFrame();

    } else {
      if (!_.video || _.video.length <= 0) return;
      let video = _.video.get(0);
      video.play();
    }
  }

  pause() {
    let _ = this;
    _.isPlaying = false;

    if( _.isIOS ) {
      window.cancelAnimationFrame( _.animationFrame );
      _.animationFrame = null;
    } else {
      if (!_.video || _.video.length <= 0) return;
      let video = _.video.get(0);
      video.pause();
    }
  }

  stop() {
    let _ = this;
    _.isPlaying = false;

    if( _.isIOS ) {
      window.cancelAnimationFrame( _.animationFrame );
      _.animationFrame = null;
      _.lastRenderTime = 0; // TODO - confirm

    } else {
      if (!_.video || _.video.length <= 0) return;
      let video = _.video.get(0);
      video.pause();
      video.currentTime = 0;
    }
  }

  seek(second) {
    let _ = this;
    if (!_.video || _.video.length <= 0) return;

    let video = _.video.get(0);
    video.currentTime = second;

    _.drawVideoToCanvas();
  }

  drawVideoToCanvas() {
    let _ = this,
      video = _.video.get(0);
    _.ctx.drawImage(video, 0, 0, _.video.width(), _.video.height());
  }

  loopAnimationFrame() {
    let _ = this;

    let now = Date.now();
    let elapsedTime = ( now - _.lastRenderTime ) / 1000;

    if ( elapsedTime >= 1 / _.option.fps ) {
      _.video.currentTime = _.video.currentTime + elapsedTime;
      _.lastRenderTime = now;
    }

    if (_.video.currentTime >= _.video.duration) {
      _.isPlaying = false;

      if (_.option.loop === true) {
        _.video.currentTime = 0;
        _.play();
      }
    }

    if (_.isPlaying) {
      _.animationFrame = window.requestAnimationFrame(() => {
        _.loopAnimationFrame();
      });
    } else {
      window.cancelAnimationFrame( _.animationFrame );
      _.animationFrame = null;
    }
  }

  getVideoTpl() {
    let _ = this,
      opt = _.option;

    let videoSourceTpl = '',
      ext = opt.videoUrl.split('.').pop().toLowerCase();
    videoSourceTpl += `<source src="${opt.videoUrl}" type="video/${ext}"></source>`;

    let tpl = `<video class="${opt.videoClass}" poster="${opt.posterUrl}">${videoSourceTpl}</video>`;
    // let tpl = `<video class="${opt.videoClass}" muted="true" loop="true" autoplay="true" poster="">${videoSourceTpl}</video>`;
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
}

export default BgCanvasVideo;

/*
 class Movie{
 constructor( $parent, options ) {

 this.$parent = $parent;

 this.options = {
   framesPerSecond: 25,
   hideVideo: true,
   autoplay: true,
   loop: true,
   fixedTop: false,
   movieWidth: 960,
   movieHeight: 540,
   movieUrl : '',
   poster: ''
 }

 jQuery.extend( true, this.options, options );

 this.videoNode = jQuery( this.tmplVideo() );
 this.canvasNode = jQuery( this.tmplCanvas() );

 this.$parent.append( this.videoNode );
 this.video = this.videoNode.get( 0 );

 this.$parent.append( this.canvasNode );
 this.canvas = this.canvasNode.get( 0 );

 this.ctx = this.canvas.getContext( '2d' );

 this.playing = false;
 // this.resizeTimeoutReference = false;
 // this.resizeTimout = 100;

 this.init();
 this.bind();

 if( !this.isIOS() ){
 this.canvasNode.hide();
 }
 }

 isIOS() {
 return /iPad|iPhone|iPod/.test( navigator.platform );
 }

             position() {
             let movieWidth = this.width;
             let movieHeight = this.height;
             let winWidth = jQuery( window ).width();
             let winHeight = jQuery( window ).height();

             let left =  -( movieWidth - winWidth ) / 2;
             let top = -( movieHeight - winHeight )  / 2;

             if( this.options.fixedTop ) {
             top = 0;
             }

             if( this.isIOS() ){
             this.canvasNode.css({position:'absolute', left: left, top: top});
             }else{
             this.videoNode.css({position:'absolute', left: left, top: top});
             }
             }

 init() {
 this.video.load();
 this.setCanvasSize();
 this.position();

 if ( this.isIOS() && this.options.hideVideo )
 this.videoNode.hide();
 }

 bind() {
   if( this.isIOS() ){
     this.video.addEventListener('timeupdate', () => {
     this.drawFrame();
   });

   this.video.addEventListener('canplay', () => {
   this.drawFrame();
   });

   if (this.video.readyState >= 2) {
   this.drawFrame();
   }
   }

   if ( this.isIOS() && this.options.autoplay ) {
    this.play();
   }

 // Cache canvas size on resize (doing it only once in a second)
 jQuery( window ).on('resize', () => {
 //clearTimeout( this.resizeTimeoutReference );

 //this.resizeTimeoutReference = setTimeout(() => {
 this.setCanvasSize();
 this.position();

 if( this.isIOS() ) this.drawFrame();
 //}, this.resizeTimout );
 });

   jQuery( document ).bind( 'webkitvisibilitychange', function(){
     if ( !window._checkVisibilityChange ) return;
       if ( document[ 'webkitHidden' ] ) {
         this.pause();
       } else {
         this.play();
       }
     });
   }

   setCanvasSize() {
   let movieWidth = this.options.movieWidth;
   let movieHeight = this.options.movieHeight;
   let winWidth = jQuery( window ).width();
   let winHeight = jQuery( window ).height();

   this.height = Math.ceil( winHeight );
   this.width = Math.ceil( this.height * movieWidth / movieHeight );

   if( this.width < winWidth ){
     this.height = Math.ceil( winHeight + ( ( winWidth - this.width ) * 9 / 16 ) );
     this.width = Math.ceil( this.height * movieWidth / movieHeight );
   }

   if( this.isIOS() ){
     this.ctx.canvas.width = this.width;
     this.ctx.canvas.height = this.height;

     this.canvasNode.attr('width', this.width);
     this.canvasNode.attr('height', this.height);
   }else{
     this.videoNode.width( this.width );
     this.videoNode.height( this.height );
   }
 }

 play () {
   if( this.isIOS() ){
     this.lastTime = Date.now();
     this.playing = true;
     this.loop();
   }else{
     this.playing = true;
     this.videoNode.get( 0 ).play();
   }
 }

 pause() {
   if( this.isIOS() ){
     this.playing = false;
   }else{
     this.playing = false;
     this.videoNode.get( 0 ).pause();
   }
 }

 playPause() {
   if (this.playing) {
     this.pause();
   } else {
     this.play();
   }
 }

 loop () {
   let time = Date.now();
   let elapsed = ( time - this.lastTime ) / 1000;

   // Render
   if( elapsed >= (1 / this.options.framesPerSecond ) ) {
     this.video.currentTime = this.video.currentTime + elapsed;
     this.lastTime = time;
   }

   if (this.video.currentTime >= this.video.duration) {
     this.playing = false;

     if (this.options.loop === true) {
       this.video.currentTime = 0;
       this.play();
     }
   }

   if ( this.playing ) {
      this.animationFrame = requestAnimationFrame( () => {
      this.loop();
     });
   }else {
     cancelAnimationFrame( this.animationFrame );
   }
 }







 tmplVideo () {
 return `<video class="video" muted="true" loop="true" autoplay="true" poster="${this.options.poster}">
 <source src="${this.options.movieUrl}" type="video/mp4"></video>`;
 }

 tmplCanvas() {
 return '<canvas class="canvas"></canvas>';
 }

 drawFrame() {
 this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
 }
 }

 module.exports = Movie;
 */