import React from 'react';
import { Card, Row, Col } from 'antd';
import MediaQuery from 'react-responsive';
// import marked from 'marked';
import SideBar from '../components/Sidebar';

class Archives extends React.Component {
  componentDidMount() {
    document.title = '关于 | 和光同尘';
    this.props.dispatch({
      type: 'article/init',
    });
  }
  render() {
    const markdownString =
      '# 个人信息<br><br> - 尹锋/男/1996 <br> - 本科/中南大学 <br> - 手机: 13789309117<br> - Email: 619772719@qq.com<br> - Github: [https://github.com/accelerator-feng](https://github.com/accelerator-feng)<br><br>---<br><br>## 实习<br>  暑期在**蚂蚁金服保险事业群**实习前端开发，学习蚂蚁技术栈dva，Egg，以及Hybrid App开发，<br>  熟悉开发流程和规范，依据新的埋点库的文档，协助进行项目内部分页面的数据埋点改造。<br><br>## 技能清单<br><br>- 掌握 **HTML5 / CSS3** 新特性, 做到响应式布局<br>- 熟悉 **ECMAScript (JavaScript)**, 熟练使用 **ES6**, 理解原型链、继承、闭包等概念<br>- 熟练使用 **React**, **Redux (dva)**, **Ant Design**<br>- 熟悉 **Node.js**, 熟悉 **Koa2 (Egg.js)**<br>- 熟练使用构建工具 **Webpack**, CSS预处理工具 **Sass**, 版本控制 **Git**, 懂得规范的团队开发流程<br>- 熟练使用 **jQuery** (DOM,事件,Ajax)<br>- 掌握 **前端性能优化** 方面的知识<br><br>## 个人项目<br><br>*所有项目独立完成*<br><br> - [单页博客](http://yinfengblog.com) 源码: [[前端](https://github.com/accelerator-feng/AccBlog)][[服务端](https://github.com/accelerator-feng/AccBlogServer)] : 基于React + Redux + antd + Koa + MongoDB的响应式单页博客，完整的实现了前端，后端和部署，具有注册/登录，文章浏览、评论、分类、归档等功能<br><br> - [待办事项Web应用](http://yinfengblog.xyz/TodoList/) [[源码](https://github.com/accelerator-feng/TodoList)] : 使用jQuery，通过localStorage实现本地读取与存储，具有增查删改、定时、响铃提醒等功能。兼容主流浏览器及移动设备<br> <br> - 模态框组件 [[源码](https://github.com/accelerator-feng/Acc-msg-component)] : 基于原生JS的模态框组件。设计了Widget抽象类，统一了组件的生命周期。可自定义位置皮肤等各种参数，支持拖动功能。支持AMD，ES6模块引入以及全局引入<br><br> - [freeCodeCamp](https://freecodecamp.cn/accelerator-feng) : 完成了freeCodeCamp(Github | star 第一开源社区)前端所有的编程练习与项目<br><br><br>## 技术文章<br><br>有自己的技术博客，长期更新学习笔记，不断总结学习心得<br><br>- [学习跨域请求解决方案(CORS、JSONP)](http://39.108.173.226/#/article/594cd3693d3ce0e28bbfe8c8)<br>- [理解词法作用域与闭包](http://39.108.173.226/#/article/594ccd2f3d3ce0e28bbfe8c6) <br><br>---<br><br>## 自我评价<br><br>1. 爱逛技术论坛，关注优秀的前端博客。喜欢在前端社区与他人交流分享，相互学习<br><br>2. 善于使用 Google 搜索资料，解决技术难题。懂得合理地提出问题以及向他人描述技术问题<br><br>3. 具备阅读英文技术文档的能力<br>';
    const Resume = (
      <Card style={{ marginTop: 20 }}>
        <div
          dangerouslySetInnerHTML={{
            __html: markdownString.replace(/<br>/g, '\n'),
          }}
          style={{ padding: 40, fontSize: 15 }}
        />
      </Card>
    );
    return (
      <Row>
        <Col span={1} />
        <MediaQuery query="(min-device-width:800px)">
          <Col span={17}>
            {Resume}
          </Col>
          <Col span={5}><SideBar /></Col>
        </MediaQuery>
        <MediaQuery query="(max-device-width:800px)">
          <Col span={22}>
            {Resume}
          </Col>
        </MediaQuery>
        <Col span={1} />
      </Row>
    );
  }
}

export default Archives;
