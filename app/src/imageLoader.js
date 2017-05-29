import ImageLoader from './component/ImageLoader';

(function ($) {
  "use strict";
  $(document).ready(init);

  function init() {
    let imgLoader = new ImageLoader({
      loadCompleteCallback: (obj) => {
        console.log('loadComplete :', obj);
        console.log('imgLoader.isFinished() :', imgLoader.isFinished());
        console.log('imgLoader.getLoadedImgs() :', imgLoader.getLoadedImgs());
      },
      loadPerCompleteCallback: (obj) => {
        console.log('loadPerComplete :', obj);
        console.log('imgLoader.isFinished() :', imgLoader.isFinished());
        console.log('imgLoader.getLoadedImgs() :', imgLoader.getLoadedImgs());
      },
      loadErrorCallback: (obj) => {
        console.log('loadError :', obj)
        console.log('imgLoader.isFinished() :', imgLoader.isFinished());
        console.log('imgLoader.getLoadedImgs() :', imgLoader.getLoadedImgs());
      }
    });

    imgLoader.start([
      'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?dpr=2&auto=compress,format&crop=entropy&fit=crop&w=767&h=511&q=80&cs=tinysrgb',
      'https://images.unsplash.com/error-dummy-url.png',
      'https://images.unsplash.com/photo-1459666644539-a9755287d6b0?dpr=2&auto=compress,format&crop=entropy&fit=crop&w=767&h=463&q=80&cs=tinysrgb'
    ]);
  }
}(jQuery));