import Navi from './Navi';
import { isDefined, isString, isFunction, isExistJQueryObj, not } from '../utils/util';

class Dropdown {
  constructor(options) {
    const _ = this;

    if (not(isDefined)(options)) {
      throw new Error('require option object when create Dropdown instance.');
    }

    _.option = $.extend({
      wrap: null,
      titleBtnClass: 'select',
      optionWrapClass: 'option',

      activateOptionClass: 'selected',
      activateIndex: 0,

      activateCallback: null,
      openCallback: null,
      closeCallback: null,

      isCloseByClickOutside: true,
      isDisableClass: 'disabled',

      // mobile device options
      useDefaultSelectInMobileDevice: false,
      isMobileDevice: false,

      global: global
    }, options);

    _.global = (_.option.global) ? _.option.global : window;

    _.uniqueId = Date.now();

    _.wrap = null;
    _.titleBtn = null;
    _.title = null;
    _.optionWrap = null;
    _.optionMenu = null;

    _.isShowOptionWrap = false;
    _.isDisable = false;

    // mobile device
    _.selectEl = null;
    _.isMobileDeviceUseDefaultSelect = false;

    _.proxy = {
      changeSelectElementEventHandler: null,
      clickDocumentEventHandler: null
    };
  }

  init(obj = null) {
    this.setInstance();

    return this;
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.wrap = $(opt.wrap);
    _.titleBtn = $(`.${opt.titleBtnClass}`, _.wrap);
    _.title = $('> span', _.titleBtn);
    _.optionWrap = $(`.${opt.optionWrapClass}`, _.wrap);

    if (_.wrap.length > 1) {
      throw new Error('require only one element to Dropdown\'s "wrap" option.');
    }

    _.proxy.changeSelectElementEventHandler = $.proxy(_.changeSelectElementEventHandler, _);
    _.proxy.clickDocumentEventHandler = $.proxy(_.clickDocumentEventHandler, _);

    if (opt.isMobileDevice === true) {
      // phone or tablet device

      if (opt.useDefaultSelectInMobileDevice === true) {
        // console.log('use <select> in mobile device');
        _.isMobileDeviceUseDefaultSelect = true;

        _.titleBtn.remove();
        _.optionWrap.remove();

        _.titleBtn = null;
        _.title = null;
        _.optionWrap = null;

        // set default <select>
        _.selectEl = $('select', _.wrap);

        if (_.selectEl.length > 1) {
          throw new Error('must exist only one <select> element within Dropdown\'s "wrap" option element.');
        }

        let selectOptionBtns = $('option', _.selectEl),
          selectOptionBtn = _.selectEl.find(':selected'),
          selectOptionIndex = selectOptionBtns.index(selectOptionBtn) + 1;

        _.selectEl.data('prevIndex', selectOptionIndex);

        _.setSelectElementEventHandler(true);

      } else {
        // no use <select> in mobile device
        $('select', _.wrap).remove();

        if (_.titleBtn.length <= 0 || _.optionWrap.length <= 0) return;

        _.setTitleBtn();
        _.setOptionMenu();
        _.showOptionMenu(_.isShowOptionWrap, opt.isCloseByClickOutside);
        _.activate(opt.activateIndex);
      }

    } else {
      // pc device
      $('select', _.wrap).remove();

      if (_.titleBtn.length <= 0 || _.optionWrap.length <= 0) return;

      _.setTitleBtn();
      _.setOptionMenu();
      _.showOptionMenu(_.isShowOptionWrap, opt.isCloseByClickOutside);
      _.activate(opt.activateIndex);
    }

    return _;
  }

  setSelectElementEventHandler(flag) {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect !== true) return _;

    if (flag === true) {
      _.selectEl.on('change.ui.dropdown', _.proxy.changeSelectElementEventHandler);
    } else {
      _.selectEl.off('change.ui.dropdown', _.proxy.changeSelectElementEventHandler);
    }

