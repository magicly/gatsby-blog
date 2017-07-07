exports.onRenderBody = function({setPostBodyComponents}, pluginOptions) {
  console.log('onServerRender ....')
  return setPostBodyComponents([
    <script
    key='body1'
    dangerouslySetInnerHTML={{
      __html:
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?fcf7862e13f1dbfdbb92690dab2e86a0";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `
    }}>
    </script>
  ])
}