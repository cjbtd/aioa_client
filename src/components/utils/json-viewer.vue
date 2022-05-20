<template>
  <div>
    <el-form :inline="true">
      <el-form-item :label="$utils._T('_T0072')">
        <el-input-number :min="1" v-model="deep" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="showRaw">{{ $utils._T("_T0073") }}</el-checkbox>
      </el-form-item>
    </el-form>
    <el-scrollbar style="height: 600px">
      <vue-json-pretty
        v-if="!showRaw"
        :key="deep + ''"
        :data="jsonString"
        :deep="deep"
        showLength
      />
      <pre
        v-show="showRaw"
        style="
          font-family: 'courier new';
          word-break: break-word;
          white-space: pre-wrap;
        "
        >{{ JSON.stringify(jsonString, null, 2) }}</pre
      >
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

defineProps(["jsonString"]);

let deep = ref(1);
let showRaw = ref(false);
</script>
