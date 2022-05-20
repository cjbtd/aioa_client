<template>
  <el-form class="aioa-setting-mail" label-position="top">
    <el-form-item>
      <template #label>
        <div>
          <span>{{ $utils._T("_T0149") }}</span>
        </div>
      </template>
      <el-input v-model="mailLabels" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div>
          <span>{{ $utils._T("_T0144") }}</span>
          <el-select
            v-model="userTKey"
            filterable
            allow-create
            @change="changeUser"
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
      <form-remote :form="form" fKey="user" :fOpt="form.user" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div>
          <span>{{ $utils._T("_T0145") }}</span>
          <el-select
            v-model="contentTKey"
            filterable
            allow-create
            @change="changeContent"
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
      <form-richtext :form="form" fKey="content" :fOpt="form.content" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save()">
        {{ $utils._T("save") }}
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

export default defineComponent({
  components: {
    FormStr,
    FormRichtext,
    FormFile,
    FormRemote,
  },
  data() {
    let mailLabels: string = "";
    let mailUsers: Record<string, any> = {};
    let mailContents: Record<string, any> = {};
    return {
      userTKey: "",
      contentTKey: "",
      mailLabels,
      mailUsers,
      mailContents,
      form: {
        user: {
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
        content: {
          val: "",
          ckeditor_media_path: "usermail",
        },
      },
    };
  },
  created() {
    let confs = this.$utils.deepCopy(this.$store.state.confs);

    this.mailLabels = (confs.mailLabels || []).join(",");
    this.mailUsers = confs.mailUsers || {};
    this.mailContents = confs.mailContents || {};
  },
  methods: {
    changeUser(val: string) {
      if (this.mailUsers[val]) {
        this.form.user.val = this.mailUsers[val] || null;
      } else {
        this.mailUsers[val] = this.form.user.val;
      }
    },
    changeContent(val: string) {
      if (this.mailContents[val]) {
        this.form.content.val = this.mailContents[val] || null;
      } else {
        this.mailContents[val] = this.form.content.val;
      }
    },
    save() {
      if (this.userTKey) {
        this.mailUsers[this.userTKey] = this.form.user.val;
      }

      if (this.contentTKey) {
        this.mailContents[this.contentTKey] = this.form.content.val;
      }

      let confs = this.$utils.deepCopy(this.$store.state.confs);

      for (let [key, val] of Object.entries(this.mailUsers)) {
        if (!val) delete this.mailUsers[key];
      }

      for (let [key, val] of Object.entries(this.mailContents)) {
        if (!val) delete this.mailContents[key];
      }

      if (Object.keys(this.mailUsers).length === 0) {
        delete confs.mailUsers;
      } else {
        confs.mailUsers = this.mailUsers;
      }

      if (Object.keys(this.mailContents).length === 0) {
        delete confs.mailContents;
      } else {
        confs.mailContents = this.mailContents;
      }

      if (this.mailLabels) {
        confs.mailLabels = this.mailLabels.split(",");
      } else {
        delete confs.mailLabels;
      }

      this.$store.dispatch("SAVE_CONFS", confs);
    },
  },
});
</script>

<style lang="scss">
.aioa-setting-mail .el-form-item {
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
      justify-content: end;
    }
  }
}
</style>
