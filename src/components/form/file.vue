<template>
  <el-upload
    action="/"
    multiple
    :limit="limit"
    :file-list="fileList"
    :auto-upload="false"
    :on-change="changeFile"
    :on-remove="removeFile"
    :style="fOpt.style"
    class="aioa-form-upload"
  >
    <el-button> {{ $utils._T("_T0056") }} </el-button>
    <template #tip>
      <div v-if="placeholder">{{ $utils._T(placeholder) }}</div>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getFileMd5 } from "~/utils/md5";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    let fileList: Array<any> = [];

    return {
      sepUrl: this.$settings.VARIABLE.link_url,
      sepName: this.$settings.VARIABLE.link_name,
      fileList,
      limit: 0,
      placeholder: this.fOpt.placeholder,
    };
  },
  watch: {
    isRest() {
      this.fOpt.val = null;
    },
    "fOpt.val"() {
      this.initVal();
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

      let list: Array<any> = [];

      if (val) {
        for (let file of val.split(this.sepUrl)) {
          if (file) {
            list.push({
              name: file.split(this.sepName)[1],
              url: file.split(this.sepName)[0],
            });
          }
        }
      }

      this.fileList = list;
    },
    changeFile(file: any) {
      if (!file.raw) return;

      getFileMd5(file.raw).then((md5) => {
        this.$request({
          url: "/base/touch",
          params: { md5 },
        }).then((resTouch) => {
          let { status, data } = resTouch.data;

          if (status === this.$settings.STATUS.ok) {
            if (data) {
              this.setUrl(file.name, md5);

              this.$message({
                message: this.$utils._T("_T0057"),
                grouping: true,
                type: "success",
                offset: 60,
              });
            } else {
              let formData = new FormData();
              formData.append("attachments", file.raw);

              this.$request({
                url: "/base/upload",
                method: "POST",
                data: formData,
              }).then((resUpload) => {
                let { status } = resUpload.data;

                if (status === this.$settings.STATUS.ok) {
                  let info = resUpload.data.data[0];
                  this.setUrl(info.name, info.md5);

                  this.$message({
                    message: this.$utils._T("_T0058"),
                    grouping: true,
                    type: "success",
                    offset: 60,
                  });
                }
              });
            }
          }
        });
      });
    },
    removeFile() {
      this.change();
    },
    setUrl(name: string, url: any) {
      let index = this.fileList.findIndex((item) => item.name === name);
      this.fileList[index].url = url;
      this.change();
    },
    change() {
      let list: Array<string> = [];

      for (let { name, url } of this.fileList) {
        list.push(`${url}${this.sepName}${name}`);
      }

      this.fOpt.val = list.join(this.sepUrl) || null;
    },
  },
});
</script>

<style lang="scss">
.aioa-form-upload {
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-width: 238px;
}
</style>
