<template>
  <div class="aioa-setting-dataflow">
    <div>
      <el-select v-model="rid" @change="changeRole">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id + ''"
        />
      </el-select>
      <el-button type="primary" @click="save()">
        {{ $utils._T("save") }}
      </el-button>
    </div>
    <aioa-form v-if="form" :form="form" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaForm from "~/components/form/index.vue";

export default defineComponent({
  components: { AioaForm },
  data() {
    const DC_KEY = this.$store.state.confName.split(
      this.$settings.VARIABLE.link_name
    )[1];

    let dataflow: Record<string, any> = {};
    let roles: Array<any> = [];
    let form: any = null;

    return {
      DC_KEY,
      dataflow,
      roles,
      rid: "",
      form,
    };
  },
  mounted() {
    this.$request({ url: "/base/userroles" }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.roles = data;

        const DC = this.$store.state.dcs[this.DC_KEY];

        if (DC.enable_df) {
          let list: Array<string> = [];

          for (let val of Object.values(DC.enable_df)) {
            if (val) list.push(val);
          }

          this.form = this.$datacenter.buildForm(DC.columns, list);
        }
      }
    });
  },
  methods: {
    loadDataflow() {
      let confs = this.$utils.deepCopy(this.$store.state.confs);
      this.dataflow = confs?.[this.DC_KEY]?.dataflow || {};
    },
    changeRole(rid: number) {
      this.loadDataflow();

      const df = this.dataflow[rid] || {};

      for (let [key, val] of Object.entries(df)) {
        if (this.form?.[key]) this.form[key].val = val;
      }
    },
    save() {
      this.loadDataflow();

      let confs = this.$utils.deepCopy(this.$store.state.confs);

      if (!this.dataflow[this.rid]) {
        this.dataflow[this.rid] = {};
      }

      for (let key of Object.keys(this.form)) {
        this.dataflow[this.rid][key] = this.form[key].val;
      }

      this.$utils.saveValByPath(
        confs,
        `${this.DC_KEY}.dataflow`,
        this.dataflow
      );

      this.$store.dispatch("SAVE_CONFS", confs);
    },
  },
});
</script>

<style lang="scss">
.aioa-setting-dataflow {
  & > div:first-child {
    display: flex;
    justify-content: end;
    margin: 10px 0;

    & > * {
      margin-left: 10px;
    }
  }
}
</style>
