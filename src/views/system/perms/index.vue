<template>
  <el-row class="bs aioa-perms">
    <el-col :span="4">
      <perms-name
        :names="names"
        v-model:nameU="nameU"
        v-model:idR="idR"
        v-model:idMs="idMs"
        v-model:idP="idP"
        @handleData="handleData"
      />
    </el-col>
    <el-col :span="7">
      <perms-module
        :modules="modules"
        :configs="configs"
        :perms="perms"
        v-model:idMs="idMs"
        v-model:idP="idP"
        v-model:fullConf="fullConf"
        v-model:permConf="permConf"
        v-model:newConf="newConf"
      />
    </el-col>
    <el-col :span="4">
      <perms-perm
        :configs="configs"
        v-model:nameU="nameU"
        v-model:idR="idR"
        v-model:idMs="idMs"
        v-model:idP="idP"
        v-model:permConf="permConf"
        v-model:newConf="newConf"
        @handleData="handleData"
      />
    </el-col>
    <el-col :span="9">
      <el-button type="primary" icon="search" @click="dialog.visible = true">
        {{ $utils._T("_T0068") }}
      </el-button>
      <el-button type="primary" icon="refresh" @click="handleData()">
        {{ $utils._T("_T0026") }}
      </el-button>
      <perms-conf
        v-model:idP="idP"
        v-model:fullConf="fullConf"
        v-model:permConf="permConf"
        v-model:newConf="newConf"
        @handleData="handleData"
      />
    </el-col>
  </el-row>
  <aioa-dialog v-if="dialog.visible" :opts="dialog">
    <perm-query />
  </aioa-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import PermQuery from "./query.vue";
import PermsName from "./name.vue";
import PermsModule from "./module.vue";
import PermsPerm from "./perm.vue";
import PermsConf from "./conf.vue";

export default defineComponent({
  name: "perms",
  components: {
    AioaDialog,
    PermQuery,
    PermsName,
    PermsModule,
    PermsPerm,
    PermsConf,
  },
  data() {
    return {
      nameRU: null,
      nameMo: null,
      namePe: null,
      nameU: null,
      idR: null,
      idMs: [],
      idP: null,
      fullConf: null,
      permConf: null,
      newConf: {},
      checkList: [],
      perms: {},
      names: [],
      modules: [],
      configs: [],
      dialog: {
        title: this.$utils._T("_T0068"),
        visible: false,
      },
    };
  },
  created() {
    this.handleData();
  },
  methods: {
    handleData(params = null, data = null) {
      this.$request({
        url: this.$route.path,
        params,
        data,
        method: data === null ? "GET" : "POST",
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          if (data.names) {
            this.names = data.names;
            this.modules = data.modules;
            this.configs = data.configs;

            this.idMs = [];
            this.idP = null;
            this.idR = null;
            this.nameU = null;
            this.perms = {};
            this.fullConf = null;
            this.permConf = null;
            this.newConf = {};
          } else {
            this.perms = data;
          }
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-perms {
  .el-col {
    border-right: 1px solid #dcdfe6;
    padding: 10px;
  }

  .el-col:last-child {
    border-right: none;
  }

  .el-scrollbar {
    height: 75vh;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
