<template>
  <div :class="{ bs: !isSub, 'aioa-dc': true, 'aioa-sub-dc': isSub }">
    <div>
      <div>
        <el-button
          v-if="DC.v_list_status"
          @click="verify()"
          :disabled="!DC.selection.length"
          type="danger"
        >
          {{ $utils._T("_T0102") }}
        </el-button>
        <el-button
          v-if="DC.enable_add && !!$datacenter.getEList(DC, '0').length"
          @click="edit()"
          type="primary"
        >
          {{ $utils._T("_T0100") }}
        </el-button>
        <dc-modules
          v-if="!isSub && DC.key_gid && DC.modules.length > 1"
          :DC_KEY="DC_KEY"
        />
        <dc-orders :DC_KEY="DC_KEY" />
      </div>
      <div>
        <dc-help :DC_KEY="DC_KEY" />
        <dc-tools :DC_KEY="DC_KEY" />
        <dc-display :DC_KEY="DC_KEY" />
        <el-button
          type="primary"
          @click="
            DC.isShowSearchForm = !DC.isShowSearchForm;
            DC.isFixedSearchForm = false;
          "
          @contextmenu.prevent="
            DC.isShowSearchForm = true;
            DC.isFixedSearchForm = true;
          "
        >
          {{ $utils._T(DC.isShowSearchForm ? "_T0106" : "_T0107") }}
        </el-button>
        <dc-full-text-search
          :params="newParams"
          :item="{ name: 'fulltext', val: DC.params.fulltext }"
          @keyup.enter="search()"
          @contextmenu.prevent="search(true)"
        />
      </div>
    </div>
    <dc-search v-show="DC.isShowSearchForm" :id="idDcSearch" :DC_KEY="DC_KEY" />
    <dc-table
      :id="idDcTable"
      :DC_KEY="DC_KEY"
      :height="isSub ? undefined : height"
      :max-height="isSub ? '60vh' : undefined"
    />
    <dc-pagination :DC_KEY="DC_KEY" />
    <oa-dialog v-if="dialog.visible" :opts="dialog">
      <slot :DC_KEY="DC_KEY" :DC="DC"></slot>
      <slot name="edit" :DC_KEY="DC_KEY" :DC="DC">
        <dc-edit-form
          v-if="DC.formType === 'add data' || DC.formType === 'edit data'"
          :DC_KEY="DC_KEY"
        />
      </slot>
      <slot name="verify" :DC_KEY="DC_KEY" :DC="DC">
        <dc-verify-form v-if="DC.formType === 'verify data'" :DC_KEY="DC_KEY" />
      </slot>
    </oa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DEFAULT_DC_KEY, MetaItem } from "~/store/index.d";
import watermark from "~/utils/watermark";
import OaDialog from "~/components/dialog/index.vue";
import DcDisplay from "./display/index.vue";
import DcEditForm from "./edit/index.vue";
import DcHelp from "./help/index.vue";
import DcModules from "./modules/index.vue";
import DcOrders from "./orders/index.vue";
import DcPagination from "./pagination/index.vue";
import DcSearch from "./search/index.vue";
import DcTable from "./table/index.vue";
import DcTools from "./tools/index.vue";
import DcVerifyForm from "./verify/index.vue";
import DcFullTextSearch from "./search/str.vue";

