<template>
  <app-scroll-box class="page-clientsManage">
    <el-row class="pa-20">
      <el-card class="table-card mt-20">
        <el-row slot="header" class="clearfix">
          <el-row class="fl">
            <span class="title">疫区设置：{{ itemTitle }}</span>
          </el-row>
        </el-row>
        <div class="deliverySetting">
          <div
            class="deliverySetting-table"
            v-for="(item, idx) in countries"
            :key="idx"
          >
            <div
              class="table-body"
              v-for="(pro, idx2) in item.pros"
              :key="idx2"
            >
              <div class="first-col">
                <span
                  v-if="idx2 == 0"
                  style="
                    display: inline-block;
                    line-height: 30px;
                    cursor: pointer;
                  "
                >
                  <el-checkbox
                    @change="handleChecked('country', item)"
                    :label="item.cname"
                    v-model="item.checked"
                    :key="item.cid"
                  >
                    {{ item.cname }}
                  </el-checkbox>
                </span>
              </div>
              <div class="width120">
                <span
                  style="
                    display: inline-block;
                    line-height: 30px;
                    cursor: pointer;
                  "
                >
                  <el-checkbox
                    @change="handleChecked('pro', pro)"
                    :label="pro.pname"
                    v-model="pro.checked"
                    :key="pro.pid"
                  >
                    {{ pro.pname }}
                  </el-checkbox>
                </span>
              </div>
              <div class="width265">
                <el-checkbox
                  v-for="c in pro.cities"
                  v-model="c.checked"
                  :label="c.cityName"
                  :key="c.cityId"
                  @change="handleChecked('city', c)"
                >
                  {{ c.cityName }}
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-row>
  </app-scroll-box>
