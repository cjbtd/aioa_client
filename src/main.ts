import "nprogress/nprogress.css";
import "./styles/index.scss";
import NProgress from "nprogress";

import { createApp } from "vue";

import loadPlugins from "./plugins";
import loadDirectives from "./directives";

import store from "./store";
import router from "./router";

import * as utils from "./utils";
import * as settings from "./utils/settings";
import * as datacenter from "./utils/datacenter";
import filters from "./utils/filters";
import request from "./utils/request";

import App from "./App.vue";
import DataCenter from "~/views/datacenter/index.vue";

const app = createApp(App);

loadPlugins(app);
loadDirectives(app);

router.beforeEach((to, _, next) => {
  NProgress.start();

  let meta = store.state.metas?.[to.path] || to.meta;
  document.title = utils._T(meta.title || settings.DEFAULT_TITLE);

  if (utils.isLogin() || settings.LOGIN_WHITE_LIST.indexOf(to.path) >= 0) {
    to.path === settings.URL.login && utils.isLogin() ? next("/home") : next();
  } else {
    next(`${settings.URL.login}?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});

router.afterEach(() => NProgress.done());

app.config.globalProperties.$utils = utils;
app.config.globalProperties.$settings = settings;
app.config.globalProperties.$datacenter = datacenter;
app.config.globalProperties.$filters = filters;
app.config.globalProperties.$request = request;

app.use(store);
app.use(router);

app.component("data-center", DataCenter);

app.mount("#app");
