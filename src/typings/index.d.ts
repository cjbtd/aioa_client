import { Store } from "vuex";
import { State } from "~/store/index.d";
import * as utils from "~/utils";
import * as settings from "~/utils/settings";
import * as datacenter from "~/utils/datacenter";
import filters from "~/utils/filters";
import request from "~/utils/request";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $store: Store<State>;
    $utils: typeof utils;
    $settings: typeof settings;
    $datacenter: typeof datacenter;
    $filters: typeof filters;
    $request: typeof request;
    // [key: string]: any;
  }
}

declare global {
  interface Window {
    CKEDITOR: any;
  }
}
