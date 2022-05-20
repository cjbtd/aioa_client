<template>
  <el-select v-model="val" @change="change">
    <el-option
      v-if="DC.enable_all"
      key="_T0055"
      :label="$utils._T('_T0055')"
      :value="0"
    />
    <el-option
      v-for="item in DC.modules"
      :key="item.label + item.value"
      :label="$utils._T(item.label)"
      :value="item.value"
    />
  </el-select>
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
    return {
      val: 0,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    "DC.modules": {
      handler: function () {
        this.setGid();
      },
      immediate: true,
    },
  },
  methods: {
    setGid() {
      let gid = this.$route.query.gid
        ? parseInt(this.$route.query.gid + "")
        : 0;

      this.val =
        gid === 0 && this.DC.enable_all
          ? 0
          : parseInt(this.DC_KEY.split(this.$settings.VARIABLE.link_key)[1]);
    },
    change(gid: number) {
      if (
        this.DC_KEY.endsWith(":" + gid) ||
        (gid === 0 &&
          this.DC.enable_all &&
          this.DC_KEY.endsWith(":" + this.DC.modules[0].value))
      ) {
        this.DC.params.gid = gid;
        this.$store.dispatch("GET_DATA", {
          key: this.DC_KEY,
          params: this.DC.params,
        });
      } else {
        this.$router.push({ query: { gid } });
      }
    },
  },
});
</script>
