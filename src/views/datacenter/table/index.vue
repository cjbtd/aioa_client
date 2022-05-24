<template>
  <div class="aioa-dc-table">
    <el-table
      ref="dcTable"
      :border="true"
      :stripe="true"
      :highlight-current-row="true"
      :height="height"
      :max-height="maxHeight"
      :data="DC.table"
      :show-summary="DC.config.summary"
      @selection-change="handleSelectionChange"
      @cell-click="cellClick"
    >
      <el-table-column
        v-if="DC.config.selectable !== false"
        fixed
        width="20"
        type="selection"
      ></el-table-column>
      <el-table-column
        v-for="key in DC.displayed"
        :key="key"
        :prop="key"
        :fixed="DC.columns[key].fixed || false"
        :width="DC.columns[key].width"
        :resizable="true"
        :show-overflow-tooltip="DC.columns[key].tooltip !== false"
      >
        <template #header>
          <span
            class="aioa-dc-table-header"
            :title="DC.columns[key].label"
            @click="headerClick(key)"
          >
            {{ DC.columns[key].label }}
          </span>
        </template>
        <template #default="{ row }">
          <dc-cell
            :key="'cell_' + key + row[DC.key_id] + row[key]"
            :DC="DC"
            :col="key"
            :row="row"
            :opts="DC.columns[key]"
            rel=""
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="DC.e_list_status || DC.r_list.length"
        fixed="right"
        class-name="txt-center"
        label-class-name="txt-center aioa-dc-table-header"
        :label="$utils._T('_T0116')"
        :width="(DC.e_list_status ? 35 : 0) + (DC.r_list.length ? 40 : 0)"
      >
        <template #default="{ row }">
          <el-button
            v-if="DC.r_list.length"
            link
            type="primary"
            size="small"
            @click="detail(row)"
          >
            {{ $utils._T("_T0089") }}
          </el-button>
          <el-button
            v-if="DC.e_list_status"
            link
            type="primary"
            size="small"
            @click="edit(row, false)"
            @contextmenu.prevent="edit(row, true)"
          >
            {{ $utils._T("_T0101") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <aioa-dialog v-if="dialog.visible" :opts="dialog">
      <dc-relations :DC_KEY="DC_KEY" />
    </aioa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import DcCell from "./cell.vue";
import DcRelations from "../relations/index.vue";

export default defineComponent({
  components: { AioaDialog, DcCell, DcRelations },
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
    height: {
      type: String,
    },
    maxHeight: {
      type: String,
    },
  },
  data() {
    return {
      dialog: {
        title: "",
        visible: false,
        class: "aioa-dialog-fit-form",
      },
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    "DC.refreshCount"(val) {
      if (val === 0) return;

      this.$nextTick(() => {
        const _rel = this.DC.relInfo;
        const _pk = this.DC.editInfo._pk;
        const _pks = this.DC.verifyInfo._pks;

        let pks: Array<any> = [];

        if (_rel) {
          pks = [_rel];
        } else if (_pk) {
          pks = [_pk];
        } else if (_pks.length) {
          pks = _pks;
        }

        if (pks.length) {
          pks = pks.map((pk) => pk + "");
          let rows = this.DC.table.filter(
            (row) => pks.indexOf(row[this.DC.key_id] + "") >= 0
          );

          this.DC.selection = rows;
          this.handleSelection(rows);

          if (_rel) {
            this.dialog.title = _rel;
            this.dialog.visible = true;
          } else if (_pk) {
            this.DC.formType = _pk === "0" ? "add data" : "edit data";
          } else if (_pks.length) {
            this.DC.formType = "verify data";
          }
        }
      });
    },
    "dialog.visible"(val) {
      if (val === false) this.DC.relInfo = null;
    },
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
    handleSelectionChange(selection: Array<any>) {
      this.DC.selection = selection;
    },
    handleSelection(rows: Array<Record<string, any>>) {
      const dcTable: any = this.$refs.dcTable;
      dcTable.clearSelection();
      rows.map((row) => dcTable.toggleRowSelection(row, true));
    },
    headerClick(col: string) {
      let index = this.DC.d_a_list.findIndex((key) => col === key) + 1;

      if (index > 0) {
        const orders = this.$datacenter.buildOrders(
          this.DC.params.orders,
          this.DC.d_a_list.length,
          index
        ).orders;

        this.DC.params.orders = orders;

        this.$store.dispatch("GET_DATA", {
          key: this.DC_KEY,
          params: this.DC.params,
        });
      }
    },
    detail(row: Record<string, any>) {
      this.handleSelection([row]);

      this.DC.relInfo = row[this.DC.key_id] + "";
      this.dialog.title = this.DC.relInfo;
      this.dialog.visible = true;
    },
    edit(row: Record<string, any>, isSuper: boolean) {
      this.handleSelection([row]);

      this.DC.formData = null;
      this.DC.oldRowData = null;

      this.DC.editInfo._is_super = isSuper;
      this.DC.editInfo._pk = row[this.DC.key_id] + "";
      this.DC.editInfo._status = "0";

      this.DC.formType = "edit data";
    },
  },
});
</script>
