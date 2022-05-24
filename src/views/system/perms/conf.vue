<template>
  <div class="aioa-perms-conf">
    <el-button type="danger" icon="check" :disabled="!isOk" @click="saveConf()">
      {{ $utils._T("_T0081") }}
    </el-button>
    <el-popover
      v-if="fullConf"
      placement="bottom"
      width="800px"
      trigger="click"
    >
      <json-viewer :jsonString="fullConf" />
      <template #reference>
        <el-button icon="view">
          {{ $utils._T("_T0082") }}
        </el-button>
      </template>
    </el-popover>
    <el-popover
      v-if="permConf"
      placement="bottom"
      width="800px"
      trigger="click"
    >
      <json-viewer :jsonString="permConf" />
      <template #reference>
        <el-button icon="view">
          {{ $utils._T("_T0083") }}
        </el-button>
      </template>
    </el-popover>
    <el-popover
      v-if="!!Object.keys(newPermConf).length"
      placement="bottom"
      width="800px"
      trigger="click"
    >
      <json-viewer :jsonString="newPermConf" />
      <template #reference>
        <el-button icon="view">
          {{ $utils._T("_T0084") }}
        </el-button>
      </template>
    </el-popover>
    <el-divider></el-divider>
    <el-scrollbar>
      <el-form v-if="isOk" label-position="top">
        <el-divider v-if="fullConf.enable_add !== false">
          {{ $utils._T("add data") }}
        </el-divider>
        <el-form-item v-if="fullConf.enable_add !== false">
          <template #label>
            <el-checkbox v-model="newConf.enable_add">
              {{ $utils._T("_T0087") }}
            </el-checkbox>
          </template>
        </el-form-item>

        <template v-for="opts in attr_list" :key="opts.key">
          <el-divider
            v-if="!!opts.options.length"
            @click="newConf[opts.key] = selectAll(opts.options)"
            class="aioa-perms-click"
          >
            {{ opts.title }}
          </el-divider>
          <el-form-item v-if="!!opts.options.length">
            <template #label>
              <el-checkbox
                :model-value="newConf[opts.key] === true"
                :disabled="typeof fullConf[opts.key] === 'object'"
                @change="
                  newConf[opts.key] = newConf[opts.key] === true ? [] : true
                "
              >
                {{ $utils._T("_T0086") }}
              </el-checkbox>
            </template>
            <el-select
              v-if="newConf[opts.key] !== true"
              v-model="newConf[opts.key]"
              multiple
              clearable
            >
              <el-option
                v-for="item in opts.options"
                :key="item.key || item"
                :label="item.label || getLabel(item)"
                :value="item.key || item"
              />
            </el-select>
          </el-form-item>
        </template>

        <el-divider>{{ $utils._T("_T0096") }}</el-divider>
        <el-form-item v-for="item in e_status" :key="item.value">
          <template #label>
            <el-button
              link
              type="primary"
              @click="
                newConf.e_list_status[item.value] = selectAll(item.options)
              "
            >
              {{ item.label }}
            </el-button>
            <el-checkbox
              :model-value="newConf.e_list_status[item.value] === true"
              :disabled="
                typeof fullConf.e_list_status?.[item.value] === 'object'
              "
              @change="
                newConf.e_list_status[item.value] =
                  newConf.e_list_status[item.value] === true ? [] : true
              "
            >
              {{ $utils._T("_T0086") }}
            </el-checkbox>
          </template>
          <el-select
            v-if="newConf.e_list_status[item.value] !== true"
            v-model="newConf.e_list_status[item.value]"
            multiple
            clearable
          >
            <el-option
              v-for="key in item.options"
              :key="key"
              :label="getLabel(key)"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-divider>{{ $utils._T("_T0097") }}</el-divider>
        <el-form-item v-for="item in v_status" :key="item.value">
          <template #label>
            <el-button
              link
              type="primary"
              @click="
                newConf.v_list_status[item.value] = selectAll(item.options)
              "
            >
              {{ item.label }}
            </el-button>
            <el-checkbox
              :model-value="newConf.v_list_status[item.value] === true"
              :disabled="
                typeof fullConf.v_list_status?.[item.value] === 'object'
              "
              @change="
                newConf.v_list_status[item.value] =
                  newConf.v_list_status[item.value] === true ? [] : true
              "
            >
              {{ $utils._T("_T0086") }}
            </el-checkbox>
            <el-checkbox
              :model-value="!!newConf.v_list_status[item.value]"
              @change="
                newConf.v_list_status[item.value] =
                  !newConf.v_list_status[item.value]
              "
            >
              {{ $utils._T("_T0087") }}
            </el-checkbox>
          </template>
          <el-select
            v-if="
              $utils.getObjType(newConf.v_list_status[item.value]) === 'Array'
            "
            v-model="newConf.v_list_status[item.value]"
            multiple
            clearable
          >
            <el-option
              v-for="key in item.options"
              :key="key"
              :label="getLabel(key)"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import JsonViewer from "~/components/utils/json-viewer.vue";

