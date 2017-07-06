import NaviHasTimer from './component/NaviHasTimer';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
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
  }

}(jQuery));