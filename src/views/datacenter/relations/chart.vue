<template>
  <aioa-charts v-if="charts" :charts="charts" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaCharts from "~/components/charts/index.vue";

export default defineComponent({
  components: { AioaCharts },
  props: ["DC_KEY", "relation", "result"],
  data() {
    let charts: any = null;
    return {
      charts,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  created() {
    let charts = this.DC.charts[this.relation];
    charts.results = this.result;
    this.charts = charts;
  },
});
</script>
