<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="DC.total"
      :page-size="DC.size"
      :page-sizes="DC.sizes"
      :current-page="DC.currentpage"
      :hide-on-single-page="DC.size === 10"
    />
    <div v-if="tips" style="color: red">{{ tips }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tips: "",
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  methods: {
    handleSizeChange(val: number) {
      this.DC.params.size = val;
      this.DC.params.currentpage = 1;

      this.$store.dispatch("GET_DATA", {
        key: this.DC_KEY,
        params: this.DC.params,
      });
    },
    handleCurrentChange(val: number) {
      this.tips = "";

      if (this.DC.views && this.DC.size * val > this.DC.views) {
        this.tips = this.$utils._T("_T0109\f{0}".format(this.DC.views));
      } else {
        this.DC.params.currentpage = val;

        this.$store.dispatch("GET_DATA", {
          key: this.DC_KEY,
          params: this.DC.params,
        });
      }
    },
  },
});
</script>
