<template>
  <aioa-layouts v-if="layout" :layout="layout" />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AioaLayouts from "~/components/layouts/index.vue";

export default defineComponent({
  components: { AioaLayouts },
  props: ["DC_KEY", "relation", "result"],
  data() {
    let layout: any = null;

    return {
      layout,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  mounted() {
    let layout = this.DC.layouts[this.relation];
    if (layout) {
      let data = [this.DC.selection[0]];
      let subData = [this.result];

      layout.datasets = { data, subData };
      this.layout = layout;
    }
  },
});
</script>
