<template>
  <el-cascader
    clearable
    filterable
    v-model="val"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :options="fOpt.enums"
    :props="props"
    @change="change"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    const props: any = {
      expandTrigger: "hover",
    };

    return {
      val: [],
      sep: this.$settings.VARIABLE.link_cascade,
      props,
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
      this.val = val ? val.split(this.sep) : [];
    },
    change() {
      this.fOpt.val = this.val ? this.val.join(this.sep) || null : null;
    },
  },
});
</script>
