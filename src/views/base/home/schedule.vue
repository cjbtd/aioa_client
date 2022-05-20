<template>
  <el-card class="aioa-schedule">
    <template #header>
      <router-link :to="url">{{ $utils._T("_T0120") }}</router-link>
      <span style="color: red">{{ lunarYear }}</span>
    </template>
    <el-calendar ref="schedule" v-model="calendarValue">
      <template #header="{ date }">
        <span>{{ date }}</span>
        <el-button-group>
          <el-button @click="selectDate('prev-year')">
            {{ $utils._T("_T0121") }}
          </el-button>
          <el-button @click="selectDate('prev-month')">
            {{ $utils._T("_T0122") }}
          </el-button>
          <el-button @click="selectDate('today')">
            {{ $utils._T("_T0123") }}
          </el-button>
          <el-button @click="selectDate('next-month')">
            {{ $utils._T("_T0124") }}
          </el-button>
          <el-button @click="selectDate('next-year')">
            {{ $utils._T("_T0125") }}
          </el-button>
        </el-button-group>
      </template>
      <template #dateCell="{ data }">
        <span class="solar-day" @click="newCalendar(data.day)">
          {{ data.date.getDate() }}
        </span>
        <span class="lunar-day">
          {{ getLunar(data.day) }}
        </span>
        <div>
          <template v-for="info in getCalendarInfos(data.day)">
            <el-tooltip
              v-if="info[5]"
              :key="'tooltip' + info[1]"
              placement="left"
              style="margin-right: 3px"
            >
              <template #content>
                <pre>{{ info[5] }}</pre>
              </template>
              <el-badge is-dot>
                <el-tag
                  size="small"
                  disable-transitions
                  :type="typeMap[info[4]]"
                  @click="jumpCalendarInfo(info)"
                >
                  {{ info[1] }}
                </el-tag>
              </el-badge>
            </el-tooltip>
            <el-tag
              v-else
              :key="'tag' + info[1]"
              size="small"
              disable-transitions
              :type="typeMap[info[4]]"
              @click="jumpCalendarInfo(info)"
              style="margin-right: 3px"
            >
              {{ info[1] }}
            </el-tag>
          </template>
          <el-tag
            v-if="termInfo[data.day]"
            size="small"
            type="success"
            disable-transitions
            style="margin-right: 3px"
          >
            {{ termInfo[data.day] }}
          </el-tag>
        </div>
      </template>
    </el-calendar>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import calendar from "~/utils/calendar";

type Info = [number, string, string, string, "0" | "1" | "2" | "3", string];

export default defineComponent({
  name: "home",
  data() {
    let days: Array<string> = [];
    let calendarInfos: Array<Info> = [];
    let typeMap: Record<string, any> = {
      "0": "",
      "1": "warning",
      "2": "info",
      "3": "danger",
    };
    let termInfo: Record<string, any> = {};

    return {
      url: "/datacenter/calendar",
      calendarValue: new Date(),
      days,
      calendarInfos,
      typeMap,
      lunarYear: "",
      termInfo,
    };
  },
  mounted() {
    this.loadCalendarInfos(this.calendarValue);
  },
  watch: {
    calendarValue(val, oldVal) {
      if (val.getMonth() !== oldVal.getMonth()) {
        this.loadCalendarInfos(val);
      }
    },
  },
  methods: {
    selectDate(value: string) {
      (this.$refs as any).schedule.selectDate(value);
    },
    newCalendar(day: string) {
      let insert_dict = {
        BEGIN_DT: day + " 00:00:00",
        END_DT: day + " 23:59:59",
      };

      this.$router.push(
        this.url +
          "?_init_pk=0&_init_form=" +
          encodeURIComponent(JSON.stringify(insert_dict))
      );
    },
    jumpCalendarInfo(info: Info) {
      if (["0", "1"].indexOf(info[4]) > -1) return false;

      this.$router.push(
        this.url + "?id={0}&_init_pk={0}&_init_status=1".format(info[0])
      );
    },
    getCalendarInfos(day: string) {
      return this.calendarInfos.filter((info) => {
        return (
          day >= info[2].substring(0, 10) && day <= info[3].substring(0, 10)
        );
      });
    },
    loadCalendarInfos(now: Date) {
      let day = this.getFirstDay(now);

      this.$request({
        url: "/base/calendar",
        params: { day },
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          this.calendarInfos = data;
        }
      });
    },
    getFirstDay(day: Date) {
      const fmtDate = this.$settings.FMT.date;
      let now = new Date(day.format(fmtDate).substring(0, 8) + "01");
      let diff = now.getDay() - 1;
      if (diff === -1) diff = 6;

      return new Date(now.valueOf() - diff * (24 * 60 * 60 * 1000)).format(
        fmtDate
      );
    },
    getLunar(day: string) {
      const [y, m, d] = day.split("-");
      let lunarDay = calendar.solar2lunar(
        parseInt(y),
        parseInt(m),
        parseInt(d)
      );

      if (typeof lunarDay === "number") return "";

      this.termInfo[day] = lunarDay.Term;

      if (lunarDay.cDay === 1) {
        this.lunarYear =
          lunarDay.gzYear +
          "(" +
          lunarDay.Animal +
          ")年 " +
          lunarDay.gzMonth +
          "月";
      }

      return lunarDay.lDay === 1
        ? lunarDay.IMonthCn + " " + lunarDay.IDayCn
        : lunarDay.IDayCn;
    },
  },
});
</script>

<style lang="scss">
.aioa-schedule {
  .solar-day {
    font-weight: bold;
  }

  .lunar-day {
    font-size: 14px;
    float: right;
  }

  .el-calendar-day {
    height: unset !important;
    min-height: 85px;
  }
}
</style>
