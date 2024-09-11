<template>
  <div
    ref="myChart"
    id="mywordcloud"
    :style="{ width: '100%', height: '200px' }"
  ></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'
export default {
  props: {
    //数据
    wordData: {
      type: Array,
      default: [],
    },
  },
  watch: {
    wordData: {
      deep: true,
      handler(newVal) {
        this.wordData = newVal
        this.initChart()
      },
    },
  },
  name: 'VueWordCloud',
  data() {
    return {}
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const myChart = echarts.init(this.$refs.myChart)
      console.log(this.wordData, '词云数据')
      let data = []
      this.wordData.forEach((e) => {
        if (e.value != 0) {
          data.push({
            name: e.name,
            value: e.value,
          })
        }
      })
      const option = {
        title: {
          text: '',
          show: false,
          x: 'left',
          textStyle: {
            fontSize: 15,
          },
        },
        backgroundColor: '#fff',
        tooltip: {
          show: true,
          formatter: function (params) {
            return `${params.marker}${params.name}: ${params.value}` + '%'
          },
        },
        series: [
          {
            type: 'wordCloud',
            //用来调整词之间的距离
            gridSize: 10,
            //用来调整字的大小范围
            sizeRange: [6, 50],
            //调整词的旋转方向，[0,0]--没有角度，即词为水平方向
            // rotationRange: [-45, 0, 45, 90],
            rotationRange: [0, 0],
            textStyle: {
              // color: function () {
              //   const colorList = ['#f89b6299', '#afcf7cde', '#fece5b']
              //   let index = Math.floor(Math.random() * colorList.length)
              //   return colorList[index]
              // },
              //随机颜色
              color: function () {
                return `rgb(${[
                  Math.round(Math.random() * 200 + 55),
                  Math.round(Math.random() * 200 + 55),
                  Math.round(Math.random() * 200 + 55),
                ].join(',')})`
              },
            },
            //位置相关设置
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            //数据
            data: data,
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

<style lang="scss" scoped>
#mywordcloud {
  margin-top: 30px;
}
</style>
