/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  /**
   * @description: 后端代理配置
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */

  // 本地联调
  local: {
    '/api': {
      target: 'http://local.test.com/api', // 测试
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  // dev 环境联调
  dev: {
    '/api': {
      // target: 'https://develop.test.cn/api', // 测试
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  // test 环境联调
  test: {
    '/api': {
      target: 'https://develop.test.cn/api', // 测试
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  // staging 环境联调
  staging: {
    '/api': {
      target: 'https://staging.test.cn/api', // 测试
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  // prod 环境联调
  prod: {
    '/api': {
      target: 'https://www.test.cn/api', // 测试
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
