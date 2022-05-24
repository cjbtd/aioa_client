<template>
  <div v-if="options.length" class="aioa-dc-tool-enum">
    <el-select v-model="columnKey" style="margin-bottom: 6px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
    <el-button type="primary" style="margin-left: 10px" @click="add()">
      {{ $utils._T("add") }}
    </el-button>
    <el-input clearable v-model="txt" :placeholder="$utils._T('_T0118')" />
    <el-tree
      ref="enumTree"
      draggable
      :data="treeData"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <template #default="{ node, data }">
        <span class="tree-node">
          <span v-if="data.label" @dblclick="edit(node, data)">
            {{ data.label }}
          </span>
          <el-input
            ref="enumInput"
            v-else
            v-model="label"
            clearable
            @blur="save(node, data)"
          />
          <span>
            <el-button
              v-show="columnType === 'cascade'"
              link
              type="primary"
              size="small"
              @click="append(node, data)"
            >
              {{ $utils._T("append") }}
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="remove(node, data)"
            >
              {{ $utils._T("delete") }}
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>
    <div class="aioa-footer">
      <el-button type="primary" @click="saveData()">
        {{ $utils._T("save") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "kwargs", "params", "dialog"],
  data() {
    let options: Array<any> = [];
    let treeData: Array<any> = [];

    return {
      txt: null,
      columnKey: "",
      columnType: "",
      label: null,
      options,
      treeData,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  mounted() {
    let options = Object.keys(this.kwargs.keys).map((key) => {
      return { value: key, label: this.DC.columns[key].label };
    });

    if (options.length > 0) this.columnKey = options[0].value;

    this.options = options;
  },
  watch: {
    txt(val) {
      (this.$refs as any)?.enumTree.filter(val);
    },
    columnKey(val) {
      this.columnType = this.DC.columns[val].type || "";
      this.treeData = this.$utils.deepCopy(this.DC.columns[val].enums);
    },
  },
  methods: {
    saveData() {
      let enums = JSON.stringify(this.treeData).replace(
        new RegExp(/,?"children":\[\]/, "g"),
        ""
      );

      this.$request({
        url: this.DC.path,
        method: "POST",
        params: Object.assign(this.params, { key: this.columnKey }),
        data: { enums },
      }).then((res) => {
        let { status } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.dialog.visible = false;

          this.DC.params._init = true;

          this.$store.dispatch("GET_DATA", {
            key: this.DC_KEY,
            params: this.DC.params,
          });
        }
      });
    },
    filterNode(value: string, data: any) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    add() {
      const ts = new Date().getTime() + "";
      this.treeData.push({ value: ts, label: ts });
    },
    edit(_: any, data: any) {
      this.label = data.label;
      data.value = null;
      data.label = null;

      this.$nextTick(() => (this.$refs as any)?.enumInput.focus());
    },
    save(_: any, data: any) {
      data.value = this.label;
      data.label = this.label;
    },
    append(_: any, data: any) {
      if (!data.children) data.children = [];

      const ts = new Date().getTime() + "";
      data.children.push({ value: ts, label: ts });
    },
    remove(node: any, data: any) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d: any) => d.label === data.label);
      children.splice(index, 1);
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-tool-enum .el-tree {
  border: 1px solid #ecf5ff;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  max-height: 500px;
  overflow: auto;

  .tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;

    .el-input__inner {
      height: 26px;
    }
  }
}
</style>
