/// <reference types="." />
import { ElMessageBox } from "element-plus";
import {
  DEFAULT_USER,
  DEFAULT_LANG,
  LANG_LIST,
  COOKIE_KEYS,
  LOADING_WHITE_LIST,
  FMT,
  VARIABLE,
  TEXT_MAP,
} from "~/utils/settings";
import MESSAGE from "~/utils/message";

Date.prototype.format = function (fmt) {
  let regs: Array<[RegExp, number]> = [
    [/(MM)/g, this.getMonth() + 1],
    [/(DD)/g, this.getDate()],
    [/(HH)/g, this.getHours()],
    [/(mm)/g, this.getMinutes()],
    [/(ss)/g, this.getSeconds()],
  ];

  fmt = fmt.replace(/(Y+)/, (match) =>
    (this.getFullYear() + "").substring(4 - match.length)
  );

  for (let [reg, val] of regs) {
    let res: string = "00" + val;
    fmt = fmt.replace(reg, res.substring(res.length - 2));
  }
  return fmt;
};

Array.prototype.diff = function (list: Array<any>) {
  return this.filter((item) => list.indexOf(item) === -1);
};

String.prototype.format = function () {
  let list = arguments;
  let obj = arguments[0] instanceof Object ? arguments[0] : null;

  return this.replace(/{(\w+)}/g, function (match, index) {
    let val = obj ? obj[index] : list[index];
    if (val === null) val = "";
    return val === undefined ? match : val;
  });
};

const cookie = {
  set: function (
    key: string,
    value: string,
    options: cookieOptions = {}
  ): string {
    let { expires, path, domain, secure } = options || {};

    let dt: string = "";
    if (expires !== undefined) {
      dt = new Date(new Date().valueOf() + expires * 1000).toUTCString();
    }

    return (document.cookie = [
      encodeURIComponent(key),
      "=",
      encodeURIComponent(value),
      expires ? "; expires=" + dt : "",
      path ? "; path=" + path : "; path=/",
      domain ? "; domain=" + domain : "",
      secure ? "; secure" : "",
    ].join(""));
  },
  get: function (key: string): string {
    let cookies = document.cookie ? document.cookie.split("; ") : [];
    let result = "";

    for (let i = 0; i < cookies.length; i++) {
      let [k, v] = cookies[i].split("=");

      if (key === decodeURIComponent(k)) return decodeURIComponent(v);
    }

    return result;
  },
  del: function (key: string): string {
    return cookie.set(key, "", { expires: -1 });
  },
};

const trans = {
  langIndex: function () {
    let index = LANG_LIST.indexOf(cookie.get(COOKIE_KEYS.lang));
    return index === -1 ? DEFAULT_LANG : index;
  },
  getTxt: function (list: Array<string>, _default: string = "") {
    return list[trans.langIndex()] || list[DEFAULT_LANG] || list[0] || _default;
  },
  getMessage: function (key: string) {
    return trans.getTxt(MESSAGE[key] || [], key);
  },
  translate: function (txt: any) {
    /*
     * txt: (key) \f ((key \b key) \v (key) \v (txt))
     *      \f: split main key and args
     *      \b: split and getMessage then join it
     *      \v: split and getMessage then fill main string
     */
    if (txt instanceof Array) return trans.getTxt(txt, String(txt));
    if (typeof txt !== "string") return txt + "";

    let [key, args] = txt.split("\f");

    let arg_list: Array<string> = args ? args.split("\v") : [];

    for (let i = 0; i < arg_list.length; i++) {
      let txt_list = arg_list[i].split("\b");
      for (let j = 0; j < txt_list.length; j++) {
        txt_list[j] = trans.getMessage(txt_list[j]);
      }
      arg_list[i] = trans.getMessage(txt_list.join(", "));
    }

    return trans.getMessage(key).format(...arg_list);
  },
};

const _T = trans.translate;

const loading = {
  url: "",
  domId: "aioa-loading",
  open: function () {
    if (LOADING_WHITE_LIST.indexOf(loading.url) === -1) {
      const dom = document.getElementById(loading.domId);
      if (dom) dom.style.display = "flex";
    }
  },
  close: function () {
    const dom = document.getElementById(loading.domId);
    if (dom) dom.style.display = "none";
  },
};

function showAlert(msg: string | Array<string>) {
  ElMessageBox.alert(_T(msg), _T("_T0019"), {
    type: "warning",
    draggable: true,
    lockScroll: false,
    dangerouslyUseHTMLString: true,
    confirmButtonText: _T("_T0020"),
  });
  return false;
}

function debounce<T>(fn: T, delay: number): () => void {
  let timer: NodeJS.Timeout;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(
      () => typeof fn === "function" && fn.apply(null, arguments),
      delay
    );
  };
}

