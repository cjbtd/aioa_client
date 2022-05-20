<template>
  <div class="aioa-perms-query">
    <el-form :inline="true">
      <el-form-item>
        <el-input
          clearable
          v-model="user"
          :placeholder="$utils._T('_T0070')"
          @keyup.enter="search()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          v-model="name"
          :placeholder="$utils._T('_T0071')"
          @keyup.enter="search()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">
          {{ $utils._T("_T0062") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar>
      <span
        v-for="item in modules"
        :key="item[0] + item[6] + item[9]"
        @click="showConf(item)"
      >
        {{ item[0] + " > " + item[6] + " > " + item[9] }}
      </span>
    </el-scrollbar>
    <aioa-dialog v-if="dialog.visible" :opts="dialog">
      <json-viewer :jsonString="conf" />
    </aioa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import JsonViewer from "~/components/utils/json-viewer.vue";

export default defineComponent({
  components: { AioaDialog, JsonViewer },
  data() {
    return {
      user: null,
      name: null,
      modules: [],
      conf: null,
      dialog: {
        title: "",
        visible: false,
      },
    };
  },
  methods: {
    search() {
      this.$request({
        url: "/system/permsquery",
        params: { user: this.user, name: this.name },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.modules = data;
        }
      });
    },
    showConf(item: any) {
      this.$request({
        url: "/system/permsquery",
        params: { ids: item.slice(11) },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.dialog.visible = true;
          this.dialog.title = item[0] + " > " + item[6] + " > " + item[9];
          this.conf = data;
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-perms-query {
  .el-scrollbar {
    height: 70vh;

    .el-scrollbar__wrap {
      overflow-x: hidden;

      span {
        cursor: pointer;
        display: block;
        padding: 5px;
        margin: 0 5px 5px 0;
        border: 1px solid #b3d8ff;
        border-radius: 5px;
      }
    }
  }
}
</style>
