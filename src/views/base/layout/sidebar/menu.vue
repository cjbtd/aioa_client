<template>
  <template v-for="[name, val] in Object.entries(menus)">
    <el-sub-menu
      v-if="val.children"
      v-show="name[0] !== '*'"
      :index="val.key"
      :key="val.key + 's'"
    >
      <template #title> {{ $utils._T(name) }} </template>
      <aioa-menu :menus="val.children" />
    </el-sub-menu>
    <el-menu-item
      v-else
      v-show="name[0] !== '*'"
      :index="val.index"
      :key="val.key + 'm'"
    >
      <template #title> {{ $utils._T(name) }} </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Menu } from "~/store/index.d";

export default defineComponent({
  name: "AioaMenu",
  props: {
    menus: {
      type: Object as PropType<Menu>,
      required: true,
    },
  },
});
</script>
