import {isDefined, not} from '../utils/util';

class Navi {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require options object when create Navi instance.');
    }

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
      mouseoverBtnEventHandler: null,
      mouseoutBtnEventHandler: null,
      mousedownBtnEventHandler: null,
      mouseupBtnEventHandler: null,
      clickBtnEventHandler: null
    };
  }

  init(obj = null) {
    const _ = this;

    _.proxy.mouseoverBtnEventHandler = $.proxy(_.mouseoverBtnEventHandler, _);
    _.proxy.mouseoutBtnEventHandler = $.proxy(_.mouseoutBtnEventHandler, _);
    _.proxy.mousedownBtnEventHandler = $.proxy(_.mousedownBtnEventHandler, _);
    _.proxy.mouseupBtnEventHandler = $.proxy(_.mouseupBtnEventHandler, _);
    _.proxy.clickBtnEventHandler = $.proxy(_.clickBtnEventHandler, _);

    _.setBtnsEventHandler(true);

    return _;
  }

  mouseoverBtnEventHandler(evt) {
    evt.preventDefault();

    const _ = this,
      btn = evt.currentTarget;

    _.currentIndex = $(_.btns).index(btn) + 1;

    if (isDefined(_.mouseoverCallback)) {
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

    if (isDefined(_.mousedownCallback)) {
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

    if (isDefined(_.mouseupCallback)) {
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

    if (isDefined(_.clickCallback)) {
      _.clickCallback.call(null, {
        event: evt,
        btn: btn,
        prevIndex: prevIndex,
        index: idx
      });
    }

    if (isDefined(_.activateCallback)) {
      _.activateCallback.call(null, {
        prevIndex: prevIndex,
        index: idx
      });
    }

    _.currentIndex = _.activateIndex = idx;
  }

  /*
   * public methods
   */
  setBtnsEventHandler(flag) {
    const _ = this;

    if (flag === true) {
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

  getBtns() {
    return this.btns;
  }

  getBtn(index) {
    const idx = index - 1;

    if (idx < 0 || idx >= this.btns.length) return null;

    return $(this.btns).get(idx);
  }

  getActivatedIndex() {
    return this.activateIndex;
  }

  activate(index) {
    const _ = this,
      idx = (index <= 0 || index > _.btns.length) ? 0 : index;

    if (isDefined(_.activateCallback)) {
      _.activateCallback.call(null, {
        prevIndex: _.activateIndex,
        index: idx
      });
    }

    _.activateIndex = idx;

    return _;
  }

  destroy(obj = null) {
    const _ = this;

    _.setBtnsEventHandler(false);

    _.btns = [];

    _.mouseoverCallback = null;
    _.mouseoutCallback = null;
    _.mousedownCallback = null;
    _.mouseupCallback = null;
    _.clickCallback = null;
    _.activateCallback = null;

    _.currentIndex = 0;
    _.activateIndex = 0;

    _.proxy.mouseoverBtnEventHandler = null;
    _.proxy.mouseoutBtnEventHandler = null;
    _.proxy.mousedownBtnEventHandler = null;
    _.proxy.mouseupBtnEventHandler = null;
    _.proxy.clickBtnEventHandler = null;

    return _;
  }
}

export default Navi;