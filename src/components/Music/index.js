import React from 'react';
import { Card, Icon } from 'antd';

import './index.css';
const styles = {
"slider": "slider",
"music-info": "music-info",
"mask": "mask",
"audio": "audio",
"input": "input",
"icon": "icon",
}

class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = { songname: '' };
  }
  handleChange = event => {
    this.setState({ songname: event.target.value });
  };
  handleClick = () => {
    this.setState({ songname: '' });
    this.props.dispatch({
      type: 'music/fetch',
      payload: this.state.songname,
    });
  };
  handleOnKeyDown = e => {
    if (e.keyCode === 13) {
      this.setState({ songname: '' });
      this.props.dispatch({
        type: 'music/fetch',
        payload: this.state.songname,
      });
    }
  };
  render() {
    const { img, songname, m4a, singername } = this.props;
    return (
      <Card
        style={{
          width: '90%',
          float: 'right',
          marginTop: 20,
          height: 66,
        }}
        bordered={false}
      >
        <img alt="歌曲图片" src={img} width="66" />
        <div className={styles.mask} />
        <span className={styles['music-info']}>
          {songname}
          {' '}
          -
          {' '}
          {singername}
        </span>
        <input
          type="text"
          className={styles.input}
          value={this.state.songname}
          onChange={this.handleChange}
          onKeyDown={this.handleOnKeyDown}
        />
        <Icon
          type="search"
          onClick={this.handleClick}
          className={styles.icon}
        />
        <audio
          src={m4a}
          controls
          loop
          preload="auto"
          className={styles.audio}
        />
      </Card>
    );
  }
}

export default Music;
