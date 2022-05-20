<template>
  <el-input
    type="textarea"
    v-model="val"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :style="fOpt.style || 'width:60vw;'"
    :autosize="{ minRows: 3, maxRows: 9 }"
    @change="change"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    return {
      val: null,
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
      this.val = this.fOpt.val;
    },
    change() {
      this.fOpt.val = this.val || null;
    },
  },
});
</script>
