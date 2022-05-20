<template>
  <div class="aioa-footer">
    <span style="font-size: 15px; font-weight: 600; color: red">
      {{ $utils._T("_T0138\f{0}".format(kwargs.limit || 1000)) }}
    </span>
    <el-button type="primary" @click="format()">
      {{ $utils._T("_T0137") }}
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
    format() {
      this.$request({
        url: this.DC.path,
        params: this.params,
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
