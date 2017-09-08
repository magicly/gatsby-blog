import React from 'react';
import Link from "gatsby-link"

import styled from 'styled-components'

const Nav = styled.nav`
  text-align: center;
  margin-top: 30px;
`
const NavLink = styled(Link) `
  color: #4d4d4d;
  margin: 0 27px;
  opacity: 1;
`
const NavSpan = NavLink.withComponent('span')

const NavNumber = styled(Link) `
  width: 20px;
  height: 25px;
  background: #4d4d4d;
  display: inline-block;
  color: #fff;
  line-height: 25px;
  font-size: 12px;
  margin: 0 5px 30px;
  border-radius: 2px;
`
const Current = NavNumber.withComponent('span').extend`
  background: #88acdb;
  cursor: default;
`

export default ({ current = 1, total = 1 }) => {
  let prev;
  if (current === 1) {
    prev = <NavSpan>« Prev</NavSpan>
  } else if (current === 2) {
    prev = <NavLink to={`/`}>« Prev</NavLink>;
  } else {
    prev = <NavLink to={`/page/${current - 1}`}>« Prev</NavLink>;
  }
  const next = current === total ? <NavSpan>Next »</NavSpan> : <NavLink to={`/page/${current + 1}`}>Next »</NavLink>;
  const numbers = [];
  for (let i = 1; i <= total; i += 1) {
    if (i === current) {
      numbers.push(<Current key={i}>{i}</Current>);
    } else {
      numbers.push(<NavNumber key={i} to={i === 1 ? '/' : `/page/${i}`}>{i}</NavNumber>);
    }
  }
  return (
    <Nav>
      {prev}
      {numbers}
      {next}
    </Nav>
  );
}