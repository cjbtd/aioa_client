<template>
  <div class="aioa-dc-verify">
    <div v-if="DC.enable_df" class="tips">
      <el-button icon="setting" @click="openSetting()">
        {{ $utils._T("_T0140") }}
      </el-button>
      <div>
        <span style="margin-left: 10px">{{ $utils._T("_T0114") }}</span>
        <span style="color: red">
          {{ $store.state.roleName || $utils._T("_T0117") }}
        </span>
      </div>
    </div>
    <div class="cmd">
      <template v-for="item in cmds" :key="item.command">
        <el-popover
          trigger="hover"
          @show="showForm = item.attach"
          @hide="showForm = true"
        >
          <div v-html="$utils._T(item.tips || '_T0113')"></div>
          <template #reference>
            <el-button :type="item.type || 'danger'" @click="saveData(item)">
              {{ $utils._T(item.label) }}
            </el-button>
          </template>
        </el-popover>
      </template>
    </div>
    <aioa-form v-if="form" v-show="showForm !== false" :form="form" />
    <el-card v-if="DC.enable_v_mail && mail">
      <template #header>
        <h2>{{ $utils._T("_T0111") }}</h2>
      </template>
      <mail-send :mail="mail" :emitSend="emitSend" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Cmd } from "~/store/index.d";
import AioaForm from "~/components/form/index.vue";
import MailSend from "~/components/mail/send.vue";

export default defineComponent({
  components: { AioaForm, MailSend },
  props: {
    DC_KEY: {
      type: String,
      required: true,
    },
  },
  data() {
    let form: any = null;
    let mail: any = null;
    let cmds: Array<Cmd> = [];

    return {
      form,
      mail,
      emitSend: false,
      showForm: true,
      cmds,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    form: {
      handler: function () {
        this.DC.formData = this.form;

        this.initMail();
      },
      deep: true,
    },
    "$store.state.roleName"() {
      this.changeRole();
    },
  },
  created() {
    // Before each init, must set DC.formType|DC.formData|DC.oldRowData
    this.initForm();
  },
  methods: {
    changeRole() {
      if (!this.DC.enable_df) return;

      const key = this.$settings.COOKIE_KEYS.rid;
      const rid = this.$utils.cookie.get(key);

      const confs = this.$utils.deepCopy(this.$store.state.confs);
      const df = confs?.[this.DC_KEY]?.dataflow?.[rid] || {};

      for (let [key, val] of Object.entries(df)) {
        if (this.form?.[key]) this.form[key].val = val;
      }
    },
    initMail() {
      this.mail = this.$datacenter.buildMail(this.DC, this.form);
    },
    initForm() {
      const key_id = this.DC.key_id;
      const key_gid = this.DC.key_gid;
      const key_status = this.DC.key_status;

      let selected = this.DC.selection[0];
      let _pk = selected[key_id] + "";
      let _status = "0";

      if (typeof key_gid === "string") {
        let _gid = selected[key_gid];

        if (
          this.DC.selection.some((row) => row[key_gid] !== _gid) ||
          this.DC.gid !==
            this.$datacenter.getEnumValue(
              this.DC.columns,
              key_gid,
              selected[key_gid]
            )
        ) {
          this.DC.formType = null;
          return this.$utils.showAlert("_T0170");
        }
      }

      if (typeof key_status === "string") {
        _status = selected[key_status];

        if (this.DC.selection.some((row) => row[key_status] !== _status)) {
          this.DC.formType = null;
          return this.$utils.showAlert("_T0115");
        }

        _status = this.$datacenter.getEnumValue(
          this.DC.columns,
          key_status,
          selected[key_status]
        );
      }

      let list = this.$datacenter.getVList(this.DC, _status);

      if (typeof list === "boolean") {
        this.DC.formType = null;
        return this.$utils.showAlert("_T0022");
      }

      this.cmds = this.$datacenter.getCmds(this.DC, _status);

      this.DC.verifyInfo._pks = this.DC.selection.map(
        (item) => item[key_id] + ""
      );
      this.DC.verifyInfo._status = _status;

      if (list.length) {
        if (this.DC.formData) {
          this.form = this.DC.formData;
        } else {
          this.$request({
            url: this.DC.path,
            params: {
              _pk,
              _status,
              _type: "v",
              gid: this.DC.params.gid,
            },
          }).then((res) => {
            let { status, data } = res.data;

            if (status === this.$settings.STATUS.ok) {
              this.DC.oldRowData =
                this.DC.config.clearvform === true ? null : data;

              this.form = this.$datacenter.buildForm(
                this.DC.columns,
                list as Array<string>,
                this.DC.oldRowData
              );

              this.changeRole();
            } else {
              this.DC.formType = null;
            }
          });
        }
      }

      this.initMail();
    },
    saveData(item: Cmd) {
      this.DC.verifyInfo._command = item.command;

      let data: any = {};

      if (item.attach !== false && this.form) {
        data = this.$datacenter.isValid(this.form, this.DC.oldRowData);

        if (typeof data === "boolean") return false;
      }

      Object.assign(data, this.DC.verifyInfo);

      let func = this.doSomething();
      this.$store.dispatch("POST_DATA", { key: this.DC_KEY, data, func });
    },
    doSomething() {
      return (_: string, __: any) => {
        this.emitSend = !this.emitSend;

        setTimeout(() => (this.DC.formType = null), 100);
      };
    },
    openSetting() {
      this.$store.commit(
        "SET_CONF_NAME",
        "dataflow" + this.$settings.VARIABLE.link_name + this.DC_KEY
      );
    },
  },
});
</script>

<style lang="scss">
.aioa-dc-verify {
  .tips,
  .cmd {
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
