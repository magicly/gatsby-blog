import React from 'react';
import {
  Menu as MenuRaw,
  Row,
  Col,
  Icon,
  Button,
  Dropdown,
  message,
  Modal,
} from 'antd';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

const Logo = styled.img`
    width: 83px;
    height: 83px;
    vertical-align: middle;
`
const Title = styled.span`
    position: absolute;
    margin-left: 10px;
    font-size: 39px;
    font-weight: 400;
    color: #fff;
`

const Desc = styled.span`
    position: absolute;
    top: 62px;
    margin-left: 10px;
    font-size: 18px;
    color: #fff;
`

const MenuFold = styled(Icon) `
    float: right;
    font-size: 25px;
    color: #fff;
`

const RowContainer = styled(Row) `
    padding-top: 29px;
    height: 180px !important; // why need?
    background: #2ca6cb;
    box-shadow: 2px 4px 5px rgba(3,3,3,.2);
`
const Menu = styled(MenuRaw) `
    background: #2ca6cb !important;
    border-bottom: none !important;
`
Menu.Item = MenuRaw.Item;

const Header = () => {
  const menu = (
    <Menu>
      <Menu.Item key="index">
        <Link to="/">主页</Link>
      </Menu.Item>
      <Menu.Item key="archives">
        <Link to="/archives">归档</Link>
      </Menu.Item>
      <Menu.Item key="categories">
        <Link to="/categories">分类</Link>
      </Menu.Item>
      <Menu.Item key="about">
        <Link to="/about">关于</Link>
      </Menu.Item>
    </Menu>
  );
  const title = (
    <Link to="/">
      <Logo
        src="http://cdn.yinfengblog.com/logo.png"
        alt="logo"
      />
      <Title>和光同尘</Title>
      <Desc>前端小白的学习笔记</Desc>
    </Link>
  );
  return (
    <RowContainer>
      <MediaQuery query="(min-width:801px)">
        <Col span={1} />
        <Col span={9}>{title}</Col>
        <Col span={13}>
          <Menu
            mode="horizontal"
            theme="dark"
            style={{
              position: 'absolute',
              bottom: '-140px',
              fontSize: '15px',
              right: 0,
            }}
          >
            <Menu.Item key="home">
              <Link to="/"><Icon type="appstore" />主页</Link>
            </Menu.Item>
            <Menu.Item key="archives">
              <Link to="/archives"><Icon type="appstore" />归档</Link>
            </Menu.Item>
            <Menu.Item key="categories">
              <Link to="/categories"><Icon type="appstore" />分类</Link>
            </Menu.Item>
            <Menu.Item key="about">
              <Link to="/about"><Icon type="appstore" />关于</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={1} />
      </MediaQuery>
      <MediaQuery query="(max-width:800px)">
        <div>
          <Col span={1} />
          <Col span={17}>
            {title}
          </Col>
          <Col span={5}>
            <Dropdown overlay={menu} placement="bottomRight">
              <MenuFold type="menu-fold" />
            </Dropdown>
          </Col>
          <Col span={1} />
        </div>
      </MediaQuery>
        <MediaQuery query="(min-width:800px)">
          <a href="https://github.com/accelerator-feng">
            <img
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                border: 0,
                width: 130,
                height: 130,
              }}
              src="http://cdn.yinfengblog.com/forkme.png"
              alt="Fork me on GitHub"
            />
          </a>
        </MediaQuery>
    </RowContainer>
  );
}
export default Header;