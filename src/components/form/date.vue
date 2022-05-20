<template>
  <el-date-picker
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
      fmt: this.$settings.FMT.date,
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
      this.val = this.fOpt.val || undefined;
    },
    change() {
      this.fOpt.val = this.val || null;
    },
  },
});
</script>
