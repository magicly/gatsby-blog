import React from 'react';
import { Card, Icon, Button } from 'antd';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';

import styled from 'styled-components'

const Summary = styled.div`
    border-bottom: 1px solid #eee;
    padding: 10px 30px;
    line-height: 50px;
`
const Footer = styled.div`
    padding: 10px 30px;
`
const Btn = styled(Button) `
    border-radius: 14px;
    color: #817c7c;
    background: #ddd;
    &:hover {
      color: #fff;
      background: #2ca6cb;
    }
`
const CategoryLink = styled(Link) `
    padding: 3px;
    font-size: 16px;
    &:hover {
      color: #fff;
      background: #2ca6cb;
    }
`
const TagLink = styled(Link) `
    padding: 3px;
    font-size: 16px;
    background: rgb(230,230,230);
    :hover {
        color: #fff;
        background: #2ca6cb;
    }
`
const LinkHover = styled(Link) `
    &:hover {
      color: #ea6753;
    }
`

function ArticleCard({ articles }) {
  return (
    <div>
      {articles.map(article => {
        return (
          <Card
            key={article.id}
            title={
              <LinkHover to={`/article/${article.id}`}>
                {article.title}
              </LinkHover>
            }
            extra={
              <MediaQuery query="(min-device-width:700px)">
                <span>
                  <Icon type="clock-circle-o" />
                  {' '}
                  发表于 {article.time || '2017-01-01'} By
                  {' '}
                  <LinkHover to="/about">
                    {article.author || 'Magicly'}
                  </LinkHover>
                </span>
              </MediaQuery>
            }
            style={{
              color: '#817c7c',
              paddingTop: 5,
              fontSize: 5,
              marginTop: 20,
            }}
            bodyStyle={{ color: '#413f3f', fontSize: 20 }}
          >
            <Summary>
              <div>{article.summary}</div>
              <Link to={`/article/${article.id}`}>
                <Btn>
                  Read More
                </Btn>
              </Link>
            </Summary>
            <Footer>
              {article.category &&
                <span>
                  <Icon type="folder" style={{ color: '#ccc' }} />
                  {' '}
                  <CategoryLink
                    to={`/categories/${article.category}`}
                  >
                    {article.category}
                  </CategoryLink>&nbsp;&nbsp;
                </span>}
              {article.tags &&
                article.tags.length > 0 &&
                <span>
                  <Icon type="tags" style={{ color: '#ccc' }} />
                  {' '}
                  {article.tags.map((tag, i) => (
                    <TagLink key={i}>
                      {tag}{' '}
                    </TagLink>
                  ))}
                </span>}
            </Footer>
          </Card>
        );
      })}
    </div>
  );
}

export default ArticleCard;
