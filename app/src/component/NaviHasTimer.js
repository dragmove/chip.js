import Navi from './Navi';
import {isDefined, isNumber, not} from '../utils/util';

class NaviHasTimer extends Navi {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require options object when create NaviHasTimer instance.');
    }

    super(options);

    this.timerInterval = (isNumber(options.timerInterval) && options.timerInterval >= 0) ? options.timerInterval : 500;

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
  // setBtnsEventHandler(flag)
  // getBtns()
  // getBtn(index)
  // getActivatedIndex()
  // activate(index)

  destroy(obj = null) {
    this.removeTimer();

    super.destroy(obj);

    return this;
  }
}

export default NaviHasTimer;