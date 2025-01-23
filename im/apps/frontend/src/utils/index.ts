/*
 * @Description: 全局公共方法
 */

import type { ColumnsState, RequestData } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import CryptoJS from 'crypto-js'; // AES/DES加密
import {
  compact,
  eq,
  get,
  join,
  keys,
  random,
  sample,
  startsWith,
  toLower,
  cloneDeep,
  isNil,
  assign,
} from 'lodash-es';
import { stringify } from 'querystring';

import Html2ReactParser, { DOMNode } from 'html-react-parser';
import DOMPurify from 'dompurify';

// import { getPermissions, getRoutesMenus, getUserInfo } from '@/services/logic/login'; // 登录相关接口
import { LOCAL_STORAGE, REQUEST_CODE, ROUTES } from '@/utils/enums';
import type { InitialStateTypes, LockSleepTypes, PageResponse, Response } from '@/utils/types';
import { fetchConfig, queryCurrentUser } from '@/services/logic/login';
import { message } from 'antd';

/** description: 浏览器重定向，强制刷新 */
export const forceRedirect = (url: string) => {
  const retryCount = getLocalStorageItem<number>(LOCAL_STORAGE.Retry_COUNT) || 0;
  if (retryCount < 1) {
    window.location.replace(url);
    return;
  }

  if (retryCount === 1) {
    setTimeout(() => {
      setLocalStorageItem(LOCAL_STORAGE.Retry_COUNT, 0);
    }, 1000 * 10); // 10 秒后重置重试次数
  }
};

/**
 * @description: 判断请求是否成功
 */
export const isSuccess = (code?: number): boolean => eq(code, REQUEST_CODE.SUCCESS);

/**
 * @description: 格式化请求数据
 */
export const formatResponse = <T extends any[]>(
  response: Response<T> | Response<PageResponse<T[number]>>,
): RequestData<T[number]> => {
  // 解构响应值
  const { code, data } = response;
  return {
    data: get(data, 'list') || get(response, 'data') || [],
    // success 请返回 true，不然 table 会停止解析数据，即使有数据
    success: isSuccess(code),
    total: get(data, 'total', 0),
  };
};

/**
 * @description: 将 pathname 转成国际化对应的 key，如：/administrative/jobs-management => administrative.jobs-management
 */
export const formatPathName = (pathname: string): string => {
  return join(compact(pathname.split('/')), '.');
};

/**
 * @description: 获取 localstorage 的值
 */
export const getLocalStorageItem = <T>(key: string): T | null => {
  // 获取 值
  const item = localStorage.getItem(key);
  // 判断是否为空
  if (item === null) {
    return null;
  }

  // 不为空返回解析后的值
  const result: T = JSON.parse(item);
  return result;
};

/**
 * @description: 存储 localstorage 的值
 */
export const setLocalStorageItem = <T>(key: string, value: T) => {
  const result = JSON.stringify(value);
  localStorage.setItem(key, result);
};

/**
 * @description: 移除 localstorage 的值
 */
export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * @description: AES/DES密钥
 */
const CRYPTO_KEY = CryptoJS.enc.Utf8.parse('ABCDEF0123456789'); // 十六位十六进制数作为密钥
const CRYPTO_IV = CryptoJS.enc.Utf8.parse('ABCDEF0123456789'); // 十六位十六进制数作为密钥偏移量

/**
 * @description: AES/DES加密
 * @param {string} password
 */
