<template>
  <div class="aioa-dc-tool-calc">
    <el-tag
      v-for="(key, index) in $datacenter.getListByType(DC, DC.d_a_list, 'num')"
      :key="key"
      size="large"
      effect="plain"
    >
      {{ index + ": " + DC.columns[key].label }}
    </el-tag>
    <el-input
      v-model="expression"
      clearable
      style="margin: 10px 0"
      :placeholder="$utils._T('_T0131')"
    >
      <template #prepend>{{ $utils._T("_T0130") }}</template>
    </el-input>
    <div class="aioa-footer">
      <span>{{ $utils._T("_T0129") }}</span>
      <el-input-number
        v-model="precision"
        :min="0"
        :max="10"
        style="margin: 0 10px"
      />
      <el-button type="primary" @click="calc()" :disabled="!expression">
        {{ $utils._T("_T0128") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "kwargs", "params", "dialog"],
  data() {
    return {
      expression: null,
      precision: 0,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  methods: {
    calc() {
      this.$request({
        url: this.DC.path,
        params: Object.assign(this.params, {
          expression: this.expression,
          precision: this.precision,
        }),
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-tool-calc {
  .el-tag {
    margin: 3px 3px 3px 0;
    width: 140px;
    color: #303133;
  }
}
</style>
