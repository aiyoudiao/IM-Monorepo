// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import path, { resolve } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import icons from './icons';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  plugins: [
    resolve(__dirname, './plugins/html'),
    'umi-plugin-click-to-code', // 使用插件
  ],
  clickToCode: {},
  npmClient: 'pnpm',
  /**
   * @name 开启 hash 模式
   * @description 让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  /**
   * @name 兼容性设置
   * @description 设置 ie11 不一定完美兼容，需要检查自己使用的所有依赖
   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @name 路由的配置，不在路由中引入的文件不会编译
   * @description 只支持 path，component，routes，redirect，wrappers，title 的配置
   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @name 主题的配置
   * @description 虽然叫主题，但是其实只是 less 的变量设置
   * @doc antd的主题设置 https://ant.design/docs/react/customize-theme-cn
   * @doc umi 的theme 配置 https://umijs.org/docs/api/config#theme
   */
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    'root-entry-name': 'variable',
  },
  /**
   * @name moment 的国际化配置
   * @description 如果对国际化没有要求，打开之后能减少js的包大小
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @name 代理配置
   * @description 可以让你的本地服务器代理到你的服务器上，这样你就可以访问服务器的数据了
   * @see 要注意以下 代理只能在本地开发时使用，build 之后就无法使用了。
   * @doc 代理介绍 https://umijs.org/docs/guides/proxy
   * @doc 代理配置 https://umijs.org/docs/api/config#proxy
   */
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  /**
   * @name 快速热更新配置
   * @description 一个不错的热更新组件，更新时可以保留 state
   */
  fastRefresh: true,
  // 全局通用的环境变量
  define: {
    isAppDevelopment: REACT_APP_ENV === 'dev',
  },
  //============== 以下都是max的插件配置 ===============
  /**
   * @name 数据流插件
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * 一个全局的初始数据流，可以用它在插件之间共享数据
   * @description 可以用来存放一些全局的数据，比如用户信息，或者一些全局的状态，全局初始状态在整个 Umi 项目的最开始创建。
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name layout 插件
   * @doc https://umijs.org/docs/max/layout-menu
   */
  title: 'IM',
  metas: [
    {
      name: 'keywords',
      content: 'IM',
    },
    { name: 'description', content: 'IM' },
  ],
  layout: {
    locale: false,
    ...defaultSettings,
  },
  /**
   * @name moment2dayjs 插件
   * @description 将项目中的 moment 替换为 dayjs
   * @doc https://umijs.org/docs/max/moment2dayjs
   */
  moment2dayjs: {},
  /**
   * @name 国际化插件
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: false,
  /**
   * @name antd 插件
   * @description 内置了 babel import 插件
   * @doc https://umijs.org/docs/max/antd
   */
  antd: {},
  /**
   * @name 网络请求配置
   * @description 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
   * @doc https://umijs.org/docs/max/request
   */
  request: {
    dataField: 'data',
  },
  /**
   * @name 权限插件
   * @description 基于 initialState 的权限插件，必须先打开 initialState
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name <head> 中额外的 script
   * @description 配置 <head> 中额外的 script
   */
  devtool: process.env.UMI_ENV === 'prod' ? 'hidden-source-map' : 'source-map',
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  headScripts: [],

  //================ pro 插件配置 =================
  presets: ['umi-presets-pro'],
  /**
   * @name openAPI 插件的配置
   * @description 基于 openapi 的规范生成serve 和mock，能减少很多样板代码
   * @doc https://pro.ant.design/zh-cn/docs/openapi/
   */
  openAPI: false,

  // 启后，可通过 Option+Click/Alt+Click 点击组件跳转至编辑器源码位置，Option+Right-click/Alt+Right-click 可以打开上下文，查看父组件。
  // clickToComponent: {
  //   editor: 'vscode',
  // },
  // 检测未使用的文件和导出，仅在 build 阶段开启。
  deadCode: {},
  // 配置 mock 功能。
  mock: false,
  // 设置别名
  alias: {
    '@public': path.resolve(__dirname, '../public'),
    '@components': path.resolve(__dirname, '../src/components'),
    '@hooks': path.resolve(__dirname, '../src/hooks'),
    '@services': path.resolve(__dirname, '../src/services'),
    '@utils': path.resolve(__dirname, '../src/utils'),
  },
  /**
   * @name icons 插件
   * @doc https://umijs.org/docs/api/config#icons
   * 自动安装图标库 https://icones.js.org/
   */
  icons: {
    autoInstall: {},
    include: icons,
  },
  // 使用 mako 用于编译以显著提高构建速度。 https://makojs.dev/docs/config
  mako: {},
  mfsu: {
    strategy: 'normal',
    exclude: ['xlsx'],
  },

  // 修复 esbuild 压缩器自动引入的全局变量导致的命名冲突问题。
  esbuildMinifyIIFE: true,
  requestRecord: {},
  // 默认情况下，站点将使用约定 favicon 来创建图标的 meta 头标签。
  favicons: ['/favicon.ico'],
  tailwindcss: {
    timeout: 100000, // 设置更长的超时时间，单位为毫秒
  },
  copy: ['public', 'src/assets'],
});
