class Navi {
	constructor(options) {
		let _ = this;

		_.btns = options.btns || _.btns;
		_.mouseoverCallback = options.mouseoverCallback || null;
		_.mouseoutCallback = options.mouseoutCallback || null;
		_.clickCallback = options.clickCallback || null;
		
		_.activeClass = options.activeClass || 'active';

		_.currentIndex = 0;
		_.activateIndex = 0;

		_.setBtnsEventHandler(true);
	}

	setBtnsEventHandler(flag) {
		let _ = this;

		if(flag) {
			for(let btn of _.btns) {
				$(btn).on('mouseover', $.proxy(_.mouseoverBtnEventHandler, _));
				$(btn).on('mouseout', $.proxy(_.mouseoutBtnEventHandler, _));
				$(btn).on('click', $.proxy(_.clickBtnEventHandler, _));
			}
		} else {
			for(let btn of _.btns) {
				$(btn).off('mouseover', $.proxy(_.mouseoverBtnEventHandler, _));
				$(btn).off('mouseout', $.proxy(_.mouseoutBtnEventHandler, _));
				$(btn).off('click', $.proxy(_.clickBtnEventHandler, _));
			}
		}
	}

	mouseoverBtnEventHandler(evt) {
		evt.preventDefault();

		let _ = this,
			btn = evt.target;

		_.currentIndex = $(_.btns).index(btn) + 1;

		if(_.mouseoverCallback) {
			_.mouseoverCallback.call(null, {
				event: evt,
				btn: btn,
				index: _.currentIndex
			});
		}
	}

	mouseoutBtnEventHandler(evt) {
		evt.preventDefault();

		let _ = this,
			btn = evt.target;

		if(_.mouseoutCallback) {
			_.mouseoutCallback.call(null, {
				event: evt,
				btn: btn,
				index: $(_.btns).index(btn) + 1
			});
		}
	}

	clickBtnEventHandler(evt) {
		evt.preventDefault();

		let _ = this,
			btn = evt.target;

		let prevIndex = _.activateIndex,
			index = $(_.btns).index(btn) + 1;

		_.displayNaviStatus(index);
		_.currentIndex = _.activateIndex = index;

		if(_.clickCallback) {
			_.clickCallback.call(null, {
				event: evt,
				btn: btn,
				prevIndex: prevIndex,
				index: _.activateIndex
			});
		}
	}

	displayNaviStatus(index) {
		let _ = this;
		$(_.btns).removeClass(_.activeClass);
		$(_.getBtn(index)).addClass(_.activeClass);
	}

	/*
	 * public methods
	 */
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

		this.displayNaviStatus(index);
		this.activateIndex = targetIndex;
	}

	destroy(obj) {
		let _ = this;
		_.setBtnsEventHandler(false);

		_.btns = [];
		_.mouseoverCallback = null;
		_.mouseoutCallback = null;
		_.clickCallback = null;

		_.currentIndex = 0;
		_.activateIndex = 0;
	}
}

export default Navi;