import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { STATUS } from '@/utils/enums';

/**
 * @description: 获取枚举的所有 key
 */
export type EnumKeys<T> = keyof T;

/**
 * @description: 获取枚举的所有可能值
 */
export type EnumValues<T> = T[EnumKeys<T>];

/**
 * @description: 状态
 */
export type Status = EnumValues<typeof STATUS>;

/**
 * @description: Response 返回体
 */
export type Response<T = any> = {
  code?: number;
  status_code?: number;
  data: T;
  msg?: string;
  message?: string;
};

/**
 * @description: 全局状态数据流
 */
export type InitialStateTypes = {
  accessToken?: string;
  settings?: Partial<LayoutSettings>;
  permissions?: string[];
  collapsed?: boolean;
  loading?: boolean;
  currentUser?: USERAPI.CurrentUser;
  config?: any;
};
