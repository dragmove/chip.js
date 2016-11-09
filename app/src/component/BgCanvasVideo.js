class BgCanvasVideo {
	constructor(options) {
		let _ = this;

		_.option = {
			parent: null,
			videoClass: 'video',
			canvasClass: 'canvas',

			autoplay: true,
			loop: false,
			muted: false,
			
			width: 1024,
			height: 768,

			posterUrl: '',
			posterAlt: '',

			videoUrl: '',
		};
		Object.assign(_.option, options);

		this.parent = $(_.option.parent);

		this.videoTpl = $(_.getVideoTpl());
		this.video = null;

		this.canvasTpl = $(_.getCanvasTpl());
		this.canvas = null;

		// this.ctx = this.canvas.getContext('2d');

		_.$proxyResize = $.proxy(_.resize, _);
	}

	getVideoTpl() {
		let _ = this,
			opt = _.option;

		let videoSourceTpl = '',
			ext = opt.videoUrl.split('.').pop().toLowerCase();
		videoSourceTpl += `<source src="${opt.videoUrl}" type="video/${ext}"></source>`;

		let tpl = `<video class="${opt.videoClass}" autoplay="${opt.autoplay}" loop="${opt.loop}" muted="${opt.muted}" poster="${opt.posterUrl}">${videoSourceTpl}</video>`;
		return tpl;
	}

	getCanvasTpl() {
		return `<canvas class="${this.option.canvasClass}"></canvas>`;
	}

	resize(evt) {
		let _ = this,
			size = _.getVideoSizeAspectFill();
		console.log('size :', size);

		_.video.width(size.width).height(size.height);

	}

	init(obj) {
		let _ = this;

		_.setInstance();

		/*
		
		this.position();

		if ( this.isIOS() && this.options.hideVideo )
			this.videoNode.hide();
		*/
	}

	setInstance() {
		let _ = this;

		this.parent.append(_.videoTpl);
		this.parent.append(_.canvasTpl);

		this.video = $(`.${_.option.videoClass}`, _.parent);
		this.canvas = $(`.${_.option.canvasClass}`, _.parent);

		$(window).on('resize', _.$proxyResize);

		/*
		this.setCanvasSize();
		this.setPosition();
		*/
	}

	setCanvasSize() {
		let _ = this;


		if( this.isIOS() ){
			this.ctx.canvas.width = this.width;
			this.ctx.canvas.height = this.height;

			this.canvasNode.attr('width', this.width);
			this.canvasNode.attr('height', this.height);
		}else{
			this.videoNode.width( this.width );
			this.videoNode.height( this.height );
		}
		*/
	}

	getVideoSizeAspectFill() {
		let _ = this,
			opt = _.option;

		let winWidth = window.innerWidth,
			winHeight = window.innerHeight,
			modifiedSizeW = winWidth,
			modifiedSizeH = Math.ceil( (winWidth / opt.width) * opt.height );

		if(modifiedSizeH < winHeight) {
			modifiedSizeW = Math.ceil( (winHeight / opt.height) * opt.width );
			modifiedSizeH = winHeight;
		}

		return {
			width: modifiedSizeW,
			height: modifiedSizeH
		};
	}

	setPosition() {
		let _ = this;

		let videoWidth = _.width,
			videoHeight = _.height;

		let winWidth = window.innerWidth,
			winHeight = window.innerHeight;

		/*
		let left =  -( videoWidth - winWidth ) / 2;
		let top = -( videoHeight - winHeight )  / 2;

		if( this.options.fixedTop ) {
			top = 0;
		}

		if( this.isIOS() ){
			this.canvasNode.css({position:'absolute', left: left, top: top});
		}else{
			this.videoNode.css({position:'absolute', left: left, top: top});
		}
		*/
	}





	/*
	 * utils
	 */
	isIOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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
		this.resizeTimeoutReference = false;
		this.resizeTimout = 100;

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