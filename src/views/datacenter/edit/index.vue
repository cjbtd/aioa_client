<template>
  <div>
    <aioa-form :form="form" />
    <el-card v-if="DC.enable_e_mail && mail">
      <template #header>
        <h2>{{ $utils._T("_T0111") }}</h2>
      </template>
      <mail-send :mail="mail" :emitSend="emitSend" />
    </el-card>
    <div v-drag class="aioa-dc-btn-submit">
      <el-button
        v-if="DC.formType === 'add data'"
        @click="saveData(false)"
        size="large"
      >
        {{ $utils._T("_T0110") }}
      </el-button>
      <br />
      <br />
      <el-button @click="saveData(true)" size="large">
        {{ $utils._T("save") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
    let form: Record<string, any> = {};
    let mail: any = null;

    return {
      form,
      mail,
      emitSend: false,
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
  },
  created() {
    // Before each init, must set DC.formType|DC.formData|DC.oldRowData|DC.editInfo
    this.initForm();
  },
  methods: {
    initMail() {
      this.mail = this.$datacenter.buildMail(this.DC, this.form);
    },
    initForm() {
      let { _is_super, _pk, _status } = this.DC.editInfo;

      if (this.DC.formData) {
        this.form = this.DC.formData;
      } else {
        let selected = this.DC.selection[0];

        if (selected) {
          if (
            this.DC.formType === "edit data" &&
            typeof this.DC.key_gid !== "boolean" &&
            this.DC.gid !==
              this.$datacenter.getEnumValue(
                this.DC.columns,
                this.DC.key_gid,
                selected[this.DC.key_gid]
              )
          ) {
            this.DC.formType = null;
            return this.$utils.showAlert("_T0170");
          }

          if (_pk === "0" || typeof this.DC.key_status === "boolean") {
            _status = "0";
          } else {
            _status = this.$datacenter.getEnumValue(
              this.DC.columns,
              this.DC.key_status,
              selected[this.DC.key_status]
            );
            this.DC.editInfo._status = _status;
          }

          _pk = (selected?.[this.DC.key_id] || "0") + "";
        }

        let list = _is_super
          ? this.DC.e_list_super
          : this.$datacenter.getEList(this.DC, _status);

        if (list.length === 0) {
          this.DC.formType = null;
          return this.$utils.showAlert("_T0022");
        }

        if (_pk !== "0") {
          this.$request({
            url: this.DC.path,
            params: {
              _is_super,
              _pk,
              _status,
              _type: "e",
              gid: this.DC.params.gid,
            },
          }).then((res) => {
            let { status, data } = res.data;

            if (status === this.$settings.STATUS.ok) {
              this.DC.oldRowData = data;

              this.form = this.$datacenter.buildForm(
                this.DC.columns,
                list,
                data
              );
            } else {
              this.DC.formType = null;
            }
          });
        } else {
          this.form = this.$datacenter.buildForm(
            this.DC.columns,
            list,
            this.DC.fkRowData || this.DC.oldRowData
          );
        }
      }

      this.initMail();
    },
    saveData(isCloseDialog: boolean) {
      let data = this.$datacenter.isValid(
        this.form,
        this.DC.formType === "add data" ? null : this.DC.oldRowData
      );

      if (typeof data === "object") {
        let { __count__, _form_data } = data;

        if (
          __count__ === 0 ||
          _form_data === JSON.stringify(this.DC.oldRowData)
        ) {
          return this.$utils.showAlert("_T0112");
        }

        Object.assign(data, this.DC.editInfo);

        let func = this.doSomething(isCloseDialog, JSON.parse(_form_data));
        this.$store.dispatch("POST_DATA", { key: this.DC_KEY, data, func });
      }
    },
    doSomething(isCloseDialog: boolean, formData: Record<string, any>) {
      return (_: string, __: any) => {
        this.emitSend = !this.emitSend;

        if (isCloseDialog) {
          setTimeout(() => (this.DC.formType = null), 100);
        } else {
          this.DC.oldRowData = formData;
        }
      };
    },
  },
});
</script>
