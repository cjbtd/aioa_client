<template>
  <div class="aioa-perms-module">
    <el-input v-model="name" clearable :placeholder="$utils._T('_T0071')" />
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="1" :border="true">
        {{ $utils._T("_T0074") }}
      </el-checkbox>
      <el-checkbox label="0" :border="true">
        {{ $utils._T("_T0075") }}
      </el-checkbox>
    </el-checkbox-group>
    <el-divider @click="checkAll()"> {{ $utils._T("_T0076") }} </el-divider>
    <el-scrollbar>
      <el-tag
        v-for="item in module_list"
        :key="item[1] + ':' + item[2]"
        :effect="idMs.indexOf(item[0]) >= 0 ? 'dark' : 'plain'"
        :type="perms[item[0]] !== undefined ? 'success' : ''"
        size="large"
        @click="change(item)"
        @contextmenu.prevent="change(item, true)"
      >
        {{ item[1] + " > " + item[2] }}
      </el-tag>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: [
    "modules",
    "configs",
    "perms",
    "idMs",
    "idP",
    "fullConf",
    "permConf",
    "newConf",
  ],
  data() {
    return {
      name: "",
      checkList: [],
    };
  },
  computed: {
    module_list() {
      return this.modules.filter(
        (item: any) =>
          (!this.name ||
            item[1].indexOf(this.name) >= 0 ||
            item[2].indexOf(this.name) >= 0) &&
          (this.checkList.length !== 1 ||
            (this.perms[item[0]] !== undefined) ===
              !!parseInt(this.checkList[0]))
      );
    },
  },
  methods: {
    checkAll() {
      let idMs =
        this.idMs.length === this.module_list.length
          ? []
          : this.module_list.map((item: any) => item[0]);

      this.$emit("update:idMs", idMs);
    },
    change(item: any, isGetConf = false) {
      let index = this.idMs.indexOf(item[0]);

      if (index === -1) {
        this.idMs.push(item[0]);
      } else {
        this.idMs.splice(index, 1);
      }

      this.$emit("update:fullConf", null);
      this.$emit("update:permConf", null);
      this.$emit("update:newConf", {});

      if (!this.idMs.length) return false;

      let idM = this.idMs[this.idMs.length - 1];
      let idP = this.perms[idM] || null;

      this.$emit("update:idP", idP);

      if (!isGetConf) return;

      let permConf = JSON.parse(
        this.configs.find((item: any) => item.id === idP)?.conf || null
      );

      this.$emit("update:permConf", permConf);

      let ids = this.modules.find((item: any) => item[0] === idM).slice(3);

      this.$request({
        url: "/system/permsquery",
        params: { ids },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          let fullconf = {};

          this.$utils.mergeObjs(fullconf, data, data.self || {});

          if (JSON.stringify(fullconf) !== "{}") {
            this.$emit("update:fullConf", fullconf);
          }
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-perms-module {
  .el-checkbox {
    margin: 10px 10px 0 0;
  }

  .el-divider {
    cursor: pointer;
    user-select: none;

    .el-divider__text {
      color: #409eff;
    }
  }

  .el-scrollbar__view {
    & > .el-tag {
      cursor: pointer;
      display: flex;
      justify-content: start;
      margin: 0 0 5px 0;
    }
  }
}
</style>
