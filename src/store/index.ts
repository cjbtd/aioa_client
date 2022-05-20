import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { DEFAULT_DC_KEY, State, Getters, Actions, Mutations } from "./index.d";
import { _T, getObjType, deepCopy } from "~/utils";
import request from "~/utils/request";
import MESSAGE from "~/utils/message";
import { VARIABLE, STATUS } from "~/utils/settings";
import { buildTable } from "~/utils/datacenter";

const DEFAULT_DC = {
  views: 0,
  sizes: [5, 10, 20, 50, 100],
  config: {},
  key_id: "id",
  key_gid: "gid",
  key_status: "status",
  enable_df: false,
  enable_all: true,
  enable_add: true,
  enable_e_mail: false,
  enable_v_mail: false,
  charts: {},
  layouts: {},
  tools: {},
  columns: {},
  relations: {},
  t_list: [],
  r_list: [],
  s_list: [],
  d_a_list: [],
  d_d_list: [],
  d_r_list: [],
  e_list: [],
  e_list_status: false,
  e_list_super: [],
  v_list: [],
  v_list_status: false,
  v_cmds: [],
  v_cmds_status: {},
  gid: 0,
  path: "",
  modules: [],
  book: null,
  dicts: null,
  size: 10,
  total: 0,
  currentpage: 1,
  table: [],
  message: null,
  refreshCount: 0,
  displayed: [],
  selection: [],
  isShowSearchForm: false,
  isFixedSearchForm: false,
  formType: null,
  formData: null,
  fkRowData: null,
  oldRowData: null,
  editInfo: {
    _is_super: false,
    _pk: null,
    _status: "0",
  },
  verifyInfo: {
    _command: "0",
    _pks: [],
    _status: "0",
  },
  relInfo: null,
  cmdInfo: null,
  params: {
    _init: null,
    gid: null,
    size: 10,
    currentpage: 1,
    orders: null,
    fulltext: null,
  },
  isSub: false,
};

const state: State = {
  total: 0,
  confs: {},
  menus: {},
  metas: {},
  caches: [],
  isShowMenu: true,
  isFixedMenu: false,
  roleName: "",
  confName: "",
  cells: [],
  dcs: {
    [DEFAULT_DC_KEY]: DEFAULT_DC,
  },
};

const getters: Getters = {};

const actions: Actions = {
  GET_DATA: ({ commit, state }, { key, params, func }) => {
    if (!state.dcs[key]) state.dcs[key] = deepCopy(DEFAULT_DC);

    let DC = state.dcs[key];

    DC.params = Object.assign(
      {
        _init: DC.refreshCount === 0,
        gid: null,
        size: 10,
        currentpage: 1,
        orders: null,
        fulltext: null,
      },
      params
    );

    request({
      url: key.split(VARIABLE.link_key)[0],
      method: "GET",
      params: DC.params,
    }).then((res) => {
      let { status, data } = res.data;

      if (status === STATUS.ok) {
        commit("LOAD_DATA", { key, data });
        if (func) func(key, data);
      }
    });
  },
  POST_DATA: ({ commit, state }, { key, data, func }) => {
    request({
      url: key.split(VARIABLE.link_key)[0],
      method: "POST",
      params: state.dcs[key].params,
      data,
    }).then((res) => {
      let { status, data } = res.data;

      if (status === STATUS.ok) {
        commit("LOAD_DATA", { key, data });
        if (func) func(key, data);
      }
    });
  },
  SAVE_CONFS: ({ state }, confs) => {
    request({
      url: "/base/userconfs",
      method: "POST",
      data: { userconf: JSON.stringify(confs, null, 2) },
    }).then((res) => {
      let { status } = res.data;

      if (status === STATUS.ok) {
        state.confs = confs;
      }
    });
  },
};

const mutations: Mutations = {
  SET_TOTAL(state, total) {
    total >= 0
      ? (state.total = total)
      : (state.total = state.total > 0 ? state.total + total : state.total);
  },
  SET_CONFS(state, confs) {
    state.confs = confs;
  },
  SET_MENUS(state, menus) {
    state.menus = menus;
  },
  SET_METAS(state, metas) {
    state.metas = metas;
  },
  SET_CACHES(state, caches) {
    state.caches = caches;
  },
  COLLAPSE_MENU_TRUE(state) {
    state.isShowMenu = state.isFixedMenu;
  },
  COLLAPSE_MENU_TOGGLE(state, isFixedMenu) {
    state.isFixedMenu = isFixedMenu;
    state.isShowMenu = !state.isShowMenu;
  },
  SET_ROLE_NAME(state, name) {
    state.roleName = name;
  },
  SET_CONF_NAME(state, name) {
    state.confName = name;
  },
  LOAD_DATA(state, { key, data }) {
    state.cells = [];

    let DC = state.dcs[key];

    for (let key of Object.keys(DC.params)) {
      if (key[0] === "_") delete DC.params[key];
    }

    DC.isShowSearchForm = DC.isFixedSearchForm;
    DC.selection = [];

    let columns: Record<string, any> = data.columns || {};
    for (let [key, opt] of Object.entries(columns)) {
      let label = opt.label || opt.name || key;
      MESSAGE[key] = getObjType(label) === "Array" ? label : [label, label];
      data.columns[key].name = key;
      data.columns[key].label = _T(label);
    }

    buildTable(data.columns || DC.columns, data.table);

    Object.assign(DC, data);

    DC.refreshCount++;
  },
};

export const KEY_STORE: InjectionKey<Store<State>> = Symbol();

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
