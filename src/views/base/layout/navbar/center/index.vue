<template>
  <div class="aioa-header-center">
    <router-link v-for="(tag, index) in tags" :key="tag.path" :to="tag.path">
      <el-tag
        :closable="index > 0"
        size="large"
        effect="dark"
        color="#003300"
        disable-transitions
        @close.prevent="closeTag(index)"
      >
        {{ tag.title }}
      </el-tag>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Tag {
  name: string;
  path: string;
  title: string;
  keepAlive: boolean;
}

export default defineComponent({
  data() {
    let tags: Array<Tag> = [];

    return {
      tags,
    };
  },
  watch: {
    $route(val) {
      this.$store.commit("COLLAPSE_MENU_TRUE");
      this.setTags(val);
    },
  },
  beforeCreate() {
    this.$request({ url: "/base/menu" }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.$store.commit("SET_MENUS", data.MENUS);
        this.$store.commit("SET_METAS", data.METAS);
        this.setTags(this.$route);
      }
    });
  },
  methods: {
    refreshCaches() {
      let caches = [];
      for (let i = 0, len = this.tags.length; i < len; i++) {
        let tag = this.tags[i];
        if (tag.keepAlive && tag.path.indexOf("/datacenter/") === -1) {
          caches.push(tag.name);
        }
      }

      this.$store.commit("SET_CACHES", caches);
    },
    closeTag(index: number) {
      if (index > 0) {
        const delItem = this.tags.splice(index, 1)[0];
        const nextItem = this.tags[index] || this.tags[index - 1];
        delItem.path === this.$route.fullPath &&
          this.$router.push(nextItem.path);

        this.refreshCaches();
      }
    },
    setTags(route: typeof this.$route) {
      let tags: Array<Tag> = [];

      tags.push({
        name: "home",
        path: this.$settings.URL.home,
        title: this.$utils._T("_T0036"),
        keepAlive: false,
      });

      if (route.path !== this.$settings.URL.home) {
        let meta = this.$store.state.metas[route.path] || route.meta;

        tags.push({
          name: route.matched.slice(-1)[0].components.default.name || "",
          path: route.fullPath,
          title: this.$utils._T(meta.tagName),
          keepAlive: meta.keepAlive,
        });

        for (let i = 1, len = this.tags.length; i < len; i++) {
          if (this.tags[i].path.split("?")[0] !== route.path) {
            tags.push(this.tags[i]);
          }
        }
      }

      this.tags = tags;
      this.refreshCaches();
    },
  },
});
</script>

<style lang="scss">
@media screen and (min-width: 500px) {
  .aioa-header-center {
    display: none;
  }
}

.aioa-header-center {
  display: inline-block;
  width: calc(100% - #{$header-left-width} - 400px);
  height: $navbar-height;
  line-height: 38px;
  overflow: hidden;

  &:hover {
    height: unset;
    overflow: unset;
  }

  a {
    color: white;
    display: inline-block;
    height: 100%;
    margin: 0 1px;
  }

  .el-tag:hover {
    border-color: gold;
  }

  .router-link-active .el-tag__content {
    color: gold !important;
  }
}
</style>
