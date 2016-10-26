class Navi {
	constructor(options) {
		let _ = this;

		_.btns = options.btns || _.btns;
		_.mouseoverCallback = options.mouseoverCallback || null;
		_.mouseoutCallback = options.mouseoutCallback || null;
		_.clickCallback = options.clickCallback || null;
		_.activateCallback = options.activateCallback || _.activateCallback;
		_.activeClass = options.activeClass || 'active';

		_.currentIndex = 0;
		_.activateIndex = 0;

		_.setBtnsEventHandler(true);
	}

	setBtnsEventHandler(flag) {
		if(flag) {
			for(let btn of this.btns) {
				$(btn).on('mouseover', $.proxy(this.btnMouseEventHandler, this));
				$(btn).on('mouseout', $.proxy(this.btnMouseEventHandler, this));
				$(btn).on('click', $.proxy(this.btnMouseEventHandler, this));
			}
		} else {
			for(let btn of this.btns) {
				$(btn).off('mouseover', $.proxy(this.btnMouseEventHandler, this));
				$(btn).off('mouseout', $.proxy(this.btnMouseEventHandler, this));
				$(btn).off('click', $.proxy(this.btnMouseEventHandler, this));
			}
		}
	}

	btnMouseEventHandler(evt) {
		evt.preventDefault();

		let _ = this,
			btn = null;

		switch(evt.type) {
			case 'mouseover' :
				btn = evt.target;

				_.currentIndex = $(_.btns).index(btn) + 1;

				if(_.mouseoverCallback) {
					_.mouseoverCallback.call(null, {
						event: evt,
						btn: btn,
						index: _.currentIndex
					});
				}
			break;

			case 'mouseout' :
				btn = evt.target;

				if(_.mouseoutCallback) {
					_.mouseoutCallback.call(null, {
						event: evt,
						btn: btn,
						index: $(_.btns).index(btn) + 1
					});
				}
			break;

			case 'click' :
				btn = evt.target;

				let prevIndex = _.activateIndex;

				_.activateBtn(btn);
				_.currentIndex = _.activateIndex = $(_.btns).index(btn) + 1;

				if(_.clickCallback) {
					_.clickCallback.call(null, {
						event: evt,
						btn: btn,
						prevIndex: prevIndex,
						index: _.activateIndex
					});
				}

				if(_.activateCallback) {
					_.activateCallback.call(null, {
						event: evt,
						btn: btn,
						prevIndex: prevIndex,
						index: _.activateIndex
					});
				}
			break;
		}
	}

	activateBtn(btn) {
		let _ = this;
		$(_.btns).removeClass(_.activeClass);
		$(btn).addClass(_.activeClass);
	}

	activateBtnByIndex(index) {
		let _ = this;
		$(_.btns).removeClass(_.activeClass);
		$(_.getBtn(index)).addClass(_.activeClass);
	}

	getBtn(index) {
		let idx = index - 1;
		if(idx < 0) return null;

		return $(this.btns).get(idx);
	}

	getActivatedIndex() {
		return this.activateIndex;
	}

	activate(index) {
		let prevIndex = this.activateIndex,
			targetIndex = (index < 0 || index > this.btns.length) ? 0 : index;

		this.activateBtnByIndex(index);
		this.activateIndex = targetIndex;
	}

	destroy(obj) {
		let _ = this;
		
		_.setBtnsEventHandler(false);

		_.btns = [];
		_.mouseoverCallback = null;
		_.mouseoutCallback = null;
		_.clickCallback = null;
		_.activateCallback = null;

		_.currentIndex = 0;
		_.activateIndex = 0;
	}
}

export default Navi;