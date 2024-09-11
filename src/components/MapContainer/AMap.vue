<!-- 热力图-高德 -->
<template>
  <div>
    <div id="container">
      <div v-if="isFullScreen">
        <img
          @click="enlarge"
          class="iconBox"
          :src="
            fullScreen
              ? require('@/assets/images/slices/amplifier_0.svg')
              : require('@/assets/images/slices/amplifier_1.svg')
          "
          :title="fullScreen ? '点击还原' : '点击全屏'"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import remoteLoad from '@/utils/remoteLoad.js'
// import heatmapData from './heatmapData.json'
// window._AMapSecurityConfig = {
//   securityJsCode: 'e8b2d57e693b50576072e537e169b8a2', //安全密钥
// }
export default {
  props: {
    //数据
    heatmapData: {
      type: Array,
      default: () => [],
    },
    //关键字查询传入的关键字
    value: {
      type: String,
      default: '',
    },
    //是否显示全屏按钮
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    radius: {
      type: Number,
      default: 150,
    },
  },
  watch: {
    heatmapData: {
      deep: true,
      handler(newVal) {
        this.heatmapData = newVal
        this.initMap()
      },
    },
    value: {
      deep: true,
      handler(newVal) {
        this.value = newVal
        this.searchAddress()
      },
    },
  },
  data() {
    return {
      //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      map: null,
      fullScreen: false,
      lnglat: [],
      positionVal: '',
      pointList: [
        {
          address: '郑州市收到货爽肤水1',
          local: [113.651398, 34.767445],
        },
        {
          address: '郑州市收到货爽肤水2',
          local: [113.851398, 34.767445],
        },
        {
          address: '郑州市收到货爽肤水3',
          local: [113.751398, 34.667445],
        },
        {
          address: '郑州市收到货爽肤水4',
          local: [113.641398, 34.747445],
        },
      ],
      searchValue: '',
      pois: [],
      poi: [
        {
          id: 'B000A83M61',
          name: '北京西站',
          type: '交通设施服务;火车站;火车站',
          location: [116.322056, 39.89491],
          address: '莲花池东路118号',
          tel: '010-51824233',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110106',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '丰台区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/778d4f452762efe0e80ccf924cb6340c',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/0793370a3b06936fa67a4df01bbab5bd',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/71c814eb3f8bbf1a38b574ddf8806b6e',
            },
          ],
          entr_location: [116.321543, 39.896245],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A83M61',
            floor: '1',
            truefloor: 'F1',
          },
          _idx: 0,
          index: 0,
        },
        {
          id: 'B000A83AJN',
          name: '北京南站',
          type: '交通设施服务;火车站;火车站',
          location: [116.378517, 39.865246],
          address: '永外大街车站路12号',
          tel: '010-51867688',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110106',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '丰台区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/7eb23a4d50dff813f5601de3094c5b2d',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/9d6320791877defb3005438eba133cc5',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/8cb59fca328d949cd47a96e4cca1be42',
            },
          ],
          entr_location: [116.379822, 39.86562],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A83AJN',
            floor: '-2',
            truefloor: 'B2',
          },
          _idx: 1,
          index: 1,
        },
        {
          id: 'BV10006813',
          name: '北京站(地铁站)',
          type: '交通设施服务;地铁站;地铁站',
          location: [116.427287, 39.904983],
          address: '2号线',
          tel: '',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110101',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '东城区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/2a7b19e75b92e0de0d164cf964b49cbc',
            },
            {
              title: '',
              url:
                'https://aos-comment.amap.com/BV10006813/comment/content_media_external_images_media_565590.jpg',
            },
            {
              title: '',
              url:
                'https://aos-comment.amap.com/BV10006813/comment/content_media_external_images_media_565592.jpg',
            },
          ],
          entr_location: null,
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: false,
          _idx: 2,
          index: 2,
        },
        {
          id: 'B000A833V8',
          name: '北京北站',
          type: '交通设施服务;火车站;火车站',
          location: [116.353063, 39.944876],
          address: '北滨河路1号',
          tel: '010-51866852',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110102',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '西城区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/b71fd3fbc082badb9debe289c69eac52',
            },
            {
              title: '',
              url:
                'http://aos-cdn-image.amap.com/sns/ugccomment/8034da1d-6f99-41cc-97dc-eebcce00f145.jpg',
            },
            {
              title: '',
              url:
                'https://aos-comment.amap.com/B000A833V8/headerImg/content_media_external_images_media_5748430_1656134444232_4693d9f8.webp',
            },
          ],
          entr_location: [116.351895, 39.942554],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A833V8',
            floor: '1',
            truefloor: '1F',
          },
          _idx: 3,
          index: 3,
        },
        {
          id: 'B000A350CB',
          name: '北京东站',
          type: '交通设施服务;火车站;火车站',
          location: [116.485079, 39.90242],
          address: '百子湾路7号',
          tel: '010-51835662',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110105',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '朝阳区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://aos-cdn-image.amap.com/sns/ugccomment/a69ddb63-9d63-42b3-8cf3-aedaff479e58.jpg',
            },
            {
              title: '',
              url:
                'http://aos-cdn-image.amap.com/sns/ugccomment/310c83e0-a16f-40c5-9e16-b9cac28c0e6b.jpg',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/87a38102dafd74c1a494f534229dff1f',
            },
          ],
          entr_location: [116.489146, 39.904783],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A350CB',
            floor: '',
            truefloor: '',
          },
          _idx: 4,
          index: 4,
        },
        {
          id: 'B000A83C36',
          name: '北京站',
          type: '交通设施服务;火车站;火车站',
          location: [116.427341, 39.902842],
          address: '毛家湾胡同甲13号',
          tel: '010-51831812',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110101',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '东城区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/3b3195adc4fd9a07c14fbf5d1d1b0230',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/1e03d126ba77b83f58341dc0c54cc1f9',
            },
            {
              title: '',
              url:
                'https://aos-comment.amap.com/B000A83C36/headerImg/8f17cfeea56824f3bc59a41d84b7a4d3_2048_2048_80.jpg',
            },
          ],
          entr_location: [116.424694, 39.9045],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A83C36',
            floor: '',
            truefloor: '',
          },
          _idx: 5,
          index: 5,
        },
        {
          id: 'BV10006454',
          name: '北京南站(地铁站)',
          type: '交通设施服务;地铁站;地铁站',
          location: [116.379008, 39.865012],
          address: '14号线;4号线/大兴线',
          tel: '',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110106',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '丰台区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/d3948c5acc43f43f9303dbe540738a91',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/6b5ba0395d9500cfa97c30a7c9685e49',
            },
          ],
          entr_location: null,
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A83AJN',
            floor: '-1',
            truefloor: 'B1',
          },
          _idx: 6,
          index: 6,
        },
        {
          id: 'B000A7HOIQ',
          name: '北京海洋馆',
          type: '风景名胜;公园广场;水族馆',
          location: [116.340971, 39.944676],
          address: '气象路6号',
          tel: '010-62176655',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110108',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '海淀区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/19d96cbb3f0eaaa3afc6c7b00002b94e',
              provider: '',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/ddeb64cbff6a4f14b6eb16e0bce17856',
              provider: '',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/3d3144195c55767b3f0a81319e1f4ecb',
              provider: '',
            },
          ],
          entr_location: [116.339834, 39.947458],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: false,
          rating: '4.9',
          cost: '165.00',
          ticket_ordering: '0',
          _idx: 7,
          index: 7,
        },
        {
          id: 'BV10000102',
          name: '北京西站(地铁站)',
          type: '交通设施服务;地铁站;地铁站',
          location: [116.321262, 39.894763],
          address: '7号线;9号线',
          tel: '',
          distance: null,
          shopinfo: '2',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110106',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '丰台区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/eec208127c34ca30fb14edbc40728b47',
            },
            {
              title: '',
              url:
                'http://aos-cdn-image.amap.com/sns/ugccomment/938ad72a-9f0c-4e3e-a257-393a22c49734.jpg',
            },
            {
              title: '',
              url:
                'http://aos-cdn-image.amap.com/sns/ugccomment/b45a1464-5dcb-4706-b809-b020b3b62540.jpg',
            },
          ],
          entr_location: null,
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: true,
          indoor_data: {
            cpid: 'B000A83M61',
            floor: '-2',
            truefloor: 'B2',
          },
          _idx: 8,
          index: 8,
        },
        {
          id: 'B0FFHF130I',
          name: '北京簋街',
          type: '购物服务;特色商业街;特色商业街',
          location: [116.424768, 39.941746],
          address: '东直门大街5-11号',
          tel: '',
          distance: null,
          shopinfo: '0',
          website: '',
          pcode: '110000',
          citycode: '010',
          adcode: '110101',
          postcode: '',
          pname: '北京市',
          cityname: '北京市',
          adname: '东城区',
          email: '',
          photos: [
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/698c9b521433b58252e097aae4ad9577',
            },
            {
              title: '',
              url:
                'https://aos-comment.amap.com/B0FFHF130I/headerImg/a1d7a7be6e0344c29ee4262dec919b0f_2048_2048_80.jpg',
            },
            {
              title: '',
              url:
                'http://store.is.autonavi.com/showpic/dc3cf23ce5713d297a595ba7ea04320c',
            },
          ],
          entr_location: [116.432016, 39.941208],
          exit_location: null,
          groupbuy: false,
          discount: false,
          indoor_map: false,
          rating: '4.9',
          _idx: 9,
          index: 9,
        },
      ],
    }
  },
  mounted() {
    // 延迟加载，防止出现AMap not defined
    setTimeout(() => {
      this.initMap()
    }, 1000)
    //监听是否为全屏状态，改变按钮状态
    window.onresize = () => {
      if (!this.checkFull()) {
        this.fullScreen = false
      }
    }
  },
  destroyed() {
    if (!!this.map) {
      this.map.destroy()
    }
  },
  methods: {
    //全屏显示
    enlarge() {
      let element = document.getElementById('container') //需要全屏容器的id
      // 浏览器兼容
      if (this.fullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.fullScreen = !this.fullScreen
    },
    //判断是否为全屏
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    //搜索完自动打点
    searchPoint(img) {
      this.searchValue = this.value
      if (this.searchValue != '') {
        this.map.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
          let placeSearch = new AMap.PlaceSearch()
          let that = this
          placeSearch.search(this.searchValue, function (status, result) {
            // 查询成功时，result即对应匹配的POI信息
            console.log(result, '搜索返回值')
            that.pois = result?.poiList?.pois || []
            for (var i = 0; i < that.pois.length; i++) {
              var poi = that.pois[i]
              var marker = []
              marker[i] = new AMap.Marker({
                map: that.map,
                position: poi.location, // 经纬度对象，或者经纬度数组[116.39, 39.9]
                title: poi.name,
                offset: new AMap.Pixel(0, 0),
                icon: img || '',
                anchor: 'bottom-center',
              })
              // 将创建的点标记添加到已有的地图实例：
              that.map.add(marker[i])
            }
            that.map.setFitView()
          })
        })
      }
    },
    //关键字搜索--外部搜索框
    searchAddress() {
      this.searchValue = this.value
      if (this.searchValue != '') {
        var autoOptions = {
          input: 'searchValue',
        }
        this.map.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
          let placeSearch = new AMap.PlaceSearch({
            // map: this.map,//查询后自动打点
          })
          let that = this
          // var auto = new AMap.AutoComplete(autoOptions)
          // auto.on('select', select) //注册监听，当选中某条记录时会触发
          // function select(e) {
          //   placeSearch.setCity(e.poi.adcode)
          //   placeSearch.search(e.poi.name) //关键字查询查询
          // }
          placeSearch.search(this.searchValue, function (status, result) {
            // 查询成功时，result即对应匹配的POI信息
            console.log(result, '搜索返回值')
            that.pois = result?.poiList?.pois || []
          })
        })
      }
      // this.pois = this.poi
      this.$emit('searchPoi', this.pois)
    },
    //地图标点--包括点和矢量圆
    pointMarker(pois, radius) {
      //清除地图上的覆盖物
      this.map.clearMap()
      for (var i = 0; i < pois.length; i++) {
        var poi = pois[i]
        var marker = [] //标点
        var circle = [] //矢量圆
        marker[i] = new AMap.Marker({
          map: this.map,
          position: poi.location, // 经纬度对象，或者经纬度数组[116.39, 39.9]
          title: poi.name,
          offset: new AMap.Pixel(0, 0),
          // icon:
          //   '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-' +
          //   (i + 1) +
          //   '.png',
          anchor: 'bottom-center',
        })
        circle[i] = new AMap.Circle({
          center: poi.location, // 圆心位置
          radius: radius || this.radius, //半径
          strokeColor: '#59a4ef', //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线粗细度
          fillColor: '#4b9def', //填充颜色
          fillOpacity: 0.35, //填充透明度
        })
        // 将创建的点标记添加到已有的地图实例：
        // this.map.add(marker[i])
        this.map.add([marker[i], circle[i]])
      }
      this.map.setFitView()
    },
    initMap() {
      const that = this
      let heatmapData = that.heatmapData
      console.log(heatmapData)
      const map = new AMap.Map('container', {
        //设置地图容器id
        resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
        viewMode: '2D', //是否为3D地图模式
        zoom: 5, //初始化地图级别
        zooms: [3, 18], //设置地图缩放范围
        center: [105.602725, 37.076636], //初始化地图中心点位置
        // mapStyle: 'macaron',
        WebGLParams: {
          preserveDrawingBuffer: true,
        }, //解决html2canvas截图空白问题
      })
      if (!this.isSupportCanvas()) {
        return this.$msg.error(
          '热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试。',
        )
      }
      map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.HeatMap'], function () {
        map.addControl(new AMap.ToolBar()) //等级大小控制按钮
        map.addControl(new AMap.Scale()) //尺子
        //热力图
        const heatmap = new AMap.HeatMap(map, {
          visible: false,
          radius: 8, // 每个点的覆盖范围半径，单位是像素
          opacity: [0, 0.7], //最小透明度和最大透明度，最小透明度越小，数值小的点就越不明显；最大透明度越大，数值大的点就越明显
          // blur: 0.8, //一个点外圈和内圈的大小比例，值越大，内圈占的比例就越大；值越小，外圈占的比例就越大
          //自定义热力点颜色
          gradient: {
            0.5: '#ba7cd3',
            0.65: 'rgb(117,211,248)',
            0.7: 'rgb(0, 255, 0)',
            0.9: '#ffea00',
            1: 'red',
          },
        })
        that.heatMao = heatmap
        that.heatMao.setDataSet({
          data: heatmapData, //热力数据
          // max: 100, // 见gradient的例子
        })
      })
      //当地图放大缩小时，调整热力点的大小，保证显示效果的一致
      map.on('zoomchange', function (e) {
        // let newRadius
        // let zoomLevel = map.getZoom() //获取当前最新的地图层级
        // // console.log('地图缩放等级', zoomLevel)
        // if (zoomLevel <= 12) {
        //   newRadius = 5
        // } else if (zoomLevel == 13) {
        //   newRadius = 6
        // } else if (zoomLevel == 14) {
        //   newRadius = 7
        // } else if (zoomLevel == 15) {
        //   newRadius = 8
        // } else if (zoomLevel == 16) {
        //   newRadius = 10
        // } else {
        //   newRadius = 15
        // }
        // that.heatMao.setOptions({
        //   radius: newRadius,
        // })
      })
      //设置光标样式--crosshair 十字光标 pointer--手指
      map.setDefaultCursor('crosshair')
      this.map = map
      // 鼠标点击获取经纬度
      this.map.on('click', function (e) {
        this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()]
        console.log('经纬度', this.lnglat)
        //   console.log('经度', e.lnglat.getLng())
        //   console.log('纬度', e.lnglat.getLat())
      })
    },
    //判断浏览区是否支持canvas
    isSupportCanvas() {
      let elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    },
  },
}
</script>
<style lang="scss" scoped>
//地图容器
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 555px;
}
//全屏按钮
.iconBox {
  position: relative;
  cursor: pointer;
  top: 10px;
  right: 10px;
  float: right;
  font-size: 20px;
  z-index: 999;
}
//删掉底部logo和文字
::v-deep .amap-logo {
  display: none;
  opacity: 0 !important;
}
::v-deep .amap-copyright {
  opacity: 0;
}
</style>
