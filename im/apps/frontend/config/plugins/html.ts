import { readFileSync } from 'fs';
import { resolve } from 'path';
import { IApi } from '@umijs/max';

export default (api: IApi) => {
  api.modifyHTML(($) => {
    const loading = readFileSync(resolve(__dirname, './html/loading.html'), 'utf-8');
    $('body').prepend(loading);
    return $;
  });
  api.addHTMLStyles(() => {
    return `
      .dark { background: #000000 }
      .light { background: #f5f5f5 }
    `;
  });
  api.addHTMLScripts(() => {
    return `
      const environmentVariables = window.document.head.dataset.environmentVariables;
      window.ENVIRONMENT_TYPE = environmentVariables;
      window.DOWNLOAD_SUFFIX_NAME = environmentVariables === 'production' ? '' : '-' + environmentVariables;
      window.TRACKED_ID = environmentVariables === 'production' ? 'lfna-22256647' : 'lfna-92278777';
    !function(l, f, n, a) {
        if (l.lfq) return;
        a = l.lfq = function() {
            a.callMethod ?
                a.callMethod.apply(a, arguments) : a.queue.push(arguments)
        };
        a.queue = [];
        a.version = '1.0';
        var s = f.createElement('script');
        s.async = !0;
        s.src = n;
        var h = f.getElementsByTagName('script')[0];
        h.parentNode.insertBefore(s, h)
    }(window, document, "https://gss-apps.oss-cn-shenzhen.aliyuncs.com/trace/event.js");


    function lfqInit () {
      window.lfq('init', window.TRACKED_ID , {
        send_page_view: false, // page view 事件，页面加载时自动触发
        send_scroll: true, // scroll 事件，页面滚动到底部时触发
        send_search_result: true, // search_result 事件，当用户看到搜索结果页时触发
        // send_outbound: true, // outbound 事件，当用户点击外链时触发
        send_performance: true, // 自动触发 performance 事件
        user_id: localStorage.getItem('OA_USER_NAME') || 'anonymous', // 用户 ID
      });
    }

    lfqInit();

    if (!localStorage.getItem('OA_USER_NAME')) {
      window.setTimeout(() => {
        lfqInit();
        window.lfq('track', 'pageView');
      }, 8000)
    }


    // 从 localStorage 中获取主题配置
    let value = localStorage.getItem('LAYOUT')
      if (value) {
        try {
          value = JSON.parse(value)
          document.querySelector('body').classList.add(value.navTheme === 'realDark' ? 'dark' : 'light')
        } catch (error) {}
      }
    `;
  });
};
