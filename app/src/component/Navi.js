class Navi {
	constructor(options) {
		let _ = this;

		_.btns = options.btns || _.btns;
		_.activateCallback = options.activateCallback || _.activateCallback;
		_.activeClass = options.activeClass || 'active';

		_.activateIndex = 0;

		_.setBtnsEventHandler(true);
	}

	setBtnsEventHandler(flag) {
		if(flag) {
			for(let btn of this.btns) {
				$(btn).on('click', $.proxy(this.btnMouseEventHandler, this));
			}
		} else {
			for(let btn of this.btns) {
				$(btn).off('click', $.proxy(this.btnMouseEventHandler, this));
			}
		}
	}

	btnMouseEventHandler(evt) {
		evt.preventDefault();

		let _ = this;
		switch(evt.type) {
			case 'click' :
				let btn = evt.target,
					prevIndex = _.activateIndex;

				_.activateNavi(btn);
				_.activateIndex = $(_.btns).index(btn) + 1;

				_.callActivateCallback({
					btn: btn,
					prevIndex: prevIndex,
					index: _.activateIndex
				});
			break;
		}
	}

	getBtn(index) {
		let idx = index - 1;
		if(idx < 0) return null;

		return $(this.btns).get(idx);
	}

	activateNavi(btn) {
		let _ = this;
		$(_.btns).removeClass(_.activeClass);
		$(btn).addClass(_.activeClass);
	}

	activateNaviByIndex(index) {
		let _ = this;
		$(_.btns).removeClass(_.activeClass);
		$(_.getBtn(index)).addClass(_.activeClass);
	}

	callActivateCallback(obj) {
		if(this.activateCallback) this.activateCallback.apply(null, [obj]);
	}

	/*
	 * public
	 */
	getActivatedIndex() {
		return this.activateIndex;
	}

	activate(index) {
		let prevIndex = this.activateIndex,
			targetIndex = (index < 0 || index > this.btns.length) ? 0 : index;

		this.activateNaviByIndex(index);
		this.activateIndex = targetIndex;
	}

	destroy(obj) {
		this.setBtnsEventHandler(false);

		this.btns = [];
		this.activateCallback = null;
		this.activateIndex = 0;
	}
}

export default Navi;