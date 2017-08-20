import React from 'react';
import { Icon, Tabs, Form, Input, Button, Modal, Checkbox } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class MyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
    this.action = 'register';
    this.field = {
      login: ['username', 'password', 'rememberMe'],
      register: ['r_username', 'r_password', 'r_confirmPassword'],
    };
  }

  handleTabChange = key => {
    this.props.form.resetFields();
    this.action = key === 'login' ? 'login' : 'register';
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('r_password')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['r_confirmPassword'], {
        force: true,
      });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value,
    });
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'user/save',
      payload: { isModalVisible: false },
    });
    this.props.form.resetFields();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { field, action, props, handleCancel } = this;
    const formData = props.form.getFieldsValue(field[action]);
    props.form.validateFields(field[action], {}, err => {
      if (!err) {
        props.dispatch({
          type: `user/${action}`,
          payload: { formData, handleCancel },
        });
        if (action === 'register') {
          handleCancel();
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="用户中心"
        wrapClassName="vertical-center-modal"
        visible={this.props.isModalVisible}
        onCancel={this.handleCancel}
        footer={[
          <Button size="large" onClick={this.handleCancel} key="0">
            关闭
          </Button>,
        ]}
      >
        <Tabs type="card" onChange={this.handleTabChange}>
          <TabPane key="register" tab="注册">
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
              <FormItem label="用户名" hasFeedback>
                {getFieldDecorator('r_username', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: '请输入您的用户名！',
                    },
                    {
                      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                      message: '需字母开头，且仅支持字母、数字、下划线',
                    },
                    {
                      max: 16,
                      message: '不能超过16个字符',
                    },
                    {
                      validator: (rule, value, callback) => {
                        this.props.dispatch({
                          type: 'user/query',
                          payload: { value, callback },
                        });
                      },
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="密码" hasFeedback>
                {getFieldDecorator('r_password', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: '请输入您的密码！',
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]*$/,
                      message: '仅支持字母、数字、下划线',
                    },
                    {
                      max: 16,
                      message: '不能超过16个字符',
                    },
                    {
                      min: 5,
                      message: '不能少于5个字符',
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(<Input type="password" />)}
              </FormItem>
              <FormItem label="确认密码" hasFeedback>
                {getFieldDecorator('r_confirmPassword', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: '请确认您的密码！',
                    },
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
              </FormItem>
              <Button type="primary" htmlType="submit">注册</Button>
            </Form>
          </TabPane>
          <TabPane key="login" tab="登陆">
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
              <FormItem hasFeedback>
                {getFieldDecorator('username', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: '请输入您的用户名！',
                    },
                    {
                      pattern: /^[a-zA-Z][a-zA-Z0-9_]+$/,
                      message: '用户名格式错误',
                    },
                    {
                      max: 16,
                      message: '用户名格式错误',
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="user"
                        style={{
                          fontSize: 13,
                        }}
                      />
                    }
                    placeholder="用户名"
                  />,
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  validateTrigger: 'onSubmit',
                  rules: [
                    {
                      required: true,
                      message: '请输入您的密码！',
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]{5,16}$/,
                      message: '密码错误',
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="lock"
                        style={{
                          fontSize: 13,
                        }}
                      />
                    }
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('rememberMe', {
                  valuePropName: 'checked',
                })(<Checkbox>记住我</Checkbox>)}
              </FormItem>
              <Button type="primary" htmlType="submit">
                登陆
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

const WrappedMyModal = Form.create()(MyModal);

export default WrappedMyModal;
