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
  width: 320,
  height: 176,
  alignX: 'center',
  alignY: 'center',

  videoUrls: ['data/video_320x176.mp4'],
  
  posterUrl: 'https://images.unsplash.com/photo-1474496517593-015d8b59450d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=49563d997d36faad03833ddab8d15c0a',
  posterAlt: 'poster alt string',

  autoplay: true,
  loop: false,
  muted: true,

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
}, 2000);

setTimeout(function() {
  fullSizeVideo.stop();
}, 4000);

setTimeout(function() {
  fullSizeVideo.seek(5);
  fullSizeVideo.play();
}, 6000);

$(window).on('resize', function(evt) {
  $('#wrapper').css({
    width: window.innerWidth,
    height: window.innerHeight
  });
}).trigger('resize');
*/

class FullSizeVideo {
	constructor(options) {
		let _ = this;

		_.option = {
			videoWrap: null,
			width: 320,
			height: 240,
			alignX: 'center',
			alignY: 'center',

			videoUrls: [],

			posterUrl: '',
			posterAlt: '',

			autoplay: true,
			loop: false,
			muted: false,

			canplayCallback: null,
			timeupdateCallback: null,
			endedCallback: null
		};
		$.extend(_.option, options);

		if(!_.option.videoWrap || $(_.option.videoWrap).length <= 0) {
			throw new Error('FullSizeBg Class require options have videoWrap');
			return;
		}

		_.video = null;
		_.poster = null;

		_.$proxyResize = $.proxy(_.resize, _);
	}

	init(obj) {
		this.setInstance();
		this.setCallbacks();
	}

	setInstance() {
		let _ = this,
			opt = _.option;

		let videoSourceTpl = '', ext = '';
		for(let url of opt.videoUrls) {
			ext = url.split('.').pop().toLowerCase();
			videoSourceTpl += `<source src="${url}" type="video/${ext}"></source>`;
		}

		let tpl = '';
		if(opt.posterUrl) tpl = `<img src="${opt.posterUrl}" alt="${opt.posterAlt}">`;
		tpl += `<video>${videoSourceTpl}</video>`;
		$(opt.videoWrap).append(tpl);

		_.video = $('video', opt.videoWrap);
		_.poster = $('img', opt.videoWrap);

		let video = _.video.get(0);
		if(opt.loop === true) video.setAttribute('loop', '');
		if(opt.muted === true) video.setAttribute('muted', '');
		if(opt.autoplay === true) video.setAttribute('autoplay', '');

		$(window).on('resize', _.$proxyResize);
	}

	setCallbacks() {
		let _ = this,
			opt = _.option,
			video = _.video.get(0),
			isVideoHasOnended = video.hasOwnProperty('onended');

		if(opt.canplayCallback) {
			$(video).on('canplay', (evt) => {
				opt.canplayCallback.call(null, {
					event: evt
				});
			});
		}

		if(opt.timeupdateCallback || (!isVideoHasOnended && opt.endedCallback)) {
			$(video).on('timeupdate', (evt) => {
				if(opt.timeupdateCallback) {
					opt.timeupdateCallback.call(null, {
						event: evt,
						currentTime: video.currentTime,
						duration: video.duration
					});
				}

				if(opt.endedCallback && (video.currentTime >= video.duration)) {
					opt.endedCallback.call(null, {
						event: evt,
						currentTime: video.currentTime,
						duration: video.duration
					});
				}
			});	
		}

		if(isVideoHasOnended && opt.endedCallback) {
			$(video).on('ended', (evt) => {
				opt.endedCallback.call(null, {
            		event: evt,
            		currentTime: video.currentTime,
            		duration: video.duration
            	});
			});
		}
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

	setWrapAlign(alignX, alignY, modifiedSize) {
		let winWidth = window.innerWidth,
			winHeight = window.innerHeight,
			left = 0, 
			top = 0;

		switch(alignX) {
			case 'left' :
				left = 0;
			break;

			case 'center' :
				left = Math.round( (winWidth - modifiedSize.width) / 2 );
			break;

			case 'right' :
				left = Math.round(winWidth - modifiedSize.width);
			break;
		}

		switch(alignY) {
			case 'top' :
				top = 0;
			break;

			case 'center' :
				top = Math.round( (winHeight - modifiedSize.height) / 2 );
			break;

			case 'bottom' :
				top = Math.round(winHeight - modifiedSize.height);
			break;
		}

		this.option.videoWrap.css({
			left: left,
			top: top
		});
	}

	resize(evt) {
		let _ = this,
			size = _.getVideoSizeAspectFill();

		_.poster.width(size.width).height(size.height);
		_.video.width(size.width).height(size.height);
		_.setWrapAlign(_.option.alignX, _.option.alignY, size);
	}

	play() {
		let _ = this;
		if(!_.video || _.video.length <= 0) return;

		let video = _.video.get(0);
		video.play();
	}

	pause() {
		let _ = this;
		if(!_.video || _.video.length <= 0) return;

		let video = _.video.get(0);
		video.pause();
	}

	stop() {
		let _ = this;
		if(!_.video || _.video.length <= 0) return;

		let video = _.video.get(0);
		video.pause();
		video.currentTime = 0;
	}

	seek(second) {
		let _ = this;
		if(!_.video || _.video.length <= 0) return;

		let video = _.video.get(0);
		video.currentTime = second;
	}

	getVideoNode() {
		return this.video;
	}

	destroy(obj) {
		let _ = this,
			video = _.video.get(0);

		_.pause();
		
		$(video).off('canplay');
		$(video).off('timeupdate');
		$(video).off('ended');

		_.video = null;
		_.poster = null;

		$(window).off('resize', _.$proxyResize);
	}
}

export default FullSizeVideo;