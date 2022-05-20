<template>
  <el-table
    v-if="result"
    :border="true"
    :stripe="true"
    :highlight-current-row="true"
    :data="table"
    :show-summary="config.summary"
    max-height="60vh"
    @cell-click="cellClick"
    class="aioa-dc-table"
  >
    <el-table-column
      v-for="key in list"
      :key="key"
      :prop="key"
      :label="$utils._T(columns[key].label || columns[key].name || key)"
      :width="
        columns[key].rwidth ||
        (columns[key].width ? columns[key].width + 25 : columns[key].width)
      "
      :show-overflow-tooltip="columns[key].tooltip !== false"
      :resizable="true"
      :sortable="true"
      label-class-name="aioa-dc-table-header"
    >
      <template #default="{ row }">
        <dc-cell
          :key="'cell_' + key + row[DC.key_id] + row[key]"
          :DC="DC"
          :col="key"
          :row="row"
          :opts="columns[key]"
          :rel="relation"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DcCell from "../table/cell.vue";

export default defineComponent({
  props: ["DC_KEY", "relation", "result"],
  components: { DcCell },
  data() {
    let config: Record<string, any> = {};
    let table: Array<any> = [];
    let list: Array<string> = [];
    let columns: Record<string, any> = {};

    return {
      config,
      table,
      list,
      columns,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  created() {
    if (this.result) {
      this.table = this.result.data;
      this.list = this.result.d_r_list;
      this.columns = this.result.columns;
      this.config = this.result.config;
    }
  },
  methods: {
    cellClick(_: any, __: any, cell: HTMLElement) {
      let newCells: Array<any> = [];

      if (this.DC.config.calc && /^[-+]?\d+(\.\d+)?$/.test(cell.innerText)) {
        let oldCells = this.$store.state.cells;

        const index = oldCells.indexOf(cell);

        for (let i = 0, len = oldCells.length; i < len; i++) {
          if (i !== index) {
            newCells.push(oldCells[i]);
          }
        }

        if (index === -1) newCells.push(cell);
      }

      this.$store.state.cells = newCells;
    },
  },
});
</script>