    return _;
  }

  changeSelectElementEventHandler(evt) {
    const _ = this,
      opt = _.option;

    let selectEl = $(evt.target),
      val = selectEl.get(0).value,
      optionBtns = $('option', selectEl),
      optionBtn = selectEl.find(':selected'),
      index = optionBtns.index(optionBtn) + 1,
      prevIndex = selectEl.data('prevIndex');

    selectEl.data('prevIndex', index);

    if (isFunction(opt.activateCallback)) {
      const data = {
        btns: optionBtns,
        btn: optionBtn,
        title: optionBtn.text(),
        index: index,
        prevIndex: prevIndex,
        value: val
      };
      opt.activateCallback.call(_, data);
    }

    return _;
  }

  setTitleBtn() {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect === true) return _;

    if (not(isExistJQueryObj)(_.titleBtn)) return _;

    _.titleBtn.on('click.ui.dropdown', evt => {
      if (_.isDisable === true) return;

      (_.isShowOptionWrap === true) ? _.close() : _.open();
    });

    return _;
  }

  setOptionMenu() {
    const _ = this,
      opt = _.option;

    if (_.isMobileDeviceUseDefaultSelect === true) return _;

    if (not(isExistJQueryObj)(_.optionWrap)) return _;

    if (_.optionMenu) _.optionMenu.destroy();

    _.optionMenu = new Navi({
      btns: $('li', _.optionWrap),

      clickCallback: function (obj) {
        const btn = $(_.optionMenu.getBtn(obj.index));

        _.showOptionMenu(false, opt.isCloseByClickOutside);
        _.isShowOptionWrap = false;

        if (isFunction(_.option.closeCallback)) {
          _.option.closeCallback.call(_, {
            title: btn.text(),
            index: obj.index,
            value: btn.attr('data-value') || null
          });
        }
      },

      activateCallback: function (obj) {
        const btns = $(_.optionMenu.getBtns());
        if (obj.index <= 0 || obj.index > btns.length) return;

        const btn = $(_.optionMenu.getBtn(obj.index)),
          text = btn.text();

        btns.removeClass(opt.activateOptionClass);
        btn.addClass(opt.activateOptionClass);

        _.setTitle(text);

        if (isFunction(opt.activateCallback)) {
          const data = {
            btns: btns,
            btn: btn,
            title: text,
            index: obj.index,
            prevIndex: obj.prevIndex,
            value: btn.attr('data-value') || null
          };
          opt.activateCallback.call(this, data);
        }
      }
    });
    _.optionMenu.init();

    return _;
  }

  setDocumentEventHandler(flag) {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect === true) return _;

    if (flag === true) {
      $(document).on(`click.ui.dropdown.${_.uniqueId}`, _.proxy.clickDocumentEventHandler);
    } else {
      $(document).off(`click.ui.dropdown.${_.uniqueId}`, _.proxy.clickDocumentEventHandler);
    }

    return _;
  }

  clickDocumentEventHandler(evt) {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect === true) return _;

    switch (evt.type) {
      case 'click' :
        if (_.option.isCloseByClickOutside !== true) return;

        if (evt.target === _.wrap.get(0) || $.contains(_.wrap.get(0), evt.target)) return;
        _.close();

        break;
    }

    return _;
  }

  showOptionMenu(flag, isCloseByClickOutside) {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect === true) return _;

    (flag === true) ? _.optionWrap.show() : _.optionWrap.hide();

    if (isCloseByClickOutside === true) _.setDocumentEventHandler(flag);

    return _;
  }

  /*
   * public methods
   */
  getTitle() {
    const _ = this;

    let title = '';

    if (_.isMobileDeviceUseDefaultSelect === true) {
      const optionBtn = _.selectEl.find(':selected');
      title = optionBtn.text() || '';

    } else {
      if (isExistJQueryObj(_.title)) title = this.title.text() || '';
    }

    return title;
  }

  setTitle(str) {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      // there is not title node. can not set title string.

    } else {
      if (isExistJQueryObj(_.title)) _.title.text(str);
    }

    return _;
  }

  getTitleBtn() {
    const _ = this;

    let btn = null;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      btn = _.selectEl.find(':selected');

    } else {
      btn = (isExistJQueryObj(this.titleBtn)) ? this.titleBtn : null;
    }

    return btn;
  }

  getOptionWrap() {
    const _ = this;

    let optionWrap = null;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      optionWrap = (isExistJQueryObj(_.selectEl)) ? _.selectEl : null;

    } else {
      optionWrap = (isExistJQueryObj(_.optionWrap)) ? _.optionWrap : null;
    }

    return optionWrap;
  }

  getActivatedOptionIndex() {
    const _ = this;

    let index = 0;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      if (isExistJQueryObj(_.selectEl)) index = _.selectEl.get(0).selectedIndex + 1;

    } else {
      index = (_.optionMenu) ? _.optionMenu.getActivatedIndex() : 0;
    }

    return index;
  }

  getActivatedOptionValue() {
    const _ = this;

    let value = null;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      const optionBtn = _.selectEl.find(':selected');
      if (optionBtn.length) value = optionBtn.attr('value');

    } else {
      let selectedOption = null;

      if (_.optionMenu) selectedOption = $(_.optionMenu.getBtn(_.getActivatedOptionIndex()));
      value = (selectedOption) ? (selectedOption.attr('data-value') || null) : null;
    }

    return value;
  }

  getOptionInfoByValue(optionDataValue) {
    const _ = this;

    if (not(isString)(optionDataValue)) {
      throw Error('getOptionInfoByValue(optionDataValue) method requires string parameter.');
    }

    let index = 0,
      value = null,
      optionBtns = null,
      optionBtn = null;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      optionBtns = $('option', _.selectEl);

      optionBtn = optionBtns.filter(function (index, element) {
        return ($(element).attr('value') === optionDataValue);
      });

      if (optionBtn.length) {
        index = optionBtns.index(optionBtn) + 1;
        value = optionBtn.attr('value');
      }

    } else {
      optionBtns = _.optionMenu.getBtns();

      if (_.optionMenu) optionBtn = $(optionBtns).filter(function (index, element) {
        return ($(element).attr('data-value') === optionDataValue);
      });

      if (optionBtn.length) {
        index = optionBtns.index(optionBtn) + 1;
        value = optionBtn.attr('data-value');
      }
    }

    return {
      index: index,
      value: value,
      btns: (optionBtns.length > 0) ? optionBtns : [],
      btn: (isExistJQueryObj(optionBtn)) ? optionBtn : null,
      title: optionBtn.text() || ''
    };
  }

  activate(index) {
    const _ = this;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      // phone, tablet device
      if (isExistJQueryObj(_.selectEl)) _.selectEl.get(0).selectedIndex = index - 1;

    } else {
      // pc
      if (_.optionMenu) _.optionMenu.activate(index);
    }

    return _;
  }

  open() {
    const _ = this,
      opt = _.option;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      // <select> element has not open method.

    } else {
      _.showOptionMenu(true, opt.isCloseByClickOutside);
      _.isShowOptionWrap = true;

      if (isFunction(opt.openCallback)) {
        opt.openCallback.call(_, {
          title: _.getTitle(),
          index: _.getActivatedOptionIndex(),
          value: _.getActivatedOptionValue()
        });
      }
    }

    return _;
  }

  close() {
    const _ = this,
      opt = _.option;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      // <select> element has not close method.

    } else {
      _.showOptionMenu(false, opt.isCloseByClickOutside);
      _.isShowOptionWrap = false;

      if (isFunction(opt.closeCallback)) {
        opt.closeCallback.call(_, {
          title: _.getTitle(),
          index: _.getActivatedOptionIndex(),
          value: _.getActivatedOptionValue()
        });
      }
    }

    return _;
  }

  disable(flag) {
    const _ = this;

    flag = (isDefined(flag)) ? flag : true;

    if (_.isMobileDeviceUseDefaultSelect === true) {
      // phone or tablet device
      if (isExistJQueryObj(_.selectEl)) _.selectEl.attr('disabled', flag);

    } else {
      // pc
    }

    (flag === true) ? _.wrap.addClass(_.option.isDisableClass) : _.wrap.removeClass(_.option.isDisableClass);

    _.isDisable = flag;

    return _;
  }

  isDisabled() {
    return this.isDisable;
  }

  changeOptions(optionObjs) {
    // [{text: '', value: ''}, {text: '', value: ''}, ...]

    const _ = this;

    if (not(Array.isArray)(optionObjs) || optionObjs.length <= 0) {
      throw Error('changeOptions(optionObjs) method requires array parameter has {text: "", value: ""} objects.');
    }

    if (_.isMobileDeviceUseDefaultSelect === true) {
      // phone or tablet device
      _.setSelectElementEventHandler(false);

      let html = '', obj, text, value;
      for (let i = 0, max = optionObjs.length; i < max; i++) {
        obj = optionObjs[i];
        text = obj.text || '';
        value = obj.value || '';

        html += `<option value="${value}">${text}</option>`;
      }
      _.selectEl.empty().html(html);

      let selectOptionBtns = $('option', _.selectEl),
        selectOptionBtn = _.selectEl.find(':selected'),
        selectOptionIndex = selectOptionBtns.index(selectOptionBtn) + 1;

      _.selectEl.data('prevIndex', selectOptionIndex);

      _.setSelectElementEventHandler(true);

    } else {
      // pc
      if (_.isShowOptionWrap) _.close();

      _.setDocumentEventHandler(false);

      let html = '', obj, text, value;
      for (let i = 0, max = optionObjs.length; i < max; i++) {
        obj = optionObjs[i];
        text = obj.text || '';
        value = obj.value || '';

        html += `<li data-value="${value}">${text}</li>`;
      }
      _.optionWrap.empty().html(html);

      _.setOptionMenu();
    }

    return _;
  }

  destroy(obj = null) {
    const _ = this;

    _.wrap = null;

    _.titleBtn.off('click.ui.dropdown');
    _.titleBtn = null;

    _.title = null;

    _.optionWrap = null;

    _.optionMenu.destroy();
    _.optionMenu = null;

    _.setDocumentEventHandler(false);

    _.isShowOptionWrap = false;

    _.isDisable = false;

    return _;
  }
}

export default Dropdown;