<template>
  <div ref="myChart" id="myChart" style="height: 200px; width: 100%;" />
</template>

<script>
import * as echarts from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GaugeChart, CanvasRenderer])

export default {
  props: {
    //数据
    PieData: {
      type: Array,
      default: [],
    },
  },
  watch: {
    PieData: {
      deep: true,
      handler(newVal) {
        this.PieData = newVal
        this.init()
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      // setTimeout(() => {
      this.init()
      // }, 1000)
    })
  },
  methods: {
    init() {
      const myChart = echarts.init(this.$refs.myChart)
      let data = []
      let legendList = []
      console.log(this.PieData, '饼状图数据')
      this.PieData.forEach((e) => {
        data.push({
          value: Number(e.coverage),
          name: e.serviceProvideName,
        })
        e.value = Number(e.value)
        legendList.push(e.name)
      })
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}%',
        },
        legend: {
          orient: 'vertical',
          icon: 'circle',
          itemHeight: 10,
          left: '62%',
          top: '15%',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          data: legendList,
        },
        // color: ['#AECBFF', '#9E5EFF', '#F0BD66', '#EA6B67'], // 自定义颜色
        series: [
          {
            name: '',
            type: 'pie',
            minAngle: 10, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            radius: ['40%', '80%'],
            center: ['30%', '50%'],
            label: {
              position: 'inner', //outside  inner
              formatter: '{c}%', // 这里的设置就是饼图的标签内容及其格式
              color: '#fff',
              fontSize: '10',
              // rich: {
              //   b: {
              //     align: 'center',
              //   },
              // },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
              normal: {
                color: function (params) {
                  var colorList = [
                    {
                      c1: '#AECBFF', //紫色
                      c2: '#418FF6',
                    },
                    {
                      c1: '#CFAEFF', //蓝色
                      c2: '#9E5EFF',
                    },
                    {
                      c1: '#ffddaa', //黄色
                      c2: '#ecb867',
                    },
                    {
                      c1: '#FFD064', //橙色
                      c2: '#EA6B67',
                    },
                    {
                      c1: '#d4f8bf', //绿色
                      c2: '#b4e798',
                    },
                    {
                      c1: '#ffb2c4', //红色
                      c2: '#e47c91',
                    },
                  ]
                  return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ])
                },
              },
            },
            data: this.PieData,
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

<style lang="scss" scoped></style>
