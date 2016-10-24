class BgCanvasVideo {
	constructor(options) {
		console.log('options :', options);

		this.options = {
			parent: null,

			videoClass: 'video',

			autoplay: true,
			loop: true,
			muted: true,
			
			width: 1024,
			height: 768,

			posterUrl: '',
			videoUrl: '',

			canvasClass: 'canvas'
		};
		$.extend(true, this.options, options);

		this.$parent = $(this.options.parent);

		this.videoEle = $(this.getVideoTpl());
		this.$parent.append(this.videoEle);

		this.canvasEle = $(this.getCanvasTpl());
		this.$parent.append(this.canvasEle);

		this.video = this.videoEle.get(0);
		this.canvas = this.canvasEle.get(0);
		this.ctx = this.canvas.getContext('2d');

		this.isPlaying = false;

		this.init();
	}

	init() {
		this.setCanvasSize();
		this.setPosition();

		/*
		
		this.position();

		if ( this.isIOS() && this.options.hideVideo )
			this.videoNode.hide();
		*/
	}

	setCanvasSize() {
		let _ = this;

		let videoWidth = _.options.width,
			videoHeight = _.options.height;

		let winWidth = window.innerWidth,
			winHeight = window.innerHeight;

		_.height = Math.ceil(winHeight);
		_.width = Math.ceil(videoWidth * _.height / videoHeight);

		/*
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
		*/
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

	getVideoTpl() {
		let _ = this.options;
		return `<video class="${_.videoClass}" autoplay="${_.autoplay}" loop="${_.loop}" muted="${_.muted}" poster="${_.posterUrl}">
			<source src="${_.videoUrl}" type="video/mp4">
		</video>`;
	}

	getCanvasTpl() {
		return `<canvas class="${this.options.canvasClass}"></canvas>`;
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