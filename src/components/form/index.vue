<template>
  <el-form :inline="true" class="aioa-form">
    <template v-for="[fKey, fOpt] in Object.entries(form)" :key="fKey">
      <el-divider v-if="fOpt.divider !== undefined" class="aioa-divider">
        {{ fOpt.divider ? $utils._T(fOpt.divider) : "" }}
      </el-divider>
      <el-form-item v-show="isShow(fOpt)">
        <template #label>
          <div
            :style="{ color: fOpt?.null === false ? 'red' : 'black' }"
            :title="fOpt.label"
          >
            {{ fOpt.label }}
          </div>
        </template>
        <component
          :is="'form-' + (fOpt.type || 'str')"
          :form="form"
          :fKey="fKey"
          :fOpt="fOpt"
          :isRest="isRest"
        />
      </el-form-item>
    </template>
    <div style="text-align: right">
      <el-button @click="isRest = !isRest" style="margin: 10px 10px 10px 5px">
        {{ $utils._T("empty") }}
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import FormCascade from "./cascade.vue";
import FormDate from "./date.vue";
import FormDatetime from "./datetime.vue";
import FormEnum from "./enum.vue";
import FormFile from "./file.vue";
import FormNum from "./str.vue";
import FormRemote from "./remote.vue";
import FormRichtext from "./richtext.vue";
import FormStr from "./str.vue";
import FormText from "./text.vue";
import FormTime from "./time.vue";
import { Column } from "~/store/index.d";

interface FormItem extends Column {
  val?: string | number | boolean | null;
}

interface Form {
  [key: string]: FormItem;
}

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<Form>,
      required: true,
    },
  },
  components: {
    FormStr,
    FormNum,
    FormText,
    FormRichtext,
    FormFile,
    FormEnum,
    FormRemote,
    FormCascade,
    FormDate,
    FormTime,
    FormDatetime,
  },
  data() {
    return {
      isRest: false,
    };
  },
  computed: {
    isShow() {
      return (fOpt: FormItem) => {
        let refVal = this.form?.[fOpt.ref]?.val;
        let filters = fOpt.filters || [refVal];

        // return !refVal || filters.indexOf(refVal) >= 0 || !!(fOpt.val = null);
        return filters.indexOf(refVal) >= 0 || !!(fOpt.val = null);
      };
    },
  },
});
</script>

<style lang="scss">
.aioa-form {
  .el-form-item {
    margin: 0 0 3px 3px;
  }

  .el-form-item__label {
    width: 80px;
    color: black;
    white-space: nowrap;
  }

  .el-input {
    width: 250px;
  }

  .el-input__inner {
    color: blue;
  }

  .el-range-input {
    color: blue;
  }
}
</style>
