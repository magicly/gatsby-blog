import React from 'react';
import Link from "gatsby-link"
import styled from 'styled-components'

const Header = styled.header`
  border-left: 5px solid #4d4d4d;
  padding: 30px 0 15px 25px;
  padding-left: 7.6923%;

  @media screen and (max-width: 800px) {
    border-left: none;
    padding: 0;
    border-bottom: 1px dotted #ddd;
  }
`
const Title = styled(Link) `
  color: #696969;
  margin-left: 0;
  font-weight: 300;
  line-height: 35px;
  margin-bottom: 20px;
  font-size: 26px;
  transition: color .3s;

  @media screen and (max-width: 800px) {
    font-size: 18px;
    font-weight: 300;
    display: block;
    margin: 0;
  }
`
const TitleWithoutLink = Title.withComponent('span');
const Date = styled.time`
  color: #999;
  margin-right: 7.6923%;
  float: right;
  @media screen and (max-width: 800px) {
    float: none;
  }
`
const DateIcon = styled.i`
  margin: 5px 5px 5px 0;
`

export default ({ article }) => <Header>
  {
    article.id ?
      <Title to={`${article.id}`}>
        {article.title}
      </Title>
      :
      <TitleWithoutLink to={`${article.id}`}>
        {article.title}
      </TitleWithoutLink>
  }
  <Date>
    <DateIcon className="iconfont icon-calendarok" />
    {article.time || '2017-01-01'}
  </Date>
</Header>