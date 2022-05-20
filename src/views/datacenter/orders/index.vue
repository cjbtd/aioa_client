<template>
  <div v-if="ods.length" class="aioa-dc-orders">
    <el-tag
      v-for="od in ods"
      :key="'o' + od.idx"
      size="large"
      effect="plain"
      type="success"
      closable
      @close="change(od.idx, 'del')"
    >
      <el-button
        type="text"
        :icon="iconMap[od.by]"
        @click="change(od.idx, 'add')"
      >
        {{ DC.columns[DC.d_a_list[od.idx - 1]].label }}
      </el-button>
    </el-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Od } from "~/utils/datacenter";

export default defineComponent({
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    let ods: Array<Od> = [];

    return {
      ods,
      iconMap: {
        desc: "caret-bottom",
        asc: "caret-top",
      },
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    "DC.params.orders": {
      handler: function () {
        this.setOds();
      },
      immediate: true,
    },
    "DC.d_a_list": {
      handler: function () {
        this.setOds();
      },
      immediate: true,
    },
  },
  methods: {
    setOds() {
      this.ods = this.$datacenter.buildOrders(
        this.DC.params.orders,
        this.DC.d_a_list.length
      ).ods;
    },
    change(index: number, method: "add" | "del") {
      const orders = this.$datacenter.buildOrders(
        this.DC.params.orders,
        this.DC.d_a_list.length,
        index,
        method
      ).orders;

      this.DC.params.orders = orders;

      this.$store.dispatch("GET_DATA", {
        key: this.DC_KEY,
        params: this.DC.params,
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-orders {
  .el-tag {
    margin-left: 2px;
  }
}
</style>
