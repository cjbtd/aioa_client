<template>
  <div
    class="aioa-company"
    :title="$utils._T('_T0037')"
    @click="toggle(false)"
    @contextmenu.prevent="toggle(true)"
  >
    {{ companyName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      companyName: "~",
    };
  },
  watch: {
    "$store.state.confs": {
      handler: function () {
        this.companyName = this.$utils.getCompanyName();
      },
      immediate: true,
    },
  },
  methods: {
    toggle(isFixedMenu: boolean) {
      this.$store.commit("COLLAPSE_MENU_TOGGLE", isFixedMenu);
    },
  },
});
</script>

<style lang="scss">
.aioa-company {
  width: 144px;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  line-height: $navbar-height;
  font-size: 28px;
  font-family: STXingkai, serif;
  color: #faebd7;
  &:hover {
    color: gold;
  }
}
</style>