export default defineComponent({
  components: {
    OaDialog,
    DcDisplay,
    DcEditForm,
    DcHelp,
    DcModules,
    DcOrders,
    DcPagination,
    DcSearch,
    DcTable,
    DcTools,
    DcVerifyForm,
    DcFullTextSearch,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
    query: {
      type: Object as PropType<any>,
      required: true,
    },
    isSub: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    const TIME = this.$utils.uuid();
    let newParams: Record<string, any> = {};

    return {
      idDcSearch: "aioa-dc-search" + TIME,
      idDcTable: "aioa-dc-table" + TIME,
      height: "800px",
      newParams,
      dialog: {
        visible: false,
        title: "",
        width: "78%",
      },
    };
  },
  computed: {
    DC_KEY() {
      let gid = parseInt(this.query.gid + "");
      let path = this.path;
      let meta: MetaItem = this.$store.state.metas[path];
      let key = DEFAULT_DC_KEY;

      if (meta) {
        gid = meta.modules.some((item) => item.value === gid)
          ? gid
          : meta.modules[0].value;

        key = `${path}${this.$settings.VARIABLE.link_key}${gid}`;

        if (!this.$store.state.dcs[key]) {
          this.$store.state.dcs[key] = this.$utils.deepCopy(
            this.$store.state.dcs[DEFAULT_DC_KEY]
          );
        }

        this.$store.state.dcs[key].isSub = this.isSub;
      }

      return key;
    },
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    DC_KEY: {
      handler: function (key) {
        if (key === DEFAULT_DC_KEY) return;

        const params = this.query;

        const _rel = params._init_rel || null;
        const _pk = params._init_pk || null;

        if (_rel) {
          this.DC.formData = null;
          this.DC.formType = null;
          this.DC.oldRowData = null;

          this.DC.relInfo = _rel;
        } else if (_pk) {
          this.DC.formType = null;
          this.DC.formData = null;
          this.DC.relInfo = null;

          this.DC.editInfo._is_super = false; // params._init_is_super === 'true'
          this.DC.editInfo._pk = _pk;
          this.DC.editInfo._status = params._init_status || "0";

          if (params._init_form) {
            this.DC.oldRowData = JSON.parse(params._init_form);
          } else {
            this.DC.oldRowData = null;
          }
        } else {
          if (this.DC.formType) {
            this.DC.relInfo = null;

            this.dialog.title = this.$utils._T(this.DC.formType);
            this.dialog.visible = true;
          }
        }

        if (this.isSub && params._fk_row_data) {
          this.DC.fkRowData = params._fk_row_data;
        } else {
          this.DC.fkRowData = null;
        }

        this.$store.dispatch("GET_DATA", { key, params });
      },
      immediate: true,
    },
    "DC.formType"(val: any) {
      if (val) {
        this.dialog.title = this.$utils._T(val);
        this.dialog.visible = true;
      } else {
        this.dialog.visible = false;
      }
    },
    "DC.refreshCount"() {
      this.$nextTick(() => {
        let height = Math.abs(document.body.clientHeight - 160);
        height -= document.getElementById(this.idDcSearch)?.clientHeight || 0;
        this.height = height + "px";

        watermark(this.DC.config.watermark, this.idDcTable);
      });

      if (this.DC.message) {
        this.$message({
          type: "warning",
          grouping: true,
          duration: 3000,
          offset: 60,
          showClose: true,
          message: this.DC.message,
          dangerouslyUseHTMLString: true,
        });
      }

      if (this.isSub) {
        this.$emit("refresh", this.DC_KEY);
      } else {
        this.$router.push({ query: this.DC.params });
      }
    },
    "dialog.visible"(val) {
      if (val === false) {
        this.DC.formType = null;
        this.DC.editInfo._pk = null;
        this.DC.verifyInfo._pks = [];
      }
    },
  },
  methods: {
    search(_init: boolean = false) {
      this.DC.params._init = _init;
      this.DC.params.fulltext = this.newParams.fulltext;

      this.$store.dispatch("GET_DATA", {
        key: this.DC_KEY,
        params: this.DC.params,
      });
    },
    verify() {
      this.DC.formData = null;
      this.DC.oldRowData = null;

      this.DC.formType = "verify data";
    },
    edit() {
      this.DC.formData = null;
      this.DC.oldRowData = null;

      this.DC.editInfo._is_super = false;
      this.DC.editInfo._pk = "0";
      this.DC.editInfo._status = "0";

      this.DC.formType = "add data";
    },
  },
});
</script>

<style lang="scss">
.aioa-dc {
  padding: 5px;
  margin-bottom: 20px;

  & > div:first-child {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    & > div {
      display: flex;

      &:first-child > * {
        margin: 0 5px 5px 0;
      }

      &:last-child > * {
        margin: 0 0 5px 5px;

        &:first-child {
          margin: 0 0 5px 0;
        }
      }
    }
  }
}
.aioa-sub-dc {
  padding: 0 !important;
}
</style>
