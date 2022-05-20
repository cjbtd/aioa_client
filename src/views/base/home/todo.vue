<template>
  <el-card class="aioa-todo">
    <template #header>
      <el-badge
        :value="count"
        :type="count < 5 ? 'primary' : count < 10 ? 'warning' : 'danger'"
      >
        <router-link :to="url"> {{ $utils._T("_T0119") }} </router-link>
      </el-badge>
      <span>
        <el-button icon="refresh" @click="handleTodoList()" />
        <el-button icon="plus" @click="$router.push(`${url}?_init_pk=0`)" />
      </span>
    </template>
    <el-tabs v-if="tagName" v-model="tagName">
      <el-tab-pane
        v-for="(list, tag) in todoList"
        :key="tag"
        :name="tag"
        :label="tag + ' (' + Object.keys(list).length + ')'"
      >
        <el-alert
          v-for="row in list"
          :key="row.id + ''"
          type="success"
          @close="handleTodoList(row.id)"
        >
          <template #title>
            <router-link :to="`${url}?id=${row.id}`" style="color: #ff9800">
              {{ $utils._T("view") }}
            </router-link>
            <router-link
              :to="`${url}?id=${row.id}&_init_pk=${row.id}`"
              style="color: #000000"
            >
              {{ ` [${row["PRIORITY"]}] ` }}
            </router-link>
            <template v-if="row['URL']">
              <router-link v-if="row['URL'][0] === '/'" :to="row['URL']">
                {{ row["CONTENT"] }}
              </router-link>
              <a
                v-else
                target="_blank"
                rel="noopener norefferrer"
                :href="row['URL']"
              >
                {{ row["CONTENT"] }}
              </a>
            </template>
            <span v-else>{{ row["CONTENT"] }}</span>
          </template>
        </el-alert>
      </el-tab-pane>
    </el-tabs>
    <el-empty v-else />
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    let tagName: string = "";
    let todoList: any = {};

    return {
      url: "/datacenter/todolist",
      count: 0,
      tagName,
      todoList,
    };
  },
  mounted() {
    this.handleTodoList();
  },
  methods: {
    handleTodoList(pk = 0) {
      this.$request({
        url: this.url,
        method: pk ? "POST" : "GET",
        params: { size: 100, status: 0, _init: false },
        data: { _pks: [pk], _command: "0" },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          const table: Array<any> = data?.table || [];

          this.count = table.length;
          let todoList: Record<string, Array<any>> = {};

          let tagName = null;

          if (this.count > 0) {
            tagName = table[0]["TAG"];

            table.forEach((row) => {
              if (row["TAG"] in todoList) {
                todoList[row["TAG"]].push(row);
              } else {
                todoList[row["TAG"]] = [row];
              }
            });
          }

          if (!this.tagName || !todoList[this.tagName]) this.tagName = tagName;

          this.todoList = todoList;
        }
      });
    },
  },
});
</script>

<style lang="scss">
.aioa-todo {
  .el-alert {
    margin: 5px 0;
  }
  .el-alert__title {
    font-size: 18px;
    color: #333399;
  }
  .el-badge__content.is-fixed {
    right: 0;
  }
}
</style>
