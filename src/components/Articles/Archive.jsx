import React from 'react';
import Link from "gatsby-link"

import styled from 'styled-components'

import Header from './Header';
import { CategoryAndTags } from './Footer';

const Article = styled.div`
  margin-left: 30px;
  background: #fff;
  padding: 20px 100px 20px 0;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #fff;
  position: relative;

  header {
    border-left: none;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
  }
  a {
    font-size: 16px;
  }
`
const ArchiveFooter = styled(CategoryAndTags) `
  border-top: none;
  margin: 0;
  padding-top: 0;
  min-height: 0;
  text-align: right;
`

export default ({ article }) => <Article>
  <Header article={article} />
  <ArchiveFooter article={article} />
</Article>