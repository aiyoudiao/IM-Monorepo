import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { InitialStateTypes } from '@/utils/types'
import type { RunTimeLayoutConfig } from '@umijs/max';


import defaultSettings from '../config/defaultSettings';
import { getLocalStorageItem, setLocalStorageItem,  } from './utils';
import { LOCAL_STORAGE } from './utils/enums';
import { BasicLayout } from '@/components/BasicLayout';
import './app.less';


/**
 * @description 全局初始状态设置
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * @return initialState InitialStateTypes
 */
export async function getInitialState(): Promise<InitialStateTypes> {

  // 获取 LAYOUT 的值
  const LAYOUT_SETTINGS = getLocalStorageItem<LayoutSettings>(LOCAL_STORAGE.LAYOUT) || defaultSettings;


  // 存储到 localstorage
  setLocalStorageItem(LOCAL_STORAGE.LAYOUT, LAYOUT_SETTINGS)

  // 初始化数据
  const initialState: InitialStateTypes = {
    settings: LAYOUT_SETTINGS as LayoutSettings,
    collapsed: false,
  }

  return initialState
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
/**
 *
 *
 * @param {*} {
 *   initialState,
 * }
 * @return {*}
 */
export const layout: RunTimeLayoutConfig = BasicLayout;
