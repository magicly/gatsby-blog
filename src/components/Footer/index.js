import React from 'react';
import { Row, Col, Icon as IconRaw, Popover } from 'antd';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';
import styled, {injectGlobal} from 'styled-components';
injectGlobal`
  @font-face {font-family: "anticon";
    src: url('fonts/iconfont.eot'); /* IE9*/
    src: url('fonts/iconfont.eot#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('fonts/iconfont.woff') format('woff'), /* chrome, firefox */
    url('fonts/iconfont.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url('fonts/iconfont.svg#anticon') format('svg'); /* iOS 4.1- */
  }

  .anticon {
    font-family:"anticon" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
`

const SocialFont = styled.div`
    position: absolute;
    top: 95px;
    right: 12px;
    width: 204px;
`
const Icon = styled(IconRaw)`
    margin: 0 10px;
    font-size: 30px;
    color: #fff;
    :hover {
      color: #2ca6cb;
    }
`
const IconFont = styled.i`
    margin: 0 10px;
    font-family: "iconfont" !important;
    font-size: 32px;
    font-style: normal;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    :hover {
      color: #2ca6cb;
    }
`
const Container = styled.div`
    position: relative;
    margin-top: 16px;
    padding: 0 26px 8px 26px;
    height: 248px;
    background: #1f1f1f;
`
const Line = styled.span`
    display: block;
    width: 2px;
    height: 80px;
    background: #fff;
`
const Author = styled.div`
    margin-left: -55px;
    border-radius: 50%;
    width: 110px;
    height: 110px;
    background: no-repeat url("http://cdn.yinfengblog.com/tuzi.jpg") ;
    background-size: 100% 100%;
    transition: transform 2s ease-out;
    &:hover {
      transform: rotate(360deg);
    }
`
const Title = styled.span`
    position: absolute;
    top: 50%;
    left: 25%;
    font-size: 20px;
    color: #fff;
`
const Desc = styled.span`
    position: absolute;
    top: 70%;
    left: 20%;
    font-family: "Verdana";
    font-size: 20px;
    color: #fff;
`
const MTitle = styled.div`
    margin: 10px 0;
    font-size: 20px;
    text-align: center;
    color: #fff;
`

const MDesc = styled.div`
    margin: 0 auto;
    width: 230px;
    font-size: 20px;
    text-align: center;
    color: #fff;
`

const Copyright = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    width: 278px;
    font-family: "Verdana";
    font-size: 13px;
    color: #fff;
    transform: translate(-50%);
`
const CopyrightLink = styled.a`
    color: #2ca6cb;
    &:hover {
      text-decoration: underline !important;
    }
`
const AboutLink = CopyrightLink.withComponent(Link)

export default function Footer() {
  const socialFont = (
    <SocialFont>
      <a
        href="https://github.com/accelerator-feng"
        target="_blank"
        rel="noopener noreferrer"
        title="github"
      >
        <Icon type="github" />
      </a>
      <a
        href="http://www.zhihu.com/people/yin-feng-56-5/activities"
        target="_blank"
        rel="noopener noreferrer"
        title="知乎"
      >
        <IconFont>&#xe601;</IconFont>
      </a>
      <Popover
        placement="topLeft"
        content={
          <img
            src="http://cdn.yinfengblog.com/QRcode.png"
            width="100px"
            height="100px"
            style={{ marginTop: '8px' }}
            alt="我的微信二维码"
          />
        }
      >
        <IconFont>&#xe600;</IconFont>
      </Popover>
      <a
        href="mailto:accelerator-feng@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Email Me"
      >
        <Icon type="mail" />
      </a>
    </SocialFont>
  );
  return (
    <Container>
      <Row>
        <MediaQuery query="(min-device-width:750px)">
          <Col span={2} />
          <Col span={12}>
            <Line />
            <Author />
            <Title>未来的前端攻城狮</Title>
            <Desc>Stay hungry. Stay foolish.</Desc>
          </Col>
          <Col span={8}>
            {socialFont}
          </Col>
          <Col span={2} />
        </MediaQuery>
        <MediaQuery query="(max-device-width:750px)">
          <Col span={4} />
          <Col span={16}>
            <MTitle>未来的前端攻城狮</MTitle>
            <MDesc>Stay hungry. Stay foolish.</MDesc>
            {socialFont}
          </Col>
          <Col span={4} />
        </MediaQuery>
      </Row>
      <Copyright>
        Powered by
        {' '}
        <CopyrightLink
          href="https://github.com/dvajs/dva"
          target="_blank"
          rel="noopener noreferrer"
          title="dva.js"
        >
          dva
        </CopyrightLink>
        {' '}
        and
        {' '}
        <CopyrightLink
          href="https://eggjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          title="Egg.js"
        >
          Egg
        </CopyrightLink>
        {' '}
        © 2017
        {' '}
        <AboutLink to="/about">
          Magicly
        </AboutLink>
      </Copyright>
    </Container>
  );
}
