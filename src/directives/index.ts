import type { App } from "vue";

import drag from "./drag";
import print from "./print";

export default function (app: App) {
  app.directive("drag", drag);
  app.directive("print", print);
}
