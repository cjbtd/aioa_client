<template>
  <el-main class="aioa-home">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24">
        <aioa-todo />
        <aioa-notice />
      </el-col>
      <el-col :lg="12" :md="24">
        <aioa-schedule />
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup lang="ts">
import AioaTodo from "./todo.vue";
import AioaNotice from "./notice.vue";
import AioaSchedule from "./schedule.vue";
</script>

<style lang="scss">
.aioa-home {
  padding: 10px;

  .el-card {
    margin-bottom: 10px;

    .el-card__header {
      height: 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
