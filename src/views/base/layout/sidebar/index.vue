<template>
  <div class="aioa-menu" v-show="isShowMenu">
    <el-scrollbar style="height: 100%">
      <el-input v-model="txt" suffix-icon="search" clearable />
      <el-menu
        mode="vertical"
        router
        :unique-opened="true"
        :default-active="path"
        menu-trigger="click"
        text-color="#cccc99"
        background-color="#333333"
        active-text-color="#ffd04b"
      >
        <aioa-menu :menus="menus" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Menu } from "~/store/index.d";
import AioaMenu from "./menu.vue";

export default defineComponent({
  components: { AioaMenu },
  data() {
    return {
      txt: "",
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    menus() {
      let menus = this.$store.state.menus;
      // @ts-ignore
      return this.txt ? this.filter(this.$utils.deepCopy(menus)) : menus;
    },
    isShowMenu() {
      return this.$store.state.isShowMenu;
    },
  },
  methods: {
    filter(menu: Menu) {
      let res: Menu = {};

      for (let [key, val] of Object.entries(menu)) {
        if (this.isExist(key)) {
          res[key] = val;
        } else {
          if (val.children && this.isContain(val.children)) {
            res[key] = val;
            res[key]["children"] = this.filter(val.children);
          }
        }
      }

      return res;
    },
    isExist(key: string) {
      return (
        this.$utils._T(key).toLowerCase().indexOf(this.txt.toLowerCase()) >= 0
      );
    },
    isContain(menu: Menu) {
      let isKeyContain = false;
      let isChildrenContain = false;

      for (let [key, val] of Object.entries(menu)) {
        if (this.isExist(key)) {
          isKeyContain = true;
          break;
        }

        if (val.children && this.isContain(val.children)) {
          isChildrenContain = true;
          break;
        }
      }

      return isKeyContain || isChildrenContain;
    },
  },
});
</script>

<style lang="scss">
.aioa-menu {
  position: absolute;
  left: 0;
  bottom: 0;
  top: $navbar-height;
  min-width: $header-left-width;
  z-index: 9998;
  background-color: rgb(51, 51, 51);

  .el-menu {
    border-right: none;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-menu-item,
  .el-sub-menu__title,
  .el-sub-menu .el-menu-item {
    height: 30px;
    line-height: 30px;
  }

  li.el-menu-item,
  div.el-sub-menu__title {
    border-bottom: 1px solid #4c4a4a;
  }
}
</style>
