import Qs from "qs";
import axios from "axios";
import { ElMessage } from "element-plus";
import { _T, getObjType, loading, showAlert, cookie, isLogin } from ".";
import { COOKIE_KEYS, DEFAULT_USER, URL, VARIABLE, STATUS } from "./settings";
import router from "~/router";

const service = axios.create({
  baseURL: VARIABLE.url_prefix,
  timeout: 0,
});

service.interceptors.request.use(
  (config) => {
    loading.url = config.url || "/";
    loading.open();

    let csrfmiddlewaretoken = cookie.get("csrftoken");

    if (getObjType(config.data) === "FormData") {
      config.data.append("csrfmiddlewaretoken", csrfmiddlewaretoken);
      config.headers = { "Content-Type": "multipart/form-data" };
    } else if (config.data) {
      config.data["csrfmiddlewaretoken"] = csrfmiddlewaretoken;
      config.data = Qs.stringify(config.data, { indices: false });
    }

    config.params == Qs.stringify(config.params, { indices: false });

    return config;
  },
  (error) => {
    loading.close();

    let status = error.response?.status;
    return showAlert(status ? "_T0021\f{0}".format(status) : error);
  }
);

service.interceptors.response.use(
  (response) => {
    loading.close();

    const { status, message } = response.data;

    if (message !== undefined) {
      if (status === STATUS.ok) {
        ElMessage({
          message: _T(message),
          grouping: true,
          type: "success",
          offset: 60,
        });
      } else {
        showAlert(message);
      }
    }

    if (status === STATUS.error) return response;

    if (status === STATUS.nl) {
      if (isLogin()) {
        cookie.set(COOKIE_KEYS.username, DEFAULT_USER);

        const path = response.config.url;
        const params = Qs.stringify(response.config.params, { indices: false });
        router.push(
          `${URL.login}?redirect=${path}%3F${encodeURIComponent(params)}`
        );
      }
      return response;
    }

    if (status === STATUS.na) showAlert("_T0022");

    return response;
  },
  (error) => {
    loading.close();

    let status = error.response?.status;
    showAlert(status ? "_T0021\f{0}".format(status) : error);
    return error;
  }
);

export default service;
