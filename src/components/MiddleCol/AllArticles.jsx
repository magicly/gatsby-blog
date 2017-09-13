import React from 'react';
import Link from "gatsby-link"
import styled from 'styled-components';

const Section = styled.section`
  background-color: #b6cac4;
  height: 100%;
  color: #e5e5e5;
  width: 360px;
  overflow: hidden;
  overflow-y: auto;
`
const Search = styled.div`
  width: 310px;
  margin: 20px 20px 10px 20px;
  position: relative;
  .search-ipt {
    width: 310px;
    color: #fff;
    background: none;
    border: none;
    border-bottom: 2px solid #fff;
    font-family: Roboto, "Roboto", serif;
  }
  .icon {
    position: absolute;
    right: 0;
    top: 4px;
    color: #fff;
    cursor: pointer;
    &:hover {
        transform: scale(1.2);
    }
  }
  ::-webkit-input-placeholder {
      color: #ededed;
  }
`
const Tags = styled.div`
`
const SearchList = styled.ul`
  margin-top: 10px;
  color: rgba(77, 77, 77, 0.75);
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  overflow-y: auto;
  li {
    padding: 10px 20px;
    border-bottom: 1px dotted #dcdcdc;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
  }
  .search-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
      color: rgba(255,255,248,1);
      text-shadow: 1px 1px rgba(77,77,77,0.25);
      .icon {
          margin-right: 10px;
          color: #fffdd8;
      }
      &:hover {
          color: #fff;
      }
  }
  .search-time, .search-tag {
      font-size: 12px;
      color: #fffdd8;
      margin-right: 10px;
      .icon {
          margin-right: 0px;
      }
      span {
          cursor: pointer;
          &:hover {
              color: #fff;
          }
      }
  }
  .search-time {
      float: left;
  }
  .search-tag {
      span {
          margin-right: 5px;
      }
  }
`
export default class AllArticles extends React.Component {
  constructor(props) {
    super(props);
    this.all = props.all;
    this.state = {
      filterWord: '',
    }
  }
  onChangeInput(e) {
    this.setState({
      filterWord: e.target.value,
    })
  }
  render() {
    const selectedArticles = this.all.filter(article => {
      if (this.state.filterWord.startsWith('#')) {
        const filterTag = this.state.filterWord.slice(1);
        for (let tag of article.tags) {
          if (tag.match(new RegExp(filterTag, 'i')) != null) {
            return true;
          }
        }
        return false;
      } else if (this.state.filterWord) {
        const filterTitle = this.state.filterWord;
        return article.title.match(new RegExp(filterTitle, 'i')) != null;
      }
      return true; // empty
    });
    return <Section>
      <Search>
        <input className="search-ipt" type="text" placeholder="find something…" onChange={this.onChangeInput.bind(this)}
          value={this.state.filterWord} />
        {
          !this.state.filterWord ? <i className="iconfont icon-search icon"></i> : null
        }
        {
          this.state.filterWord ? <i className="iconfont icon-cross icon" onClick={() => this.setState({ filterWord: '' })}></i> : null
        }
      </Search>
      {/* <Tags>tags...</Tags> */}
      <SearchList>
        {
          selectedArticles.map(article => {
            return <li key={article.id}>
              <Link className="search-title" to={`${article.id}`} onClick={this.props.close}>
                <i className="icon iconfont icon-quoteleft"></i>
                <span>{article.title}</span>
              </Link>
              <p className="search-time">
                <i className="iconfont icon-calendarok icon"></i>
                <span>{article.time}</span>
              </p>
              <p className="search-tag">
                <i className="iconfont icon-tag icon"></i>
                {
                  article.tags.map(tag => {
                    return <span key={tag} onClick={() => this.setState({ filterWord: `#${tag}` })}>#{tag}</span>
                  })
                }
              </p>
            </li>
          })
        }
      </SearchList>
    </Section>
  }
}
