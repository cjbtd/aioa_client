<template>
  <el-form class="aioa-broadcast">
    <el-form-item>
      <el-input type="textarea" v-model="msg" :rows="3"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="send"
        :disabled="users.length === 0 || !msg"
      >
        {{ $utils._T("send") }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        {{ $utils._T("_T0064") }}
      </el-checkbox>
      <el-checkbox-group v-model="users" @change="handleChange">
        <el-checkbox
          v-for="item in list"
          :key="item.username"
          :label="item.username"
          :border="true"
        >
          {{ item.username }} ({{ item.full_name }})
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["dialog", "list", "username"],
  data() {
    return {
      msg: "",
      users: [""],
      checkAll: false,
      isIndeterminate: false,
    };
  },
  created() {
    this.users = this.username ? [this.username] : [];
    this.handleChange();
  },
  methods: {
    send() {
      this.$request({
        url: this.$route.path,
        method: "POST",
        data: { users: this.users, msg: this.msg },
      }).then((res) => {
        let { status } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.dialog.visible = false;
        }
      });
    },
    handleCheckAllChange() {
      this.users = this.checkAll
        ? this.list.map((item: any) => item.username)
        : [];
      this.isIndeterminate = false;
    },
    handleChange() {
      this.checkAll = this.list.length === this.users.length;
      this.isIndeterminate = !this.checkAll && this.users.length > 0;
    },
  },
});
</script>

<style lang="scss">
.aioa-broadcast {
  .el-checkbox-group {
    width: 100%;
  }

  .el-checkbox {
    margin: 0 10px 10px 0 !important;
    width: 168px;
    padding: 5px;
    height: auto;
  }
}
</style>
