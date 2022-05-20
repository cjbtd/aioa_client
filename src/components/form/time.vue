<template>
  <el-time-picker
    clearable
    v-model="val"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :format="fmt"
    @change="change"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    return {
      val: "",
      fmt: this.$settings.FMT.time,
    };
  },
  watch: {
    isRest() {
      this.fOpt.val = null;
    },
    "fOpt.val"() {
      this.initVal();
    },
  },
  created() {
    this.initVal();
  },
  methods: {
    initVal() {
      this.val = this.fOpt.val ? "1900-01-01 " + this.fOpt.val : "";
    },
    change() {
      this.fOpt.val = this.val ? this.val.format(this.fmt) : null;
    },
  },
});
</script>
