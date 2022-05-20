<template>
  <el-dropdown
    trigger="click"
    @visible-change="save"
    popper-class="aioa-dc-display"
  >
    <el-button type="success"> {{ $utils._T("_T0098") }} </el-button>
    <template #dropdown>
      <div style="text-align: center; margin-top: 10px">
        <el-button size="small" @click="reset()">
          {{ $utils._T("_T0099") }}
        </el-button>
      </div>
      <el-dropdown-menu>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleAllChange"
        >
          {{ $utils._T("_T0064") }}
        </el-checkbox>
        <el-checkbox-group v-model="displayed" @change="handleChange">
          <el-scrollbar wrap-class="aioa-scroll-max-height">
            <el-checkbox v-for="key in DC.d_a_list" :key="key" :label="key">
              {{ DC.columns[key].label }}
            </el-checkbox>
          </el-scrollbar>
        </el-checkbox-group>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    let displayed: Array<string> = [];

    return {
      checkAll: false,
      isIndeterminate: false,
      displayed,
      isSync: false,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    "DC.d_d_list": {
      handler: function (val) {
        let key = this.DC_KEY;

        let displayed = this.$store.state.confs?.[key]?.displayed;
        this.displayed = displayed || val;

        this.saveDisplayed(false);
      },
      immediate: true,
    },
  },
  methods: {
    handleAllChange(isCheckAll: boolean) {
      this.displayed = isCheckAll ? this.DC.d_a_list : [];

      this.saveDisplayed();
    },
    handleChange() {
      this.saveDisplayed();
    },
    reset() {
      this.displayed = this.DC.d_d_list;

      this.saveDisplayed();
    },
    saveDisplayed(isSync: boolean = true) {
      this.isSync = isSync;

      this.DC.displayed = this.displayed.filter(
        (key) => this.DC.d_a_list.indexOf(key) >= 0
      );

      this.checkAll = this.DC.displayed.length === this.DC.d_a_list.length;
      this.isIndeterminate = !this.checkAll && this.DC.displayed.length > 0;
    },
    save(isShow: boolean) {
      if (isShow || !this.isSync) return;

      let key = this.DC_KEY;
      let confs = this.$utils.deepCopy(this.$store.state.confs);
      let isReset =
        this.DC.displayed.diff(this.DC.d_d_list).length === 0 &&
        this.DC.d_d_list.diff(this.DC.displayed).length === 0;

      if (isReset && confs?.[key]?.displayed) {
        if (Object.keys(confs[key]).length === 1) {
          confs[key] = undefined;
        } else {
          confs[key].displayed = undefined;
        }
      } else {
        this.$utils.saveValByPath(confs, `${key}.displayed`, this.DC.displayed);
      }

      this.$store.dispatch("SAVE_CONFS", confs);
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-display {
  label.el-checkbox {
    display: block;
    height: 20px;
    margin: 0px 10px;
  }
}
</style>
