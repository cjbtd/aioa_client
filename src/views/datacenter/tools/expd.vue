<template>
  <div class="aioa-dc-tool-expd">
    <el-checkbox
      v-model="checkAll"
      @change="handleCheckAllChange"
      :indeterminate="isIndeterminate"
      style="margin: 11px !important"
    >
      {{ $utils._T("_T0064") }}
    </el-checkbox>
    <el-checkbox-group v-model="names" @change="handleCheckedChange">
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
      <el-radio-group v-model="ext">
        <el-radio label="xlsx">xlsx</el-radio>
        <el-radio label="xls">xls</el-radio>
      </el-radio-group>
      <el-button type="primary" @click="exp()" :disabled="!names.length">
        {{ $utils._T("_T0139") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as XLSX from "xlsx";

export default defineComponent({
  props: ["DC_KEY", "params", "kwargs", "dialog"],
  data() {
    let names: Array<string> = [];
    let ext: "xlsx" | "xls" = "xlsx";

    return {
      isIndeterminate: false,
      checkAll: false,
      names,
      ext,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  methods: {
    handleCheckAllChange(val: boolean) {
      this.names = val ? this.DC.displayed : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(val: Array<string>) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.DC.displayed.length;
      this.isIndeterminate = !!checkedCount && !this.checkAll;
    },
    exp() {
      this.$request({
        url: this.DC.path,
        params: Object.assign(this.params, { keys: this.names }),
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.$datacenter.buildData(this.DC.columns, data, this.names);

          data.unshift(this.names.map((key) => this.DC.columns[key].label));

          let fileName = document.title;
          let wbout = XLSX.utils.aoa_to_sheet(data);
          let wbn = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wbn, wbout, fileName);
          XLSX.writeFile(wbn, `${fileName}.${this.ext}`, {
            bookType: this.ext,
          });

          this.dialog.visible = false;
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-tool-expd {
  .el-checkbox {
    margin: 0 5px 5px 0 !important;
    width: 170px;
  }

  .el-radio {
    margin-right: 10px !important;
  }
}
</style>
