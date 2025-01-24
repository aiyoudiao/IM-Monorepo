import React, { useState, useRef } from 'react';
import { Button, Row, Col, Input, Space } from 'antd';

import { Sender } from '@ant-design/x'; // 引入 Sender 组件

interface RichTextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RichTextArea: React.FC<RichTextAreaProps> = (props) => {
  console.log(`RichTextArea props: ${JSON.stringify(props)}`, props);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // 获取光标位置
  const getCaretPosition = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range;
    }
    return null;
  };

  // 设置光标位置
  const setCaretPosition = (range: Range) => {
    debugger
    const selection = window.getSelection();
    if (selection) {
      setTimeout(()=> {
        selection.removeAllRanges();
        selection.addRange(range);
      }, 2000)
    }
  };

  // 处理输入变化
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    debugger
    const caretRange = getCaretPosition(); // 获取当前光标位置

    e.target.value = e.target.innerHTML;
    props.onChange(e)

    if (caretRange) {
      setCaretPosition(caretRange); // 设置光标位置
    }
  };

  // 处理加粗、斜体、下划线等格式化操作
  const applyStyle = (style: string) => {
    const selection = window.getSelection();
    if (selection?.rangeCount > 0) {
      document.execCommand(style, false, null); // 执行编辑命令
    }
  };

  return (

    <div style={{ width: '100%' }}>
      <Space>

        <Button onClick={() => applyStyle('bold')}>加粗</Button>
        <Button onClick={() => applyStyle('italic')}>斜体</Button>
        <Button onClick={() => applyStyle('underline')}>下划线</Button>
      </Space>

      <div
        {...props}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          // border: '1px solid #ddd',
          padding: '10px',
          minHeight: '150px',
          display: 'inline-block',
          width: '100%',
          marginTop: '10px',
          whiteSpace: 'pre-wrap',
          outline: 'none',
        }}
        onInput={(e) => {
          debugger
          handleInput(e)
        }}
        onChange={(e) => {
          debugger
          props.onChange(e)
        }}
        // onFocus={handleFocus}
        // onBlur={handleBlur}
        onKeyDown={props.onPressEnter}
        // onKeyUp={handleKeyUp}
        onPaste={props.onPaste}
        // onCut={handleCut}
        // onCopy={handleCopy}
        dangerouslySetInnerHTML={{ __html: props.value }} // 初始值渲染
      // dangerouslySetInnerHTML={{ __html: value }} // 初始值渲染
      />
    </div>
  );
};

/* 使用 Sender 组件来发送内容 */
const RichSender = (props: any) => <Sender components={{ input: RichTextArea }} {...props} />;

export default RichSender;
