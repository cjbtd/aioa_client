<template>
  <div class="aioa-onliners">
    <div class="bs">
      <el-input v-model="txt" clearable>
        <template #append>
          <el-button @click="loadData">
            {{ $utils._T("_T0062") }} ({{ tips }})
          </el-button>
        </template>
      </el-input>
      <el-button type="warning" @click="openBroadcast()">
        {{ $utils._T("_T0063") }}
      </el-button>
    </div>
    <div class="bs">
      <template v-for="(item, index) in list" :key="item.username">
        <el-popover
          trigger="hover"
          effect="dark"
          width="unset"
          :show-after="888"
          :placement="index >= 108 ? 'top' : 'bottom'"
        >
          <template #reference>
            <el-badge :value="item.un_pushed">
              <el-button
                :type="item.is_online ? 'primary' : 'info'"
                @click="openBroadcast(item)"
                @contextmenu.prevent="edit(item.pk, item.gid)"
              >
                {{ item.username }}({{ item.full_name }})
              </el-button>
            </el-badge>
          </template>
          <pre style="font-family: courier new">{{
            JSON.stringify(item.info, null, 4)
          }}</pre>
        </el-popover>
      </template>
    </div>
    <aioa-dialog v-if="dialog.visible" :opts="dialog">
      <broadcast :dialog="dialog" :list="list" :username="username" />
    </aioa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import Broadcast from "./broadcast.vue";

interface UserInfo {
  username: string;
  full_name: string;
  is_online: boolean;
  un_pushed: number;
  info: Record<string, string>;
  pk: any;
  gid: number;
}

export default defineComponent({
  name: "onliners",
  components: { AioaDialog, Broadcast },
  data() {
    let users: Array<UserInfo> = [];
    let list: Array<UserInfo> = [];

    return {
      txt: "",
      tips: "0/0",
      users,
      list,
      username: "",
      dialog: {
        title: this.$utils._T("_T0063"),
        visible: false,
      },
    };
  },
  watch: {
    txt(val) {
      if (val) {
        this.list = this.users.filter(
          (item) => (item.username + item.full_name).indexOf(val) >= 0
        );
      } else {
        this.list = this.users;
      }
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    edit(pk: any, gid: number) {
      if (pk) {
        this.$router.push(
          `/datacenter/staff?gid=${gid}&id=${pk}&_init_pk=${pk}&_init_status=1`
        );
      }
    },
    loadData() {
      this.$request({ url: this.$route.path }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          let count = 0;

          data.filter((item: UserInfo) => (item.is_online ? count++ : ""));

          this.users = data;
          this.list = data;
          this.tips = count + "/" + data.length;
          this.txt = "";
        }
      });
    },
    openBroadcast(user?: UserInfo) {
      this.username = user ? user.username : "";
      this.dialog.visible = true;
    },
  },
});
</script>

<style lang="scss">
.aioa-onliners {
  & > div:first-child {
    padding: 5px;
    display: flex;
    align-items: center;

    .el-input {
      width: 300px;
      margin-right: 10px;
    }
  }

  & > div:nth-child(2) {
    .el-badge {
      margin: 3px 12px 3px 3px;

      .el-button {
        padding: 5px;
        width: 140px;
        font-size: 15px;
      }
    }
  }
}
</style>
