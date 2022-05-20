<template>
  <div class="aioa-header">
    <header-left />
    <el-link
      v-if="$utils.isAdmin()"
      href="/admin/"
      target="_blank"
      style="
        display: inline-block;
        vertical-align: top;
        line-height: 40px;
        margin: 0 10px;
      "
    >
      后台管理
    </el-link>
    <header-center />
    <header-right />
  </div>
</template>

<script setup lang="ts">
import HeaderLeft from "./left/index.vue";
import HeaderCenter from "./center/index.vue";
import HeaderRight from "./right/index.vue";
</script>

<style lang="scss">
.aioa-header {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: $navbar-height;
  line-height: 100%;
  box-sizing: border-box;
  box-shadow: 0px 3px 5px rgba(#000, 0.5);
  color: #fff;
  background-color: #3e1515;
  z-index: 9999;
  user-select: none;
}
</style>
