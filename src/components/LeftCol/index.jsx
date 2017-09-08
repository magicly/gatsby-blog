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
  // color: #fff;
  opacity: .7;
  width: 28px;
  height: 28px;
  line-height: 26px;
`
const GithubLink = SocialLink.extend`
  background: #afb6ca;
  border: 1px solid #afb6ca;
  :after {
    content: "\\e8ee";
  }
`
const WeiboLink = SocialLink.extend`
  background: #aaf;
  border: 1px solid #aaf;
  :after {
    content: "\\e613";
  }
`
const TwitterLink = SocialLink.extend`
  background: #1DA1F2;
  border: 1px solid #1DA1F2;
  :after {
    content: "\\ec9c";
  }
`
const SideBar = ({ className }) => {
  return <div className={className}>
    <Overlay />
    <SelfIntro>
      <Link to="/">
        <Avatar src="https://static.oschina.net/uploads/user/53/106378_100.jpg" />
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
      <ColorA>所有文章 / </ColorA>
      <Link to="/about">关于我</Link>
    </Menu2>
    <Social>
      <GithubLink className="iconfont" href="https://github.com/magicly" title="Github" target="_blank"></GithubLink>
      <WeiboLink className="iconfont" href="https://weibo.com/magicly" title="Weibo" target="_blank"></WeiboLink>
      <TwitterLink className="iconfont" href="https://twitter.com/magicly007" title="Twitter" target="_blank"></TwitterLink>
    </Social>
  </div>
}

const StyledSideBar = styled(SideBar) `
  background-color: white;
  width: 300px;
  height: 100%;
  position: fixed;
  text-align: center;
  opacity: 1;
`
export default StyledSideBar;