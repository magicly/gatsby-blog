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
`

export default ({ article }) => <Article>
  <Header article={article} />
  <Summary article={article} />
  <Footer article={article} />
</Article>
