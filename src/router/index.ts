import { createRouter, createWebHistory } from "vue-router";
import { DEFAULT_TITLE, URL } from "~/utils/settings";
import { _T } from "~/utils";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: URL.login,
      component: () => import("~/views/base/login/index.vue"),
      meta: { title: _T("login") },
    },
    {
      path: "/",
      component: () => import("~/views/base/layout/index.vue"),
      meta: { title: _T(DEFAULT_TITLE) },
      redirect: URL.home,
      children: [
        {
          path: "home",
          meta: { title: _T(DEFAULT_TITLE) },
          component: () => import("~/views/base/home/index.vue"),
        },
        {
          path: "datacenter/:dc",
          component: () => import("~/views/datacenter/index.vue"),
          props: (route) => ({ path: route.path, query: route.query }),
        },
        {
          path: "system/logs",
          component: () => import("~/views/system/logs/index.vue"),
        },
        {
          path: "system/perms",
          component: () => import("~/views/system/perms/index.vue"),
        },
        {
          path: "system/onliners",
          component: () => import("~/views/system/onliners/index.vue"),
        },
        {
          path: "test",
          component: () => import("~/views/test/index.vue"),
        },
      ],
    },
    {
      path: "/:all*",
      redirect: URL.home,
    },
  ],
});
