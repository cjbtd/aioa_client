<template>
  <div class="aioa-dc-search">
    <el-form :inline="true" style="text-align: right">
      <el-form-item>
        <el-input v-model="name" clearable :placeholder="$utils._T('_T0148')">
          <template #append>
            <el-button @click="save()" :disabled="!name">
              {{ $utils._T("_T0146") }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="collect"
          @change="change"
          :placeholder="$utils._T('_T0147')"
        >
          <el-option
            v-for="item in Object.keys(searchCollects)"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="isRest = !isRest">
          {{ $utils._T("empty") }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">
          {{ $utils._T("_T0062") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider>{{ $utils._T("_T0108") }}</el-divider>
    <el-form :inline="true" label-position="right">
      <el-form-item
        v-for="key in DC.s_list"
        :key="DC_KEY + key"
        :label="DC.columns[key].label"
        :title="DC.columns[key].label"
      >
        <template v-if="getType(key) === 'str'">
          <search-str
            :params="newParams"
            :item="getItem(key)"
            :isRest="isRest"
            @keyup.enter="search()"
          />
        </template>
        <template v-else>
          <component
            :is="'search-' + getType(key)"
            :params="newParams"
            :item="getItem(key)"
            :isRest="isRest"
          />
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchStr from "./str.vue";
import SearchEnum from "./enum.vue";
import SearchDate from "./date.vue";
import SearchTime from "./time.vue";
import SearchDatetime from "./datetime.vue";

export default defineComponent({
  components: { SearchStr, SearchEnum, SearchDate, SearchTime, SearchDatetime },
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    let newParams: Record<string, any> = {};
    let searchCollects: Record<string, any> = {};

    return {
      name: "",
      collect: "",
      searchCollects,
      newParams,
      isRest: false,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    "$store.state.confs": {
      handler: function (val) {
        this.searchCollects = val?.[this.DC_KEY]?.searchCollects || {};
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    getType(key: string) {
      const type = this.DC.columns[key]?.type;

      return [
        "num",
        "file",
        "remote",
        "cascade",
        "text",
        "richtext",
        undefined,
      ].indexOf(type) >= 0
        ? "str"
        : type;
    },
    getItem(key: string) {
      const val = this.DC.params[key];
      this.newParams[key] = val;

      return {
        name: key,
        val,
        enums: this.DC.columns[key]?.enums,
      };
    },
    search() {
      this.collect = "";

      let params: Record<string, any> = {};

      Object.assign(params, this.newParams, {
        gid: this.DC.params.gid,
        size: this.DC.params.size,
        orders: this.DC.params.orders,
        currentpage: 1,
        fulltext: null,
      });

      this.$store.dispatch("GET_DATA", {
        key: this.DC_KEY,
        params,
      });
    },
    change() {
      this.name = this.collect;
      const query = this.searchCollects[this.collect] || {};
      this.newParams = this.$utils.deepCopy(query);
      this.search();
    },
    save() {
      let query: Record<string, any> = {};

      for (let [key, val] of Object.entries(this.newParams)) {
        if (val) query[key] = val;
      }

      this.searchCollects[this.name] = query;

      for (let [key, val] of Object.entries(this.searchCollects)) {
        if (Object.keys(val).length === 0) delete this.searchCollects[key];
      }

      let confs = this.$utils.deepCopy(this.$store.state.confs);

      if (Object.keys(this.searchCollects).length === 0) {
        if (confs[this.DC_KEY]) {
          delete confs[this.DC_KEY].searchCollects;

          if (Object.keys(confs[this.DC_KEY]).length === 0) {
            delete confs[this.DC_KEY];
          }
        } else {
          return;
        }
      } else {
        if (!confs[this.DC_KEY]) confs[this.DC_KEY] = {};

        confs[this.DC_KEY].searchCollects = this.searchCollects;
      }

      this.$store.dispatch("SAVE_CONFS", confs);
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-search {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;

  .el-input-group__append {
    background-color: #fff;
    color: #606266;
  }

  .el-form-item {
    margin: 0 0 3px 3px;
  }

  .el-form-item__label {
    width: 80px;
    color: black;
    white-space: nowrap;
  }

  .el-input__inner {
    height: 32px !important;
    width: 220px;
    color: blue;
  }

  .el-select {
    .el-input__inner {
      width: 198px;
    }
  }

  .el-date-editor {
    width: 222px;
    height: 28px;
  }

  .el-range-input {
    color: blue;
  }

  .el-form:first-child {
    .el-input-group__append {
      width: 84px;
    }

    .el-form-item:first-child {
      .el-input__inner {
        width: 222px;
      }
    }
  }
}
</style>
