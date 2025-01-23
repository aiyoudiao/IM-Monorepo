import { InitDataType, RunTimeLayoutConfig } from "@umijs/max";
import { ConfigProvider } from "antd";


export const BasicLayout: RunTimeLayoutConfig = ({
  initialState,
}: InitDataType) => {


  return {
    waterMarkProps: {
      content: initialState?.currentUser?.name,
      fontColor: 'rgba(227,227,227,0.2)',
    },
    rightContentRender: () => <></>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <ConfigProvider
        theme={{
          components: {
            Input: {
              colorTextDisabled: '#222222',
            },
            Select: {
              colorTextDisabled: '#222222',
            },
          },
        }}
      >
        <main className="h-full">{children}</main>
      </ConfigProvider>

    },
    hideChildrenInMenu: true,
    hideInMenu: true,
    hideInBreadcrumb: true,
    headerRender: false,
    footerRender: false,
    menuRender: false,
    menuHeaderRender: false,
  };
};
