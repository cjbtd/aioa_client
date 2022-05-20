<template>
  <el-dropdown v-if="DC.t_list.length" @command="handleCommand" trigger="click">
    <el-button type="danger">{{ $utils._T("_T0105") }}</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-scrollbar wrap-class="aioa-scroll-max-height">
          <el-dropdown-item v-for="key in DC.t_list" :key="key" :command="key">
            {{ $utils._T(DC.tools[key].label) }}
          </el-dropdown-item>
        </el-scrollbar>
      </el-dropdown-menu>
    </template>
    <aioa-dialog v-if="dialog.visible" :opts="dialog">
      <component
        :is="component"
        :DC_KEY="DC_KEY"
        :kwargs="kwargs"
        :params="newParams"
        :dialog="dialog"
      />
    </aioa-dialog>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import DtDel from "./del.vue";
import DtSum from "./sum.vue";
import DtCalc from "./calc.vue";
import DtExpd from "./expd.vue";
import DtImpd from "./impd.vue";
import DtEnum from "./enum.vue";
import DtPrint from "./print.vue";
import DtChart from "./chart.vue";
import DtUnique from "./unique.vue";
import DtCorpus from "./corpus.vue";
import DtStructure from "./structure.vue";
import DtAttendance from "./attendance.vue";

export default defineComponent({
  components: {
    AioaDialog,
    DtDel,
    DtSum,
    DtCalc,
    DtExpd,
    DtImpd,
    DtEnum,
    DtPrint,
    DtChart,
    DtUnique,
    DtCorpus,
    DtStructure,
    DtAttendance,
  },
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    let component: string = "";
    let kwargs: any = "";
    let newParams: any = {};

    return {
      component,
      kwargs,
      newParams,
      dialog: {
        visible: false,
        title: "",
        width: "",
      },
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    "DC.cmdInfo": {
      handler: function (val: string | null) {
        if (val) {
          this.openTool(val);
        } else {
          this.dialog.visible = false;
        }
      },
      immediate: true,
    },
    "dialog.visible"(val) {
      if (val === false) {
        this.DC.cmdInfo = null;
      }
    },
  },
  methods: {
    handleCommand(command: string) {
      this.DC.cmdInfo = command;
    },
    openTool(tool: string) {
      this.component = "dt-" + tool;

      this.newParams = this.$utils.deepCopy(this.DC.params);
      this.newParams._init = false;
      this.newParams._tool = tool;

      this.kwargs = this.DC.tools[tool].kwargs;

      this.dialog.title = this.$utils._T(this.DC.tools[tool].label);
      this.dialog.width = this.DC.tools[tool].width || "";
      this.dialog.visible = true;
    },
  },
});
</script>
