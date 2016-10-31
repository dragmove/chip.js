class FullSizeBg {
	constructor(options) {
		let _ = this;

		_.imgWrap = options.imgWrap;
		_.imgWidth = options.imgWidth;
		_.imgHeight = options.imgHeight;

		if(!_.imgWrap || !_.imgWidth || !_.imgHeight) return;
		_.img = $('img', _.imgWrap);

		_.alignX = options.alignX || 'center';
		_.alignY = options.alignY || 'center';

		_.init();
	}

	init() {
		$(window).on('resize', $.proxy(this.resize, this));
	}

	resize(evt) {
		let _ = this;

		let winWidth = window.innerWidth,
			winHeight = window.innerHeight,
			modifiedSizeW = winWidth,
			modifiedSizeH = parseInt( (winWidth / _.imgWidth) * _.imgHeight, 10 );

		if(modifiedSizeH < winHeight) {
			modifiedSizeW = parseInt( (winHeight / _.imgHeight) * _.imgWidth, 10 );
			modifiedSizeH = winHeight;
		}

		_.img.width(modifiedSizeW).height(modifiedSizeH);

		let  left,
			top = Math.round( (winHeight - modifiedSizeH) / 2 );

		switch(_.alignX) {
			case 'left' :
				left = 0;
			break;

			case 'center' :
				left = Math.round( (winWidth - modifiedSizeW) / 2 );
			break;

			case 'right' :
				left = Math.round( winWidth - modifiedSizeW );
			break;
		}

		// TODO - alignY
		if(_.alignY === 'top') top = 0;

		_.imgWrap.css({
			left: left,
			top: top
		});
		console.log('modifiedSizeW :', modifiedSizeW);
		console.log('modifiedSizeH :', modifiedSizeH);
		console.log('left :', left);
		console.log('top :', top);
	}
}

export default FullSizeBg;

/*
export class FullsizeBg {
	constructor(obj) {
		// options
		this.imgWrap = obj.imgWrap;
		this.imgWidth = obj.imgWidth;
		this.imgHeight = obj.imgHeight;

		this.img = $('img', this.imgWrap);
	}

	init() {
		let $win = $(window);

		$win.on('resize', $.proxy(function(evt) {
			let winWidth = $win.width(),
				winHeight = $win.height();

			let fixSizeW = winWidth;

			let fixSizeH = parseInt( (winWidth / this.imgWidth) * this.imgHeight , 10 );
			if (fixSizeH < winHeight) {
				fixSizeW = parseInt( (winHeight / this.imgHeight) * this.imgWidth, 10 );
				fixSizeH = winHeight;
			}

			this.img.width(fixSizeW).height(fixSizeH);

			this.imgWrap.css({
				left: Math.round( (winWidth - fixSizeW) / 2 ),
				top: Math.round( (winHeight - fixSizeH) / 2 )
			});
		}, this)).trigger('resize');
	}
}
*/