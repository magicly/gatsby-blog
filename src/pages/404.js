import React from "react"
import Helmet from "react-helmet"

const NotFound = () => {
  return <div>
    <Helmet title="404" />
    <Helmet script={[{
      src: `//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js`,
      type: `text/javascript`,
      charset: `utf-8`,
      homePageUrl: `//magicly.me`,
      homePageName: `回到主页`
    }]} />
  </div>
}

export default NotFound;