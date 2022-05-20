<template>
  <el-input clearable v-model="val" @change="change"></el-input>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["params", "item", "isRest"],
  data() {
    return {
      val: this.item.val || null,
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
