import Dropdown from './component/Dropdown';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    let useDefaultSelectInMobileDevice = true,
      isMobileDevice = ( $('body').hasClass('phone') || $('body').hasClass('tablet') ) ? true : false;

    let dropdown = new Dropdown({
      wrap: $('.ui-dropdown')

      // options
      /*
       activateIndex: 0, // activated option <li> index. default is 0.

       titleBtnClass: 'select', // default is 'select'
       optionWrapClass: 'option', // default is 'option'

       activateOptionClass: 'selected', // default is 'selected'
       activateCallback: function (obj) {
       console.log('activateCallback :', obj); // { btns, btn, title, index, prevIndex }
       },
       openCallback: function (obj) {
       console.log('openCallback :', obj); // { title, index }
       },
       closeCallback: function (obj) {
       console.log('closeCallback :', obj); // { title, index }
       },

       isCloseByClickOutside: true, // default is true
       disableClass: 'disabled' // default is 'disabled'

       // If "useDefaultSelectInMobileDevice", "isMobileDevice" variables are all true, use <select> element instead of <ul class="option">...</ul> custom UI.
       // useDefaultSelectInMobileDevice: useDefaultSelectInMobileDevice, // default is false
       // isMobileDevice: isMobileDevice // default is false
       */
    }).init();

    /*
     * dropdown public methods
     */
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

    // get activated option's data-value.
    // console.log( 'dropdown.getActivatedOptionValue() :', dropdown.getActivatedOptionValue() );

    // get option info by data-value.
    // console.log("dropdown.getOptionInfoByValue('02') :", dropdown.getOptionInfoByValue('02')); // { btn, btns, index, title, value }

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

    // get dropdown disabled status
    // console.log( 'dropdown.isDisabled() :', dropdown.isDisabled() );

    // change dropdown options. and, change title.
    // dropdown.changeOptions([{text: 'new-option-1', value: '91'}, {text: 'new-option-2', value: '92'}, {text: 'new-option-3', value: '93'}, {text: 'new-option-4', value: '94'}, {text: 'new-option-5', value: '95'}]).setTitle('new-title');

    // destroy
    // dropdown.destroy();
  }

}(jQuery));