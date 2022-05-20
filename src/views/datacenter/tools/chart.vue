<template>
  <aioa-charts v-if="charts" :charts="charts" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaCharts from "~/components/charts/index.vue";

export default defineComponent({
  components: { AioaCharts },
  props: ["DC_KEY", "kwargs", "params", "dialog"],
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
    this.$request({
      url: this.DC.path,
      params: Object.assign(this.params),
    }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        let charts = this.DC.charts[this.kwargs.chart];
        charts.results = data;
        this.charts = charts;
      }
    });
  },
});
</script>
