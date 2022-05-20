<template>
  <div class="wrapper">
    <nav-bar />
    <side-bar />
    <div v-if="isReady" id="content">
      <el-scrollbar>
        <router-view #default="{ Component }">
          <keep-alive :include="caches">
            <component :key="key" :is="Component" />
          </keep-alive>
        </router-view>
      </el-scrollbar>
    </div>
    <mail-content v-if="dialog.visible" :dialog="dialog" :pk="pk" />
    <aioa-setting />
    <calc-area />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MESSAGE from "~/utils/message";
import socket from "~/utils/websocket";
import NavBar from "./navbar/index.vue";
import SideBar from "./sidebar/index.vue";
import CalcArea from "./calcarea/index.vue";
import MailContent from "~/components/mail/content.vue";
import AioaSetting from "~/components/setting/index.vue";

export default defineComponent({
  components: { NavBar, SideBar, CalcArea, MailContent, AioaSetting },
  data() {
    return {
      pk: 0,
      dialog: {
        title: "",
        visible: false,
        class: "aioa-dialog-fit-form",
      },
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
    caches() {
      return this.$store.state.caches;
    },
    isReady() {
      return (
        ["/", "/home"].indexOf(this.$route.path) >= 0 ||
        !!this.$store.state.metas[this.$route.path]
      );
    },
  },
  beforeCreate() {
    const merge = this.$utils.mergeObjs;

    this.$request({
      url: "/base/userconfs",
    }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        const { confs, message, textmap } = data;

        merge(MESSAGE, message);
        merge(this.$settings.TEXT_MAP, textmap);

        let userconf = {};
        confs.map((conf: string) => merge(userconf, JSON.parse(conf)));

        this.$store.commit("SET_CONFS", userconf);
      }
    });
  },
  mounted() {
    socket.handleFuncs.handleMail = this.handleMail;
    socket.heartbeat();
  },
  unmounted() {
    socket.reset();
  },
  methods: {
    handleMail(body: any) {
      let userMails = body.usermails;
      if (userMails !== undefined) {
        let i = 0;
        for (let mail of userMails) {
          const notify = this.$notify({
            type: "info",
            offset: 100 * i++ + 60,
            duration: 0,
            title: this.$utils._T("_T0061\f{0}".format(mail.by)),
            customClass: "aioa-notify",
            message: mail.title,
            onClick: () => {
              this.pk = mail.id;
              this.dialog.title = mail.title;
              this.dialog.visible = true;
              notify.close();
            },
          });
        }
      }
    },
  },
});
</script>

<style lang="scss">
#content {
  height: calc(100% - #{$navbar-height});
}
.aioa-notify {
  cursor: pointer;
  word-break: break-all;

  .el-notification__content:hover {
    color: blue !important;
  }
}
</style>
