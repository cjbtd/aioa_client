<template>
  <div v-drag:[CLASSNAME]="'el-dialog__header'">
    <el-dialog
      v-model="opts.visible"
      :top="opts.top || '50px'"
      :width="opts.width || '50%'"
      :title="opts.title + '&nbsp;'"
      :custom-class="CLASSNAME + ' ' + (opts.class || '')"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="opts.visible = false"
    >
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

interface Opts {
  visible: boolean;
  top?: string;
  width?: string | number;
  title?: string;
  class?: string;
}

defineProps({
  opts: {
    type: Object as PropType<Opts>,
    required: true,
  },
});

const CLASSNAME = "aioa-dialog-" + new Date().getTime();
</script>
