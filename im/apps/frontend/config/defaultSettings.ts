import { ProLayoutProps } from '@ant-design/pro-components';
import ErrorBoundary from '../src/pages/ErrorBoundary';
/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#2F51FF',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'IM',
  logo: '@/assets/logo.png',
  iconfontUrl: '',
  token: {
    colorPrimary: '#2F51FF',
    sider: {
      colorTextMenu: '#222222',
      colorMenuBackground: '#ffffff',
      colorTextMenuSelected: '#2F51FF',
      colorTextMenuItemHover: '#2F51FF',
      colorTextMenuActive: '#2F51FF',
      colorTextMenuSecondary: '#2F51FF',
      colorBgMenuItemSelected: '#F0F5FF',
      // colorBgMenuItemCollapsedElevated: '#F0F5FF',
      colorBgMenuItemActive: '#F0F5FF',
      // colorBgCollapsedButton: '#F0F5FF',
    },
    header: {
      // colorBgHeader: '#020566',
      // colorBgHeader: '#10159d',
      colorBgHeader: '#353ae5',
      // colorBgHeader: '#077aff',
      colorHeaderTitle: '#ffffff',
    },
    pageContainer: {
      paddingInlinePageContainerContent: 24,
    },
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
  ErrorBoundary,
};

export default Settings;
