export const DEFAULT_USER = "Anonymous";
export const DEFAULT_TITLE = ["企业管理系统", "Enterprise Management System"];
export const DEFAULT_LANG = 0;
export const LANG_LIST = ["zh", "en"];

export const LOGIN_WHITE_LIST = ["/base/login"];
export const LOADING_WHITE_LIST = ["/base/remote"];

export const COOKIE_KEYS = {
  lang: "lang",
  rid: "rid",
  admin: "admin",
  username: "username",
};

export const URL = {
  home: "/home",
  login: "/base/login",
  logout: "/base/logout",
};

export const FMT = {
  time: "HH:mm:ss",
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
};

export const VARIABLE = {
  url_prefix: "/api",
  link_key: ":",
  link_url: ";",
  link_name: ":::",
  link_list: " , ",
  link_cascade: " / ",
};

export const STATUS = {
  error: -1,
  nl: 0,
  ok: 1,
  na: 2,
};

export var TEXT_MAP = {
  currency: {
    人民币: "¥",
    美元: "$",
    欧元: "€",
    英镑: "￡",
    泰铢: "฿",
    卢比: "Rs.",
  },
} as { [key: string]: Record<string, string> };

export const CONTEXT = {
  status: "status",
  message: "message?",
  data: "data?",
};