export const encryptionAesPsd = (password: string): string => {
  const encrypted = CryptoJS.AES.encrypt(password, CRYPTO_KEY, {
    iv: CRYPTO_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // 返回的是base64格式的密文
};

/**
 * @description: AES/DES解密
 * @param {string} password
 */
export const decryptionAesPsd = (password: string): string => {
  const decrypted = CryptoJS.AES.decrypt(password, CRYPTO_KEY, {
    iv: CRYPTO_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8); // 返回的是解密后的字符串
};

/**
 * @description: 退出登录返回到登录页
 */
export const logoutToLogin = () => {
  const { search, pathname } = window.location;
  // 获取 LOCK_SLEEP 信息
  const LOCK_SLEEP = getLocalStorageItem<LockSleepTypes>(LOCAL_STORAGE.LOCK_SLEEP);
  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect');
  // 移除 token
  removeLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN);
  // 取消睡眠弹窗
  if (LOCK_SLEEP) {
    setLocalStorageItem(LOCAL_STORAGE.LOCK_SLEEP, { ...LOCK_SLEEP, isSleep: false });
  }
  // 重定向地址
  if (window.location.pathname !== ROUTES.LOGIN && !redirect) {
    history.replace({
      pathname: ROUTES.LOGIN,
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

/**
 * @description: 初始化相关状态：用户信息、配置信息、权限信息等
 */
export const initInitialState = async (
  initialState: InitialStateTypes,
): Promise<InitialStateTypes> => {
  const retryCount = getLocalStorageItem<number>(LOCAL_STORAGE.Retry_COUNT) || 0;
  setLocalStorageItem(LOCAL_STORAGE.Retry_COUNT, retryCount + 1);
  try {
    // 获取用户信息、配置信息、权限信息等
    const [currentUser] = await Promise.all([
      initialState.fetchUserInfo(),
      // initialState.fetchConfigInfo(),
    ]);

    // 初始化全局状态
    const data = {
      currentUser,
      // config,
    };
    setLocalStorageItem(LOCAL_STORAGE.Retry_COUNT, 0);
    return assign(initialState, data);
  } catch (error) {
    forceRedirect(ROUTES.LOGIN);
    return initialState;
  }
};

/**
 * @description: 获取当前时间
 */
export const timeFix = (): string => {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9
    ? '早上好'
    : hour <= 11
    ? '上午好'
    : hour <= 13
    ? '中午好'
    : hour < 20
    ? '下午好'
    : '夜深了';
};

/**
 * @description: 随机欢迎语
 */
export const welcomeWords = (): string => {
  const words = [
    '休息一会儿吧',
    '准备吃什么呢?',
    '我猜你可能累了',
    '认真工作吧',
    '今天又是充满活力的一天',
  ];
  return sample(words);
};

/**
 * @description: 判断是否是HTTP或HTTPS链接
 * @param {string} link
 */
export const isHttpLink = (link: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?' + // port
      '(\\/[-a-z\\d%_.~+]*)*' + // path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(link);
};

/**
 * @description: 默认不显示的 column 项
 */
export const renderColumnsStateMap = (MENU_CFG: string[] = []) => {
  const result: Record<string, ColumnsState> = {};
  MENU_CFG.forEach((ele) => {
    result[ele] = {
      show: false,
    };
  });
  return result;
};

/**
 * @description: Tag 标签随机颜色
 */
export const randomTagColor = () => {
  const colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];
  return sample(colors);
};

/** @description: 生成随机颜色 */
export const randomColor = (min = 0, max = 255) => {
  // 生成三个介于 0 到 255 之间的随机数作为 RGB 的值
  const r = random(min, max);
  const g = random(min, max);
  const b = random(min, max);
  return `rgb(${r},${g},${b})`;
};

/** @description: 验证码字符 */
export const codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * @description: 生成随机的汉字数组
 * @param {number} count
 */
export const generateRandomHanziArray = (count = 1) => {
  const minCode = 0x4e00; // 汉字 Unicode 范围的最小值
  const maxCode = 0x9fff; // 汉字 Unicode 范围的最大值

  const hanziArray = [];
  for (let i = 0; i < count; i++) {
    const randomCode = random(minCode, maxCode);
    hanziArray.push(String.fromCodePoint(randomCode));
  }

  return hanziArray;
};

/** @description: 浏览器图标映射 */
export const BroswerIconMap = (text: string): string | undefined => {
  const iconMap: Record<string, string> = {
    Chrome: 'logos:chrome',
    Firefox: 'logos:firefox',
    Safari: 'logos:safari',
    Opera: 'logos:opera',
    Edge: 'logos:microsoft-edge',
    WebKit: 'logos:webkit',
    Android: 'logos:android-icon',
  };
  for (let i = 0; i < keys(iconMap).length; i += 1) {
    const item = keys(iconMap)[i];
    if (startsWith(toLower(text), toLower(item))) {
      return iconMap[item];
    }
  }
  return undefined;
};

/** @description: 操作系统图标映射 */
export const OsIconMap = (text: string): string | undefined => {
  const iconMap: Record<string, string> = {
    Windows: 'logos:microsoft-windows-icon',
    'Mac OS': 'logos:apple',
    Linux: 'logos:linux-tux',
    Android: 'logos:android-icon',
    iOS: 'logos:apple',
    Chrome: 'logos:chrome',
  };
  for (let i = 0; i < keys(iconMap).length; i += 1) {
    const item = keys(iconMap)[i];
    if (startsWith(toLower(text), toLower(item))) {
      return iconMap[item];
    }
  }
  return undefined;
};

// 格式化page和pageSize
export const formatTablePostParams = (params: Record<string, any>) => {
  const filter = {} as any;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      switch (key) {
        case 'current':
          filter.page = params[key];
          break;
        case 'pageSize':
          filter.per_page = params[key];
          break;
        default:
          filter[key] = params[key];
          break;
      }
    }
  }
  return filter;
};

// 格式化为展示需要的数据格式
export const formatTableResponse = (response: Record<string, any>) => {
  const { data = [], meta = {} } = response;
  const responseFormat = {
    current: meta.current_page,
    data: data,
    pageSize: meta.per_page,
    total: meta.total,
    success: true,
  };
  return responseFormat;
};

// 清除空字符串、null和undefined
export const clearFalseValue = (compactParam: any) => {
  const _compactParam = cloneDeep(compactParam);
  for (const key in _compactParam) {
    if (
      isNil(_compactParam[key]) ||
      _compactParam[key] === '' ||
      (Array.isArray(_compactParam[key]) && _compactParam[key].length === 0)
    ) {
      delete _compactParam[key];
    }
  }
  return _compactParam;
};

/** @description: 获取路由菜单图标 */
export const getRuleMenuIcon = (ruleMenus: API.MENU_MANAGEMENT[], path: string) => {
  /**
   * 递归查找 path 对应的 icon
   */
  const findIcon = (menus: API.MENU_MANAGEMENT[], routePath: string): string => {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.path === routePath) {
        return menu.icon as string;
      }
      if (menu?.routes?.length) {
        const icon = findIcon(menu.routes, routePath);
        if (icon) {
          return icon;
        }
      }
    }
    return '';
  };

  return findIcon(ruleMenus, path);
};

/* HTML 转 React 组件 */
export const html2React = (str: string) => {
  return Html2ReactParser(DOMPurify.sanitize(str));
};
