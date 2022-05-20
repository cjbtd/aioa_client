<template>
  <el-dropdown
    v-if="DC.book || DC.dicts"
    :hide-on-click="false"
    trigger="click"
  >
    <el-button type="warning">{{ $utils._T("_T0103") }}</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="DC.book">
          <help-content :label="$utils._T('_T0104')" :content="DC.book" />
        </el-dropdown-item>
        <el-scrollbar v-if="DC.dicts" wrap-class="aioa-scroll-max-height">
          <el-dropdown-item v-for="[key, html] in DC.dicts" :key="key">
            <help-content :label="DC.columns[key].label" :content="html" />
          </el-dropdown-item>
        </el-scrollbar>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelpContent from "./content.vue";

export default defineComponent({
  components: { HelpContent },
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
});
</script>
