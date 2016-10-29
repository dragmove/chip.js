class Navi {
	constructor(options) {
		if(!options) return;
		let _ = this;

		_.btns = options.btns || [];

		_.mouseoverCallback = options.mouseoverCallback || null;
		_.mouseoutCallback = options.mouseoutCallback || null;
		_.clickCallback = options.clickCallback || null;
		_.activateCallback = options.activateCallback || null;

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
			btn = evt.target,
			btns = _.btns,
			prevIndex = _.activateIndex,
			idx = $(_.btns).index(btn) + 1;

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
				prevIndex: prevIndex,
				index: idx
			})
		}

		_.currentIndex = _.activateIndex = idx;
	}

	/*
	 * public methods
	 */
	getBtns() {
		return this.btns;
	}

	getBtn(index) {
		let idx = index - 1;
		if(idx < 0 || idx >= this.btns.length) return null;

		return $(this.btns).get(idx);
	}

	getActivatedIndex() {
		return this.activateIndex;
	}

	activate(index) {
		let _ = this,
			idx = (index <= 0 || index > _.btns.length) ? 0 : index;

		if(_.activateCallback) {
			_.activateCallback.call(null, {
				prevIndex: _.activateIndex,
				index: idx
			});	
		}
		
		_.activateIndex = idx;
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