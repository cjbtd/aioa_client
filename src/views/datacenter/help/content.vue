<template>
  <el-popover placement="left" trigger="hover" width="fit-content">
    <template #reference>
      <div>{{ label }}</div>
    </template>
    <div class="aioa-dc-help-html" v-html="content"></div>
  </el-popover>
</template>

<script setup lang="ts">
defineProps(["label", "content"]);
</script>

<style lang="scss">
.aioa-dc-help-html {
  overflow: auto;
  max-width: 75vw;
  max-height: 70vh;
  margin-top: 30px;
}
</style>
