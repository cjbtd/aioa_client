<template>
  <el-select
    remote
    :loading="loading"
    :remote-method="$utils.debounce(remoteSearch, 300)"
    clearable
    filterable
    v-model="val"
    :multiple="limit !== 1"
    :allow-create="fOpt.create === true"
    :placeholder="$utils._T(fOpt.placeholder || '')"
    :style="fOpt.style"
    :class="{ 'aioa-form-sub-edit': fOpt.autocomplete?.edit }"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item.value + item.label"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-icon
    v-if="fOpt.autocomplete?.edit"
    size="20px"
    color="red"
    style="cursor: pointer; margin: 0 5px"
    @click="edit()"
  >
    <edit />
  </el-icon>
  <aioa-dialog v-if="dialog.visible" :opts="dialog">
    <data-center v-if="path" :path="path" :query="query" :isSub="true" />
  </aioa-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";

interface Option {
  label: string;
  value: string | number;
}

export default defineComponent({
  components: { AioaDialog },
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    let options: Array<Option> = [];
    let query: Record<string, any> = {};

    return {
      val: [],
      sep: this.$settings.VARIABLE.link_list,
      limit: 0,
      loading: false,
      options,
      ignore: false,
      path: "",
      query,
      dialog: {
        visible: false,
        title: "",
        class: "aioa-dialog-fit-form",
      },
    };
  },
  watch: {
    isRest() {
      this.fOpt.val = null;
    },
    "fOpt.val"() {
      this.ignore || this.initVal();
      this.ignore = false;
    },
  },
  created() {
    let limit = this.fOpt.limit;
    this.limit = limit === undefined ? 1 : limit;

    this.initVal();
  },
  methods: {
    initVal() {
      let val = this.fOpt.val;

      this.val =
        this.limit === 1 ? val || undefined : val ? val.split(this.sep) : [];

      this.remoteSearch(null, this.val);
    },
    change() {
      this.ignore = true;

      this.fOpt.val =
        (this.limit === 1 ? this.val : this.val.join(this.sep)) || null;
    },
    remoteSearch(label: any, value: any = null) {
      if (this.$utils.isEmpty(label) && this.$utils.isEmpty(value))
        return false;

      let url = "/base/remote";
      let params = {};

      let autocomplete = this.fOpt.autocomplete;

      if (autocomplete) {
        url = autocomplete.url;
        let _autocomplete = autocomplete.key;
        params = { _autocomplete, label, value };
      } else {
        let idx = this.fOpt.enums[0][label ? "label" : "value"];
        let ref = this.form[this.fOpt.ref]?.val || null;
        params = { idx, label, value, ref };
      }

      this.loading = true;
      this.$request({ url, params }).then((res) => {
        this.loading = false;

        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.options = data;
          if (value) this.val = value;
        }
      });
    },
    edit() {
      this.path = this.fOpt.autocomplete.url;
      this.query = this.fOpt.autocomplete.query || { id: null };

      for (let [key, val] of Object.entries(this.query)) {
        if (val === null) this.query[key] = this.fOpt.val;
      }

      this.query._init_pk = this.fOpt.val || "0";

      this.dialog.title = this.fOpt.label;
      this.dialog.visible = true;
    },
  },
});
</script>

<style lang="scss">
.aioa-form-sub-edit {
  .el-input {
    width: 220px !important;
  }
}
</style>
