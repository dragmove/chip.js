class Overlay {
	constructor(options) {
		let _ = this;
		
		_.option = {
			class: 'overlay',
			color: '#000',
			opacity: 0.5,
			appendTo: $('body')
		};
		$.extend(_.option, options);

		_.node = null;
		_.parentNode = _.option.appendTo;
	}

	init(obj) {
		let _ = this;

		_.node = $(document.createElement('div')).addClass(_.option.class);
		_.node.css({
			position: 'fixed',
		    width: '100%',
		    height: '100%',
		    top: 0,
		    left: 0,
		    'background-color': _.option.color,
		    opacity: _.option.opacity,
		    filter: `alpha(opacity=${_.option.opacity * 100})`
		});

		_.parentNode.append(_.node);
	}

	setCss(obj) {
		let _ = this;

		if(!_.node.length) return;
		_.node.css(obj);
	}

	getNode() {
		return this.node;
	}

	show() {
		this.node.show();
	}

	hide() {
		this.node.hide();
	}

	destroy(obj) {
		let _ = this;

		_.option = null;
		_.node = null;
		_.parentNode = null;
	}
}

export default Overlay;