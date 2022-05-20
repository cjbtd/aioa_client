import "element-plus/theme-chalk/display.css";
import "element-plus/theme-chalk/index.css";

import type { App } from "vue";

import * as ElIcons from "@element-plus/icons-vue";
import ElementPlus from "element-plus";
import enEle from "element-plus/es/locale/lang/en";
import zhEle from "element-plus/es/locale/lang/zh-cn";

import dayjs from "dayjs";
import enDay from "dayjs/locale/en";
import zhDay from "dayjs/locale/zh-cn";

import { isZh } from "~/utils";

dayjs().locale(isZh() ? zhDay : enDay);

export default function (app: App) {
  for (const name in ElIcons) {
    app.component(name, (ElIcons as any)[name]);
  }

  app.use(ElementPlus, { locale: isZh() ? zhEle : enEle });
}
