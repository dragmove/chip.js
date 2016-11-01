class FullSizeBg {
	/*
	@example
	
	// html
	<div id="wrapper">
		<div class="fullsize-bg">
			<img src="https://images.unsplash.com/photo-1474496517593-015d8b59450d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=49563d997d36faad03833ddab8d15c0a" alt="">
		</div>
    </div>
	
	// css
    #wrapper {
        position: relative;
        overflow: hidden;
        background: #333;
    }

    .fullsize-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
	
	// js
    import FullSizeBg from './component/FullSizeBg';

    let fullSizeBg = new FullSizeBg({
		imgWrap: $('.fullsize-bg'),
		imgWidth: 4592,
		imgHeight: 3064,
		alignX: 'center', // left, center, right
		alignY: 'center' // top, center, bottom
    });
    fullSizeBg.init();

    $(window).on('resize', function(evt) {
		$('#wrapper').css({
			width: window.innerWidth,
			height: window.innerHeight
		});
    }).trigger('resize');
	*/

	constructor(options) {
		let _ = this;

		_.imgWrap = options.imgWrap;
		_.imgWidth = options.imgWidth;
		_.imgHeight = options.imgHeight;

		if(!_.imgWrap || !_.imgWidth || !_.imgHeight) {
			throw new Error('FullSizeBg Class require options have imgWrap, imgWidth, imgHeight');
			return;
		}
		_.img = $('img', _.imgWrap);

		_.alignX = options.alignX || 'center';
		_.alignY = options.alignY || 'center';
	}

	init() {
		$(window).on('resize', $.proxy(this.resize, this));
	}

	getImageSizeAspectFill() {
		let _ = this;

		let winWidth = window.innerWidth,
			winHeight = window.innerHeight,
			modifiedSizeW = winWidth,
			modifiedSizeH = Math.ceil( (winWidth / _.imgWidth) * _.imgHeight );

		if(modifiedSizeH < winHeight) {
			modifiedSizeW = Math.ceil( (winHeight / _.imgHeight) * _.imgWidth );
			modifiedSizeH = winHeight;
		}

		return {
			width: modifiedSizeW,
			height: modifiedSizeH
		};
	}

	setImageAlign(alignX, alignY, modifiedSize) {
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

		this.imgWrap.css({
			left: left,
			top: top
		});
	}

	resize(evt) {
		let _ = this,
			size = _.getImageSizeAspectFill();

		_.img.width(size.width).height(size.height);
		_.setImageAlign(_.alignX, _.alignY, size);
	}
}

export default FullSizeBg;