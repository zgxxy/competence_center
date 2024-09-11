<template>
  <div>
    <div class="select_box">
      <!--联动选择省份后选择城市-->
      <div>
        <el-select
          size="small"
          style="width: 130px; margin-right: 10px;"
          v-model="selectProv"
          placeholder="请选择省份"
          v-on:change="getProv($event)"
          :filterable="true"
          clearable
        >
          <el-option
            v-for="item in provs"
            :label="item.label"
            :value="item.value"
            :disabled="item.disable"
          ></el-option>
        </el-select>
      </div>
      —
      <div>
        <el-select
          size="small"
          style="width: 130px; margin: 10px;"
          v-model="selectCity"
          placeholder="请选择城市"
          v-on:change="getCity($event)"
          :filterable="true"
          clearable
        >
          <el-option
            v-for="item in citys"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-button type="" class="addBtn" @click="addCity">
          添加
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import cityData from '@/assets/data/cityData.json'
import { getCityList } from '@/api/crowdControl'
export default {
  props: {
    checkedList: {
      type: Array,
      default: () => [],
    },
    groupList: {
      type: Array,
      default: () => [],
    },
    provs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cityList: { name: '城市', children: [] },
      citys: [],
      selectProv: '',
      selectCity: '',
      cityData: [],
    }
  },
  mounted() {
    this.getCityData()
  },
  methods: {
    async getCityData() {
      let res = await getCityList()
      if (res.code == 200) {
        this.cityData = res.data
      }
    },
    /*二级联动选择地区*/
    getProv: function (prov) {
      let tempCity = []
      this.citys = []
      this.selectCity = ''
      let allCity = this.cityData
      for (var val of allCity) {
        if (prov == val.prov) {
          console.log(val)
          tempCity.push({ label: val.label, value: val.value })
        }
      }
      this.citys = tempCity
    },
    getCity: function (city) {
      console.log(this.selectCity)
    },
    //添加城市
    addCity() {
      if (this.selectCity) {
        let repeat = false
        let cityName = ''
        //储存城市label
        this.citys.forEach((e) => {
          if (this.selectCity == e.value) {
            cityName = e.label
          }
        })
        this.checkedList.forEach((val) => {
          if (this.selectCity == val.value) {
            this.$message.warning('请勿重复添加城市！')
            repeat = true
          }
        })
        if (!repeat) {
          this.cityList.children.push({
            name: cityName,
            value: this.selectCity,
            checked: true,
          })
          this.checkedList.push({
            name: cityName,
            value: this.selectCity,
            checked: true,
          })
          this.groupList.push(this.cityList)
        }
      } else {
        this.$message.warning('请选择要添加的城市！')
      }
      for (let i = 0; i < this.groupList.length; i++) {
        for (let j = i + 1; j < this.groupList.length; j++) {
          if (this.groupList[i].name == this.groupList[j].name) {
            this.groupList[i].children.push(...this.groupList[j].children)
            this.groupList.splice(j, 1)
            j--
          }
        }
      }
      this.groupList.forEach((e) => {
        for (let i = 0; i < e.children.length; i++) {
          for (let j = i + 1; j < e.children.length; j++) {
            if (e.children[i].name == e.children[j].name) {
              e.children.splice(j, 1)
              j--
            }
          }
        }
      })
      console.log(this.checkedList, '添加城市-标签')
      console.log(this.groupList, '添加城市-标签组')
    },
  },
}
</script>

<style scoped lang="scss">
.select_box {
  display: flex;
  align-items: center;
}
.el-button.addBtn {
  border-color: #66b1ff;
  color: #66b1ff;
}
</style>
