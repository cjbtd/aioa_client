import { GetterTree, ActionTree, MutationTree, ActionContext } from "vuex";

export const DEFAULT_DC_KEY = "default:0";

export interface MenuItem {
  key: string;
  index: string;
  children?: Menu;
}

export interface Menu {
  [name: string]: MenuItem;
}

export interface Modules {
  label: string;
  value: number;
  cids: Array<number>;
}

export interface MetaItem {
  mid: number;
  title: string;
  tagName: string;
  keepAlive: boolean;
  modules: Array<Modules>;
  [name: string]: any;
}

export interface Meta {
  [path: string]: MetaItem;
}

export interface Role {
  id: number;
  name: string;
}

export interface MessageForm {
  to?: string;
  cc?: string;
  title?: string;
  content?: string;
  attachments?: string;
  keys?: Array<string>;
}

export interface Tool {
  label: string;
  width?: string;
  kwargs?: Record<string, any>;
}

export interface Column {
  name: string;
  label: string; // | Array<string>
  type?: string;
  enabled?: Array<"s" | "e" | "v" | "a" | "d" | "r">;
  tooltip?: boolean;
  fixed?: string | boolean;
  width?: number;
  link?: string;
  link_keys?: Array<any>;
  link_name?: string;
  encode?: boolean;
  cell_style?: string;
  funcs?: Array<{ func: string; args: Array<any> }>;
  divider?: string | Array<string>;
  style?: string;
  placeholder?: string | Array<string>;
  autocomplete?: Record<string, string>;
  default?: string | null;
  null?: boolean;
  sizes?: number;
  limit?: number;
  ranges?: Array<string>;
  regexs?: Array<Array<string>>;
  ref?: any;
  filters?: Array<any>;
  create?: boolean;
  enums?: Array<Record<string, any>>;
}

export interface Relation {
  type?: string;
  title?: string;
  kwargs: Record<string, any>;
}

export interface Cmd {
  attach: boolean;
  command: string;
  label: string | Array<string>;
  tips?: string | Array<string>;
  type?:
    | ""
    | "default"
    | "info"
    | "success"
    | "warning"
    | "text"
    | "danger"
    | "primary";
}

export interface Dict {
  alias: string;
  remark: string;
}

export interface EditInfo {
  _is_super: boolean;
  _pk: string | null;
  _status: string;
}

export interface VerifyInfo {
  _command: string;
  _pks: Array<string>;
  _status: string;
}

export interface DataCenter {
  //// Server
  // opts
  views: number;
  sizes: Array<number>;
  config: Record<string, any>;
  key_id: string;
  key_gid: string | boolean;
  key_status: string | boolean;
  enable_df: boolean | Record<string, string>;
  enable_all: boolean;
  enable_add: boolean;
  enable_e_mail: boolean | MessageForm;
  enable_v_mail: boolean | MessageForm;
  charts: Record<string, any>;
  layouts: Record<string, any>;
  tools: Record<string, Tool>;
  columns: Record<string, Column>;
  relations: Record<string, Relation>;
  t_list: Array<string>;
  r_list: Array<string>;
  s_list: Array<string>;
  d_a_list: Array<string>;
  d_d_list: Array<string>;
  d_r_list: Array<string>;
  e_list: Array<string>;
  e_list_status: boolean | Record<string, boolean | Array<string>>;
  e_list_super: Array<string>;
  v_list: Array<string>;
  v_list_status: boolean | Record<string, boolean | Array<string>>;
  v_cmds: Array<Cmd>;
  v_cmds_status: Record<string, Array<Cmd>>;
  // system
  gid: number;
  path: string;
  modules: Array<Modules>;
  book: string | null;
  dicts: Array<[string, string]> | null;
  size: number;
  total: number;
  currentpage: number;
  table: Array<Record<string, any>>;
  message: string | null;
  //// Client
  refreshCount: number;
  displayed: Array<string>;
  selection: Array<Record<string, any>>;
  isShowSearchForm: boolean;
  isFixedSearchForm: boolean;
  formType: "add data" | "edit data" | "verify data" | null;
  formData: Record<string, any> | null;
  fkRowData: Record<string, any> | null;
  oldRowData: Record<string, any> | null;
  editInfo: EditInfo;
  verifyInfo: VerifyInfo;
  relInfo: string | null;
  cmdInfo: string | null;
  params: {
    _init: boolean | null;
    gid: number | null;
    size: number;
    currentpage: number;
    orders: string | null;
    fulltext: string | null;
    [key: string]: any;
  };
  isSub: boolean;
}

export interface State {
  total: number;
  confs: Record<string, any>;
  menus: Menu;
  metas: Meta;
  roles: Array<Role>;
  caches: Array<string>;
  isShowMenu: boolean;
  isFixedMenu: boolean;
  roleName: string;
  confName: string;
  cells: Array<any>;
  dcs: Record<string, DataCenter>;
}

export interface Getters extends GetterTree<State, State> {}

export interface Actions extends ActionTree<State, State> {
  GET_DATA(injectee: ActionContext<State, State>, payload: any): void;
  POST_DATA(injectee: ActionContext<State, State>, payload: any): void;
  SAVE_CONFS(injectee: ActionContext<State, State>, payload: any): void;
}

export interface Mutations extends MutationTree<State> {
  SET_TOTAL(state: State, total: number): void;
  SET_CONFS(state: State, confs: Record<string, any>): void;
  SET_MENUS(state: State, menus: Menu): void;
  SET_METAS(state: State, metas: Meta): void;
  SET_ROLES(state: State, roles: Array<Role>): void;
  SET_CACHES(state: State, caches: Array<string>): void;
  COLLAPSE_MENU_TRUE(state: State): void;
  COLLAPSE_MENU_TOGGLE(state: State, isFixedMenu: boolean): void;
  SET_ROLE_ID(state: State, rid: number): void;
  SET_CONF_NAME(state: State, name: string): void;
  LOAD_DATA(state: State, payload: any): void;
}
