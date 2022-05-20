<template>
  <div>
    <el-form :inline="true" class="aioa-mail-search">
      <el-form-item>
        <el-select v-model="who" @change="handleMail()">
          <el-option :label="$utils._T('_T0049')" value="me" />
          <el-option :label="$utils._T('_T0050')" value="by" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="read" @change="handleMail()">
          <el-option :label="$utils._T('_T0048')" value="n" />
          <el-option :label="$utils._T('_T0047')" value="y" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="txt" @keyup.enter="handleMail()">
          <template #prepend>
            <el-select
              v-model="label"
              @change="handleMail()"
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
          </template>
          <template #append>
            <el-button icon="search" @click="handleMail()"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="edit" @click="subDialog.visible = true"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="setting" @click="openSetting()"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleMail(true, true)">
          {{ $utils._T("_T0052") }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="aioa-mail-list">
      <el-alert
        v-for="item in items"
        :type="item.is_read ? 'info' : 'success'"
        :key="item.id"
        :title="item.title"
        :closable="false"
        @click="readMail(item)"
      >
        {{ $filters.display_datetime($filters.format_datetime(item.edt)) }} -
        {{ who === "me" ? `from: ${item.by} ` : `to:  ${item.me}` }}
        <el-tag
          v-if="item.label"
          @click.stop="
            label = item.label;
            handleMail();
          "
        >
          {{ item.label }}
        </el-tag>
      </el-alert>
    </div>
    <el-pagination
      @current-change="handleMail(true)"
      layout="total, prev, pager, next, jumper"
      :page-size="10"
      :page-sizes="[10]"
      :total="total"
      v-model:current-page="currentpage"
    />
    <mail-content v-if="dialog.visible" :dialog="dialog" :pk="pk" />
    <aioa-dialog v-if="subDialog.visible" :opts="subDialog">
      <mail-send :dialog="subDialog" />
    </aioa-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AioaDialog from "~/components/dialog/index.vue";
import MailSend from "./send.vue";
import MailContent from "./content.vue";

interface Item {
  id: number;
  by: string;
  me: string;
  is_read: boolean;
  title: string;
  label: string;
  edt: string;
}

export default defineComponent({
  components: { AioaDialog, MailSend, MailContent },
  data() {
    let items: Array<Item> = [];

    return {
      txt: "",
      who: "me",
      read: "n",
      currentpage: 1,
      label: "",
      labels: [],
      total: 0,
      items,
      pk: 0,
      dialog: {
        visible: false,
        title: "",
        class: "aioa-dialog-fit-form",
      },
      subDialog: {
        visible: false,
        title: this.$utils._T("_T0059"),
        class: "aioa-dialog-fit-form",
      },
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
    this.handleMail();
  },
  methods: {
    handleMail(isScroll: boolean = false, isSetRead = false) {
      if (!isScroll) this.currentpage = 1;

      this.$request({
        url: "/chat/usermail",
        params: {
          _type: isSetRead ? "setRead" : null,
          txt: this.txt,
          who: this.who,
          read: this.read,
          label: this.label,
          currentpage: this.currentpage,
        },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.items = data.data;
          this.total = data.total;
          this.currentpage = data.currentpage;

          this.read === "n" &&
            this.who === "me" &&
            !this.txt &&
            !this.label &&
            this.$store.commit("SET_TOTAL", this.total);
        }
      });
    },
    readMail(item: Item) {
      this.pk = item.id;
      this.dialog.title = item.title;
      this.dialog.visible = true;

      if (item.me === this.me) item.is_read = true;
    },
    openSetting() {
      this.$store.commit("SET_CONF_NAME", "mail");
    },
  },
});
</script>

<style lang="scss">
.aioa-mail-search .el-form-item {
  margin-right: 5px;

  &:nth-child(1),
  &:nth-child(2) {
    width: 100px;
  }

  &:nth-child(3) {
    width: 336px;
  }

  .el-input-group__prepend {
    background-color: #fff;
    width: 100px;
  }
}

.aioa-mail-list {
  min-height: 618px;

  .el-alert {
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 5px;

    &:hover {
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
      transition: all 0.25s;
    }
  }

  .el-alert__title {
    color: #333399 !important;
  }

  .el-alert__description {
    color: #5f5f0b !important;
  }

  .el-alert__close-btn {
    color: red !important;
  }
}
</style>
