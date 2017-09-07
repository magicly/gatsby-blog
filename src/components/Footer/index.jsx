import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  font-size: 12px;
  font-family: Menlo,Monaco,Andale Mono,lucida console,Courier New,monospace;
  text-shadow: 0 1px #fff;
  opacity: .6;
  width: 100%;
  text-align: center;
  padding: 0 30px;
`
const Left = styled.div`
  float: left;
`
const Right = styled.div`
  float: right;
`
export default () => {
  return <Footer>
    <Left>© 2017 magicly</Left>
    <Right>Powerd by <a href="https://github.com/gatsbyjs/gatsby" target="_blank">Gatsby</a></Right>
  </Footer>
}