import React from 'react';
import Link from "gatsby-link"
import styled from 'styled-components'
import kebabCase from "lodash/kebabCase"

const CategoryLink = styled(Link) `
  background: #ba8f6c;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
  font-size: 10px;
  color: #fff;
  height: 18px;
  line-height: 18px;
  padding: 0 5px 0 10px;
  position: relative;
  border-radius: 0 5px 5px 0;
  margin: 5px 9px 5px 8px;
  font-family: Menlo,Monaco,Andale Mono,lucida console,Courier New,monospace;
  &:before {
    content: " ";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: -18px;
    border: 9px solid transparent;
    border-right-color: #ba8f6c;
  }
  &:after {
    content: " ";
    width: 4px;
    height: 4px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.3);
    position: absolute;
    top: 7px;
    left: 2px;
  }
`
const TagLink = CategoryLink.extend`
`
const Footer = styled.div`
  padding-top: 20px;
  margin: 30px 7.6923% 0;
  min-height: 72px;
  border-top: 1px solid #ddd;

  @media screen and (max-width: 800px) {
    min-height: 40px;
    padding-top: 10px;
    margin: 0;
    border-top: 1px solid #ddd;
  }
`
const More = styled.p`
  margin-top: 0;
  float: right;
`
const MoreLink = styled(Link) `
  background: #4d4d4d;
  color: #fff;
  font-size: 12px;
  padding: 5px 8px;
  line-height: 16px;
  border-radius: 2px;
  transition: background .3s;
`
const Icon = styled.i`
  color: #999;
  margin-right: 10px;
  margin-top: 6px;
`
const Category = styled.div`
  float: left;
`
const Tags = Category.extend``;

const ClearFloat = styled.div`
  clear: both;
`
const getCategory = article => {
  return article.category &&
    <Category><Icon className="iconfont icon-category" />
      <CategoryLink
        to={`/categories/${article.category}`}
      >
        {article.category}
      </CategoryLink>&nbsp;&nbsp;
      </Category>
};

const getTags = article => {
  return article.tags && article.tags.length > 0 &&
    <Tags><Icon className="iconfont icon-tag" />
      {article.tags.map((tag, i) => (
        <TagLink to={`/tags/${kebabCase(tag)}`} key={tag}>
          {tag}{' '}
        </TagLink>
      ))}
    </Tags>
}

const CategoryAndTags = ({ article, className }) => <Footer className={className}>
  {getTags(article)}
  {getCategory(article)}
  <ClearFloat />
</Footer>
export { CategoryAndTags };

export default ({ article }) => <Footer>
  {getTags(article)}
  {getCategory(article)}
  <More>
    <MoreLink to={`/${article.id}`}>展开全文>></MoreLink>
  </More>
  <ClearFloat />
</Footer>