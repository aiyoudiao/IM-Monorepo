/*
 * @Description: 工单管理模块
 */

export default {
  path: '/chats',
  name: '客服机器人',
  icon: 'ant-design:reddit-outlined',
  exact: true,
  routes: [
    {
      path: '/chats',
      redirect: '/chats/online',
    },
    {
      path: '/chats/online',
      name: '在线聊天',
      component: './Chats/Online/Home',
      exact: true,
    },
  ],
};
