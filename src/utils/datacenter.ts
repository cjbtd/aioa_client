import { showAlert, getValByPath, deepCopy } from ".";
import { FMT, VARIABLE } from "./settings";
import { Column, DataCenter, MessageForm } from "~/store/index.d";

interface Od {
  idx: number;
  by: "desc" | "asc";
}

function isValid(
  data: Record<string, Record<string, any>>,
  oldData: Record<string, any> | null = null
) {
  let _form_data: Record<string, any> = {};
  let __count__ = 0;

  for (let [key, kwargs] of Object.entries(data)) {
    let _type = getValByPath(kwargs, "type", "str");

    let oldVal = oldData ? getValByPath(oldData, key, null) : null;
    if (oldVal === "") oldVal = null;
    if (oldVal === "NULL") oldVal = null;
    if (oldVal && _type === "datetime")
      oldVal = new Date(oldVal).format(FMT.datetime);

    let newVal = getValByPath(kwargs, "val", null);
    if (newVal === "") newVal = null;

    if (oldData && oldVal === newVal) continue;

    if (newVal === null) newVal = "NULL";
    if (!getValByPath(kwargs, "null", true) && newVal === "NULL") {
      return showAlert("_T0003\f{0}".format(key));
    }

    if (
      newVal !== "NULL" &&
      ["date", "time", "datetime", "file", "enum", "remote", "cascade"].indexOf(
        _type
      ) === -1
    ) {
      let ranges: null | Array<string> = getValByPath(kwargs, "ranges", null);
      let regexs: Array<[string, string, string]> = getValByPath(
        kwargs,
        "regexs",
        []
      );

      if (_type === "num") regexs.push(["_T0004", "^[-+]?\\d+(\\.\\d+)?$", ""]);

      if (!!regexs.length) {
        let res = "";
        for (let [msg, reg, _] of regexs) {
          if (new RegExp(reg).test(newVal)) break;
          res = "{0}\f{1}".format(msg, key);
        }

        if (res !== "") return showAlert(res);
      }

      let msg = "";
      let _len = 0;

      if (_type === "num") {
        msg = "_T0005";
        _len = parseFloat(newVal);
      } else {
        msg = "_T0006";
        _len = parseFloat(newVal.length);
      }

      if (ranges) {
        let [c_min, c_max] = ranges;
        let c_min_unlimit = c_min.length == 0;
        let c_max_unlimit = c_max.length == 0;

        if (
          (c_min_unlimit && _len < parseFloat(c_min)) ||
          (c_max_unlimit && _len > parseFloat(c_max))
        ) {
          c_min = c_min_unlimit ? c_min : "~";
          c_max = c_max_unlimit ? c_max : "~";
          return showAlert("{}\f{}\v{}\v{}".format(msg, key, c_min, c_max));
        }
      }
    }

    __count__++;
    _form_data[key] = newVal;
  }

  let jsonStr = JSON.stringify(_form_data);

  return { _form_data: jsonStr, __count__ };
}

function buildForm(
  columns: Record<string, Record<string, any>>,
  list: Array<string>,
  rowdata: Record<string, any> | null = null
) {
  if (!!list.length) {
    let form: Record<string, Record<string, any>> = {};

    for (let key of list) {
      let val = null;
      form[key] = columns[key];

      if (rowdata) {
        val = rowdata[key] === undefined ? null : rowdata[key];
      } else {
        val = columns[key].default === undefined ? null : columns[key].default;
      }

      form[key].val = val === "" ? null : val;
    }
    return deepCopy(form);
  }
  return null;
}

function buildOrders(
  orders: string | null,
  len: number,
  index: number = 0,
  method: "add" | "del" = "add"
) {
  let ods: Array<Od> = [];
  let odList: Array<string> = [];

  for (let order of (orders || "").split(",")) {
    let idx = parseInt(order.split(" ")[0]);
    if (isNaN(idx) || idx > len) continue;

    let by: "desc" | "asc" = order.indexOf("desc") >= 0 ? "desc" : "asc";
    ods.push({ idx, by });
    odList.push(idx + " " + by);
  }

  if (index) {
    let newOds: Array<Od> = [];
    let newOdList: Array<string> = [];
    let isNew = true;

    for (let od of ods) {
      let idx = od.idx;
      let by = od.by;
      if (idx === index) {
        isNew = false;
        if (method === "del") continue;
        by = by === "desc" ? "asc" : "desc";
      }

      newOds.push({ idx, by });
      newOdList.push(idx + " " + by);
    }

    if (isNew) {
      newOds.push({ idx: index, by: "asc" });
      newOdList.push(index + " asc");
    }

    ods = newOds;
    odList = newOdList;
  }
  return { orders: odList.join(","), ods };
}

