<template>
  <div class="aioa-dc-relations">
    <div v-show="list.length > 1" style="text-align: right">
      <el-button @click="collapseAll()">{{ $utils._T("_T0141") }}</el-button>
    </div>
    <div v-for="key in list" :key="key">
      <el-divider
        v-if="DC.relations[key].title"
        @click="states[key] = !states[key]"
        :title="$utils._T('_T0141')"
        class="aioa-divider"
      >
        {{ $utils._T(DC.relations[key].title) }}
      </el-divider>
      <component
        v-show="states[key]"
        :is="DC.relations[key].type || 'rTable'"
        :DC_KEY="DC_KEY"
        :relation="key"
        :result="results[key]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import rTable from "./table.vue";
import rChart from "./chart.vue";
import rLayout from "./layout.vue";
import rDatacenter from "./datacenter.vue";

export default defineComponent({
  components: { rTable, rChart, rLayout, rDatacenter },
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    let list: Array<string> = [];
    let states: Record<string, boolean> = {};
    let results: Record<string, any> = {};

    return {
      list,
      states,
      results,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.list = [];
      this.results = {};

      this.$request({
        url: this.DC.path,
        params: { gid: this.DC.params.gid, _relation_pk: this.DC.relInfo },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.DC.r_list.map((key) => (this.states[key] = true));

          this.results = data;
          this.list = this.DC.r_list;
        }
      });
    },
    collapseAll() {
      Object.keys(this.states).map(
        (key) => (this.states[key] = !this.states[key])
      );
    },
  },
});
</script>
