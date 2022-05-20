<template>
  <aioa-dialog :opts="dialog">
    <el-form :inline="true" class="aioa-mail-tool">
      <el-form-item>
        <el-button @click="newMail('forward')">
          {{ $utils._T("forward") }}
        </el-button>
      </el-form-item>
      <el-form-item v-if="item.me === me">
        <el-button @click="newMail('reply')">
          {{ $utils._T("reply") }}
        </el-button>
      </el-form-item>
      <el-form-item v-if="item.me === me">
        <el-button @click="newMail('reply all')">
          {{ $utils._T("reply all") }}
        </el-button>
      </el-form-item>
      <el-form-item v-if="item.me === me">
        <el-select
          v-model="label"
          @change="addLabel()"
          clearable
          :placeholder="$utils._T('_T0051')"
        >
          <el-option
            v-for="name in labels"
            :key="name"
            :label="name"
            :value="name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div :id="detailId">
      <div style="color: #67c23a; font-size: 12px">
        {{ item.edt }} - {{ item.by }}
      </div>
      <div style="border-top: 1px solid #eaecef; margin: 10px 0"></div>
      <div>
        <span
          style="
            font-weight: bold;
            font-size: 16px;
            color: #f56c6c;
            margin-right: 10px;
          "
        >
          {{ $utils._T("_T0053") }}
        </span>
        <span style="color: #5408db; word-break: break-word">
          {{ item.to }}
        </span>
      </div>
      <div v-if="item.cc">
        <div style="border-top: 1px dotted #eaecef; margin: 5px 0"></div>
        <span
          style="
            font-weight: bold;
            font-size: 16px;
            color: #e6a23c;
            margin-right: 10px;
          "
        >
          {{ $utils._T("_T0054") }}
        </span>
        <span style="color: #795548; word-break: break-word">
          {{ item.cc }}
        </span>
      </div>
      <div v-if="item.attachments">
        <div style="border-top: 1px solid #eaecef; margin: 10px 0"></div>
        <a
          v-for="info in $utils.strToListBySemi(item.attachments)"
          :key="info"
          :href="`/api/chat/download?mid=${item.id}&info=${encodeURIComponent(
            info
          )}`"
          target="_blank"
          style="margin-right: 10px"
        >
          {{ info.split($settings.VARIABLE.link_name)[1] }}
        </a>
      </div>
      <div style="border-top: 1px solid #eaecef; margin: 10px 0 20px"></div>
      <div v-html="item.content"></div>
    </div>
    <aioa-dialog v-if="subDialog.visible" :opts="subDialog">
      <mail-send :mail="mail" :dialog="subDialog" />
    </aioa-dialog>
  </aioa-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import MailSend from "./send.vue";

interface Item {
  id: number;
  by: string;
  me: string;
  to: string;
  cc: string;
  is_read: boolean;
  title: string;
  content: string;
  attachments: string;
  label: string;
  edt: string;
}

interface Mail {
  to: string;
  cc: string;
  title: string;
  content: string;
  attachments: string;
}

export default defineComponent({
  components: { AioaDialog, MailSend },
  props: ["dialog", "pk"],
  data() {
    let item: Item = {
      id: 0,
      by: "",
      me: "",
      to: "",
      cc: "",
      is_read: false,
      title: "",
      content: "",
      attachments: "",
      label: "",
      edt: "",
    };

    let mail: Mail = {
      to: "",
      cc: "",
      title: "",
      content: "",
      attachments: "",
    };

    return {
      item,
      mail,
      label: "",
      labels: [],
      subDialog: {
        visible: false,
        title: "",
        class: "aioa-dialog-fit-form",
      },
      detailId: "mail-detail-" + new Date().getTime(),
      me: this.$utils.getUserName(),
    };
  },
  watch: {
    "$store.state.confs": {
      handler: function (val) {
        this.labels = val.mailLabels || [];
      },
      immediate: true,
    },
  },
  mounted() {
    this.$request({
      url: "/chat/usermail",
      params: {
        _type: "view",
        pk: this.pk,
      },
    }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.item = data;
        this.label = this.item.label;

        this.item.is_read === false &&
          this.item.me === this.me &&
          this.$store.commit("SET_TOTAL", -1);
      }
    });
  },
  methods: {
    addLabel() {
      this.$request({
        url: "/chat/usermail",
        params: {
          _type: "addLabel",
          pk: this.pk,
          label: this.label,
        },
      });
    },
    newMail(type: "forward" | "reply" | "reply all" = "reply") {
      if (type === "reply") {
        this.mail.to = this.item.by;
      }

      if (type === "reply all") {
        if (this.item.to.indexOf(this.item.by) === -1) {
          this.mail.to =
            this.item.by + this.$settings.VARIABLE.link_list + this.item.to;
        } else {
          this.mail.to = this.item.to;
        }

        this.mail.cc = this.item.cc;
      }

      this.mail.title = this.$utils._T(type) + ": " + this.item.title;
      this.mail.content =
        `<p>${this.$utils._T("_T0060")}</p>
        <div style="border-top: 2px solid #d71414; margin: 20px 0; font-size: 20px; font-weight: bold;">
        ${this.$utils._T("title")}: ${this.item.title}
        </div>` + document.getElementById(this.detailId)?.innerHTML || "";
      this.mail.attachments = this.item.attachments;

      this.subDialog.title = this.$utils._T(type);
      this.subDialog.visible = true;
    },
  },
});
</script>

<style lang="scss">
.aioa-mail-tool .el-form-item {
  margin-right: 5px;
}
</style>
