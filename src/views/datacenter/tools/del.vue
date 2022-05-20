<template>
  <div class="aioa-footer">
    <el-button type="primary" @click="del()">
      {{ $utils._T("delete") }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "kwargs", "params", "dialog"],
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  methods: {
    del() {
      if (this.DC.selection.length < 1) return this.$utils.showAlert("_T0132");

      let ids = this.DC.selection.map((item) => item[this.DC.key_id]);

      this.$request({
        url: this.DC.path,
        params: Object.assign(this.params, { ids }),
      }).then((res) => {
        let { status } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.dialog.visible = false;

          this.$store.dispatch("GET_DATA", {
            key: this.DC_KEY,
            params: this.DC.params,
          });
        }
      });
    },
  },
});
</script>
