<template>
  <div class="aioa-dc-tool-unique">
    <el-checkbox-group v-model="names">
      <el-checkbox
        v-for="key in DC.displayed"
        :key="key"
        :label="key"
        :border="true"
      >
        {{ DC.columns[key].label }}
      </el-checkbox>
    </el-checkbox-group>
    <div class="aioa-footer">
      <el-checkbox v-model="showDetail" style="margin-right: 10px">
        {{ $utils._T("_T0133") }}
      </el-checkbox>
      <el-button @click="names = []">{{ $utils._T("empty") }}</el-button>
      <el-button type="primary" @click="calc()" :disabled="!names.length">
        {{ $utils._T("_T0128") }}
      </el-button>
    </div>
    <el-tag v-if="showDetail && tableData.length" disable-transitions>
      {{ tableData.length }}
    </el-tag>
    <el-table
      v-if="showDetail && tableData.length"
      :border="true"
      :stripe="true"
      :data="tableData"
      height="45vh"
      style="margin-top: 10px"
      highlight-current-row
    >
      <el-table-column
        v-for="key in names"
        :key="key"
        :prop="key"
        :label="DC.columns[key].label"
        :sort-orders="['ascending', 'descending']"
        :sortable="true"
        :resizable="true"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "params", "kwargs", "dialog"],
  data() {
    return {
      names: [],
      tableData: [],
      showDetail: false,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  methods: {
    calc() {
      this.$request({
        url: this.DC.path,
        params: Object.assign(this.params, {
          keys: this.names,
          show_detail: this.showDetail,
        }),
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok && data) {
          this.$datacenter.buildTable(this.DC.columns, data);
          this.tableData = data;
        }
      });
    },
  },
  watch: {
    names() {
      this.tableData = [];
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-tool-unique {
  .el-checkbox-group .el-checkbox {
    margin: 0 5px 5px 0 !important;
    width: 170px;
  }

  .el-table th,
  .el-table td {
    padding: 0;
  }

  .el-table div.cell {
    color: black;
    font-size: 12px;
    padding: 0 2px;
  }
}
</style>
