import Navi from './component/Navi';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let navi = new Navi({
      btns: $('.navi li a'),
      mouseoverCallback: (obj) => {
        console.log('mouseoverCallback :', obj);
      },
      mouseoutCallback: (obj) => {
        console.log('mouseoutCallback :', obj);
      },
      mousedownCallback: (obj) => {
        console.log('momousedownCallbackusedown :', obj);
      },
      mouseupCallback: (obj) => {
        console.log('mouseupCallback:', obj);
      },
      clickCallback: (obj) => {
        console.log('clickCallback :', obj);
      },
      activateCallback: (obj) => {
        console.log('activateCallback :', obj);

        const btns = $(navi.getBtns()),
          btn = $(navi.getBtn(obj.index));

        btns.removeClass('on');
        btn.addClass('on');
      }
    }).init();

    // activate 3rd btn
    // navi.activate(3);

    // get activated index
    // console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
  }
}(jQuery));