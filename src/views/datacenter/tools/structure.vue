<template>
  <div class="aioa-dc-tool-structure">
    <el-input clearable v-model="txt" :placeholder="$utils._T('_T0118')" />
    <el-tree
      ref="structureTree"
      draggable
      default-expand-all
      :data="treeData"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :allow-drop="allowDrop"
    >
      <template #default="{ node, data }">
        <span class="tree-node">
          <el-button
            v-if="data.label"
            type="text"
            size="large"
            :icon="!!data.id ? 'user' : 'grid'"
            :class="{ user: !!data.id }"
            @dblclick="edit(node, data)"
          >
            {{ data.label }}
          </el-button>
          <el-input
            ref="structureInput"
            v-else
            v-model="label"
            clearable
            @blur="save(node, data)"
          />
          <span v-if="!!data.value">
            <el-button type="text" size="small" @click="append(node, data)">
              {{ $utils._T("append") }}
            </el-button>
            <el-button type="text" size="small" @click="remove(node, data)">
              {{ $utils._T("delete") }}
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>
    <div style="margin: 20px 0; text-align: right">
      <el-button type="primary" @click="saveData()">
        {{ $utils._T("save") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Tree {
  id?: number;
  value: string;
  label: string;
  children?: Array<Tree>;
}

export default defineComponent({
  props: ["DC_KEY", "kwargs", "params", "dialog"],
  data() {
    let contactObj: Record<string, string> = {};
    let treeData: Array<Tree> = [];

    return {
      txt: null,
      label: null,
      contactObj,
      treeData,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    txt(val) {
      (this.$refs as any)?.structureTree.filter(val);
    },
  },
  mounted() {
    let treeData = this.$utils.deepCopy(this.DC.columns[this.kwargs.key].enums);

    this.$request({
      url: this.DC.path,
      params: this.params,
    }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        for (let i = 0, cLen = data.length; i < cLen; i++) {
          let subTree = treeData;

          let idx = data[i][0];
          let jobname = data[i][1];
          let username = data[i][2];

          this.contactObj[idx] = jobname;

          if (jobname) {
            let deps = jobname.split(this.$settings.VARIABLE.link_cascade);
            for (let j = 0, dLen = deps.length; j < dLen; j++) {
              let dep = deps[j];

              for (let k = 0; k < subTree.length; k++) {
                if (subTree[k].label === dep) {
                  if (!subTree[k].children) subTree[k].children = [];
                  subTree = subTree[k].children;
                  break;
                }
              }
            }
          }

          subTree.push({ id: idx, label: username });
        }

        this.treeData = treeData;
      }
    });
  },
  methods: {
    handleTreeData(
      treeData: Array<Tree>,
      contacts: Record<string, any> = {},
      val = ""
    ) {
      for (let i = 0; i < treeData.length; i++) {
        let obj = treeData[i];
        let idx = obj.id;
        let label = obj.label;

        if (idx) {
          if (this.contactObj[idx] !== val) {
            if (!contacts[val]) contacts[val] = [];
            contacts[val].push(idx);
          }

          treeData.splice(i, 1);
          i--;
        } else {
          if (obj.children !== undefined) {
            if (obj.children.length > 0) {
              this.handleTreeData(
                obj.children,
                contacts,
                val ? val + this.$settings.VARIABLE.link_cascade + label : label
              );
            }

            if (obj.children.length === 0) delete obj.children;
          }
        }
      }

      return contacts;
    },
    saveData() {
      let treeData = this.$utils.deepCopy(this.treeData);
      let contacts = this.handleTreeData(treeData);

      this.$request({
        url: this.$route.path,
        method: "POST",
        params: this.params,
        data: Object.assign({
          enums: JSON.stringify(treeData),
          contacts: JSON.stringify(contacts),
        }),
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
    allowDrop(_: any, dropNode: any, type: "prev" | "inner" | "next") {
      return !(type === "inner" && dropNode.data.id);
    },
    filterNode(value: string, data: any) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    edit(_: any, data: any) {
      if (!data.value) return false;

      this.label = data.label;
      data.label = null;

      this.$nextTick(() => (this.$refs as any)?.structureInput.focus());
    },
    save(_: any, data: any) {
      data.value = this.label;
      data.label = this.label;
    },
    append(_: any, data: any) {
      if (!data.children) data.children = [];

      const ts = new Date().getTime() + "";
      data.children.push({
        value: ts,
        label: ts,
      });
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
.aioa-dc-tool-structure .el-tree {
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

    .user {
      color: blue;
    }
  }
}
</style>
