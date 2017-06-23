import NaviHasTimer from './component/NaviHasTimer';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    const navi = new NaviHasTimer({
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
  }

}(jQuery));