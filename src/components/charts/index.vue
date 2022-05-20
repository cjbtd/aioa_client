<template>
  <el-tabs v-model="option" class="aioa-charts">
    <el-tab-pane
      v-for="{ label, value } in charts.types"
      :key="value"
      :label="$utils._T(label)"
      :name="value"
    >
      <aioa-chart
        v-if="charts.results[value]"
        :init="charts.inits?.[value] || charts.inits?.default"
        :option="charts.options[value] || charts.options.default"
        :configs="charts.datasets[value]"
        :dataset="charts.results[value]"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import AioaChart from "./chart.vue";

interface Type {
  label: string | Array<string>;
  value: string;
}

interface Charts {
  types: Array<Type>;
  inits?: Record<string, any>;
  options: Record<string, any>;
  datasets: Record<string, Array<any>>;
  results: Record<string, Array<any>>;
}

const props = defineProps({
  charts: {
    type: Object as PropType<Charts>,
    required: true,
  },
});

let option = props.charts.types[0].value;
</script>

<style lang="scss">
.aioa-chatrs {
  min-width: 1200px;
  min-height: 800px;
}
</style>
