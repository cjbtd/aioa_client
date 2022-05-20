<template>
  <table
    border="0"
    cellspacing="0"
    cellpadding="0"
    :style="layout.tableStyle"
    :class="layout.tableClass"
  >
    <colgroup>
      <col
        v-for="(width, idx) in layout.colWidths"
        :key="idx + '_' + width"
        :width="width"
      />
    </colgroup>
    <tbody>
      <tr
        v-for="tr in trs"
        :key="'tr_' + $utils.uuid()"
        :class="tr.class"
        :style="tr.style"
      >
        <td
          v-for="td in tr.tds"
          :key="'td_' + $utils.uuid()"
          :class="td.class"
          :style="td.style"
          :rowspan="td.rowspan || 1"
          :colspan="td.colspan || 1"
        >
          <div :class="td.subClass" :style="td.subStyle" v-html="td.html"></div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { deepCopy, getObjType, getValByPath } from "~/utils";
import { VARIABLE } from "~/utils/settings";
import filters from "~/utils/filters";

interface SubRows {
  [path: string]: Array<Array<any> | Record<string, any>>;
}

const props = defineProps({
  layout: {
    type: Object as PropType<any>,
    required: true,
  },
  row: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  subRows: {
    type: Object as PropType<SubRows>,
  },
});

function createHtml(td: any, text: string) {
  if (!td.checkboxs) return text;

  let boxPos = td.boxPos || "left";
  let boxClass = td.boxClass || "";
  let boxStyle = td.boxStyle || "";
  let html = "";
  let vals = text.split(VARIABLE.link_list);

  td.checkboxs.filter((item: string) => {
    let checked = vals.indexOf(item) >= 0 ? "checked" : "";
    let prefix = "";
    let suffix = "";
    boxPos === "left" ? (suffix = item) : (prefix = item);

    html += `<span class="box {0}" style="{1}">
                     {2} <input type="checkbox" disabled {3} name="{4}"> {5}
                   </span>`.format(
      boxClass,
      boxStyle,
      prefix,
      checked,
      item,
      suffix
    );
  });

  return html;
}

let row = props.row;
let subRows = props.subRows || {};

let res: Array<any> = [];

for (let trIdx = 0, trLen = props.layout.trs.length; trIdx < trLen; trIdx++) {
  let tr = props.layout.trs[trIdx];
  let length = 1;

  if (tr.tr) {
    tr = tr.tr;

    if (tr.length) {
      length = tr.length;
    } else {
      let tables = tr.tables || Object.keys(subRows);
      let lengths = tables.map((key: string) => subRows[key]?.length || 0);
      length = Math.max(...lengths);
    }
  }

  for (let n = 0; n < length; n++) {
    for (let tdIdx = 0, tdLen = tr.tds.length; tdIdx < tdLen; tdIdx++) {
      let td = tr.tds[tdIdx];

      let label = "";

      let vals = [];
      let keys = td.keys || [];
      if (typeof keys === "string") keys = [keys];

      for (let k = 0; k < keys.length; k++) {
        let key = keys[k];
        let val = "";

        if (key === "__no__") {
          val = n + 1 + "";
        } else {
          val = row[key];

          if (val === undefined) {
            val = getValByPath(subRows, key.format(n), key);
          }

          let funcs = td.funcs || [];

          for (let f = 0; f < funcs.length; f++) {
            let func = funcs[f].func;
            let args = funcs[f].args || [];

            //@ts-ignore
            if (filters[func]) val = filters[func](val, ...args);
          }
        }

        vals.push(val);

        label += "{" + k + "}";
      }

      let text = (td.label || label || "&nbsp;").format(...vals);

      td.html = createHtml(td, text);
    }

    res.push(deepCopy(tr));
  }
}

const trs = res;
</script>
