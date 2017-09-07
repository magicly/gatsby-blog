import React from 'react';

exports.onRenderBody = function({setPostBodyComponents}, pluginOptions) {
  // console.log('onServerRender ....')
  return setPostBodyComponents([
    <script
    key='body1'
    dangerouslySetInnerHTML={{
      __html:
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?d89d5868b0669fbbdc2ddb7c1d8ad1c5";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `
    }}>
    </script>
  ])
}