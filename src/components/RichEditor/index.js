import React from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './index.css';

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: '' };
    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
    this.modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link'],
        ['clean'],
      ],
    };
    this.formats = [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
      'link',
    ];
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  };

  trim = str => {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  };

  handleClick = () => {
    if (this.trim(this.quillRef.getText()) === '') {
      message.error('评论内容不能为空');
      return;
    }
    const articleId = this.props.articleId;
    const date = new Date();
    const month = String(date.getMonth() + 1);
    const time = `${date.getFullYear()}-${month.padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const content = this.state.content;
    this.reactQuillRef.setEditorContents(this.quillRef, '');
    this.props.dispatch({
      type: 'comment/push',
      payload: { content, time, articleId },
    });
  };

  handleChange = content => {
    this.setState({ content });
  };

  render() {
    return (
      <div>
        <ReactQuill
          ref={el => {
            this.reactQuillRef = el;
          }}
          onChange={this.handleChange}
          className={styles.editor}
          placeholder="写下你的评论..."
          modules={this.modules}
          formats={this.formats}
        />
        <Button
          onClick={this.handleClick}
          type="primary"
          className={styles.btn}
        >
          发布
        </Button>
      </div>
    );
  }
}

export default connect()(RichEditor);
