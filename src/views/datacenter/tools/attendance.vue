<template>
  <div>
    <div>
      <el-select v-model="companyName" style="width: 150px; margin-right: 10px">
        <el-option
          v-for="item in DC.columns?.GS?.enums || []"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        type="month"
        value-format="YYYY-MM"
        v-model="selectMonth"
        style="width: 120px; margin-right: 10px"
      />
      <el-button v-print:[id]>{{ $utils._T("print") }}</el-button>
    </div>
    <div :id="id">
      <div
        v-for="(table, group) in groups"
        :key="group + '' + $utils.uuid()"
        style="
          width: 29.7cm;
          height: 20.7cm;
          box-sizing: border-box;
          padding: 5px;
        "
      >
        <p style="font-size: 20px; text-align: center">
          {{ year }}年{{ month }}月份考勤表
        </p>
        <p style="font-size: 16px">
          {{ companyName }}
          <span style="float: right">
            <span v-for="(name, symbol) in symbols" :key="name">
              &nbsp;&nbsp;{{ symbol }}：{{ name }}
            </span>
          </span>
        </p>
        <table>
          <thead>
            <tr>
              <th rowspan="2">姓名</th>
              <th>星期</th>
              <th v-for="(week, index) in weekList" :key="index + week">
                {{ week }}
              </th>
              <th rowspan="2" style="width: 35px">月全<br />勤/时</th>
              <th style="width: 35px">事假</th>
              <th style="width: 35px">病假</th>
              <th rowspan="2" style="width: 35px">其它<br />请假</th>
              <th rowspan="2" style="width: 35px">漏打卡<br />（次）</th>
              <th rowspan="2" :style="{ width: kqWidth + 'px' }">
                考勤<br />签名
              </th>
            </tr>
            <tr>
              <th>日</th>
              <th v-for="(week, index) in weekList" :key="index + week">
                {{ index + 1 }}
              </th>
              <th>小时</th>
              <th>小时</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rid) in table" :key="rid + '' + $utils.uuid()">
              <td
                v-for="(col, cid) in row"
                :key="cid + '' + $utils.uuid()"
                :colspan="cid === 0 ? 2 : 1"
              >
                {{ col }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "~/styles/print.css";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["DC_KEY", "params", "kwargs", "dialog"],
  data() {
    let weekList: Array<any> = [];
    let groups: Array<any> = [];

    return {
      id: "aioa-dc-tool-attendance",
      companyName: "",
      selectMonth: "",
      year: "",
      month: "",
      weekNames: ["日", "一", "二", "三", "四", "五", "六"],
      weekList,
      workTime: 174,
      groups,
      symbols: {
        出勤: "√",
        事假: "◯",
        病假: "★",
        其它请假: "☆",
        漏打卡: "⊗",
        放假: "□",
      },
      kqWidth: 75,
    };
  },
  computed: {
    DC() {
      return this.$store.state.dcs[this.DC_KEY];
    },
  },
  watch: {
    companyName() {
      this.change();
    },
    selectMonth() {
      this.change();
    },
  },
  methods: {
    change() {
      this.weekList = [];
      this.groups = [];

      if (!this.companyName || !this.selectMonth) return false;

      this.year = this.selectMonth.substring(0, 4);
      this.month = this.selectMonth.substring(5);

      let lastDay = new Date(
        parseInt(this.year),
        parseInt(this.month),
        0
      ).getDate();
      let firstWeek = new Date(this.selectMonth).getDay();

      for (let i = 0; i < lastDay; i++) {
        this.weekList.push(this.weekNames[(firstWeek + i) % 7]);
      }

      this.kqWidth += (31 - lastDay) * 25;

      let range = [
        this.selectMonth + "-01 00:00:00",
        this.selectMonth + "-" + lastDay + " 23:59:59",
      ];

      this.$request({
        url: this.DC.path,
        params: Object.assign(this.params, {
          companyName: this.companyName,
          range,
        }),
      }).then((res) => {
        let { status, data } = res.data;

        if (status === this.$settings.STATUS.ok) {
          let { da, ldk, qj, jjr } = data;
          let excluded = this.kwargs.excluded || [];

          let groups = [];
          let table = [];
          for (let i = 0; i < da.length; i++) {
            if ((i + 1) % 21 === 0) {
              groups.push(table);
              table = [];
            } else {
              let row = [];
              let [user, name] = da[i];
              row.push(name);

              let sj = 0,
                bj = 0,
                qt = 0,
                ld = 0,
                show = "";

              let calced = [];

              for (let j = 0; j < this.weekList.length; j++) {
                let day = j + 1;
                let dt = this.selectMonth + "-" + (day < 10 ? "0" + day : day);
                let isWorkDay = ["六", "日"].indexOf(this.weekList[j]) === -1;

                for (let k = 0; k < jjr.length; k++) {
                  if (
                    jjr[k][0] <= dt + "T23:59:59" &&
                    jjr[k][1] >= dt + "T00:00:00"
                  ) {
                    isWorkDay = jjr[k][2] === "1";
                  }
                }

                if (!isWorkDay) show = this.symbols["放假"];

                if (isWorkDay && excluded.indexOf(user) === -1) {
                  for (let k = 0; k < qj.length; k++) {
                    if (
                      user === qj[k][0] &&
                      qj[k][2] <= dt + "T23:59:59" &&
                      qj[k][3] >= dt + "T00:00:00"
                    ) {
                      switch (qj[k][1]) {
                        case "事假":
                          if (calced.indexOf(k) === -1) sj += qj[k][4];
                          show += this.symbols["事假"];
                          break;
                        case "病假":
                          if (calced.indexOf(k) === -1) bj += qj[k][4];
                          show += this.symbols["病假"];
                          break;
                        default:
                          if (calced.indexOf(k) === -1) qt += qj[k][4];
                          show += this.symbols["其它请假"];
                      }
                      calced.push(k);
                    }
                  }

                  for (let k = 0; k < ldk.length; k++) {
                    if (user === ldk[k][0] && ldk[k][1] === dt) {
                      ld++;
                      show += this.symbols["漏打卡"];
                    }
                  }
                }

                row.push(show === "" ? this.symbols["出勤"] : show);
                show = "";
              }

              row.push(this.workTime);
              row.push(sj ? parseFloat((sj / 60.0).toFixed(2)) : "");
              row.push(bj ? parseFloat((bj / 60.0).toFixed(2)) : "");
              row.push(qt ? parseFloat((qt / 60.0).toFixed(2)) : "");
              row.push(ld || "");
              row.push("");

              table.push(row);
            }
          }

          if (table.length) groups.push(table);

          this.groups = groups;
        }
      });
    },
  },
});
</script>
