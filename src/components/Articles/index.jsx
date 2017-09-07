import React from 'react';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';

import styled from 'styled-components'

import Article from './Article';


export default ({ articles }) => {
  return (
    <div>
      {articles.map(article => {
        return (
          <Article key={article.id} article={article} />
        );
      })}
    </div>
  );
}