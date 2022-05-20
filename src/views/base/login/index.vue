<template>
  <div class="wrapper aioa-login">
    <el-form>
      <el-form-item>
        <img
          src="/src/assets/slogan.png"
          style="width: 100%"
          @click="$utils.changeLang()"
          :title="$utils._T('SwitchLang')"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="username"
          clearable
          size="large"
          :placeholder="$utils._T('account')"
          prefix-icon="user"
          @keyup.enter="login()"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="password"
          clearable
          size="large"
          show-password
          :placeholder="$utils._T('password')"
          prefix-icon="lock"
          @keyup.enter="login()"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn" @click="login()">{{ $utils._T("login") }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      username: "admin",
      password: "123456",
    };
  },
  mounted() {
    this.$request({ url: this.$settings.URL.login });
  },
  methods: {
    login() {
      if (!this.username || !this.password) return false;

      this.$request({
        url: this.$settings.URL.login,
        method: "POST",
        data: { username: this.username, password: this.password },
      }).then((res) => {
        let { status } = res.data;

        if (status === this.$settings.STATUS.ok) {
          let redirect = this.$route.query?.redirect?.toString() || "/";
          this.$router.push({ path: redirect });
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-login {
  background: #333;

  & > form {
    width: 318px;
    margin: 11% auto;
    border-radius: 5px;
    box-shadow: -15px 15px 15px rgb(6 17 47 / 70%);
    height: 300px;
    padding: 90px 40px 40px 40px;
    background: linear-gradient(
      230deg,
      rgba(53, 57, 74, 0) 0%,
      rgb(0, 0, 0) 100%
    );

    &:first-child {
      cursor: pointer;
    }

    & .btn {
      border: 1px solid #4fa1d9;
      color: #4fa1d9;
      width: 100%;
      text-align: center;
      padding: 5px;
      border-radius: 5px;
      background: #222;

      &:hover {
        color: gold;
      }
    }
  }
}
</style>
