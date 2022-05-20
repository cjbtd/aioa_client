<template>
  <div :style="cStyle">
    <template v-if="cVal === null"></template>
    <template v-else-if="cType === 'str'">
      <template v-if="!cUrl"> {{ cVal }} </template>
      <template v-else>
        <router-link v-if="cUrl[0] === '/'" :to="cUrl">
          {{ cVal }}
        </router-link>
        <a v-else target="_blank" rel="noopener norefferrer" :href="cUrl">
          {{ cVal }}
        </a>
      </template>
    </template>
    <div
      v-else-if="cType === 'richtext'"
      :style="cSubStyle"
      v-html="cVal"
    ></div>
    <pre
      v-else-if="cType === 'text'"
      :style="cSubStyle || 'white-space: nowrap;'"
      >{{ cVal }}</pre
    >
    <template v-else-if="cType === 'file'">
      <span v-for="item in cFiles" :key="item.key" class="link-margin">
        <a target="_blank" :href="item.url"> {{ item.name }} </a>
      </span>
    </template>
    <template v-else>{{ cVal }}</template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Column } from "~/store/index.d";

export default defineComponent({
  props: ["DC", "col", "row", "opts", "rel"],
  data() {
    let cFiles: Array<any> = [];

    return {
      cVal: "",
      cUrl: "",
      cFiles,
      cType: "",
      cStyle: "",
      cSubStyle: "",
    };
  },
  created() {
    let val = this.row[this.col];
    if (val === null || val === "") return;

    let opts: Column = this.opts;

    if (opts.link) {
      let link_keys = opts.link_keys || [this.col];

      let vals: Array<any> = link_keys.map((key) =>
        opts.encode === true ? encodeURIComponent(this.row[key]) : this.row[key]
      );

      this.cVal = opts.link_name || val;
      this.cUrl = opts.link.format(...vals);
      this.cType = "str";
      return;
    }

    if (opts.type === "file") {
      let files = [];
      let list = val.split(this.$settings.VARIABLE.link_url);
      let link_name = this.$settings.VARIABLE.link_name;
      let path = this.$settings.VARIABLE.url_prefix + this.DC.path;
      let gid = this.DC.params.gid || 0;
      let pk = this.row[this.DC.key_id];

      for (let i = 0, len = list.length; i < len; i++) {
        files.push({
          key: list[i],
          name: list[i].split(link_name)[1],
          url:
            path +
            "?gid=" +
            gid +
            "&_f_pk=" +
            pk +
            "&_f_key=" +
            this.col +
            "&_f_info=" +
            encodeURIComponent(list[i]) +
            "&_f_rel=" +
            this.rel,
        });
      }

      this.cFiles = files;
      this.cType = "file";
      return;
    }

    let type = opts.type || "str";
    let isRaw = ["text", "richtext"].indexOf(type) >= 0;

    let style = "";
    opts?.funcs?.map(({ func, args }) => {
      //@ts-ignore
      let res = this.$filters[func](val, ...(args || []));

      if (res.val === undefined) {
        val = res;
      } else {
        val = res.val;
        style += res.style === undefined ? "" : ";" + res.style;
      }
    });

    this.cVal = val;
    this.cType = isRaw ? type : "str";

    this.cSubStyle = opts.cell_style || "" + style;
    this.cStyle = isRaw ? "" : this.cSubStyle;
  },
});
</script>
