<template>
  <div>
    <div style="text-align: center">
      <el-button icon="zoom-in" @click="zoomSize += 0.1" />
      <el-button v-if="layout.showPrint" v-print:[id] @click="record(true)">
        {{ $utils._T("print") }}
      </el-button>
      <el-button icon="zoom-out" @click="zoomSize -= 0.1" />
    </div>
    <div :style="{ zoom: zoomSize }">
      <div :id="id" class="aioa-layout">
        <template v-for="(row, index) in layout.datasets.data">
          <aioa-layout
            :layout="layout"
            :row="row"
            :subRows="layout.datasets.subData[index]"
          />
          <div
            v-if="
              layout.a4n &&
              index + 1 !== layout.datasets.data.length &&
              (index + 1) % layout.a4n === 0
            "
            style="page-break-after: always"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/styles/print.css";
import { PropType, onMounted, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { deepCopy } from "~/utils";
import { getTxtMd5 } from "~/utils/md5";
import watermark from "~/utils/watermark";
import request from "~/utils/request";
import AioaLayout from "./layout.vue";

interface Layout {
  title?: string;
  a4n: number;
  showPrint: boolean;
  enableSelf: boolean;
  watermark: string | Record<string, any>;
  tableStyle: string;
  tableClass: string;
  colWidths: Array<number>;
  trs: Array<Record<string, any>>;
  datasets: {
    data: Array<Record<string, any>>;
    subData: Array<Record<string, any>>;
  };
}

const props = defineProps({
  layout: {
    type: Object as PropType<Layout>,
    required: true,
  },
});

const id = "aioa-layout-" + new Date().getTime();
const table = deepCopy(props.layout.datasets.data);

let zoomSize = ref(1);

if (props.layout.showPrint) record(false);

if (props.layout.enableSelf) {
  props.layout.datasets.data = [table[0]];
  props.layout.datasets.subData = [{ self: table }];
}

onMounted(() => {
  nextTick(() => watermark(props.layout.watermark, id));
});

function record(save: boolean) {
  const md5s = table.map((row: any) => getTxtMd5(JSON.stringify(row)));

  request({
    url: "/base/printed",
    method: "POST",
    data: { save, md5s },
  }).then((res) => {
    let { data } = res.data;

    if (data) {
      const printed = data.map((index: number) => table[index].id);

      if (!!printed.length) {
        ElMessage({
          message: `${props.layout.title || ""} 以下ID已打印：${printed}`,
          type: "warning",
          duration: 10000,
          offset: 60,
        });
      }
    }
  });
}
</script>
