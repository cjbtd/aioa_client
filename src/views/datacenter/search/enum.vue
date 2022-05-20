<template>
  <el-select
    multiple
    clearable
    filterable
    allow-create
    collapse-tags
    v-model="val"
    @change="change"
  >
    <el-option
      v-for="opt in options"
      :key="opt.value + opt.label"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["params", "item", "isRest"],
  data() {
    return {
      val: typeof this.item.val === "string" ? [this.item.val] : this.item.val,
    };
  },
  computed: {
    options() {
      return this.item.enums;
    },
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
