<template>
  <el-date-picker
    type="daterange"
    clearable
    v-model="val"
    :value-format="fmt"
    @change="change"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["params", "item", "isRest"],
  data() {
    return {
      val: this.item.val,
      fmt: this.$settings.FMT.date,
    };
  },
  methods: {
    change() {
      this.params[this.item.name] = this.val;
    },
  },
  watch: {
    isRest() {
      this.val = null;
      this.change();
    },
    params() {
      this.val = this.params[this.item.name];
    },
  },
});
</script>
