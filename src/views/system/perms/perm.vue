<template>
  <div class="aioa-perms-perm">
    <el-input v-model="name" clearable :placeholder="$utils._T('_T0077')" />
    <el-button icon="tools" @click="addPerm()" :disabled="!name">
      {{ $utils._T("_T0078") }}
    </el-button>
    <el-button icon="check" @click="savePerm()" type="danger">
      {{ $utils._T("_T0079") }}
    </el-button>
    <el-divider></el-divider>
    <el-scrollbar>
      <el-tag
        :key="$utils._T('_T0080')"
        :effect="idP === 0 ? 'dark' : 'plain'"
        @click="change({ id: 0 })"
        size="large"
      >
        {{ $utils._T("_T0080") }}
      </el-tag>
      <el-tag
        v-for="item in configs"
        :key="item.name"
        :effect="idP === item.id ? 'dark' : 'plain'"
        @click="change(item)"
        size="large"
        v-show="!name || item.name.indexOf(name) >= 0"
      >
        {{ item.name }}
      </el-tag>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["configs", "nameU", "idR", "idMs", "idP", "permConf", "newConf"],
  data() {
    return {
      name: "",
    };
  },
  methods: {
    addPerm() {
      const params = {
        isAdd: true,
        nameP: this.name,
      };

      this.$emit("handleData", params, null);
    },
    savePerm() {
      let idMs = this.idMs;
      let idR = this.idR;
      let idP = this.idP;
      let nameU = this.nameU;

      if (!idMs.length || idP === null || !(idR || nameU))
        return this.$utils.showAlert("_T0085");

      const params = {
        isSavePerm: true,
        idR,
        idP,
        nameU,
      };

      const data = {
        idMs,
      };

      this.$emit("handleData", params, data);
    },
    change(item: any) {
      this.$emit("update:idP", item.id);
      this.$emit("update:permConf", JSON.parse(item.conf || null));
      this.$emit("update:newConf", {});
    },
  },
});
</script>

<style lang="scss">
.aioa-perms-perm {
  & > .el-button {
    margin: 10px 10px 0 0;
  }

  .el-scrollbar__view {
    & > .el-tag {
      cursor: pointer;
      display: flex;
      justify-content: start;
      margin: 0 5px 5px 0;
    }
  }
}
</style>
