/* eslint-disable react/jsx-sort-props */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable comma-dangle */

import { Editor } from '@tinymce/tinymce-react';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';
// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';


import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

type oaTiny = {
  limit?: number;
  limitType?: 'str' | 'num';
  height?: number;
  value?: string;
  onChange?: (e: any) => any;
  // type?: 'nomal' | 'form';
  ref?: any;
  style?: object;
  disabled?: boolean;
  imgLimit?: number | false | null | undefined;
  init?: object;
};

const TinymceEditor: React.FC<oaTiny> = forwardRef((props, ref) => {
  const {
    height = 300,
    limit = null,
    limitType = 'str',
    // type = 'nomal',
    value = '',
    onChange,
    disabled = false,
    imgLimit = 10,
    init = {},
    ...otherProps
  } = props;

  // value number
  const [num, setNum] = useState(1);
  const [relValue, setRelValue] = useState(value);
  const editorRef: any = useRef(null);
  const fixStyle = props.style ? { ...{ height }, ...props.style } : { height };
  const [relDisabled, setRelDisabled] = useState(disabled);
  // 禁用状态改变
  const changeDisabled = (b: boolean) => {
    setRelDisabled(b);
  };

  // 字符数更新
  const wordcountUpdate = (plugins: any = {}, retryCount = 5) => {
    const { wordcount } = plugins;
    if (!wordcount && retryCount > 0) {
      setTimeout(() => {
        wordcountUpdate(editorRef.current.editor.plugins, retryCount - 1);
      }, 200);
      return;
    }

    if (wordcount) {
      if (wordcount.body && wordcount.body.getCharacterCount) {
        try {
          setNum(wordcount.body.getCharacterCount());
        } catch (err) {}
      }
    }
  };
  // getLimitNode
  function getLimitNode(type: 'num' | 'str'): JSX.Element {
    if (limit && typeof limit === 'number') {
      if (type === 'num') {
        return (
          <div className="flex flex_r" style={{ marginTop: 5 }}>
            <span className="flex1" />
            <span>字符数：</span>
            <span style={{ color: num > limit ? 'red' : 'inherit', paddingRight: 3 }}>{num}</span>
            <span>/ {limit}</span>
          </div>
        );
      } else if (type === 'str' && num > limit) {
        return (
          <div className="flex flex_r" style={{ marginTop: 5 }}>
            <span style={{ color: 'red' }}>输入字符超出最大限制！</span>
            <span className="flex1" />
          </div>
        );
      }
    }

    return <div className="flex flex_r" style={{ marginTop: 5 }}></div>;
  }
  // change事件
  const onEditorChange = useCallback((e: string) => {
    if (editorRef.current) {
      if (onChange) {
        onChange(e);
      }
      setRelValue(e);
    }
  }, []);
  // 初始化配置项
  const initDefault = {
    plugins: 'image link wordcount',
    menubar: '',
    language: 'zh_CN',
    language_url: '/tiny/langs/zh_CN.js',
    toolbar:
      'undo redo | fontsize |forecolor backcolor | bold italic underline | link image| alignleft aligncenter alignright alignjustify | ',
    tinycomments_mode: 'embedded',
    color_cols: 5,
    file_picker_types: 'image',
    images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,svg',
    // 头部升级标志
    promotion: false,
    // 状态栏
    statusbar: false,
    // 绝对url
    relative_urls: false,
    remove_script_host: true,
    document_base_url: '',
  };
  const initOptions = Object.assign(initDefault, fixStyle, init);
  // getRef
  const getEditor = () => {
    return editorRef.current?.editor;
  };
  useImperativeHandle(
    ref,
    () => ({
      TinymceEditor: editorRef.current,
      getEditor,
      isOverContentLength(limitNum: number) {
        return num > limitNum;
      },
      currentContent: relValue,
      setCurrentContent: setRelValue,
      changeDisabled,
    }),
    [editorRef, num, value],
  );
  // 初始化
  useEffect(() => {
    setRelValue(value);
    // 字数限制
    if (limit && editorRef.current.editor) {
      setTimeout(() => {
        wordcountUpdate(editorRef.current.editor.plugins);
      }, 100);
    }

    if (disabled !== relDisabled) {
      setRelDisabled(disabled);
    }
  }, [value, relValue, limit, disabled]);

  return (
    <div>
      <Editor
        licenseKey="gpl"
        disabled={relDisabled}
        inline={false}
        ref={editorRef}
        onEditorChange={onEditorChange}
        value={relValue}
        init={initOptions}
        {...otherProps}
      />
      {getLimitNode(limitType)}
    </div>
  );
});

export default memo(TinymceEditor);