function keys2vals(data: Record<string, any>, keys: Array<string>) {
  return keys.map((key) => (data[key] === undefined ? "" : data[key]));
}

function dtDiff(dt: string) {
  let now = new Date();
  let next = new Date();

  let val = dt.trim();

  if (val.indexOf(" ") >= 0) {
    next = new Date(val);
  } else if (val.indexOf("-") >= 0) {
    now = new Date(new Date().format(FMT.date));
    next = new Date(val);
  } else {
    now = new Date(new Date().format("1900-01-01 " + FMT.time));
    next = new Date("1900-01-01 " + val);
  }

  let diff = now.getTime() - next.getTime();
  let days = Math.floor(diff / (24 * 3600 * 1000));
  let leave1 = diff % (24 * 3600 * 1000);
  let hours = Math.floor(leave1 / (3600 * 1000));
  let leave2 = leave1 % (3600 * 1000);
  let minutes = Math.floor(leave2 / (60 * 1000));
  let leave3 = leave2 % (60 * 1000);
  let seconds = Math.round(leave3 / 1000);

  return { day: days, hour: hours, minute: minutes, second: seconds };
}

function getDiffDate(diff: number, now: string = "", fmt: string = FMT.date) {
  let date = now ? new Date(now) : new Date();
  date.setDate(date.getDate() + diff);
  return date.format(fmt);
}

function getObjType(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function getValByPath(obj: any, path: string, _default: any = null) {
  if (["Object", "Array"].indexOf(getObjType(obj)) === -1) return obj;

  let val = obj;
  for (let idx of path.split(".")) {
    let value = val[idx];
    if (value === undefined) {
      return _default;
    } else {
      val = value;
    }
  }
  return val;
}

function saveValByPath(obj: any, path: string, val: any) {
  if (["Object", "Array"].indexOf(getObjType(obj)) === -1) return;

  let subObj = obj;
  let key = null;
  let keys = path.split(".");
  let len = keys.length;

  let lastKey = keys[len - 1];

  for (let i = 0; i < keys.length - 1; i++) {
    key = keys[i];
    if (subObj[key] === undefined) subObj[key] = {};
    subObj = subObj[key];
  }

  subObj[lastKey] = val;
}

function mergeObj(oldObj: Record<string, any>, newObj: Record<string, any>) {
  for (let [key, val] of Object.entries(newObj)) {
    let old_val = oldObj[key];
    if (getObjType(old_val) === "Object" && getObjType(val) === "Object") {
      mergeObj(old_val, val);
    } else {
      oldObj[key] = val;
    }
  }
}

function mergeObjs(...rest: Array<Record<string, any>>) {
  const values = arguments;
  let oldObj = values[0];
  for (let i = 1, len = values.length; i < len; i++) {
    mergeObj(oldObj, values[i]);
  }
}

function splitStr(string: string, splitStr: string) {
  return (string ? string.split(splitStr) : []).filter((item) => !!item.trim());
}

function strToListBySemi(string: string) {
  return splitStr(string, VARIABLE.link_url);
}

function strToListByComma(string: string) {
  return splitStr(string, VARIABLE.link_list);
}

function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function isEmpty(val: any) {
  return (
    (!val && val !== 0) ||
    (val instanceof Array && !val.length) ||
    (val instanceof Object && !Object.keys(val).length)
  );
}

function isZh() {
  return trans.langIndex() === 0;
}

function changeLang() {
  let index = LANG_LIST.indexOf(cookie.get("lang"));
  if (index === -1) index = DEFAULT_LANG;
  index = index === DEFAULT_LANG ? index + 1 : DEFAULT_LANG;
  cookie.set(COOKIE_KEYS.lang, LANG_LIST[index] || LANG_LIST[0]);
  window.location.reload();
}

function getUserName() {
  return cookie.get(COOKIE_KEYS.username) || DEFAULT_USER;
}

function getCompanyId() {
  return getUserName().slice(0, 2);
}

function getCompanyName() {
  return (TEXT_MAP.company ? TEXT_MAP.company[getCompanyId()] : "~") || "~";
}

function isLogin() {
  return getUserName() !== DEFAULT_USER;
}

function isAdmin() {
  return cookie.get(COOKIE_KEYS.admin) === "True";
}

function uuid() {
  return Math.floor(Math.random() * 10000) + new Date().getTime();
}

export {
  cookie,
  loading,
  _T,
  showAlert,
  debounce,
  keys2vals,
  dtDiff,
  getDiffDate,
  getObjType,
  getValByPath,
  saveValByPath,
  mergeObjs,
  strToListBySemi,
  strToListByComma,
  deepCopy,
  isEmpty,
  isZh,
  changeLang,
  getUserName,
  getCompanyId,
  getCompanyName,
  isLogin,
  isAdmin,
  uuid,
};
