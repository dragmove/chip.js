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
 import Navi from './component/Navi';

 let navi = new Navi({
 btns: $('.navi li a'),
 mouseoverCallback: mouseoverCallback,
 mouseoutCallback: mouseoutCallback,
 clickCallback: clickCallback,
 activateCallback: activateCallback
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
 navi.activate(3);

 //get activated index
 console.log( 'after call "navi.activate(3)", print "_navi.getActivatedIndex()" :', navi.getActivatedIndex() );
 */

class Navi {
  constructor(options) {
    if (!options) return;
    const _ = this;

    _.btns = options.btns || [];

    _.mouseoverCallback = options.mouseoverCallback || null;
    _.mouseoutCallback = options.mouseoutCallback || null;
    _.mousedownCallback = options.mousedownCallback || null;
    _.mouseupCallback = options.mouseupCallback || null;
    _.clickCallback = options.clickCallback || null;
    _.activateCallback = options.activateCallback || null;

    _.currentIndex = 0;
    _.activateIndex = 0;

    _.proxy = {
      mouseoverBtnEventHandler: $.proxy(_.mouseoverBtnEventHandler, _),
      mouseoutBtnEventHandler: $.proxy(_.mouseoutBtnEventHandler, _),
      mousedownBtnEventHandler: $.proxy(_.mousedownBtnEventHandler, _),
      mouseupBtnEventHandler: $.proxy(_.mouseupBtnEventHandler, _),
      clickBtnEventHandler: $.proxy(_.clickBtnEventHandler, _)
    };
  }

  init(obj) {
    this.setBtnsEventHandler(true);
  }

  setBtnsEventHandler(flag) {
    const _ = this;

    if (flag) {
      for (let i = 0, max = _.btns.length; i < max; i++) {
        $(_.btns.get(i))
          .on('mouseover.ui.navi', _.proxy.mouseoverBtnEventHandler)
          .on('mouseout.ui.navi', _.proxy.mouseoutBtnEventHandler)
          .on('mousedown.ui.navi', _.proxy.mousedownBtnEventHandler)
          .on('mouseup.ui.navi', _.proxy.mouseupBtnEventHandler)
          .on('click.ui.navi', _.proxy.clickBtnEventHandler);
      }
    } else {
      for (let i = 0, max = _.btns.length; i < max; i++) {
        $(_.btns.get(i))
          .off('mouseover.ui.navi', _.proxy.mouseoverBtnEventHandler)
          .off('mouseout.ui.navi', _.proxy.mouseoutBtnEventHandler)
          .off('mousedown.ui.navi', _.proxy.mousedownBtnEventHandler)
          .off('mouseup.ui.navi', _.proxy.mouseupBtnEventHandler)
          .off('click.ui.navi', _.proxy.clickBtnEventHandler);
      }
    }

    return _;
  }

  mouseoverBtnEventHandler(evt) {
    evt.preventDefault();

    const _ = this,
      btn = evt.currentTarget;

    _.currentIndex = $(_.btns).index(btn) + 1;

    if (_.mouseoverCallback) {
      _.mouseoverCallback.call(null, {
        event: evt,
        btn: btn,
        index: _.currentIndex
      });
    }
  }

  mouseoutBtnEventHandler(evt) {
    evt.preventDefault();

    const _ = this,
      btn = evt.currentTarget;

    if (_.mouseoutCallback) {
      _.mouseoutCallback.call(null, {
        event: evt,
        btn: btn,
        index: $(_.btns).index(btn) + 1
      });
    }
  }

  mousedownBtnEventHandler(evt) {
    evt.preventDefault();

    const _ = this,
      btn = evt.currentTarget;

    if (_.mousedownCallback) {
      _.mousedownCallback.call(null, {
        event: evt,
        btn: btn,
        index: $(_.btns).index(btn) + 1
      });
    }
  }

  mouseupBtnEventHandler(evt) {
    evt.preventDefault();

    const _ = this,
      btn = evt.currentTarget;

    if (_.mouseupCallback) {
      _.mouseupCallback.call(null, {
        event: evt,
        btn: btn,
        index: $(_.btns).index(btn) + 1
      });
    }
  }

  clickBtnEventHandler(evt) {
    evt.preventDefault();

    const _ = this,
      btn = evt.currentTarget,
      prevIndex = _.activateIndex,
      idx = $(_.btns).index(btn) + 1;

    if (_.clickCallback) {
      _.clickCallback.call(null, {
        event: evt,
        btn: btn,
        prevIndex: prevIndex,
        index: idx
      });
    }

    if (_.activateCallback) {
      _.activateCallback.call(null, {
        prevIndex: prevIndex,
        index: idx
      })
    }

    _.currentIndex = _.activateIndex = idx;
  }

  /*
   * public methods
   */
  getBtns() {
    return this.btns;
  }

  getBtn(index) {
    let idx = index - 1;
    if (idx < 0 || idx >= this.btns.length) return null;

    return $(this.btns).get(idx);
  }

  getActivatedIndex() {
    return this.activateIndex;
  }

  activate(index) {
    const _ = this,
      idx = (index <= 0 || index > _.btns.length) ? 0 : index;

    if (_.activateCallback) {
      _.activateCallback.call(null, {
        prevIndex: _.activateIndex,
        index: idx
      });
    }

    _.activateIndex = idx;

    return _;
  }

  destroy(obj) {
    const _ = this;

    _.setBtnsEventHandler(false);

    _.btns = [];

    _.mouseoverCallback = null;
    _.mouseoutCallback = null;
    _.clickCallback = null;
    _.activateCallback = null;

    _.currentIndex = 0;
    _.activateIndex = 0;

    return _;
  }
}

export default Navi;