/*
 @ example

 // css
 .dropdown .option li.selected {
 color: #000;
 }
 .dropdown .option li.selected {
 color: #f00;
 }

 // js
 let dropdown = new Dropdown({
 wrap: $('.dropdown'),
 activateCallback: function (obj) {
 console.log('activateCallback - obj :', obj); // { btns, btn, title, index, prevIndex }
 },
 activateIndex: 0, // default is 0.
 titleBtnClass: 'select', // default is 'select'
 optionWrapClass: 'option', // default is 'option'
 activateOptionClass: 'selected', // default is 'selected'

 openCallback: function (obj) {
 console.log('openCallback - obj :', obj); // { title, index }
 },
 closeCallback: function (obj) {
 console.log('closeCallback - obj :', obj); // { title, index }
 },

 isCloseByClickOutside: true, // default is true
 isDisableClass: 'disabled' // default is 'disabled'
 }).init();

 // dropdown public methods
 // get title.
 // console.log('dropdown.getTitle() :', dropdown.getTitle());

 // set title.
 // dropdown.setTitle('temp title');

 // get titleBtn node
 // console.log('dropdown.getTitleBtn() :', dropdown.getTitleBtn());

 // get option wrap node
 // console.log('dropdown.getOptionWrap() :', dropdown.getOptionWrap());

 // get activated option index.
 // console.log( 'dropdown.getActivatedOptionIndex() :', dropdown.getActivatedOptionIndex() );

 // get activated option's data-value
 // console.log( 'dropdown.getActivatedOptionValue() :', dropdown.getActivatedOptionValue() );

 // activate dropdown option.
 // dropdown.activate(3);

 // open dropdown. and, call openCallback
 // dropdown.open();

 // close dropdown. and, call closeCallback
 // dropdown.close();

 // disable dropdown
 // dropdown.disable(true);

 // enable dropdown
 // dropdown.disable(false);

 // change dropdown menu options. and, reset title
 // dropdown.changeOptions([{text: 'new-option-1', value: '91'}, {text: 'new-option-2', value: '92'}, {text: 'new-option-3', value: '93'}, {text: 'new-option-4', value: '94'}, {text: 'new-option-5', value: '95'}]);
 // dropdown.setTitle('new-title');

 // destroy
 // dropdown.destroy();
 */

import Navi from './Navi';
import aid from 'aid.js';

class Dropdown {
  constructor(options) {
    const _ = this;
    if (!options) return;

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

      global: global
    }, options);

    _.global = (_.option.global) ? _.option.global : window;

    _.wrap = null;
    _.titleBtn = null;
    _.title = null;
    _.optionWrap = null;
    _.optionMenu = null;

    _.isShowOptionWrap = false;
    _.isDisable = false;
  }

  init(obj) {
    this.setInstance();
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.wrap = $(opt.wrap);
    _.titleBtn = $(`.${opt.titleBtnClass}`, _.wrap);
    _.title = $('> span', _.titleBtn);
    _.optionWrap = $(`.${opt.optionWrapClass}`, _.wrap);

    if (!_.titleBtn.length || !_.optionWrap.length) return;

    _.setTitleBtn();
    _.setOptionMenu();
    _.showOptionMenu(_.isShowOptionWrap, opt.isCloseByClickOutside);
    _.activate(opt.activateIndex);
  }

  setTitleBtn() {
    const _ = this;

    _.titleBtn.on('click.ui.dropdown', evt => {
      if (_.isDisable) return;

      (_.isShowOptionWrap) ? _.close() : _.open();
    });
  }

  setOptionMenu() {
    const _ = this,
      opt = _.option;

    if (_.optionMenu) _.optionMenu.destroy();

    _.optionMenu = new Navi({
      btns: $('li', _.optionWrap),

      clickCallback: function (obj) {
        const btn = $(_.optionMenu.getBtn(obj.index));

        _.showOptionMenu(false, opt.isCloseByClickOutside);
        _.isShowOptionWrap = false;

        if (_.option.closeCallback) {
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

        if (opt.activateCallback) {
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
  }

  setDocumentEventHandler(flag) {
    const _ = this;

    if (flag) {
      $(document).on('click.ui.dropdown', $.proxy(_.clickDocumentEventHandler, _));
    } else {
      $(document).off('click.ui.dropdown', $.proxy(_.clickDocumentEventHandler, _));
    }
  }

  clickDocumentEventHandler(evt) {
    const _ = this;

    switch (evt.type) {
      case 'click' :
        if (!_.option.isCloseByClickOutside) return;

        if (evt.target === _.wrap.get(0) || $.contains(_.wrap.get(0), evt.target)) return;
        _.close();

        break;
    }
  }

  showOptionMenu(flag, isCloseByClickOutside) {
    const _ = this;

    (flag) ? _.optionWrap.show() : _.optionWrap.hide();

    if (isCloseByClickOutside) _.setDocumentEventHandler(flag);
  }

  /*
   * public methods
   */
  getTitle() {
    return this.title.text() || '';
  }

  setTitle(str) {
    this.title.text(str);
  }

  getTitleBtn() {
    return this.titleBtn;
  }

  getOptionWrap() {
    return this.optionWrap;
  }

  getActivatedOptionIndex() {
    return this.optionMenu.getActivatedIndex() || 0;
  }

  getActivatedOptionValue() {
    const selectedOption = $(this.optionMenu.getBtn(this.getActivatedOptionIndex())),
      value = (selectedOption) ? (selectedOption.attr('data-value') || null) : null;

    return value;
  }

  activate(index) {
    if (this.optionMenu) this.optionMenu.activate(index);
  }

  open() {
    const _ = this,
      opt = _.option;

    _.showOptionMenu(true, opt.isCloseByClickOutside);
    _.isShowOptionWrap = true;

    if (opt.openCallback) {
      opt.openCallback.call(_, {
        title: _.getTitle(),
        index: _.getActivatedOptionIndex(),
        value: _.getActivatedOptionValue()
      });
    }
  }

  close() {
    const _ = this,
      opt = _.option;

    _.showOptionMenu(false, opt.isCloseByClickOutside);
    _.isShowOptionWrap = false;

    if (opt.closeCallback) {
      opt.closeCallback.call(_, {
        title: _.getTitle(),
        index: _.getActivatedOptionIndex(),
        value: _.getActivatedOptionValue()
      });
    }
  }

  disable(flag) {
    const _ = this;

    flag = (aid.isDefined(flag)) ? flag : true;

    if (flag === true) {
      if (_.isShowOptionWrap) _.close();
      _.wrap.addClass(_.option.isDisableClass);

    } else {
      _.wrap.removeClass(_.option.isDisableClass);
    }

    _.isDisable = flag;
  }

  changeOptions(optionObjs) {
    // [{text: '', value: ''}, {text: '', value: ''}, ...]

    const _ = this,
      opt = _.option;

    if (!aid.isArray(optionObjs) || optionObjs.length <= 0) {
      throw Error('changeOptions(optionListObjs) method requires array parameter has {text: "", value: ""} objects.');
    }

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

  destroy(obj) {
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
  }
}

export default Dropdown;