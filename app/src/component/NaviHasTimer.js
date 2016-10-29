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

		super.mouseoutBtnEventHandler(evt);

		_.timer = setTimeout(() => {
			_.activateByTimer(_.activateIndex);
		}, _.timerInterval);
	}

	activateByTimer(index) {
		super.activate(index);
	}

	removeTimer() {
		if(this.timer) clearTimeout(this.timer);
		this.timer = null;
	}

	/*
	 * public methods
	 */
	// getBtns()
	// getBtn(index)
	// getActivatedIndex()
	// activate(index)
	destroy(obj) {
		this.removeTimer();
		super.destroy(obj);
	}
}

export default NaviHasTimer;