interface Attr {
  key: string;
  title: string;
  options: Array<any>;
}

export default defineComponent({
  props: ["idP", "fullConf", "permConf", "newConf"],
  components: { JsonViewer },
  data() {
    let attr_list: Array<Attr> = [];
    let e_status: Array<any> = [];
    let v_status: Array<any> = [];

    return {
      attr_list,
      e_status,
      v_status,
      cMap: {
        s: "s_list",
        a: "d_a_list",
        d: "d_d_list",
        r: "d_r_list",
      },
      defaultEnabled: ["s", "a", "d", "r", "e"],
    };
  },
  computed: {
    isOk() {
      return this.idP && this.fullConf && this.permConf;
    },
    newPermConf() {
      let newConf = {};
      this.$utils.mergeObjs(
        newConf,
        this.$utils.deepCopy(this.permConf || {}),
        this.$utils.deepCopy(this.newConf)
      );
      return newConf;
    },
  },
  watch: {
    fullConf() {
      this.init();
    },
    permConf() {
      this.init();
    },
  },
  methods: {
    saveConf() {
      let idP = this.idP;

      if (idP <= 10) return this.$utils.showAlert("_T0017");

      const params = {
        isSaveConf: true,
        idP,
      };

      let data = {
        conf: JSON.stringify(this.newPermConf),
      };

      this.$emit("handleData", params, data);
    },
    init() {
      if (!this.isOk) return;

      const gv = this.$utils.getValByPath;

      let oldConf: any = {};

      this.$utils.mergeObjs(
        oldConf,
        this.$utils.deepCopy(this.fullConf),
        this.$utils.deepCopy(this.permConf)
      );

      this.newConf.enable_add = oldConf.enable_add !== false;
      this.newConf.r_list = gv(oldConf, "r_list", true);
      this.newConf.t_list = gv(oldConf, "t_list", true);
      this.newConf.s_list = gv(oldConf, "s_list", true);
      this.newConf.d_a_list = gv(oldConf, "d_a_list", true);
      this.newConf.d_d_list = gv(oldConf, "d_d_list", true);
      this.newConf.d_r_list = gv(oldConf, "d_r_list", true);
      this.newConf.e_list_status = {};
      this.newConf.v_list_status = {};

      this.attr_list = [
        {
          key: "r_list",
          title: this.$utils._T("_T0090"),
          options: this.rOptions(),
        },
        {
          key: "t_list",
          title: this.$utils._T("_T0091"),
          options: this.tOptions(),
        },
        {
          key: "s_list",
          title: this.$utils._T("_T0092"),
          options: this.cOptions("s"),
        },
        {
          key: "d_a_list",
          title: this.$utils._T("_T0093"),
          options: this.cOptions("a"),
        },
        {
          key: "d_d_list",
          title: this.$utils._T("_T0094"),
          options: this.cOptions("d"),
        },
        {
          key: "d_r_list",
          title: this.$utils._T("_T0095"),
          options: this.cOptions("r"),
        },
      ];

      let status_list = [];
      if (gv(this.fullConf, "enable_status", true) === false) {
        status_list = [{ value: "0", label: "_T0076" }];
      } else {
        status_list = gv(
          this.fullConf.columns,
          "{0}.enums".format(this.fullConf.key_status || "status")
        );
      }

      let e_status: Array<any> = [];
      let v_status: Array<any> = [];

      let e_list_status = gv(this.fullConf, "e_list_status", true);
      let v_list_status = gv(this.fullConf, "v_list_status", {
        "0": true,
      });

      let old_e_list_status = gv(oldConf, "e_list_status", true);
      let old_v_list_status = gv(oldConf, "v_list_status", {
        "0": true,
      });

      let e_list = gv(this.fullConf, "e_list", true);
      if (e_list === true) e_list = this.getEnabledColumns("e");

      let v_list = gv(this.fullConf, "v_list", true);
      if (v_list === true) v_list = this.getEnabledColumns("v");

      for (let i = 0, len = status_list.length; i < len; i++) {
        let value = status_list[i].value;
        let label = this.$utils._T(status_list[i].label);

        // e
        this.newConf.e_list_status[value] =
          old_e_list_status === false ? [] : gv(old_e_list_status, value, true);

        let e_options = gv(e_list_status, value, true);
        e_status.push({
          value,
          label,
          options: e_options === true ? e_list : e_options,
        });

        // v
        let v_options = gv(v_list_status, value, false);
        if (v_options) {
          this.newConf.v_list_status[value] =
            old_v_list_status === false
              ? false
              : gv(old_v_list_status, value, false);

          v_status.push({
            value,
            label,
            options: v_options === true ? v_list : v_options,
          });
        }
      }

      this.e_status = e_list_status === false ? [] : e_status;
      this.v_status = v_list_status === false ? [] : v_status;

      if (e_list_status === false) this.newConf.e_list_status = false;
      if (v_list_status === false) this.newConf.v_list_status = false;
    },
    rOptions() {
      let list: any = true;
      if (this.$utils.getObjType(this.fullConf.r_list) === "Array") {
        list = this.fullConf.r_list;
      }

      let relations: Record<string, any> = this.fullConf.relations || {};
      let options = [];

      for (let [key, opts] of Object.entries(relations)) {
        if (list === true || list.indexOf(key) >= 0)
          options.push({ key: key, label: this.$utils._T(opts.title || key) });
      }
      return options;
    },
    tOptions() {
      let list: any = true;
      if (this.$utils.getObjType(this.fullConf.t_list) === "Array") {
        list = this.fullConf.t_list;
      }

      let tools: Record<string, any> = this.fullConf.tools || {};
      let options = [];

      for (let [key, opts] of Object.entries(tools)) {
        if (list === true || list.indexOf(key) >= 0)
          options.push({ key: key, label: this.$utils._T(opts.label) });
      }
      return options;
    },
    cOptions(t: "s" | "a" | "d" | "r") {
      const attr = this.cMap[t];
      return this.$utils.getObjType(this.fullConf[attr]) === "Array"
        ? this.fullConf[attr]
        : this.getEnabledColumns(t);
    },
    getEnabledColumns(t: string) {
      let columns: Record<string, any> = this.fullConf.columns || {};
      let options = [];

      for (let [key, opts] of Object.entries(columns)) {
        if ((opts.enabled || this.defaultEnabled).indexOf(t) >= 0) {
          options.push(key);
        }
      }
      return options;
    },
    getLabel(key: string) {
      let opts = this.fullConf.columns[key];
      return this.$utils._T(opts.label || opts.name || key);
    },
    selectAll(options: Array<any>) {
      return options.map((item: any) => item.key || item);
    },
  },
});
</script>

<style lang="scss">
.aioa-perms-conf {
  & > .el-button {
    margin: 10px 10px 0 0;
  }

  .el-form {
    .el-form-item {
      margin: 0;
    }

    .el-form-item__label {
      padding: 0;
    }

    .el-select {
      width: 100%;
    }

    .el-checkbox {
      margin: 0 20px;
      vertical-align: middle;
    }
  }

  .aioa-perms-click {
    cursor: pointer;
    user-select: none;

    .el-divider__text {
      color: #409eff;
    }
  }
}
</style>