</template>
<script>
export default {
  name: 'deliverySetting',
  components: {},
  props: {},
  data() {
    return {
      itemTitle: '',
      itemId: 0,
      countries: [
        {
          cid: 1,
          cname: '中国',
          pid: '1',
          pname: '广东',
          cityId: 1,
          cityName: '深圳',
        },
        {
          cid: 1,
          cname: '中国',
          pid: '1',
          pname: '广东',
          cityId: 2,
          cityName: '肇庆',
        },
        {
          cid: 1,
          cname: '中国',
          pid: '2',
          pname: '湖北',
          cityId: 3,
          cityName: '武汉',
        },
        {
          cid: 1,
          cname: '中国',
          pid: '2',
          pname: '湖北',
          cityId: 4,
          cityName: '咸宁',
        },
        {
          cid: 1,
          cname: '中国',
          pid: '2',
          pname: '湖北',
          cityId: 5,
          cityName: '恩施',
        },
        {
          cid: 2,
          cname: '美国',
          pid: '3',
          pname: 'usa省州1',
          cityId: 6,
          cityName: 'usa-city-1',
        },
        {
          cid: 2,
          cname: '美国',
          pid: '3',
          pname: 'usa省州1',
          cityId: 7,
          cityName: 'usa-city-2',
        },
        {
          cid: 2,
          cname: '美国',
          pid: '3',
          pname: 'usa省州1',
          cityId: 8,
          cityName: 'usa-city-3',
        },
        {
          cid: 2,
          cname: '美国',
          pid: '4',
          pname: 'usa省州2',
          cityId: 9,
          cityName: 'usa-city-4',
        },
        {
          cid: 2,
          cname: '美国',
          pid: '4',
          pname: 'usa省州2',
          cityId: 10,
          cityName: 'usa-city-5',
        },
      ],
      checkedCities: [1, 4, 9, 10],
    }
  },
  computed: {},
  methods: {
    initPage() {
      let { itemId, itemTitle } = this.$route.query
      this.itemId = itemId
      this.itemTitle = itemTitle

      this.initAreaData()
    },
    //初始化数据
    initAreaData() {
      this.countries = this.countries.map((item) => {
        let res = item
        if (this.checkedCities.includes(item.cityId)) {
          res.checked = true
        } else {
          res.checked = false
        }
        return res
      })

      let resCities = []
      this.countries.forEach((item) => {
        let obj = {}
        let existsCountry = resCities.find((c) => {
          return c.cid == item.cid
        })

        if (existsCountry) {
          obj = existsCountry
        } else {
          obj.cid = item.cid
          obj.cname = item.cname
        }

        obj.checked = false

        if (!obj.pros) {
          obj.pros = []
        }

        let existsPro = obj.pros.find((c) => {
          return c.pid == item.pid
        })

        if (!existsPro) {
          existsPro = {
            pid: item.pid,
            pname: item.pname,
            checked: false,
          }
          obj.pros.push(existsPro)
        }

        if (!existsPro.cities) {
          existsPro.cities = []
        }

        existsPro.cities.push({
          cityId: item.cityId,
          cityName: item.cityName,
          checked: item.checked,
        })

        if (!existsCountry) {
          resCities.push(obj)
        }
      })

      this.countries = resCities
      this.opreationData()
    },
    //操作数据
    opreationData() {
      this.countries.forEach((c) => {
        c.pros.forEach((p) => {
          if (p.cities && p.cities.length > 0) {
            p.checked = p.cities.every((p) => p.checked)
          }
        })

        if (c.pros && c.pros.length > 0) {
          c.checked = c.pros.every((p) => p.checked)
        }
      })
    },
    handleChecked(level, item) {
      let isChecked = item.checked
      switch (level) {
        case 'country':
          if (item && item.pros) {
            item.pros.forEach((p) => {
              if (p.cities) {
                p.cities.forEach((c) => {
                  c.checked = isChecked
                })
              }
            })
          }
          break
        case 'pro':
          if (item && item.cities) {
            item.cities.forEach((c) => {
              c.checked = isChecked
            })
          }
          break
        case 'city':
          break
      }
      this.opreationData()
    },
  },
  created: function () {},
  mounted() {
    this.initPage()
  },
  watch: {},
}
</script>
<style>
.el-checkbox__label {
  padding-left: 5px;
}
.first-col {
  padding-left: 20px;
  width: 120px;
}
.deliverySetting {
  padding: 20px 0;
  position: relative;
}
.deliverySetting .el-table thead tr th {
  font-size: 14px;
}
.deliverySetting .el-table tbody tr td {
  vertical-align: baseline;
}
.deliverySetting .el-table tbody tr td p {
  line-height: 30px;
}
.deliverySetting .el-table tbody tr td .el-checkbox-group {
  display: flex;
  flex-direction: column;
}
.deliverySetting .el-table tbody tr td .el-checkbox-group label {
  line-height: 30px;
  margin-left: 0;
}
.deliverySetting .deliverySetting-table {
  font-size: 14px;
  color: #333;
}
.deliverySetting .deliverySetting-table .table-head,
.deliverySetting .deliverySetting-table .table-body {
  display: flex;
  padding: 10px 0;
}
.deliverySetting .deliverySetting-table .table-head .selection,
.deliverySetting .deliverySetting-table .table-body .selection {
  /* width: 45px; */
  text-align: center;
  line-height: 36px;
}
.deliverySetting .deliverySetting-table .table-head .width120,
.deliverySetting .deliverySetting-table .table-body .width120 {
  width: 120px;
}
/* .deliverySetting .deliverySetting-table .table-head .width265,
.deliverySetting .deliverySetting-table .table-body .width265 {
  width: 265px;
} */
.deliverySetting .deliverySetting-table .table-head {
  height: 36px;
  align-items: center;
  background-color: #e7f2ff;
}
.deliverySetting .deliverySetting-table .table-body {
  border-bottom: 1px solid #e4e4e4;
  color: #666;
}
.deliverySetting .deliverySetting-table .table-body:hover {
  background-color: #f5f7fa;
}
/* .deliverySetting .deliverySetting-table .table-body .width265 {
  display: flex;
  flex-direction: column;
} */
.deliverySetting .deliverySetting-table .table-body .width265 label {
  line-height: 30px;
  margin-left: 0;
  color: #666;
  padding: 0 5px;
}
.deliverySetting .deliverySetting-table .table-body p {
  line-height: 30px;
}
.deliverySetting .deliverySetting-btn {
  /*width: 100%;*/
  height: 59px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: -55px;
  right: -16px;
  z-index: 100;
}
.deliverySetting .deliverySetting-btn .tabs-btn {
  min-width: 90px;
  height: 34px;
  line-height: 32px;
  padding: 0 10px;
  color: #2387f7;
  border: solid 1px #4fa2ff;
  background-color: #e7f2ff;
  cursor: pointer;
}
.deliverySetting .deliverySetting-btn .tabs-btn:nth-of-type(2) {
  margin: 0 15px;
}
.deliverySetting .deliverySetting-btn .tabs-btn input {
  border: none;
  background: transparent;
  color: inherit;
  cursor: inherit;
  outline: none;
  margin: 0;
  padding: 0;
}
.deliverySetting .deliverySetting-btn .tabs-btn:hover {
  color: #fff;
  background-color: #2387f7;
}
.deliverySetting .setDistributorDailog .el-input {
  width: 270px;
}
</style>
