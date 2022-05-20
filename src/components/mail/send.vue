<template>
  <el-form class="aioa-mail" label-position="top">
    <el-form-item>
      <template #label>
        <div>
          <span style="color: red">{{ $utils._T("_T0053") }}</span>
          <el-select
            v-model="userToTKey"
            clearable
            @change="form.to.val = mailUsers[userToTKey] || null"
          >
            <el-option
              v-for="item in Object.keys(mailUsers)"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </template>
      <form-remote :form="form" fKey="to" :fOpt="form.to" :isRest="isRest" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div>
          <span>{{ $utils._T("_T0054") }}</span>
          <el-select
            v-model="userCcTKey"
            clearable
            @change="form.cc.val = mailUsers[userCcTKey] || null"
          >
            <el-option
              v-for="item in Object.keys(mailUsers)"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </template>
      <form-remote :form="form" fKey="cc" :fOpt="form.cc" :isRest="isRest" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div style="color: red">{{ $utils._T("title") }}</div>
      </template>
      <form-str :form="form" fKey="title" :fOpt="form.title" :isRest="isRest" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div>
          <span style="color: red">{{ $utils._T("content") }}</span>
          <el-select
            v-model="contentTKey"
            clearable
            @change="form.content.val = mailContents[contentTKey] || null"
          >
            <el-option
              v-for="item in Object.keys(mailContents)"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </template>
      <form-richtext
        :form="form"
        fKey="content"
        :fOpt="form.content"
        :isRest="isRest"
      />
    </el-form-item>
    <el-form-item>
      <form-file
        :form="form"
        fKey="attachments"
        :fOpt="form.attachments"
        :isRest="isRest"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="send()"
        :style="`visibility: ${emitSend === undefined ? 'visible' : 'hidden'}`"
      >
        {{ $utils._T("send") }}
      </el-button>
      <el-button @click="isRest = !isRest">
        {{ $utils._T("empty") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FormFile from "~/components/form/file.vue";
import FormRemote from "~/components/form/remote.vue";
import FormRichtext from "~/components/form/richtext.vue";
import FormStr from "~/components/form/str.vue";

interface Templates {
  [key: string]: any;
}

export default defineComponent({
  props: ["mail", "dialog", "emitSend"],
  components: {
    FormStr,
    FormRichtext,
    FormFile,
    FormRemote,
  },
  data() {
    let mailUsers: Templates = {};
    let mailContents: Templates = {};
    return {
      isRest: false,
      userToTKey: "",
      userCcTKey: "",
      contentTKey: "",
      mailUsers,
      mailContents,
      form: {
        to: {
          val: "",
          type: "remote",
          style: "width: 100%",
          null: false,
          limit: 0,
          enums: [
            {
              label: "20",
              value: "21",
            },
          ],
        },
        cc: {
          val: "",
          type: "remote",
          style: "width: 100%",
          limit: 0,
          enums: [
            {
              label: "20",
              value: "21",
            },
          ],
        },
        title: {
          val: "",
          style: "width: 100%",
          null: false,
          ranges: ["1", "256"],
        },
        content: {
          val: "",
          null: false,
          ckeditor_media_path: "usermail",
        },
        attachments: {
          val: "",
          style: "width: 100%",
          limit: 0,
        },
      },
    };
  },
  watch: {
    "$store.state.confs": {
      handler: function (val) {
        this.mailUsers = val.mailUsers || {};
        this.mailContents = val.mailContents || {};
      },
      immediate: true,
    },
    mail: {
      handler: function (val) {
        if (val) {
          this.form.to.val = this.formatUser(val.to);
          this.form.cc.val = this.formatUser(val.cc);
          this.form.title.val = val.title;
          this.form.content.val = val.content;
          this.form.attachments.val = val.attachments;
        }
      },
      immediate: true,
    },
    emitSend() {
      this.send();
    },
  },
  methods: {
    send() {
      if (!this.form.to.val) return false;
      let data = this.$datacenter.isValid(this.form);
      if (data === false) return false;

      this.$request({
        url: "/chat/sendmail",
        method: "POST",
        data,
      }).then((res) => {
        let { status } = res.data;

        if (this.dialog && status === this.$settings.STATUS.ok) {
          this.dialog.visible = false;
        }
      });
    },
    formatUser(txt: string) {
      return txt ? txt.replace(/\(.*?\)/g, "") : "";
    },
  },
});
</script>

<style lang="scss">
.aioa-mail .el-form-item {
  .el-form-item__label {
    padding: 0;

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &:last-child {
    .el-form-item__content {
      justify-content: space-between;
    }
  }
}
</style>
