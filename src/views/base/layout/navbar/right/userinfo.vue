<template>
  <div>
    <div @click="getInfo()">
      {{ $utils.getUserName() }}
    </div>
    <oa-dialog v-if="dialog.visible" :opts="dialog">
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
    </oa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OaDialog from "~/components/dialog/index.vue";

interface Role {
  id: number;
  name: string;
}

export default defineComponent({
  components: { OaDialog },
  data() {
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
      dialog: {
        visible: false,
        title: this.$utils._T("_T0045"),
        width: "400px",
      },
    };
  },
  computed: {
    roles() {
      return this.$store.state.roles;
    },
  },
  mounted() {
    this.$request({ url: "/base/userroles" }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.$store.commit("SET_ROLES", data);

        if (data.length > 0) {
          const key_rid = this.$settings.COOKIE_KEYS.rid;
          let rid = parseInt(localStorage.getItem(key_rid) + "");
          this.$store.commit("SET_ROLE_ID", isNaN(rid) ? data[0].id : rid);
        }
      }
    });
  },
  methods: {
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
