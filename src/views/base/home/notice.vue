<template>
  <el-card class="aioa-notice">
    <template #header>
      <router-link :to="url">{{ $utils._T("_T0111") }}</router-link>
    </template>
    <p v-for="item in notices" :key="item.id">
      <router-link :to="`${url}?_init_rel=${item.id}`">
        {{ item.TITLE }}
      </router-link>
      <span>
        {{ $filters.display_datetime($filters.format_datetime(item.idt)) }}
      </span>
    </p>
    <el-empty v-if="notices.length === 0" />
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    let notices: Array<any> = [];

    return {
      url: "/datacenter/notice",
      notices,
    };
  },
  mounted() {
    this.$request({
      url: this.url,
      params: { status: 1, _init: false },
    }).then((res) => {
      let { status, data } = res.data;

      if (status === this.$settings.STATUS.ok) {
        this.notices = data.table || [];
      }
    });
  },
});
</script>

<style lang="scss">
.aioa-notice {
  .el-card__body > p {
    border-bottom: 1px dotted #ddd;
    padding-bottom: 5px;
    margin-bottom: 5px;

    & > span {
      float: right;
    }
  }
}
</style>
