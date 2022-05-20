<template>
  <el-date-picker
    type="datetime"
    clearable
    v-model="val"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :value-format="fmt"
    @change="change"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    return {
      val: undefined,
      fmt: this.$settings.FMT.datetime,
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
      let val = this.fOpt.val;
      this.val = val ? this.$filters.format_dt(val, this.fmt) : undefined;
    },
    change() {
      this.fOpt.val = this.val || null;
    },
  },
});
</script>
