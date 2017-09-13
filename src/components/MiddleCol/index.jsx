import React from 'react';
import styled from 'styled-components';

import AllArticles from './AllArticles';

const MidleCol = styled.div`
    width: 360px;
    height: 100%;
    position: fixed;
    left: 300px;
    top: 0;
    z-index: 998;
    padding: 0;
    i.icon-close {
      position: absolute;
      top: 0;
      right: 5px;
    }
    @media (max-width: 800px) {
      left: 0;
	  }
`
const Section = styled.section`
    background-color: #b6cac4;
    height: 100%;
    color: #e5e5e5;
    width: 360px;
    overflow: hidden;
    overflow-y: auto;
`
const MeDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fffdd8;
  width: 100%;
  height: 100%;
  text-shadow: 1px 1px rgba(77,77,77,.45);
`
export default (props) => {
  return <MidleCol>
    <i className="iconfont icon-close" onClick={props.close}></i>
    {
      props.showContent === 'all' ?
        <AllArticles all={props.all} close={props.close} />
        :
        null
    }
    {
      props.showContent === 'me' ?
        <Section>
          <MeDiv>
            <div>
              Just For Fun!
            <br />
              <br />
              <a href="https://www.magicfun.ai" target="_blank">用科技优化生活！</a>
            </div>
          </MeDiv>
        </Section>
        :
        null
    }
  </MidleCol>
}