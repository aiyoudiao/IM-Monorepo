import { Result } from 'antd';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // 更新状态允许渲染错误界面
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error);
    // console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      // 可以渲染任何自定义的错误信息UI
      return (
        <Result
          status="500"
          title="500"
          subTitle={'服务器错误'}
          extra={
            <>
              <p>获取资源时发生了一些错误，请刷新后重试。</p>
            </>
          }
        />
      );
    }
    return (this.props as any).children;
  }
}

export default ErrorBoundary;