function buildMail(DC: DataCenter, form: Record<string, any>) {
  if (!DC.enable_e_mail && !DC.enable_v_mail) return null;

  let row = DC.selection[0] || DC;
  let mail: MessageForm = {};
  let defaultContent = "";
  let gid = DC.params.gid || 0;

  if (DC.formType === "add data") {
    mail = deepCopy(DC.enable_e_mail);
  } else if (DC.formType === "edit data") {
    defaultContent = `ID:<a target="_blank" href="${DC.path}?gid=${gid}&id=${DC.editInfo._pk}">View</a><br />`;

    mail = deepCopy(DC.enable_e_mail);
  } else if (DC.formType === "verify data") {
    defaultContent = `ID:<a target="_blank" href="${
      DC.path
    }?gid=${gid}&id=${DC.verifyInfo._pks.join(",")}">View</a><br />`;

    mail = deepCopy(DC.enable_v_mail);
  } else {
    return null;
  }

  if (mail.keys) {
    let vals: Array<any> = mail.keys.map(
      (key: string) => form?.[key]?.val || row?.[key] || ""
    );

    if (mail.title) {
      mail.title = mail.title.format(...vals);
    }

    if (mail.content) {
      mail.content = mail.content.format(...vals);
    }
  }

  if (mail) {
    mail.content = defaultContent + (mail.content || "");
  }

  return mail;
}

function buildTable(columns: Record<string, Column>, table: Array<any>) {
  let keys = [];
  for (let [key, opt] of Object.entries(columns)) {
    if (opt.type === "enum" && opt?.enums?.[0].label !== opt?.enums?.[0].value)
      keys.push(key);
  }

  if (!keys.length) return;

  for (let i = 0, len = table.length; i < len; i++) {
    keys.filter((key) => {
      const val = table[i][key];
      const enums = columns?.[key]?.enums || [];

      if (val) {
        if ([1, undefined].indexOf(columns[key]?.limit) >= 0) {
          table[i][key] = enums.find((item) => item.value == val)?.label || val;
        } else {
          const vals = val.split(VARIABLE.link_list);

          table[i][key] = vals
            .map(
              (v: string) => enums.find((item) => item.value == v)?.label || v
            )
            .join(VARIABLE.link_list);
        }
      }
    });
  }
}

function buildData(
  columns: Record<string, Column>,
  data: Array<Array<any>>,
  names: Array<string> = []
) {
  let keys: Array<[number, string]> = [];

  for (let i = 0, len = names.length; i < len; i++) {
    let opt = columns[names[i]];

    if (
      opt.type === "enum" &&
      opt?.enums?.[0].label !== opt?.enums?.[0].value
    ) {
      keys.push([i, names[i]]);
    }
  }

  if (!keys.length) return;

  for (let i = 0, len = data.length; i < len; i++) {
    keys.filter(([index, key]) => {
      const val = data[i][index];
      const enums = columns?.[key]?.enums || [];

      if (val) {
        if ([1, undefined].indexOf(columns[key]?.limit) >= 0) {
          data[i][index] =
            enums.find((item) => item.value == val)?.label || val;
        } else {
          const vals = val.split(VARIABLE.link_list);

          data[i][index] = vals
            .map(
              (v: string) => enums.find((item) => item.value == v)?.label || v
            )
            .join(VARIABLE.link_list);
        }
      }
    });
  }
}

function getEnumLabel(
  columns: Record<string, Column>,
  key: string,
  value: string
) {
  const enums = columns?.[key]?.enums || [];
  if (!enums.length || enums[0].label === enums[0].value) return value;

  return enums.find((item) => item.value == value)?.label || value;
}

function getEnumValue(
  columns: Record<string, Column>,
  key: string,
  label: string
) {
  const enums = columns?.[key]?.enums || [];
  if (!enums.length || enums[0].label === enums[0].value) return label;

  return enums.find((item) => item.label == label)?.value || label;
}

function getListByType(DC: DataCenter, list: Array<string>, type: string) {
  return list.filter(
    (key) => type === "ALL" || (DC.columns[key].type || "str") === type
  );
}

function getEList(DC: DataCenter, status: string) {
  if (!DC.key_status) return DC.e_list;

  let listStatus = DC.e_list_status;
  if (listStatus === false) return [];
  if (listStatus === true) return DC.e_list;

  let list = listStatus[status];

  if (list === false) return [];
  if (list === true || list === undefined) return DC.e_list;
  return list;
}

function getVList(DC: DataCenter, status: string) {
  if (!DC.key_status) return DC.v_list;

  let listStatus = DC.v_list_status;
  if (listStatus === false) return false;
  if (listStatus === true) return DC.v_list;

  let list = listStatus[status];

  if (list === false || list === undefined) return false;
  if (list === true) return DC.v_list;
  return list;
}

function getCmds(DC: DataCenter, status: string) {
  let cmds = DC.v_cmds_status[status];
  return cmds === undefined ? DC.v_cmds : cmds;
}

export {
  Od,
  isValid,
  buildForm,
  buildOrders,
  buildMail,
  buildTable,
  buildData,
  getListByType,
  getEList,
  getVList,
  getCmds,
  getEnumLabel,
  getEnumValue,
};
