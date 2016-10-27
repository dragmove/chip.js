import Navi from './Navi';

class NaviHasTimer extends Navi {
	constructor(options) {
		super(options);

		this.timerInterval = (options.timerInterval >= 0 || typeof options.timerInterval !== 'undefined') ? options.timerInterval : 500;

		this.timer = null;
	}

	mouseoverBtnEventHandler(evt) {
		this.removeTimer();
		super.mouseoverBtnEventHandler(evt);
	}

	mouseoutBtnEventHandler(evt) {
		let _ = this;
		_.timer = setTimeout(() => {
			_.displayNaviStatusByTimer(_.activateIndex);
		}, _.timerInterval);

		super.mouseoutBtnEventHandler(evt);
	}

	displayNaviStatusByTimer(index) {
		super.displayNaviStatus(index);
	}

	removeTimer() {
		if(this.timer) clearTimeout(this.timer);
		this.timer = null;
	}

	/*
	 * public methods
	 */
	// getBtn(index)
	// getActivatedIndex()
	// activate(index)
	destroy(obj) {
		super.destroy(obj);
		this.removeTimer();
	}
}

export default NaviHasTimer;