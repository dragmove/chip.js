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
 mouseoverCallback: (obj) => {
 console.log('mouseover :', obj);
 },
 mouseoutCallback: (obj) => {
 console.log('mouseout :', obj);
 },
 mousedownCallback: (obj) => {
 console.log('mousedown :', obj);
 },
 mouseupCallback: (obj) => {
 console.log('mouseup :', obj);
 },
 clickCallback: (obj) => {
 console.log('click :', obj);
 },
 activateCallback: (obj) => {
 console.log('activateCallback :', obj);

 const btns = $(navi.getBtns()),
 btn = $(navi.getBtn(obj.index));

 btns.removeClass('on');
 btn.addClass('on');
 },

 timerInterval: 1000
 }).init();

 //activate 3rd btn
 // navi.activate(3);

 //get activated index
 // console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
 */

import Navi from './Navi';
import {isDefined, isNumber, not} from '../utils/util';

class NaviHasTimer extends Navi {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require options object when create NaviHasTimer instance');
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