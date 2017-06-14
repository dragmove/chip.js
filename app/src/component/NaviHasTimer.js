import Navi from './Navi';

class NaviHasTimer extends Navi {
  constructor(options) {
    if (!options) return;
    super(options);

    this.timerInterval = (options.timerInterval >= 0 || typeof options.timerInterval !== 'undefined') ? options.timerInterval : 500;
    this.timer = null;
  }

  mouseoverBtnEventHandler(evt) {
    this.removeTimer();
    super.mouseoverBtnEventHandler(evt);
  }

  mouseoutBtnEventHandler(evt) {
    const _ = this;

    super.mouseoutBtnEventHandler(evt);

    _.timer = setTimeout(() => {
      _.activateByTimer(_.activateIndex);
    }, _.timerInterval);
  }

  activateByTimer(index) {
    super.activate(index);
    return this;
  }

  removeTimer() {
    const _ = this;

    if (_.timer) clearTimeout(_.timer);
    _.timer = null;

    return _;
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

    return this;
  }
}

export default NaviHasTimer;