<template>
  <div @click="dialog.visible = true">
    <el-badge type="primary" :value="total">
      <el-icon><message /></el-icon>
    </el-badge>
    <aioa-dialog v-if="dialog.visible" :opts="dialog"><aioa-mail /> </aioa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import AioaMail from "~/components/mail/index.vue";

export default defineComponent({
  components: { AioaDialog, AioaMail },
  data() {
    return {
      dialog: {
        visible: false,
        title: this.$utils._T("_T0046"),
        width: "800px",
      },
    };
  },
  computed: {
    total() {
      return this.$store.state.total;
    },
  },
  mounted() {
    this.$request({
      url: "/chat/usermail",
      params: { _type: "total" },
    }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.$store.commit("SET_TOTAL", data);
      }
    });
  },
});
</script>
