import { isDefined, isFunction, not } from '../utils/util';

class ImageLoader {
  constructor(options) {
    if (not(isDefined)(options)) {
      throw new Error('require options object when create ImageLoader instance.');
    }

    const _ = this;

    _.loadCompleteCallback = isFunction(options.loadCompleteCallback) ? options.loadCompleteCallback : null;
    _.loadPerCompleteCallback = isFunction(options.loadPerCompleteCallback) ? options.loadPerCompleteCallback : null;
    _.loadErrorCallback = isFunction(options.loadErrorCallback) ? options.loadErrorCallback : null;

    _.isLoading = false;
    _.isFinish = false;

    _.loadedImgArr = [];
    _.imgArr = [];
    _.imgURLArr = [];

    _.loadingIndex = 0;
    _.loadFailNum = 0;
    _.loadSuccessNum = 0;
    _.loadCompleteNum = 0;

    _.percentageLoaded = 0;
  }

  loadNext() {
    const _ = this;

    if (_.loadingIndex >= _.imgURLArr.length) {
      _.isLoading = false;
      _.isFinish = true;

      if (_.loadCompleteCallback) _.loadCompleteCallback.call(null, {
        imgs: _.loadedImgArr,
        percentage: _.percentageLoaded
      });

      return;
    }

    let img = document.createElement('img');

    img.onload = function (evt) {
      let img = this;
      if (img) _.loadedImgArr.push(img);

      _.loadingIndex++;
      _.loadSuccessNum++;
      _.loadCompleteNum++;
      _.percentageLoaded = _.loadCompleteNum / _.imgURLArr.length;

      if (_.loadPerCompleteCallback) {
        _.loadPerCompleteCallback.call(null, {
          event: evt,
          img: img,
          percentage: _.percentageLoaded
        });
      }

      _.loadNext();
    };

    img.onerror = function (evt) {
      let img = this;
      _.loadedImgArr.push(null);

      _.loadingIndex++;
      _.loadFailNum++;
      _.loadCompleteNum++;
      _.percentageLoaded = _.loadCompleteNum / _.imgURLArr.length;

      if (_.loadErrorCallback) {
        _.loadErrorCallback.call(null, {
          event: evt,
          img: img,
          percentage: _.percentageLoaded
        });
      }

      _.loadNext();
    };

    img.src = _.imgURLArr[_.loadingIndex];

    _.imgArr.push(img);
  }

  /*
   * public methods
   */
  /**
   * start load images
   *
   * @method start
   * @param {Array} imgURLArr
   * @returns {Object} return context
   */
  start(imgURLArr) {
    const _ = this;

    if (not(isDefined)(imgURLArr) || not(Array.isArray)(imgURLArr)) {
      throw TypeError('imgURLArr parameter type of start() must be array type.');
    }

    if (imgURLArr.length > 0) {
      _.imgURLArr = imgURLArr;

      if (!_.isLoading) {
        _.isLoading = true;
        _.isFinish = false;

        _.loadNext();
      }
    }

    return _;
  }

  /**
   * get flag finish load all images
   *
   * @method isFinished
   * @returns {Boolean} return boolean
   */
  isFinished() {
    return this.isFinish;
  }

  /**
   * get array have loaded images
   *
   * @method getLoadedImageArr
   * @returns {Array} return array
   */
  getLoadedImgs() {
    return this.loadedImgArr;
  }

  /**
   * get percentage number(0 ~ 1)
   *
   * @method getPercentageLoaded
   * @returns {Number} return number(0 ~ 1)
   */
  getPercentageLoaded() {
    return this.percentageLoaded;
  }

  /**
   * destroy
   *
   * @method destroy
   * @param {Object} hook object
   * @returns {Object} return context
   */
  destroy(obj = null) {
    const _ = this;

    if (_.isLoading === true) {
      let img;
      for (let i = 0, max = _.imgArr.length; i < max; i++) {
        img = _.imgArr[i];

        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      }
    }

    _.loadCompleteCallback = null;
    _.loadPerCompleteCallback = null;
    _.loadErrorCallback = null;

    _.isLoading = false;
    _.isFinish = false;

    _.loadedImgArr = [];
    _.imgArr = [];
    _.imgURLArr = [];

    _.loadingIndex = 0;
    _.loadFailNum = 0;
    _.loadSuccessNum = 0;
    _.loadCompleteNum = 0;

    _.percentageLoaded = 0;

    return _;
  }
}

export default ImageLoader;