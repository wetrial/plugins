import React from 'react';
import { Card, Form, Input, Button } from 'antd';

class Demo extends React.PureComponent<any> {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card title="Test&Sample&module">
        <Form>
          <Form.Item label="Demo">
            {getFieldDecorator('fff', {
              initialValue: null,
            })(<Input />)}
          </Form.Item>
          <Button htmlType="submit">提交</Button>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Demo);
