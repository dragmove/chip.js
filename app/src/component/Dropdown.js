/*
 @ example

 // css
 .dropdown .menu li.on {
 color: #000;
 }
 .dropdown .menu li.on {
 color: #f00;
 }

 // js
 let activateIndex = 3;

 var dropdown = new Dropdown({
 wrap: $('.dropdown'),
 activateIndex: activateIndex,

 titleBtnClass: 'btn-title',
 titleClass: 'title',
 menuClass: 'menu',
 activateMenuClass: 'on',

 activateCallback: function (obj) {
 console.log('activateCallback - obj :', obj); // { btns, btn, title, index, prevIndex }
 },
 openCallback: function (obj) {
 console.log('openCallback - obj :', obj); // { title, index }
 },
 closeCallback: function (obj) {
 console.log('closeCallback - obj :', obj); // { title, index }
 },

 isCloseByClickOutside: true
 });
 dropdown.init();

 // dropdown public methods
 // get title.
 // console.log('dropdown.getTitle() :', dropdown.getTitle());

 // get activated index.
 // console.log( 'dropdown.getActivatedIndex() :', dropdown.getActivatedIndex() );

 // activate dropdown menu.
 // dropdown.activate(3);

 // open dropdown. and, call openCallback
 // dropdown.open();

 // close dropdown. and, call closeCallback
 // dropdown.close();

 // destroy
 // dropdown.destroy();
 */

import Navi from './Navi';

class Dropdown {
  constructor(options) {
    const _ = this;
    if (!options) return;

    _.option = $.extend({
      wrap: null,
      titleBtnClass: 'btn-title',
      titleClass: 'title',
      menuClass: 'menu',

      activateMenuClass: 'on',
      activateIndex: 0,

      activateCallback: null,
      openCallback: null,
      closeCallback: null,

      isCloseByClickOutside: true,

      global: global
    }, options);

    _.global = (_.option.global) ? _.option.global : window;

    _.wrap = null;
    _.titleBtn = null;
    _.title = null;
    _.menuWrap = null;
    _.menu = null;

    _.isShowMenu = false;
  }

  init(obj) {
    this.setInstance();
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.wrap = $(opt.wrap);
    _.titleBtn = $(`.${opt.titleBtnClass}`, _.wrap);
    _.title = $(`.${opt.titleClass}`, _.titleBtn);
    _.menuWrap = $(`.${opt.menuClass}`, _.wrap);

    if (!_.titleBtn.length || !_.menuWrap.length) return;

    _.setTitleBtn();
    _.setMenu();
    _.showMenu(_.isShowMenu, opt.isCloseByClickOutside);
    _.activate(opt.activateIndex);
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

  setTitleBtn() {
    const _ = this;

    _.titleBtn.on('click.ui.dropdown', evt => {
      (_.isShowMenu) ? _.close() : _.open();
    });
  }

  setMenu() {
    const _ = this,
      opt = _.option;

    _.menu = new Navi({
      btns: $('li', _.menuWrap),

      clickCallback: function (obj) {
        const btn = $(_.menu.getBtn(obj.index)),
          text = btn.text();

        _.showMenu(false, opt.isCloseByClickOutside);
        _.isShowMenu = false;

        if (_.option.closeCallback) {
          _.option.closeCallback.call(_, {
            title: text,
            index: obj.index
          });
        }
      },

      activateCallback: function (obj) {
        const btns = $(_.menu.getBtns());
        if (obj.index <= 0 || obj.index > btns.length) return;

        const btn = $(_.menu.getBtn(obj.index)),
          text = btn.text();

        btns.removeClass(opt.activateMenuClass);
        btn.addClass(opt.activateMenuClass);

        _.setTitle(text);

        if (opt.activateCallback) {
          const data = {
            btns: btns,
            btn: btn,
            title: text,
            index: obj.index,
            prevIndex: obj.prevIndex
          };
          opt.activateCallback.call(this, data);
        }
      }
    });
    _.menu.init();
  }

  showMenu(flag, isCloseByClickOutside) {
    const _ = this;
    (flag) ? this.menuWrap.show() : this.menuWrap.hide();

    if (isCloseByClickOutside) _.setDocumentEventHandler(flag);
  }

  setTitle(str) {
    this.title.text(str);
  }

  /*
   * public methods
   */
  getTitle() {
    return this.title.text() || '';
  }

  getActivatedIndex() {
    return this.menu.getActivatedIndex() || 0;
  }

  getTitleBtn() {
    return this.titleBtn;
  }

  getMenu() {
    return this.menuWrap;
  }

  activate(index) {
    if (this.menu) this.menu.activate(index);
  }

  open() {
    const _ = this,
      opt = _.option;

    _.showMenu(true, opt.isCloseByClickOutside);
    _.isShowMenu = true;

    if (opt.openCallback) {
      opt.openCallback.call(_, {
        title: _.getTitle(),
        index: _.getActivatedIndex()
      });
    }
  }

  close() {
    const _ = this,
      opt = _.option;

    _.showMenu(false, opt.isCloseByClickOutside);
    _.isShowMenu = false;

    if (opt.closeCallback) {
      opt.closeCallback.call(_, {
        title: _.getTitle(),
        index: _.getActivatedIndex()
      });
    }
  }

  destroy(obj) {
    const _ = this;

    _.wrap = null;

    _.titleBtn.off('click.ui.dropdown');
    _.titleBtn = null;

    _.title = null;

    _.menuWrap = null;

    _.menu.destroy();
    _.menu = null;

    _.setDocumentEventHandler(false);

    _.isShowMenu = false;
  }
}

export default Dropdown;