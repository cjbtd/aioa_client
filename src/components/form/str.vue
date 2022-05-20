<template>
  <el-input
    clearable
    v-model="val"
    autocomplete="on"
    :name="fKey"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :style="fOpt.style"
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

      val = typeof val === "boolean" ? (val ? 1 : 0) : val;
      val = typeof val === "number" ? val + "" : val;

      this.val = val;
    },
    change() {
      this.fOpt.val = this.val || null;
    },
  },
});
</script>
