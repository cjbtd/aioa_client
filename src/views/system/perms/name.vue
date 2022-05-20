<template>
  <div class="aioa-perms-name">
    <el-input v-model="name" clearable :placeholder="$utils._T('_T0065')" />
    <el-button icon="grid" :disabled="!name" @click="addRole()">
      {{ $utils._T("_T0066") }}
    </el-button>
    <el-button icon="user" :disabled="!name" @click="addUser()">
      {{ $utils._T("_T0067") }}
    </el-button>
    <el-divider></el-divider>
    <el-scrollbar>
      <el-button
        v-for="item in names"
        :key="(item.name || item.user || '') + item.id"
        :type="item.user === nameU || idR === item.id ? 'primary' : ''"
        :icon="item.name ? 'grid' : 'user'"
        v-show="!name || (item.name || item.user || '').indexOf(name) >= 0"
        @click="change(item)"
      >
        {{ item.name || item.user }}
      </el-button>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["names", "nameU", "idR", "idMs", "idP"],
  data() {
    return {
      name: "",
    };
  },
  methods: {
    addRole() {
      const params = {
        isAdd: true,
        nameR: this.name,
      };

      this.$emit("handleData", params, null);
    },
    addUser() {
      if (this.idMs.length === 0) return this.$utils.showAlert("_T0069");

      const params = {
        isAdd: true,
        nameU: this.name,
      };

      const data = {
        idMs: this.idMs.slice(0, 1),
      };

      this.$emit("handleData", params, data);
    },
    change(item: any) {
      let idR = item.name ? item.id : null;
      let nameU = item.name ? null : item.user;

      if ((nameU && this.nameU === nameU) || (idR && this.idR === idR)) {
        this.$emit("update:idMs", []);
        this.$emit("update:idP", null);
      }

      this.$emit("update:idR", idR);
      this.$emit("update:nameU", nameU);

      const params = {
        isGet: true,
        idR,
        nameU,
      };

      this.$emit("handleData", params, null);
    },
  },
});
</script>

<style lang="scss">
.aioa-perms-name {
  & > .el-button {
    margin: 10px 10px 0 0;
  }

  .el-scrollbar__view {
    & > .el-button {
      display: flex;
      justify-content: start;
      width: 100%;
      color: #000;
      padding: 8px;
      margin: 0 0 5px 0;
    }

    & > .el-button.el-button--primary {
      color: #fff;
    }
  }
}
</style>
