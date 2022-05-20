import { _T, dtDiff, getDiffDate } from ".";
import { TEXT_MAP } from "./settings";

const DISPLAY_LIMIT_DAY = 3;
const DISPLAY_LIMIT_HOUR = 1;

export default {
  str_map: function (val: any, values: string | Record<string, string>) {
    if (typeof val !== "string" || !val.trim()) return val;

    let vals = typeof values === "string" ? TEXT_MAP[values] : values;
    return vals[val] || val;
  },
  condition_style: function (
    val: any,
    conditions: Record<string, string>,
    values: string | number | Array<any>
  ) {
    if (["string", "number"].indexOf(typeof val) === -1) return val;

    let value = val;
    if (typeof values === "number") value = parseFloat(val);

    if (typeof values === "string" && values.startsWith("now")) {
      values = getDiffDate(parseInt(values.slice(3)));
    }

    if (conditions.gt && value > values) {
      return { val, style: conditions.gt };
    }

    if (conditions.lt && value < values) {
      return { val, style: conditions.lt };
    }

    if (
      conditions.in &&
      typeof values !== "number" &&
      values.indexOf(value) >= 0
    ) {
      return { val, style: conditions.in };
    }

    return val;
  },
  add_pre_zero: function (val: string | number, len: number) {
    val = isNaN(parseFloat(val + "")) ? 0 : val;
    return ("00000000000000000000" + val).slice(-len);
  },
  del_suf_zero: function (val: string | number, pat: string = "") {
    let res = parseFloat(val + "");
    res = isNaN(res) ? 0 : res;
    return res === 0 ? pat : res;
  },
  format_datetime: function (val: any) {
    if (typeof val !== "string" || !val.trim()) return val;

    return val.replace("T", " ");
  },
  format_dt: function (val: any, fmt: string) {
    if (typeof val !== "string" || !val.trim()) return val;

    return new Date(val).format(fmt);
  },
  display_date: function (val: any) {
    if (typeof val !== "string" || !val.trim()) return val;

    let d = dtDiff(val).day;

    let d_f_msg = _T("_T0027\f{0}".format(Math.abs(d)));
    let d_b_msg = _T("_T0028\f{0}".format(Math.abs(d)));
    let now_msg = _T("_T0035");

    if (d > 0 && Math.abs(d) <= DISPLAY_LIMIT_DAY) {
      return d_f_msg;
    } else if (d < 0 && Math.abs(d) <= DISPLAY_LIMIT_DAY) {
      return d_b_msg;
    } else if (Math.abs(d) > DISPLAY_LIMIT_DAY) {
      return val;
    }

    return now_msg;
  },
  display_time: function (val: string) {
    if (typeof val !== "string" || !val.trim()) return val;

    let diff = dtDiff(val);
    let h = diff.hour;
    let m = diff.minute;
    let s = diff.second;

    let h_f_msg = _T("_T0029\f{0}".format(Math.abs(h)));
    let h_b_msg = _T("_T0030\f{0}".format(Math.abs(h)));
    let m_f_msg = _T("_T0031\f{0}".format(Math.abs(m)));
    let m_b_msg = _T("_T0032\f{0}".format(Math.abs(m)));
    let s_f_msg = _T("_T0033\f{0}".format(Math.abs(s)));
    let s_b_msg = _T("_T0034\f{0}".format(Math.abs(s)));
    let now_msg = _T("_T0035");

    if (h > 0) {
      return h_f_msg;
    } else if (h < 0) {
      return h_b_msg;
    } else if (Math.abs(h) > DISPLAY_LIMIT_HOUR) {
      return val;
    }

    if (m > 0) {
      return m_f_msg;
    } else if (m < 0) {
      return m_b_msg;
    }

    if (s > 0) {
      return s_f_msg;
    } else if (s < 0) {
      return s_b_msg;
    }

    return now_msg;
  },
  display_datetime: function (val: any) {
    if (typeof val !== "string" || !val.trim()) return val;

    let diff = dtDiff(val);
    let d = diff.day;
    let h = diff.hour;
    let m = diff.minute;
    let s = diff.second;

    let d_f_msg = _T("_T0027\f{0}".format(Math.abs(d)));
    let d_b_msg = _T("_T0028\f{0}".format(Math.abs(d)));
    let h_f_msg = _T("_T0029\f{0}".format(Math.abs(h)));
    let h_b_msg = _T("_T0030\f{0}".format(Math.abs(h)));
    let m_f_msg = _T("_T0031\f{0}".format(Math.abs(m)));
    let m_b_msg = _T("_T0032\f{0}".format(Math.abs(m)));
    let s_f_msg = _T("_T0033\f{0}".format(Math.abs(s)));
    let s_b_msg = _T("_T0034\f{0}".format(Math.abs(s)));
    let now_msg = _T("_T0035");

    if (d > 0 && Math.abs(d) <= DISPLAY_LIMIT_DAY) {
      return d_f_msg;
    } else if (d < 0 && Math.abs(d) <= DISPLAY_LIMIT_DAY) {
      return d_b_msg;
    } else if (Math.abs(d) > DISPLAY_LIMIT_DAY) {
      return val;
    }

    if (h > 0) {
      return h_f_msg;
    } else if (h < 0) {
      return h_b_msg;
    }

    if (m > 0) {
      return m_f_msg;
    } else if (m < 0) {
      return m_b_msg;
    }

    if (s > 0) {
      return s_f_msg;
    } else if (s < 0) {
      return s_b_msg;
    }

    return now_msg;
  },
};
