import Navi from './Navi';

class HorizontalScrollNavi extends Navi {
  constructor(options) {
    if(!window.Dragdealer) {
      throw new Error('HorizontalScrollNavi.js require Dragdealer.js Library.');
    }

    if(!options) return;
    super(options);

    // TODO
  }

  /*
  constructor(options) {
    if(!options) return;
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
  */
}

export default HorizontalScrollNavi;