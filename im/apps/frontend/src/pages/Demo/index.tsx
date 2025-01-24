import React, { useState } from 'react';
import { Button, Col, Input, Row } from 'antd';
import { Sender } from '@ant-design/x'; // 引入 Sender 组件
import RichTextArea from './components/RichTextArea';

// 富文本编辑器
const RichTextSender = () => {


  return (

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <RichTextArea />
        </Col>
      </Row>
  );
};

export default RichTextSender;
