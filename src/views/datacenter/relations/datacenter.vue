<template>
  <data-center v-if="path" :path="path" :query="query" :isSub="true" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "relation", "result"],
  data() {
    let query: Record<string, any> = {};
    return {
      path: "",
      query,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  created() {
    let kwargs = this.$utils.deepCopy(this.DC.relations[this.relation].kwargs);

    if (this.$store.state.metas[kwargs.path]) {
      let row = this.DC.selection[0];

      this.query = kwargs.query || {};
      for (let [key, val] of Object.entries(this.query)) {
        if (row[val] !== undefined) {
          let fill = kwargs.fill || "{0},";
          this.query[key] = fill.format(row[val]);
        }
      }

      let data: Record<string, string> | undefined = kwargs.data;
      if (data) {
        for (let [key, val] of Object.entries(data)) {
          if (row[val] !== undefined) data[key] = row[val];
        }

        this.query._fk_row_data = data;
      }

      this.path = kwargs.path;
    }
  },
});
</script>
