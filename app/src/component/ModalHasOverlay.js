import Modal from './Modal';

class ModalHasOverlay extends Modal {
  constructor(options) {
    super(options);

    const _ = this;
    _.overlay = (_.option.overlay) ? _.option.overlay : null;
  }

  /*
   * protected methods
   */
  show() {
    super.show();

    const _ = this;
    if (_.overlay) _.overlay.show();

    return _;
  }

  hide() {
    super.hide();

    const _ = this;
    if (_.overlay) _.overlay.hide();

    return _;
  }

  destroy(obj = null) {
    const _ = this;

    obj = $.extend({
      isRemoveNode: true,
      isRemoveOverlay: true
    }, obj);

    const node = _.getNode();

    super.destroy(obj);

    if (_.overlay) {
      _.overlay.destroy({isRemoveNode: obj.isRemoveOverlay});
      _.overlay = null;
    }

    if (obj.isRemoveNode) $(node).remove();

    return _;
  }

  /*
   * public methods
   */
  getOverlay() {
    return this.overlay;
  }
}

export default ModalHasOverlay;