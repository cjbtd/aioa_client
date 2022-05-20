<template>
  <div>
    <el-select
      v-if="kwargs.layouts.length > 1"
      v-model="value"
      @change="change"
    >
      <el-option
        v-for="item in kwargs.layouts"
        :key="item.value"
        :label="$utils._T(item.label)"
        :value="item.value"
      />
    </el-select>
    <aioa-layouts v-if="layout" :layout="layout" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaLayouts from "~/components/layouts/index.vue";

export default defineComponent({
  components: { AioaLayouts },
  props: ["DC_KEY", "kwargs", "params", "dialog"],
  data() {
    let layout: any = null;

    return {
      value: "",
      layout,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  mounted() {
    if (this.kwargs.layouts.length > 0) {
      this.value = this.kwargs.layouts[0].value;
      this.change();
    }
  },
  methods: {
    change() {
      this.layout = null;

      let layout = this.DC.layouts[this.value];
      if (layout) {
        let data = this.DC.selection;
        let subData: Array<Record<string, any>> = [];

        if (layout.subData) {
          let requests: Array<any> = [];

          data.filter((row) => {
            requests.push(
              this.$request({
                url: this.DC.path,
                params: {
                  gid: this.DC.params.gid,
                  _relation_pk: row[this.DC.key_id],
                  _relation: this.value,
                },
              })
            );
          });

          Promise.all(requests).then((res) => {
            subData = res.map(({ data }) => data[this.value]);

            layout.datasets = { data, subData };
            this.layout = layout;
          });
        } else {
          layout.datasets = { data, subData };
          this.layout = layout;
        }
      }
    },
  },
});
</script>
