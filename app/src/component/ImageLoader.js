/*
 * ImageLoader Class
 */
let ImageLoader = function(_obj) {
  "use strict";

  /*
   * variables
   */
  var loadCompleteCallback = null,
    loadPerCompleteCallback = null,
    loadErrorCallback = null;

  var isLoading = false,
    isFinished = false;

  var loadedImgArr = [],
    imgArr = [],
    imgURLArr = [];

  var loadingIndex = 0,
    loadFailNum = 0,
    loadSuccessNum = 0,
    loadCompleteNum = 0,
    percentageLoaded = 0;

  /*
   * implement
   */
  init(_obj);

  /*
   * functions
   */
  function init(_obj) {
    loadCompleteCallback = _obj.loadCompleteCallback || loadCompleteCallback;
    loadPerCompleteCallback = _obj.loadPerCompleteCallback || loadPerCompleteCallback;
    loadErrorCallback = _obj.loadErrorCallback || loadErrorCallback;
  }

  function loadNext() {
    setTimeout( function(){
      if(loadingIndex >= imgURLArr.length) {
        isLoading = false;
        isFinished = true;
        if(loadCompleteCallback) loadCompleteCallback.apply(null, [ {imgs:loadedImgArr, percentage:percentageLoaded} ]);
        return;
      }

      var _img = document.createElement("img");
      _img.onload = loadCompleteHandler;
      _img.onerror = loadErrorHandler;
      _img.src = imgURLArr[loadingIndex];
      imgArr.push(_img);
    }, 16);
  }

  function loadCompleteHandler(event) {
    var _img = this;
    if(_img) loadedImgArr.push(_img);

    loadingIndex++;
    loadSuccessNum++;
    loadCompleteNum++;
    percentageLoaded = loadCompleteNum / imgURLArr.length;
    if(loadPerCompleteCallback) loadPerCompleteCallback.apply(null, [ {img:_img, percentage:percentageLoaded} ]);

    loadNext();
  }

  function loadErrorHandler(event) {
    var _img = this;
    loadedImgArr.push(null);

    loadingIndex++;
    loadFailNum++;
    loadCompleteNum++;
    percentageLoaded = loadCompleteNum / imgURLArr.length;
    if(loadErrorCallback) loadErrorCallback.apply(null, [ {img:_img, percentage:percentageLoaded} ]);

    loadNext();
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
  function start(_imgUrlArr) {
    if(!_imgUrlArr || _imgUrlArr.constructor!=Array || _imgUrlArr.length<=0) return;
    imgURLArr = _imgUrlArr;

    if(isLoading) return;
    isLoading = true;
    isFinished = false;
    loadNext();
  }

  /**
   * get load finish all image files
   *
   * @method getFinished
   * @return {Boolean} Returns true or false
   */
  function getFinished() {
    return isFinished;
  }

  /**
   * get Array have loaded images
   *
   * @method getLoadedImageArr
   * @return {Array} Returns Array
   */
  function getLoadedImgs() {
    return loadedImgArr;
  }

  /**
   * get percentage Number(0 ~ 1)
   *
   * @method getPercentageLoaded
   * @return {Number} Returns Number(0 ~ 1)
   */
  function getPercentageLoaded() {
    return percentageLoaded;
  }

  /**
   * destroy ImageLoader instance
   *
   * @method destroy
   * @return {Void}
   */
  function destroy() {
    if(isLoading) {
      var img;
      for(var i=0,max=imgArr.length; i<max; i++) {
        img = imgArr[i];
        if(img) {
          img.onload = null;
          img.onerror = null;
        }
        img = null;
      }
    }
    loadCompleteCallback = null;
    loadPerCompleteCallback = null;
    loadErrorCallback = null;

    isLoading = false;
    isFinished = false;

    loadedImgArr = null;
    imgArr = null;
    imgURLArr = null;

    loadingIndex = 0;
    loadFailNum = 0;
    loadSuccessNum = 0;
    loadCompleteNum = 0;

    percentageLoaded = 0;
  }

  return {
    getFinished: getFinished,
    getLoadedImgs: getLoadedImgs,
    getPercentageLoaded: getPercentageLoaded,
    start: start,
    destroy: destroy
  };
};

export {
  ImageLoader
};