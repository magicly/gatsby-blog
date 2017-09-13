import React from 'react';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';

import styled from 'styled-components'

import Article from './Article';
import Archive from './Archive';
import Nav from './Nav';


export default ({ articles, current, total }) => {
  return (
    <div>
      {articles.map(article => {
        return (
          <Article key={article.id} article={article} />
        );
      })}
      <Nav current={current} total={total} />
    </div>
  );
}

const Archives = ({ articles, current, total }) => {
  return (
    <div>
      {articles.map(article => {
        return (
          <Archive key={article.id} article={article} />
        );
      })}
    </div>
  );
}
export { Archives };