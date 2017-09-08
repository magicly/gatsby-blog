import React from 'react';
import Link from "gatsby-link"
import styled from 'styled-components'

const Header = styled.header`
  border-left: 5px solid #4d4d4d;
  padding: 30px 0 15px 25px;
  padding-left: 7.6923%;
`
const Title = styled(Link) `
  color: #696969;
  margin-left: 0;
  font-weight: 300;
  line-height: 35px;
  margin-bottom: 20px;
  font-size: 26px;
  transition: color .3s;
`
const Date = styled.time`
  color: #999;
  margin-right: 7.6923%;
  float: right;
`
const DateIcon = styled.i`
  margin: 5px 5px 5px 0;
  :before {
    content: "\\e65e";
  }
`

export default ({ article }) => <Header>
  <Title to={`/articles/${article.id}`}>
    {article.title}
  </Title>
  <Date>
    <DateIcon className="iconfont" />
    {article.time || '2017-01-01'}
  </Date>
</Header>