<template>
  <div class="aioa-header-right">
    <el-icon
      size="26px"
      style="transform: rotate(45deg)"
      @click="handleFullScreen"
    >
      <rank />
    </el-icon>
    <router-link to="/datacenter/notice">
      <el-icon size="22px"><bell-filled /></el-icon>
    </router-link>
    <user-mail />
    <user-info />
    <el-icon size="26px" @click="logout"><close-bold /></el-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserInfo from "./userinfo.vue";
import UserMail from "./usermail.vue";

export default defineComponent({
  components: { UserInfo, UserMail },
  data() {
    return {
      fullscreen: false,
    };
  },
  methods: {
    handleFullScreen() {
      this.fullscreen
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();

      this.fullscreen = !this.fullscreen;
    },
    logout() {
      this.$request({ url: "/base/logout" }).then(() =>
        this.$router.push(this.$settings.URL.login)
      );
    },
  },
});
</script>

<style lang="scss">
.aioa-header-right {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 20px !important;
  position: absolute;
  top: 0;
  right: 0;

  & > * {
    margin: 0 8px;
    color: #cccc99 !important;
    &:hover {
      color: gold !important;
    }
  }
}
</style>
