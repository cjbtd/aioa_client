<template>
  <div>
    <el-popover
      trigger="hover"
      width="fit-content"
      popper-class="aioa-user-role"
    >
      <el-radio-group v-model="rid" @change="change()">
        <el-radio v-for="item in roles" :key="item.name" :label="item.id">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
      <template #reference>
        <div @click="getInfo()">
          {{ $utils.getUserName() }}
        </div>
      </template>
    </el-popover>
    <aioa-dialog v-if="dialog.visible" :opts="dialog">
      <el-form label-position="left" label-width="88px">
        <el-form-item :label="$utils._T('_T0038')">
          <el-input
            size="large"
            disabled
            :model-value="form.full_name"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$utils._T('_T0039')">
          <el-input size="large" clearable v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item :label="$utils._T('_T0040')">
          <el-input size="large" clearable v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item :label="$utils._T('_T0041')">
          <el-input size="large" clearable v-model="form.mp"></el-input>
        </el-form-item>
        <el-form-item :label="$utils._T('_T0042')">
          <el-input size="large" show-password v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item :label="$utils._T('_T0043')">
          <el-input size="large" disabled :model-value="form.ips"></el-input>
        </el-form-item>
        <el-form-item :label="$utils._T('_T0044')">
          <el-input
            size="large"
            disabled
            :model-value="form.last_login"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="primary" @click="saveInfo()">
          {{ $utils._T("save") }}
        </el-button>
      </div>
    </aioa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";

interface Role {
  id: number;
  name: string;
}

export default defineComponent({
  components: { AioaDialog },
  data() {
    let roles: Array<Role> = [];

    return {
      form: {
        full_name: "",
        email: "",
        tel: "",
        mp: "",
        pwd: "",
        ips: "",
        last_login: "",
      },
      rid: 0,
      roles,
      dialog: {
        visible: false,
        title: this.$utils._T("_T0045"),
        width: "400px",
      },
    };
  },
  mounted() {
    this.$request({ url: "/base/userroles" }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.roles = data;

        if (!!data.length) this.rid = data[0].id;
        this.change();
      }
    });
  },
  methods: {
    change() {
      let name = "";
      for (let item of this.roles) {
        if (item.id === this.rid) {
          name = item.name;
          break;
        }
      }

      this.$utils.cookie.set(this.$settings.COOKIE_KEYS.rid, this.rid + "");
      this.$store.commit("SET_ROLE_NAME", name);
    },
    getInfo() {
      this.$request({
        url: "/chat/userinfo",
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          Object.assign(this.form, data);
          this.dialog.visible = true;
        }
      });
    },
    saveInfo() {
      this.$request({
        method: "POST",
        url: "/chat/userinfo",
        data: {
          email: this.form.email,
          tel: this.form.tel,
          mp: this.form.mp,
          pwd: this.form.pwd,
        },
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-user-role {
  .el-radio-group {
    display: block;
  }
  .el-radio {
    display: flex;
  }
}
</style>
