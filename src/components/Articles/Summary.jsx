import React from 'react';
import Link from "gatsby-link"
import styled from 'styled-components'

const Summary = styled.div`
  line-height: 1.8em;
  padding-right: 7.6923%;
  padding-left: 7.6923%;

  @media screen and (max-width: 800px) {
    padding: 10px 0 30px;
  }
}
`
const Content = styled.p`
  margin-top: 10px;
`

export default ({ article }) => <Summary>
  <Content dangerouslySetInnerHTML={{ __html: article.summary }} />
  <Link to={`${article.id}`}>more>></Link>
</Summary>