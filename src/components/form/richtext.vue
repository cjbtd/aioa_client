<template>
  <textarea :id="instance" v-model="val"></textarea>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["form", "fKey", "fOpt", "isRest"],
  data() {
    let editor: any = {};
    const instance: string = "rt-" + this.$utils.uuid();

    return {
      instance,
      editor,
      val: this.fOpt.val,
      stop: false,
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
  mounted() {
    let path = this.fOpt.ckeditor_media_path || "";

    window.CKEDITOR.replace(this.instance, {
      width: this.fOpt.ewidth || "65vw",
      height: this.fOpt.eheight || "200px",
      toolbar: "full",
      language: this.$utils.isZh() ? "zh-cn" : "en",
      tabSpaces: 4,
      allowedContent: true,
      extraPlugins: "autogrow,elementspath,codesnippet,lineheight",
      line_height: "1.3em;1.5em;2.0em;2.5em;3.0em;3.5em;4.0em",
      // filebrowserBrowseUrl: "/ckeditor/browse/",
      filebrowserUploadUrl: "/ckeditor/upload/?ckeditor_media_path=" + path,
      removePlugins: "easyimage,cloudservices,exportpdf",
    });
    this.editor = window.CKEDITOR.instances[this.instance];

    this.editor.on("change", () => {
      this.stop = true;
      this.fOpt.val = this.editor.getData() || null;
    });

    // this.editor.on("blur", () => {
    //   this.fOpt.val = this.editor.getData() || null;
    // });

    // this.editor.on("instanceReady", () => {
    //   document
    //     .getElementById("cke_" + this.instance)
    //     ?.addEventListener("mouseleave", () => {
    //       this.fOpt.val = this.editor.getData() || null;
    //     });
    // });
  },
  methods: {
    initVal() {
      let val = this.fOpt.val;

      if (val !== this.val) {
        window.CKEDITOR.instances[this.instance].setData(val || "");
      }

      if (this.stop === false && val !== this.val) {
        window.CKEDITOR.instances[this.instance].setData(val || "");
      }

      this.stop = false;
    },
  },
});
</script>
