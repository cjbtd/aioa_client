<template>
  <div class="aioa-header-left">
    <aioa-logo />
    <aioa-name />
  </div>
</template>

<script setup lang="ts">
import AioaLogo from "./logo.vue";
import AioaName from "./name.vue";
</script>

<style lang="scss">
.aioa-header-left {
  float: left;
  width: $header-left-width;
  height: 100%;
}
</style>
