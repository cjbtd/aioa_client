<template>
  <div :id="id"></div>
</template>

<script setup lang="ts">
import { PropType, onMounted } from "vue";
import * as echarts from "echarts";
import { deepCopy, saveValByPath, uuid } from "~/utils";

interface Config {
  path: string;
  funcs?: Array<{
    func: "buildMap" | "splitData";
    args?: Array<any>;
  }>;
}

const props = defineProps({
  init: {
    type: Object as PropType<Record<string, any>>,
  },
  option: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  configs: {
    type: Object as PropType<Array<Config>>,
    required: true,
  },
  dataset: {
    type: Object as PropType<Array<any>>,
    required: true,
  },
});

const id = "aioa-charts-" + uuid();
const option: Record<string, any> = deepCopy(props.option);

const handlers = {
  formatter(params: any) {
    let [x, y, v] = params.value;
    return "{0} - {1} <br/> {2}".format(
      option.xAxis.data[x],
      option.yAxis.data[y],
      v
    );
  },
  buildMap(data: Array<any>) {
    option.tooltip.formatter = this.formatter;

    let xData = [];
    let yData = [];
    let vData = [];

    for (let i = 0, len = data[0].length; i < len; i++) {
      let [x, y, v] = data[0][i];

      if (xData.indexOf(x) === -1) xData.push(x);
      if (yData.indexOf(y) === -1) yData.push(y);

      let xIndex = xData.findIndex((item) => item === x);
      let yIndex = yData.findIndex((item) => item === y);

      vData.push([xIndex, yIndex, v]);
    }

    return [xData, yData, vData];
  },
  splitData(data: Array<any>) {
    let res = [];
    let dims = ["_|_"];
    let series = [];

    for (let i = 0, len = data[0].length; i < len; i++) {
      let [x, t, y] = data[0][i];

      if (dims.indexOf(t) === -1) dims.push(t);

      let colIndex = dims.findIndex((item) => item === t);
      let rowIndex = res.findIndex((item) => item[0] === x);

      if (rowIndex === -1) {
        rowIndex = res.length;
        res.push([x]);
      }

      res[rowIndex][colIndex] = y;
    }

    for (let i = 0, len = res.length; i < len; i++) {
      series.push(deepCopy(option.series[0]));
    }

    option.series = series;

    res.unshift(dims);
    data[0] = res;
    return data;
  },
};

onMounted(() => {
  for (let i = 0, len = props.configs.length; i < len; i++) {
    let paths = props.configs[i].path.split(";");
    let funcs = props.configs[i].funcs || [];

    let data = [props.dataset[i]];

    for (let { func, args } of funcs) {
      if (args === undefined) args = [];
      // @ts-ignore
      data = handlers[func](data, ...args);
    }

    for (let j = 0; j < paths.length; j++) {
      let path = paths[j];
      saveValByPath(option, path, data[j]);
    }
  }

  const dom = document.getElementById(id);
  if (dom) {
    const opts = props.init || { width: 1200, height: 600 };
    echarts.init(dom, undefined, opts).setOption(option);
  }
});
</script>
