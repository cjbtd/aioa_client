<template>
  <el-time-picker
    clearable
    is-range
    v-model="val"
    :value-format="fmt"
    @change="changeVal"
  ></el-time-picker>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["params", "item", "isRest"],
  data() {
    return {
      val: this.item.val,
      fmt: this.$settings.FMT.time,
    };
  },
  methods: {
    changeVal() {
      this.params[this.item.name] = this.val;
    },
  },
  watch: {
    isRest() {
      this.val = null;
      this.changeVal();
    },
    params() {
      this.val = this.params[this.item.name];
    },
  },
});
</script>
