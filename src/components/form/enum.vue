<template>
  <el-select
    clearable
    filterable
    v-model="val"
    :multiple="limit !== 1"
    :multiple-limit="limit"
    :allow-create="fOpt.create === true"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :style="fOpt.style"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item.label"
      :label="item.label"
      :value="item.value"
      :disabled="!!item.disabled"
    />
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    return {
      val: [],
      sep: this.$settings.VARIABLE.link_list,
      limit: 0,
    };
  },
  computed: {
    options() {
      let enums = this.fOpt.enums;
      let refKey = this.fOpt.ref;
      let refVal = this.form?.[refKey]?.val;
      return refVal
        ? enums.filter(
            (item: any) => !item.filters || item.filters.indexOf(refVal) >= 0
          )
        : enums;
    },
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
    let limit = this.fOpt.limit;
    this.limit = limit === undefined ? 1 : limit;

    this.initVal();
  },
  methods: {
    initVal() {
      let val = this.fOpt.val;

      this.val =
        this.limit === 1 ? val || undefined : val ? val.split(this.sep) : [];
    },
    change() {
      this.fOpt.val =
        (this.limit === 1 ? this.val : this.val.join(this.sep)) || null;
    },
  },
});
</script>
