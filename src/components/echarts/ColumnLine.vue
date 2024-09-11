<template>
  <div ref="myChart" id="myChart" style="height: 220px; width: 100%;" />
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

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
])
export default {
  props: {
    columnData: {
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
    yName: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    columnData: {
      deep: true,
      handler(newVal) {
        this.columnData = newVal
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
      const myChart = echarts.init(this.$refs.myChart)
      let data1 = this.columnData[0]?.cdata
      let data2 = this.columnData[1]?.cdata
      let data3 = this.columnData[2]?.cdata
      let data4 = this.columnData[0]?.idata
      let data5 = this.columnData[1]?.idata
      let data6 = this.columnData[2]?.idata
      let legend = []
      let yName1 = this.yName[0] || ''
      let yName2 = this.yName[1] || ''
      this.columnData.forEach((e) => {
        if (e.cname) {
          legend.push(e.cname)
        }
      })
      this.columnData.forEach((e) => {
        if (e.iname) {
          legend.push(e.iname)
        }
      })
      //有一根柱子时
      let series1 = [
        {
          name: this.columnData[0].cname,
          type: 'bar',
          barMaxWidth: 20,
          barGap: 0,
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
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
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#AECBFF' },
                { offset: 1, color: '#5EA3FF' },
              ]),
            },
          },
          data: data1,
        },
        {
          name: this.columnData[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: this.columnData.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.columnData.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
      ]
      //有两根柱子时
      let series2 = [
        //第一根柱子
        {
          name: this.columnData[0].cname,
          type: 'bar',
          // stack: 'one',
          barMaxWidth: 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
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
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#AECBFF' },
                { offset: 1, color: '#5EA3FF' },
              ]),
            },
          },
          data: data1,
          z: 1,
        },
        //第二根柱子
        {
          name: this.columnData[1]?.cname,
          type: 'bar',
          barMaxWidth: 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
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
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#FBF676' },
                { offset: 1, color: '#FFD067' },
              ]),
            },
          },
          data: data2,
          z: 1,
        },
        //第一条折线
        {
          name: this.columnData[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: this.columnData.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.columnData.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
        //第二条折线
        {
          name: this.columnData[1]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#FFB365',
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: '#FFB365',
                  fontSize: 10,
                },
              },
            },
          },
          data: data5,
        },
      ]
      //有三根柱子时
      let series3 = [
        //第一根柱子
        {
          name: this.columnData[0].cname,
          type: 'bar',
          // stack: 'one',
          barMaxWidth: 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
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
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#AECBFF' },
                { offset: 1, color: '#5EA3FF' },
              ]),
            },
          },
          data: data1,
          z: 1,
        },
        //第二根柱子
        {
          name: this.columnData[1]?.cname,
          type: 'bar',
          barMaxWidth: 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
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
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#FBF676' },
                { offset: 1, color: '#FFD067' },
              ]),
            },
          },
          data: data2,
          z: 1,
        },
        //第三根柱子
        {
          name: this.columnData[2]?.cname,
          type: 'bar',
          barMaxWidth: 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
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
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#d4f8bf' },
                { offset: 1, color: '#b4e798' },
              ]),
            },
          },
          data: data3,
          z: 1,
        },
        //第一条折线
        {
          name: this.columnData[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: this.columnData.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.columnData.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
        //第二条折线
        {
          name: this.columnData[1]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#FFB365',
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: '#FFB365',
                  fontSize: 10,
                },
              },
            },
          },
          data: data5,
        },
        // 第三条折线
        {
          name: this.columnData[2]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#97d376',
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: '#97d376',
                  fontSize: 10,
                },
              },
            },
          },
          data: data6,
        },
      ]
      const option = {
        barWidth: '30%', //柱子宽度
        legend: {
          itemHeight: 10,
          itemWidth: 20,
          textStyle: {
            fontSize: 12,
            color: '#333',
          },
          data: legend,
        },
        // toolbox: {
        //   feature: {
        //     magicType: {
        //       type: 'category',
        //     },
        //   },
        // },
        // dataZoom: [
        //   {
        //     type: 'inside', // 图表下方的伸缩条
        //     show: true,
        //     // realtime: true,
        //     start: 0,
        //     end: 100,
        //     minSpan: 70,
        //     maxSpan: 70, //maxSpan和minSpan的值设置一样，禁止滚动时滚动条大小改变（缩放和扩大）
        //   },
        // ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter(params) {
            var relVal = params[0].name
            for (var i = 0; i < params.length; i++) {
              if (
                params[i].seriesName == '占比' ||
                params[i].seriesName.indexOf('率') != -1
              ) {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  '<span style="font-weight:900;margin-left:10px;float: right;">' +
                  params[i].value +
                  '%' +
                  '</span>'
              } else {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  '<span style="font-weight:900;margin-left:10px;float: right;">' +
                  params[i].value +
                  '</span>'
              }
            }
            return relVal
          },
        },
        xAxis: [
          {
            data: this.xAxis,
            type: 'category',
            axisLabel: {
              show: true,
              // 强制显示所有标签
              interval: 0,
              textStyle: {
                fontSize: 9,
              },
              formatter: function (value) {
                var res = value
                // 长度超过4个的以省略号显示
                if (res.length > 6) {
                  res = res.substring(0, 3) + '..'
                }
                return res
                //字符过长换行
                // var valueDetal = value
                // console.log(valueDetal)
                // var ret = '' //拼接加\n返回的类目项
                // var maxLength = 2 //每项显示文字个数
                // var valLength = valueDetal.length //X轴类目项的文字个数
                // // console.log(valLength);
                // var rowN = Math.ceil(valLength / maxLength) //类目项需要换行的行数
                // if (rowN > 1) {
                //   //如果类目项的文字大于3,
                //   for (var i = 0; i < rowN; i++) {
                //     var temp = '' //每次截取的字符串
                //     var start = i * maxLength //开始截取的位置
                //     var end = start + maxLength //结束截取的位置
                //     //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                //     temp = valueDetal.substring(start, end) + '\n'
                //     ret += temp //凭借最终的字符串
                //   }
                //   return ret
                // } else {
                //   return valueDetal
                // }
              },
            },
          },
        ],
        yAxis: [
          //柱形图y轴
          {
            type: 'value',
            splitLine: false, //背景线
            name: yName1,
          },
          //折线图y轴
          {
            type: 'value',
            splitLine: false, //背景线
            name: yName2,
          },
        ],
        grid: {
          x: 0,
          x2: 0,
          top: 50,
          bottom: 0, //距离下边距
          containLabel: true,
        },
        series:
          this.columnData.length == 1
            ? series1
            : this.columnData.length == 2
            ? series2
            : series3,
      }
      //两条折线偏移设置
      // if (this.columnData.length == 2) {
      //   debugger
      //   option.xAxis[1] = {
      //     type: 'value',
      //     max: option.xAxis[0].data.length * 100,
      //     show: false,
      //   }
      //   //第一条折线偏移量
      //   if (option.series[2].data) {
      //     option.series[2].data = option.series[2].data.map((x, i) => [
      //       32 + i * 100,
      //       x,
      //     ])
      //   }
      //   //第二条折线偏移量
      //   if (option.series[3].data) {
      //     option.series[3].data = option.series[3].data.map((x, i) => [
      //       68 + i * 100,
      //       x,
      //     ])
      //   }
      // }
      //三条折线偏移设置
      // if (this.columnData.length == 3) {
      //   option.xAxis[1] = {
      //     type: 'value',
      //     max: option.xAxis[0].data.length * 100,
      //     show: false,
      //   }
      //   //第一条折线偏移量
      //   if (option.series[3].data) {
      //     option.series[3].data = option.series[3].data.map((x, i) => [
      //       30 + i * 100,
      //       x,
      //     ])
      //   }
      //   //第二条折线偏移量
      //   if (option.series[4].data) {
      //     option.series[4].data = option.series[4].data.map((x, i) => [
      //       50 + i * 100,
      //       x,
      //     ])
      //   }
      //   //第三条折线偏移量
      //   if (option.series[5].data) {
      //     option.series[5].data = option.series[5]?.data.map((x, i) => [
      //       70 + i * 100,
      //       x,
      //     ])
      //   }
      // }

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
