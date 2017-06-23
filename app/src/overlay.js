import Overlay from './component/Overlay';

(function ($) {
  "use strict";

  $(document).ready(init);

  function init() {
    const overlay = new Overlay({
      clickCallback: function (evt) {
        console.log('evt :', evt);
      }
    }).init();

    overlay.show();

    /*
     * overlay public methods
     */
    // set node event handler
    // overlay.setNodeEventHandler(true/false);

    // get node
    // console.log(overlay.getNode());

    // set css
    // overlay.setCss({'background-color': '#f00', ...});

    // append to other element
    // overlay.appendTo(parent element);

    // show overlay
    // overlay.show();

    // hide overlay
    // overlay.hide();

    // destroy overlay
    // overlay.destroy();
  }

}(jQuery));