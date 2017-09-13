import React from 'react';
import Link from "gatsby-link"

import styled from 'styled-components'

import Header from './Header';
import { CategoryAndTags } from './Footer';

const Article = styled.div`
  background: #fff;
  padding: 20px 10px 0px 10px;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #fff;
  position: relative;

  header {
    border-left: none;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    border: none;
    a {
      display: inline;
    }
    time {
      float: right;
    }
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