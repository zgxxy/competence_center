<template>
  <div ref="myChart" id="myChart" style="height: 180px; width: 100%;" />
</template>

<script>
import * as echarts from 'echarts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { thousandFormat } from '@/utils/public'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
])
export default {
  props: {
    // data: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   },
    // },
    data: {
      type: Array,
      default: () => [],
    },
    LineData: {
      type: Array,
      default: () => [],
    },
    xAxis: {
      type: Array,
      default: () => [],
    },
    //y轴上方的单位
    yName: {
      type: Array,
      default: () => [],
    },
    //y轴数据单位
    units: String,
    height: {
      type: String,
      default: '200px',
    },
    //是否显示legend
    legendShow: {
      type: Boolean,
      default: true,
    },
    //数据横向分布
    horizontal: Boolean,
    //x轴标签显示,隔几个显示
    interval: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    data: {
      deep: true,
      handler(newVal) {
        this.data = newVal
        this.init()
      },
    },
    LineData: {
      deep: true,
      handler(newVal) {
        this.LineData = newVal
        this.init()
      },
    },
    xAxis: {
      deep: true,
      handler(newVal) {
        this.xAxis = newVal
        this.init()
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      // console.log(thousandFormat(123456))
      const myChart = echarts.init(this.$refs.myChart)
      // this.data.forEach(e)
      let data1 = this.data[0].cdata
      let data2 = this.data[1]?.cdata
      let data3 = this.data[2]?.cdata
      let data4 = this.data[0].idata
      let data5 = this.data[1]?.idata
      let data6 = this.data[2]?.idata
      let legend = []
      let yName1 = this.yName[0] || ''
      let yName2 = this.yName[1] || ''
      this.data?.forEach((e) => {
        if (e.cname) {
          legend.push(e.cname)
        }
      })
      this.data?.forEach((e) => {
        if (e.iname) {
          legend.push(e.iname)
        }
      })
      const option = {
        barWidth: this.horizontal ? '50%' : '30%', //柱子宽度
        legend: {
          show: this.legendShow,
          itemHeight: 10,
          itemWidth: 20,
          textStyle: {
            fontSize: 12,
            color: '#333',
            // padding: [0, 0, 0, -8], // 修改文字和图标距离
          },
          data: legend,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter(params) {
            var relVal = params[0].name
            //横坐标为value时，会多一组数组，删掉
            if (that.horizontal) {
              params.pop()
            }
            for (var i = 0; i < params.length; i++) {
              if (params[i].data != '' || params[i].data > 0) {
                if (
                  params[i].seriesName == '占比' ||
                  params[i].seriesName.indexOf('率') != -1
                ) {
                  relVal +=
                    '<br/>' +
                    params[i].marker +
                    params[i].seriesName +
                    '<span style="font-weight:900;margin-left:10px;float: right;">' +
                    Number(params[i].value).toFixed(2) +
                    '%' +
                    '</span>'
                } else {
                  relVal +=
                    '<br/>' +
                    params[i].marker +
                    params[i].seriesName +
                    '<span style="font-weight:900;margin-left:10px;float: right;">' +
                    Number(params[i].value).toFixed(2) +
                    '</span>'
                }
              }
            }
            return relVal
          },
        },
        xAxis: {
          data: this.xAxis,
          name: this.horizontal ? yName1 : '',
          type: this.horizontal ? 'value' : 'category',
          splitLine: {
            //去除网格线
            show: false,
          },
          axisLabel: {
            show: true,
            // 强制显示所有标签
            interval: this.interval,
            textStyle: {
              fontSize: 9,
            },
            formatter: function (value) {
              var res = value
              // 长度超过4个的以省略号显示
              if (res.length > 10) {
                res = res.substring(0, 3) + '..'
              }
              return res
            },
          },
        },
        yAxis: [
          {
            type: this.horizontal ? 'category' : 'value',
            data: this.xAxis,
            splitLine: false, //背景线
            name: this.horizontal ? '' : yName1,
            //y标签值
            axisLabel: {
              show: true,
              interval: this.interval,
              formatter: function (value) {
                var res = value
                if (that.units) {
                  if (that.units.indexOf('万') != -1) {
                    res = res / 10000 + that.units
                  } else if (
                    that.units.indexOf('千') != -1 ||
                    that.units.indexOf('k') != -1
                  ) {
                    res = res / 1000 + that.units
                  } else {
                    res = res + that.units
                  }
                }
                return res
              },
              textStyle: {
                fontSize: 10,
              },
            },
            //刻度线
            axisTick: {
              show: false,
            },
          },
          {
            type: 'value',
            show: this.horizontal ? false : true,
            splitLine: false, //背景线
            name: yName2,
          },
        ],
        grid: {
          x: 10,
          x2: 15,
          top: 50,
          bottom: 10, //距离下边距
          containLabel: true,
        },
        series: [
          {
            name: this.data[0].cname,
            type: 'bar',
            stack: 'one',
            barMaxWidth: 20,
            itemStyle: {
              normal: {
                label: {
                  show: this.horizontal ? true : false, //标签数据显示
                  position: this.horizontal ? 'right' : 'top',
                  formatter: function (value) {
                    var res = value.value
                    if (
                      value.seriesName == '占比' ||
                      value.seriesName.indexOf('率') != -1
                    ) {
                      res = res + '%'
                      return res
                    } else {
                      return thousandFormat(res)
                    }
                  },
                  textStyle: {
                    color: 'black',
                    fontSize: 10,
                  },
                },
                barBorderRadius: [30, 30, 30, 30],
                // barBorderRadius:
                //   this.data.length > 1 ? [0, 0, 30, 30] : [30, 30, 30, 30],
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: '#AECBFF' },
                  { offset: 1, color: '#5EA3FF' },
                ]),
              },
            },
            barGap: '0%',
            data: data1,
          },
          {
            name: this.data[1]?.cname,
            type: 'bar',
            stack: 'one',
            barWidth: 15,
            itemStyle: {
              normal: {
                label: {
                  show: this.horizontal ? true : false, //标签数据显示
                  position: this.horizontal ? 'right' : 'top',
                  formatter: function (value) {
                    var res = value.value
                    if (
                      value.seriesName == '占比' ||
                      value.seriesName.indexOf('率') != -1
                    ) {
                      res = res + '%'
                      return res
                    } else {
                      return thousandFormat(res)
                    }
                  },
                  textStyle: {
                    color: 'black',
                    fontSize: 10,
                  },
                },
                barBorderRadius: [30, 30, 30, 30],
                // barBorderRadius:
                //   this.data.length > 1 ? [30, 30, 0, 0] : [30, 30, 30, 30],
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: '#FBF676' },
                  { offset: 1, color: '#FFD067' },
                ]),
              },
            },
            barGap: '0%',
            data: data2,
          },
          {
            name: this.data[2]?.cname,
            type: 'bar',
            stack: 'one',
            barWidth: 15,
            itemStyle: {
              normal: {
                label: {
                  show: this.horizontal ? true : false, //标签数据显示
                  position: this.horizontal ? 'right' : 'top',
                  formatter: function (value) {
                    var res = value.value
                    if (
                      value.seriesName == '占比' ||
                      value.seriesName.indexOf('率') != -1
                    ) {
                      res = res + '%'
                      return res
                    } else {
                      return thousandFormat(res)
                    }
                  },
                  textStyle: {
                    color: 'black',
                    fontSize: 10,
                  },
                },
                barBorderRadius: [30, 30, 30, 30],
                // barBorderRadius:
                //   this.data.length > 1 ? [30, 30, 0, 0] : [30, 30, 30, 30],
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: '#d4f8bf' },
                  { offset: 1, color: '#b4e798' },
                ]),
              },
            },
            barGap: '0%',
            data: data3,
          },
          {
            name: this.data[0].iname,
            type: 'line',
            smooth: true,
            symbol: 'none',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                label: {
                  show: false, //标签数据显示
                  position: 'bottom',
                  // formatter: '{c}%', //显示百分号
                  formatter: function (value) {
                    var res = value.value
                    if (
                      value.seriesName == '占比' ||
                      value.seriesName.indexOf('率') != -1
                    ) {
                      res = res + '%'
                    }
                    return res
                  },
                  textStyle: {
                    color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
                    fontSize: 10,
                  },
                },
                color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
              },
            },
            data: data4,
          },
          {
            name: this.data[1]?.iname,
            type: 'line',
            smooth: true,
            symbol: 'none',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#FFB365',
              },
            },
            data: data5,
          },
          {
            name: this.data[2]?.iname,
            type: 'line',
            smooth: true,
            symbol: 'none',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#97d376',
              },
            },
            data: data6,
          },
        ],
      }
      // option && myChart.setOption(option, true)
      setTimeout(function () {
        option && myChart.setOption(option, true)
        window.addEventListener('resize', function () {
          myChart.resize()
        })
      }, 200)
    },
  },
}
</script>

<style></style>
