<template>
  <div v-show="visible" v-drag class="aioa-calc-area">
    <span>{{ list }}</span>
    <p>{{ $utils._T("_T0142") }}{{ sumVal }}</p>
    <p>{{ $utils._T("_T0143") }}{{ avgVal }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      list: "",
      sumVal: 0,
      avgVal: 0,
      visible: false,
    };
  },
  watch: {
    "$store.state.cells": {
      handler(cells, oldCells) {
        if (cells && cells.length > 0) {
          let sumVal = 0;
          let list = "";

          cells.map((cell: HTMLElement) => {
            cell.classList.add("aioa-calc-selected");

            let val = parseFloat(cell.innerText);

            list += val + " + ";
            sumVal += val;
          });
          oldCells.map((cell: HTMLElement) => {
            if (cells.indexOf(cell) === -1) {
              cell.classList.remove("aioa-calc-selected");
            }
          });

          this.list = list;
          this.sumVal = sumVal;
          this.avgVal = (sumVal / cells.length) * 1.0;
          this.visible = true;
        } else {
          oldCells.map((cell: HTMLElement) => {
            cell.classList.remove("aioa-calc-selected");
          });

          this.visible = false;
        }
      },
      deep: true,
    },
  },
});
</script>
<style lang="scss">
.aioa-calc-selected {
  .cell {
    cursor: pointer;
    color: white !important;
    background-color: black !important;
  }
}

.aioa-calc-area {
  position: fixed;
  z-index: 99999;
  top: 42px;
  left: 25%;
  padding: 5px;
  border-radius: 4px;
  background-color: black;

  span,
  p {
    color: gold;
  }
}
</style>
