<template>
  <div v-if="keys.length" class="aioa-dc-tool-impd">
    <el-upload
      :limit="1"
      :multiple="false"
      :auto-upload="false"
      :on-change="change"
      :on-remove="change"
      drag
      action="/"
      accept=".xls,.xlsx"
      style="text-align: center; margin-bottom: 10px"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text" v-html="$utils._T('_T0136')"></div>
    </el-upload>
    <el-form :inline="true">
      <el-form-item :label="$utils._T('_T0127')">
        <el-select v-model="sheetName" :placeholder="$utils._T('_T0126')">
          <el-option
            v-for="name in sheetNames"
            :key="name"
            :label="name"
            :value="name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="imp()">
          {{ $utils._T("_T0134") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-card class="aioa-tips">
      <p>1. 只支持未加密的Excel</p>
      <p>2. 红色的为必填项，蓝色的可选</p>
      <p>3. 第一行必须是表头，且在下面列表中存在</p>
      <p>4. 列名看起来一样还是报错，可查看Excel中列名是否包含空格或换行</p>
      <p>5. 日期格式必须是纯文本，且格式为【2000-01-01】</p>
      <h3>
        6.
        批量导入如果报错，请查看是否有部分数据导入成功，此时可以在文件中删除，一般是前几条，也可以让管理员删除
      </h3>
    </el-card>
    <el-card>
      <el-tag
        v-for="key in keys"
        :key="key"
        :type="DC.columns[key]?.null === false ? 'danger' : ''"
        size="large"
        effect="dark"
      >
        {{ DC.columns[key].label }}
      </el-tag>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as XLSX from "xlsx";

export default defineComponent({
  props: ["DC_KEY", "params", "kwargs", "dialog"],
  data() {
    let keys: Array<string> = [];
    let ws: any = null;

    return {
      keys,
      ws,
      sheetNames: [],
      sheetName: "",
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  mounted() {
    this.keys = this.$datacenter.getEList(this.DC, "0");
  },
  methods: {
    reset() {
      this.ws = null;
      this.sheetNames = [];
      this.sheetName = "";
    },
    change(file: any, fileList: any) {
      if (fileList.length === 0) {
        this.reset();
      } else {
        try {
          let raw = file.raw;
          let reader = new FileReader();
          reader.onload = (e) => {
            this.ws = XLSX.read(e?.target?.result, { type: "binary" });
            this.sheetNames = this.ws.SheetNames;
          };

          reader.readAsBinaryString(raw);
        } catch (e) {
          this.reset();
          this.$utils.showAlert(e + "");
        }
      }
    },
    imp() {
      if (!this.ws || !this.sheetName) return this.$utils.showAlert("_T0126");

      let sheet = this.ws.Sheets[this.sheetName];

      let data = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        blankrows: false,
        defval: null,
      });

      if (!data || data.length <= 1) return this.$utils.showAlert("_T0135");

      let heads: Array<any> = data[0] as Array<string>;

      let key = this.keys.find(
        (key) =>
          this.DC.columns[key]?.null === false &&
          heads.indexOf(this.DC.columns[key].label) === -1
      );
      if (key)
        return this.$utils.showAlert(
          "_T0012\f{0}".format(this.DC.columns[key].label)
        );

      let label = heads.find(
        (label: string) =>
          !this.keys.find((key) => this.DC.columns[key].label === label)
      );
      if (label) return this.$utils.showAlert("_T0013\f{0}".format(label));

      for (let i = 0; i < heads.length; i++) {
        heads[i] = this.keys.find(
          (key) => this.DC.columns[key].label === heads[i]
        );
      }

      this.$request({
        url: this.DC.path,
        method: "POST",
        params: this.params,
        data: { data: JSON.stringify(data) },
      }).then((res) => {
        let { status } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.dialog.visible = false;

          this.$store.dispatch("GET_DATA", {
            key: this.DC_KEY,
            params: this.DC.params,
          });
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-tool-impd .el-tag {
  margin: 0 5px 5px 0;
}
</style>
