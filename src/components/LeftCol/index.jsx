import React from 'react';

import GatsbyLink from "gatsby-link"
import styled from 'styled-components';

const Overlay = styled.div`
  background-color: #4d4d4d;
  width: 100%;
  height: 180px;
  position: absolute;
`
const SelfIntro = styled.div`
  width: 76%;
  text-align: center;
  margin: 112px auto 0
`
const Avatar = styled.img`
    border: 5px solid #fff;
    border-radius: 300px;
    width: 128px;
    height: 128px;
    margin: 0 auto;
    position: relative;
`
const Author = styled.h1`
    margin: .67em 0;
    font-family: Roboto,serif;
    font-size: 30px;
`
const Tags = styled.p`
    color: #999;
    font-size: 14px;
    line-height: 25px;
`
const Menu = styled.nav`
    font-weight: 300;
    line-height: 31px;
    text-transform: uppercase;
    float: none;
    min-height: 150px;
    margin-left: -32px;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
`
const Menu2 = styled.nav`
  font-size: 12px;
  margin-bottom: 20px;
`
const Social = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`
const ColorA = styled.a`
  color: #696969;
  cursor: pointer;
`
const Link = styled(GatsbyLink) `
  color: #696969;
`
const SocialLink = ColorA.extend`
  border-radius: 50%;
  display: -moz-inline-stack;
  display: inline-block;
  vertical-align: middle;
  zoom: 1;
  margin: 0 8px 15px;
  transition: .3s;
  text-align: center;
  color: #fff;
  opacity: .7;
  width: 28px;
  height: 28px;
  line-height: 26px;
`
const GithubLink = SocialLink.extend`
  background: #afb6ca;
  border: 1px solid #afb6ca;
`
const WeiboLink = SocialLink.extend`
  background: #aaf;
  border: 1px solid #aaf;
`
const TwitterLink = SocialLink.extend`
  background: #1DA1F2;
  border: 1px solid #1DA1F2;
`
const WXLink = SocialLink.extend`
  background: green;
  border: 1px solid green;
  img {
    display: none;
  }
  :hover {
    img {
      position:absolute;
      left: 40px;
      bottom: 20px;
      display: block;
      width: 215px;
      height: 215px;
    }
  }
`
const SideBar = styled.div`
  background-color: white;
  width: 300px;
  height: 100%;
  position: fixed;
  text-align: center;
  opacity: 1;
`
export default ({ showMiddle }) => {
  return <SideBar>
    <Overlay />
    <SelfIntro>
      <Link to="/">
        {/* <Avatar src="https://static.oschina.net/uploads/user/53/106378_100.jpg" /> */}
        <Avatar src="https://static.magicfun.ai/images/ly_128.png" />
        {/* <Avatar src="http://tva2.sinaimg.cn/crop.0.0.180.180.180/64256cb5jw1e8qgp5bmzyj2050050aa8.jpg" />  */}
      </Link>
      <Author>
        <Link to="/">magicly </Link>
      </Author>
      <Tags>Programmer, Geek, Magic, Poker, ML</Tags>
    </SelfIntro>
    <Menu>
      <ul>
        <li><Link to="/">主页</Link></li>
        <li><Link to="/archives">归档</Link></li>
      </ul>
    </Menu>
    <Menu2>
      <ColorA onClick={() => showMiddle('all')}>所有文章 / </ColorA>
      <ColorA onClick={() => showMiddle('me')}>关于我</ColorA>
    </Menu2>
    <Social>
      <GithubLink className="iconfont icon-github" href="https://github.com/magicly" title="Github" target="_blank"></GithubLink>
      <WeiboLink className="iconfont icon-weibo" href="https://weibo.com/magicly" title="Weibo" target="_blank"></WeiboLink>
      <TwitterLink className="iconfont icon-twitter" href="https://twitter.com/magicly007" title="Twitter" target="_blank"></TwitterLink>
      <WXLink className="iconfont icon-weixin" href="https://mp.weixin.qq.com/s?__biz=MzI2NzQ0NjQ2Ng==&mid=2247483661&idx=1&sn=e75ed1772653a445b7751e4a84dd8f51&chksm=eafff0a0dd8879b6708cb1e152f74bd327d1c92f53f61ab992dea5dfe74c7e3fe8b2162bb591&mpshare=1&scene=1&srcid=0924ruejjAea8tOrkIE1hXkr#rd" title="Twitter" target="_blank">
        <img src="https://static.magicfun.ai/qrcode/jsforfun.jpg" />
      </WXLink>
    </Social>
  </SideBar>
}