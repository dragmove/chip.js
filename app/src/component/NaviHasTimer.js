/*
 @example

 // html
 <ul class="navi">
 <li><a href="#">1</a></li>
 <li><a href="#">2</a></li>
 <li><a href="#">3</a></li>
 <li><a href="#">4</a></li>
 </ul>

 // js
 import NaviHasTimer from './component/NaviHasTimer';

 let navi = new NaviHasTimer({
 btns: $('.navi li a'),
 mouseoverCallback: mouseoverCallback,
 mouseoutCallback: mouseoutCallback,
 clickCallback: clickCallback,
 activateCallback: activateCallback,

 timerInterval: 1000
 });
 navi.init();

 function mouseoverCallback(obj) {
 console.log('mouseover :', obj);
 }

 function mouseoutCallback(obj) {
 console.log('mouseout :', obj);
 }

 function clickCallback(obj) {
 console.log('click :', obj);
 }

 function activateCallback(obj) {
 console.log('activateCallback :', obj);

 let btns = $(navi.getBtns()),
 btn = $(navi.getBtn(obj.index));

 btns.removeClass('on');
 btn.addClass('on');
 }

 //activate 3rd btn
 // navi.activate(3);

 //get activated index
 // console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
 */

import Navi from './Navi';
import { isDefined, not } from '../utils/util';

class NaviHasTimer extends Navi {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require option object when create NaviHasTimer instance.');
    }

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
  destroy(obj = null) {
    this.removeTimer();
    super.destroy(obj);

    return this;
  }
}

export default NaviHasTimer;