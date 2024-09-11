<template>
  <div class="box">
    <div class="tab_left">
      <el-tabs
        tab-position="left"
        class="tab"
        v-model="tagTab"
        @tab-click="tabClick"
        style="height: 100%;"
      >
        <el-tab-pane
          v-for="(item, index) in dataList"
          :key="index"
          :label="item.label"
          :name="item.index"
        >
          <div class="box_right">
            <List
              :list="item.tagList"
              :maxTag="maxTag"
              :checkedList="checkedList"
              :groupList="groupList"
              :provs="provs"
            ></List>
            <div v-if="item.label == '位置选择'">
              <div class="city_box">
                <span>城市</span>
                <Select
                  class="select"
                  :checkedList="checkedList"
                  :groupList="groupList"
                  :provs="provs"
                ></Select>
              </div>
              <div
                class="city_tag_box"
                v-for="(item, index) in groupList"
                :key="index"
              >
                <li
                  v-if="item.name == '城市' && val.checked == true"
                  v-for="(val, i) in item.children"
                  :key="i"
                  class="city_tag"
                >
                  {{ val.name }}
                </li>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import List from './List'
import Select from './citySelect'
export default {
  components: {
    List,
    Select,
  },
  props: {
    //总数据
    dataList: {
      type: Array,
      default: () => [],
    },
    //选中的标签
    checkedList: {
      type: Array,
      default: () => [],
    },
    //选中的标签组
    groupList: {
      type: Array,
      default: () => [],
    },
    //最多能选择的标签个数
    maxTag: Number,
    tabActive: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      tagTab: this.tabActive ? this.tabActive : '0',
      cityList: { name: '城市', children: [] },
      provs: [
        { label: '北京市', value: '北京市', disable: false },
        { label: '天津市', value: '天津市', disable: false },
        { label: '河北省', value: '河北省', disable: false },
        { label: '山西省', value: '山西省', disable: false },
        { label: '内蒙古自治区', value: '内蒙古自治区', disable: false },
        { label: '辽宁省', value: '辽宁省', disable: false },
        { label: '吉林省', value: '吉林省', disable: false },
        { label: '黑龙江省', value: '黑龙江省', disable: false },
        { label: '上海市', value: '上海市', disable: false },
        { label: '江苏省', value: '江苏省', disable: false },
        { label: '浙江省', value: '浙江省', disable: false },
        { label: '安徽省', value: '安徽省', disable: false },
        { label: '福建省', value: '福建省', disable: false },
        { label: '江西省', value: '江西省', disable: false },
        { label: '山东省', value: '山东省', disable: false },
        { label: '河南省', value: '河南省', disable: false },
        { label: '湖北省', value: '湖北省', disable: false },
        { label: '湖南省', value: '湖南省', disable: false },
        { label: '广东省', value: '广东省', disable: false },
        { label: '广西壮族自治区', value: '广西壮族自治区', disable: false },
        { label: '海南省', value: '海南省', disable: false },
        { label: '重庆市', value: '重庆市', disable: false },
        { label: '四川省', value: '四川省', disable: false },
        { label: '贵州省', value: '贵州省', disable: false },
        { label: '云南省', value: '云南省', disable: false },
        { label: '西藏自治区', value: '西藏自治区', disable: false },
        { label: '陕西省', value: '陕西省', disable: false },
        { label: '甘肃省', value: '甘肃省', disable: false },
        { label: '青海省', value: '青海省', disable: false },
        { label: '宁夏回族自治区', value: '宁夏回族自治区', disable: false },
        {
          label: '新疆维吾尔自治区',
          value: '新疆维吾尔自治区',
          disable: false,
        },
        { label: '台湾省', value: '台湾省', disable: false },
        { label: '香港特别行政区', value: '香港特别行政区', disable: false },
        { label: '澳门特别行政区', value: '澳门特别行政区', disable: false },
      ],
    }
  },
  methods: {
    tabClick() {
      this.$emit('tabClick', this.tagTab)
    },
  },
}
</script>

<style lang="scss" scope>
.box {
  display: flex;
}
.box_right {
  margin: 15px 0 15px 10px;
}
.city_box {
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  color: #333333;
  margin-top: 30px;
  text-align: right;
  display: flex;
  align-items: center;
  span {
    width: 60px;
  }
  .select {
    padding-left: 10px;
    flex: 3;
  }
}
.city_tag_box {
  margin-left: 70px;
}
//标签样式
.city_tag {
  display: flex;
  min-width: 76px !important;
  height: 27px;
  line-height: 15px !important;
  font-size: 12px;
  font-weight: 400;
  padding: 5px;
  text-align: center;
  display: inline-block;
  margin: 8px 12px 0 0;
  color: #418ff6;
  background: rgba(65, 143, 246, 0.1);
  border-radius: 2px;
  border: 1px solid #418ff6;
}
.tab {
  .el-tabs__item {
    width: 100% !important;
    font-size: 14px;
    font-weight: 600;
    text-align: center !important;
  }
  .el-tabs__item.is-active {
    color: #409eff;
    background-color: #e9f2ff;
  }
  //灰色竖线
  .el-tabs__nav-wrap::after {
    width: 1px !important;
  }
  //active蓝色线
  .el-tabs__active-bar {
    width: 1px !important;
  }
}
</style>
