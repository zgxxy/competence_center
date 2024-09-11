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
    //标题
    text: String,
    //数据
    val: Number,
    //0:蓝色  or 1:紫色  or 2:红色
    type: Number,
    //标题图标url
    imageUrl: String,
    //圆环粗细
    axisWidth: Number,
    //圆环内字体大小
    fontSize: Number,
  },
  watch: {
    val: {
      deep: true,
      handler(newVal) {
        this.val = newVal
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
      //数据圆环颜色-渐变蓝
      const progressColor_0 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#AECBFF' },
        { offset: 1, color: '#418FF6' },
      ])
      //数据圆环颜色-渐变紫
      const progressColor_1 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#CFAEFF' },
        { offset: 1, color: '#9E5EFF' },
      ])
      //数据圆环颜色-渐变红
      const progressColor_2 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#ffb2c4' },
        { offset: 1, color: '#e47c91' },
      ])
      //圆环底色-蓝
      const axisLineColor_0 = 'rgba(117, 169, 255, 0.14)'
      //圆环底色-紫
      const axisLineColor_1 = 'rgba(187,117,255,0.14)'
      //圆环底色-红
      const axisLineColor_2 = '#f8efea'
      const option = {
        title: {
          x: 'center',
          y: 'bottom',
          text: '{a|} ' + this.text,
          textStyle: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder""color": "#333"}
            fontSize: 16,
            fontWeight: 'normal',
            lineHeight: 20,
            rich: {
              a: {
                // 这样设定 backgroundColor 就可以是图片了。
                align: 'left',
                backgroundColor: {
                  image: this.imageUrl,
                },
                // 可以只指定图片的高度，从而图片的宽度根据图片的长宽比自动得到。
                height: 14,
              },
            },
          },
        },
        series: [
          {
            type: 'gauge', // 测量仪
            center: ['50%', '40%'], // 图形坐标位置 [左右，上下]
            radius: '60%', // 控制饼图的大小
            startAngle: 90, // 开始位置
            endAngle: -270, // 结束位置
            pointer: {
              // 显示仪表盘指针
              show: false, // 是否显示仪表盘指针
            },
            progress: {
              // 展示当前进度。
              show: true, // 是否展示进度条
              overlap: false, // 是否重叠
              // roundCap: true, // 是否圆顶
              clip: false, // 是否裁掉超出部分
              itemStyle: {
                // 设置圆形
                color:
                  this.type == 0
                    ? progressColor_0
                    : this.type == 1
                    ? progressColor_1
                    : progressColor_2,
              },
            },
            axisLine: {
              // 设置线条
              lineStyle: {
                width: this.axisWidth ? this.axisWidth : 20, // 线条宽度
                color:
                  this.type == 0
                    ? [[1, axisLineColor_0]]
                    : this.type == 1
                    ? [[1, axisLineColor_1]]
                    : [[1, axisLineColor_2]], // 不透明度, 线条设置背景色
              },
            },
            splitLine: {
              // 分隔线样式。
              show: false, // 是否显示分隔线。
              distance: 0, // 分隔线与轴线的距离。
              length: 1033, // 分隔线线长。支持相对半径的百分比。
            },
            axisTick: {
              // 刻度样式。
              show: false, // 是否显示刻度。
            },
            axisLabel: {
              //刻度标签。
              show: false, // 是否显示标签。
              distance: 50, // 标签与刻度线的距离。
            },
            data: [
              {
                value: this.val, // 可写变量  此value 对应 formatter: '{value}%' 中的Value  64类型不对请用'64'
                detail: {
                  // 仪表盘边框数据详情，用于显示数据。
                  valueAnimation: false, // 是否开启标签的数字动画。
                  offsetCenter: ['0%', '0%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  fontSize: this.fontSize, // 文字的字体大小。
                },
              },
            ],
            detail: {
              //仪表盘详情，用于显示数据 仪表盘中间数字数据。
              color:
                this.type == 0
                  ? '#418FF6'
                  : this.type == 1
                  ? '#A468FF'
                  : '#e47c91', // 文本颜色，默认取数值所在的区间的颜色
              formatter: '{value}%', // 格式化函数或者字符串  formatter: function (value) { return value.toFixed(0);}
              // width: 20,
              // height: 14,
              // fontSize: 14,
              // borderColor: 'auto',
              // borderRadius: 20,
              // borderWidth: 1,
            },
          },
        ],
      }
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
