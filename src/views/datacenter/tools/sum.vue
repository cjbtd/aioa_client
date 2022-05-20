<template>
  <div class="aioa-dc-too-sum">
    <el-radio
      v-for="key in $datacenter.getListByType(DC, DC.d_a_list, 'num')"
      :key="key"
      :label="key"
      :border="true"
      v-model="name"
    >
      {{ DC.columns[key].label }}
    </el-radio>
    <div style="text-align: right">
      <span>{{ $utils._T("_T0129") }}</span>
      <el-input-number
        v-model="precision"
        :min="0"
        :max="10"
        style="margin: 0 10px"
      ></el-input-number>
      <el-button type="primary" @click="calc()" :disabled="!name">
        {{ $utils._T("_T0128") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "params", "kwargs", "dialog"],
  data() {
    return {
      name: undefined,
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
          key: this.name,
          precision: this.precision,
        }),
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-too-sum .el-radio {
  margin: 10px;
  width: 170px;
}
</style>
