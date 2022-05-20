<template>
  <aioa-dialog v-if="dialog.visible" :opts="dialog">
    <component :is="component" />
  </aioa-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import SettingMail from "./mail.vue";
import SettingDataflow from "./dataflow.vue";

export default defineComponent({
  components: { AioaDialog, SettingMail, SettingDataflow },
  data() {
    return {
      component: "",
      dialog: {
        visible: false,
        title: "",
        class: "aioa-dialog-fit-form",
      },
    };
  },
  watch: {
    "$store.state.confName"(val) {
      if (val) {
        const prefix = "setting-";
        this.component =
          prefix + val.split(this.$settings.VARIABLE.link_name)[0];

        this.dialog.title = this.$utils._T(this.component);
        this.dialog.visible = true;
      } else {
        this.dialog.visible = false;
      }
    },
    "dialog.visible"(val) {
      if (val === false) {
        this.$store.state.confName = "";
      }
    },
  },
});
</script>
