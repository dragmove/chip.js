class ImageLoader {
  constructor(options) {
    if(!options) return;
    let _ = this;

    _.loadCompleteCallback = options.loadCompleteCallback || null;
    _.loadPerCompleteCallback = options.loadPerCompleteCallback || null;
    _.loadErrorCallback = options.loadErrorCallback || null;

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
    let _ = this;

    if( _.loadingIndex >= _.imgURLArr.length) {
      _.isLoading = false;
      _.isFinish = true;

      if( _.loadCompleteCallback ) _.loadCompleteCallback.call(null, {
        imgs: _.loadedImgArr, 
        percentage: _.percentageLoaded
      });

      return;
    }

    let img = document.createElement('img');
    img.onload = function(evt) {
      let img = this;
      if(img) _.loadedImgArr.push(img);

      _.loadingIndex++;
      _.loadSuccessNum++;
      _.loadCompleteNum++;
      _.percentageLoaded = _.loadCompleteNum / _.imgURLArr.length;

      if(_.loadPerCompleteCallback) {
        _.loadPerCompleteCallback.call(null, {
          event: evt,
          img: img, 
          percentage: _.percentageLoaded
        });
      }

      _.loadNext();
    };

    img.onerror = function(evt) {
      let img = this;
      _.loadedImgArr.push(null);

      _.loadingIndex++;
      _.loadFailNum++;
      _.loadCompleteNum++;
      _.percentageLoaded = _.loadCompleteNum / _.imgURLArr.length;

      if(_.loadErrorCallback) {
        _.loadErrorCallback.call(null, {
          event: evt,
          img: img,
          percentage: _.percentageLoaded
        });
      }

      _.loadNext();
    };

    img.src = _.imgURLArr[ _.loadingIndex ];

    _.imgArr.push(img);
  }

  /*
   * public methods
   */

  /**
   * start load images
   *
   * @method start
   * @return {Void}
   */
  start(imgURLArr) {
    let _ = this;

    if(!imgURLArr || imgURLArr.constructor !== Array || imgURLArr.length <= 0) return;
    _.imgURLArr = imgURLArr;

    if(_.isLoading) return;
    _.isLoading = true;
    _.isFinish = false;
    
    _.loadNext();
  }

  /**
   * get load finish all image files
   *
   * @method isFinished
   * @return {Boolean} Returns true or false
   */
  isFinished() {
    return this.isFinish;
  }

  /**
   * get Array have loaded images
   *
   * @method getLoadedImageArr
   * @return {Array} Returns Array
   */
  getLoadedImgs() {
    return this.loadedImgArr;
  }

  /**
   * get percentage Number(0 ~ 1)
   *
   * @method getPercentageLoaded
   * @return {Number} Returns Number(0 ~ 1)
   */
  getPercentageLoaded() {
    return this.percentageLoaded;
  }

  /**
   * destroy ImageLoader instance
   *
   * @method destroy
   * @return {Void}
   */
  destroy(obj) {
    let _ = this;

    if(_.isLoading) {
      let img;
      for(let i=0,max=_.imgArr.length; i<max; i++) {
        img = _.imgArr[i];
        if(img) {
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

    _.loadedImgArr = null;
    _.imgArr = null;
    _.imgURLArr = null;

    _.loadingIndex = 0;
    _.loadFailNum = 0;
    _.loadSuccessNum = 0;
    _.loadCompleteNum = 0;

    _.percentageLoaded = 0;
  }
}

export default ImageLoader;