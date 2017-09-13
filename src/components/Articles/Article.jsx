import React from 'react';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';

import styled from 'styled-components'

import Header from './Header';
import Summary from './Summary';
import Footer from './Footer';

const Article = styled.div`
  margin: 30px;
  position: relative;
  border: 1px solid #ddd;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  background: #fff;
  transition: all .2s ease-in;

  ul li:before {
    content: "";
    width: 6px;
    height: 6px;
    border: 1px solid #999;
    border-radius: 10px;
    background: #aaa;
    display: inline-block;
    margin-right: 10px;
    float: left;
    margin-top: 10px;
  }
  @media screen and (max-width: 800px) {
    padding: 10px;
    margin: 10px 0;
    border: 0;
    font-size: 16px;
    color: #555;
  }
`

export default ({ article }) => <Article>
  <Header article={article} />
  <Summary article={article} />
  <Footer article={article} />
</Article>
