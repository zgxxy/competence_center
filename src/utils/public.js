import JSEncrypt from 'jsencrypt' // 引入模块

// 格式化时间
// 如：[Wed Dec 01 2021 00:00:00 GMT+0800 (中国标准时间),Wed Dec 01 2021 00:00:00 GMT+0800 (中国标准时间) ]
// 输出2019-12-1
// const arr = ['Wed Dec 01 2021 00:00:00 GMT+0800 (中国标准时间)', 'Thu Dec 02 2021 00:00:00 GMT+0800 (中国标准时间)']
export function dateTimeForm(val) {
  // console.log(typeof (val))
  if (typeof (val) === 'object') {
    // console.log('日期格式化')
    const time = val.map((el) => {
      const yy = new Date(el).getFullYear()
      const mm = new Date(el).getMonth() + 1
      const dd = new Date(el).getDate()
      return yy + '-' + mm + '-' + dd
    })
    return time
  }
}
// console.log(dateTimeForm(arr))
// 日期格式化 yyyy-mm-dd
export function formatDate(date) {
  var myyear = date.getFullYear()
  var mymonth = date.getMonth() + 1
  var myweekday = date.getDate()
  if (mymonth < 10) {
    mymonth = '0' + mymonth
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday
  }
  return (myyear + '-' + mymonth + '-' + myweekday)
}
// 格式化粒度查询
export function typeToNum(val) {
  switch (val) {
    case '日':
      return 1
    case '周':
      return 2
    case '月':
      return 3
    case '季':
      return 4
    case '年':
      return 5

    default:
      return 1
  }
}
// 去除字符串所有的空格
export function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
// console.log(typeToNum('周'))

// 获取当天日期  当前日期格式化为2021-01-02
export function fetchDate() {
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const time = y + '-' + m + '-' + d
  return time
}
// 获取当天日期  当前日期格式化为2021-01-02 08:08:01
export function fetchDateTime() {
  const date = new Date()
  const y = date.getFullYear()
  var M = (date.getMonth() + 1)
  M = M < 10 ? ('0' + M) : M
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  var s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  const nowdate = y + '-' + M + '-' + d
  const time = h + ':' + m + ':' + s
  const newdate = `${nowdate} ${time}`
  return newdate
}

// 过期比较 时间是否已经过期2021-01-02 08:08:01
export function datePass(item) {
  const now = Date.parse(new Date())
  const endString = Date.parse(new Date(Date.parse((item + '').replace(/-/g, '/'))))
  if (endString - now < 0) {
    return '已过期'
  } else if (endString - now >= 0) {
    return '未过期'
  }
}

//  转格式 2021-12-11T08:15:31.000+0000
export function formaTime(time) {
  if (time === 0 || time === undefined) return
  var tempTime = []
  var temp = []
  tempTime = time.split('T')
  temp = tempTime[1].split('.')
  time = tempTime[0] + ' ' + temp[0]
  return time
}

// 开始日期2021-09-01 00:00:00   结束时间2021-09-01 23：59：59
export function todayTime() {
  const date = new Date()
  const y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  m = m < 10 ? ('0' + m) : m
  d = d < 10 ? ('0' + d) : d
  const timeStart = y + '-' + m + '-' + d + ' ' + '00:00:00'
  const timeEnd = y + '-' + m + '-' + d + ' ' + '23:59:59'
  const time = [timeStart, timeEnd]
  return time
}
export function formDateTime() {
  const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const timeStart = y + '-' + m + '-' + d + ' ' + '00:00:00'
  const timeEnd = y + '-' + m + '-' + d + ' ' + '23:59:59'
  const time = [timeStart, timeEnd]
  return time
}

// 比较日期相差多少天多少小时2021-09-01 00:00:00
export function timeDifference(time) {
  const date1 = time[0]
  const date2 = time[1]
  // console.log(date1, date2)
  const date3 = new Date(date2).getTime() - new Date(date1).getTime()
  // console.log(date3)
  // var subMinutes = Math.floor(date3 / (60 * 1000)) // 获取总共的分钟差

  // 计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000))
  // 计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000)
  // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  return (days + '天 ' + hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒')
}

// 比较日期相差--秒数  2021-09-01 00:00:00
export function stopDifference(time) {
  const date1 = time[0]
  const date2 = time[1]
  // console.log(date1, date2)
  const date3 = new Date(date2).getTime() - new Date(date1).getTime()
  // 计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000))
  // 计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000)
  // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
}

// 截取日期，并转换为number格式 如"2022-07-06 23:59:59" 转换为 20220706 用于日期的大小比较
export function dateNum(date) {
  var newDate = ''
  // var newDate = Number(date.split('-').join('').slice(0, 9))
  if (date.length > 10) {
    newDate = Number(date.split('-').join('').slice(0, 9))
  } else {
    newDate = Number(date.split('-').join(''))
  }
  return newDate
}

// 计算某个日期的未来一个月 有参数时，num——指定多少个月，time—指定时间：2022-07-01或（2022-07-01 23:59:59） 一个月后：2023-08-01 不传参数即计算当天的一个月后
export function getMonth(time,num) {
  num = num || 1
  var date1 = time
  if (time && time.length > 10) {
    date1 = date1.slice(0, 10)
  }
  const curDate = new Date().getTime()
  const date2 = new Date(date1).getTime()
  // 算出半年的毫秒数
  const month = (30 * 24 * 3600 * 1000) * num
  const date = time ? new Date(date2 + month) : new Date(curDate + month)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  m = m < 10 ?`0${m}`: m
  d = d < 10 ?`0${d}`: d
  const date3 = y + '-' + m + '-' + d
  return date3
}
// 计算某个日期的未来一年 有参数时，指定时间：2022-07-01或（2022-07-01 23:59:59） 一年后：2023-07-01 不传参数即计算当天的一年后
export function getYear(time,num) {
  num = num || 1
  var date1 = time
  if (time && time.length > 10) {
    date1 = date1.slice(0, 10)
  }
  const curDate = new Date().getTime()
  const date2 = new Date(date1).getTime()
  // 算出一年的毫秒数
  const year = (365 * 24 * 3600 * 1000) * num
  const date = time ? new Date(date2 + year) : new Date(curDate + year)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  m = m < 10 ?`0${m}`: m
  d = d < 10 ?`0${d}`: d
  const date3 = y + '-' + m + '-' + d
  return date3
}

// 获取一周对应日期
// 传入时间参数,如 2021-11-09 获取给定日期对应周的日期 无参数获取当天对应的周日期
export function getCurrentWeek(date) {
  var nowDate = ''
  date ? nowDate = new Date(date) : nowDate = new Date()
  var currentDay = nowDate.getDay()
  if (currentDay == 0) {
    currentDay = 7
  }
  var beforweek = []
  var afterWeek = []
  for (var i = 1; i <= 7; i++) {
    if (currentDay - i >= 0) {
      var DayTime =
        nowDate.getTime() - (currentDay - i) * 24 * 60 * 60 * 1000
      var year = new Date(DayTime).getFullYear()
      var month = new Date(DayTime).getMonth() + 1
      var day = new Date(DayTime).getDate()
      month = month < 10 ? ('0' + month) : month
      day = day < 10 ? ('0' + day) : day
      beforweek.push(year + '-' + month + '-' + day)
    } else {
      var DayTime = nowDate.getTime() + (8 - i) * 24 * 60 * 60 * 1000
      var year = new Date(DayTime).getFullYear()
      var month = new Date(DayTime).getMonth() + 1
      var day = new Date(DayTime).getDate()
      month = month < 10 ? ('0' + month) : month
      day = day < 10 ? ('0' + day) : day
      afterWeek.push(year + '-' + month + '-' + day)
    }
  }
  afterWeek = afterWeek.reverse()
  return [...beforweek, ...afterWeek]
}

// 获取当前月对应日期
// 传入时间参数,如 2021-11-09 获取给定日期对应月的日期 无参数获取当天对应的月日期
export function getCurrentMonth(date) {
  var nowDate = ''
  date ? nowDate = new Date(date) : nowDate = new Date()
  var year = new Date(nowDate).getFullYear()
  var month = new Date(nowDate).getMonth() + 1
  month = month < 10 ? ('0' + month) : month
  const daysOfMonth = []
  const lastDayOfMonth = new Date(year, month, 0).getDate()
  for (var i = 1; i <= lastDayOfMonth; i++) {
    if (i < 10) {
      daysOfMonth.push(year + '-' + month + '-' + '0' + i)
    } else {
      daysOfMonth.push(year + '-' + month + '-' + i)
    }
  }
  return daysOfMonth
}
// 获取当前周的起止时间
export function getWeekDate(date) {
  var nowDate = ''
  date ? nowDate = new Date(date) : nowDate = new Date()
  var year = new Date(nowDate).getFullYear()
  var month = new Date(nowDate).getMonth()
  var day = new Date(nowDate).getDate()
  var nowDayOfWeek = new Date(nowDate).getDay() - 1 // 今天本周的第几天
  var weekStartDate = new Date(year, month, day - nowDayOfWeek)
  var weekEndDate = new Date(year, month, day + (6 - nowDayOfWeek))
  // const current = date ? date : new Date();
  // current是本周的第几天
  // let nowDayOfWeek = current.getDay();
  // if (nowDayOfWeek === 0) nowDayOfWeek = 7;
  // const dayNum = 1 * 24 * 60 * 60 * 1000;
  // // 获取本周星期一的时间，星期一作为一周的第一天
  // const firstDate = new Date(current.valueOf() - (nowDayOfWeek - 1) * dayNum);
  // // 获取本周星期天的时间，星期天作为一周的最后一天
  // const lastDate = new Date(new Date(firstDate).valueOf() + 6 * dayNum);
  //   var weekStartDate = new Date(firstDate)
  //   var weekEndDate=new Date(lastDate)
  var WeekDate = [formatDate(weekStartDate), formatDate(weekEndDate)]
  return WeekDate
}
// 获取当前月的起止时间
export function getMonthDate(date) {
  var nowDate = ''
  date ? nowDate = new Date(date) : nowDate = new Date()
  nowDate.setDate(1)
  const currentMonth = nowDate.getMonth()
  const nextMonth = currentMonth + 1
  const nextMonthFirstDay = new Date(nowDate.getFullYear(), nextMonth, 1)
  const oneDay = 24 * 60 * 60 * 1000
  const monthDate = [formatDate(nowDate), formatDate(new Date(nextMonthFirstDay - oneDay))]
  return monthDate
}
// 获取当前季度的起止时间
export function getQuarterDate(date) {
  var nowDate = ''
  date ? nowDate = new Date(date) : nowDate = new Date()
  var y = nowDate.getFullYear() // 当前年份
  var m = nowDate.getMonth() // 当前月份
  var q = parseInt(m / 3) // 当前季度
  var quarterStartDate = new Date(y, q * 3, 1) // 上一季度的开始日期
  var quarterEndMonth = new Date(y, (q + 1) * 3, 0) // 上一季度的结束日期
  const quarterDate = [formatDate(quarterStartDate), formatDate(quarterEndMonth)]
  return quarterDate
}

// 数据千分位加逗号格式
export function thousandFormat(num) {
  num = num.toString().split('.') // 分隔小数点
  var arr = num[0].split('').reverse() // 转换成字符数组并且倒序排列
  var res = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',') // 添加分隔符
    }
    res.push(arr[i])
  }
  res.reverse() // 再次倒序成为正确的顺序
  if (num[1]) { // 如果有小数的话添加小数部分
    res = res.join('').concat('.' + num[1])
  } else {
    res = res.join('')
  }
  return res
}

// 高德地图经纬度 转 百度地图经纬度
// export function AMapTransBMap(coordinate){
//   var pi = 3.14159265358979324 * 3000.0 / 180.0;
//   var x = coordinate[0];
//   var y = coordinate[1];
//   var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi);
//   var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi);
//   var bd_lng = z * Math.cos(theta) + 0.0065;
//   var bd_lat = z * Math.sin(theta) + 0.006;
//   return [Number(bd_lng.toFixed(6)),Number(bd_lat.toFixed(6))];
// }

// export function AMapTransBMap(gg_lat, gg_lon){
//   var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
//   var point={};
//   var x = gg_lon;
//   var y = gg_lat;
//   var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
//   var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
//   var bd_lon = z * Math.cos(theta) + 0.0065;
//   var bd_lat = z * Math.sin(theta) + 0.006;
//   point.lat = bd_lat;
//   point.lon = bd_lon;
//   return point;
// };
export function AMapTransBMap(lng, lat) {
  const x_pi = 3.14159265358979324 * 3000.0 / 180.0
  const x = lng
  const y = lat
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  const lngs = z * Math.cos(theta) + 0.0065
  const lats = z * Math.sin(theta) + 0.006

  return {
    lng: lngs,
    lat: lats
  }
}

// 百度地图经纬度 转 高德地图经纬度
// export function bMapTransAMap(coordinate) {
//   var bd_lng = coordinate[0];
//   var bd_lat = coordinate[1];
//   var pi = 3.14159265358979324 * 3000.0 / 180.0;
//   var x = bd_lng - 0.0065;
//   var y = bd_lat - 0.006;
//   var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
//   var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
//   var gd_lng = z * Math.cos(theta);
//   var gd_lat = z * Math.sin(theta);
//   return [gd_lng,gd_lat];
// }

export function bMapTransAMap(bd_lat, bd_lon) {
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0
  var point = {}
  var x = bd_lon - 0.0065
  var y = bd_lat - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  var gg_lon = z * Math.cos(theta)
  var gg_lat = z * Math.sin(theta)
  point.lat = gg_lat
  point.lon = gg_lon
  return point
}

export function uniqueArr(arr) {
  const res = []
  arr.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      const tmp = res.filter(
        (i) => JSON.stringify(i) === JSON.stringify(item)
      )
      if (tmp.length === 0) {
        res.push(item)
      }
    }
  })
  return res
}

/**
 * encryptDate加密
 */
export function encryptDate(data) {
  const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyD2eq6reTMh6gS3FiXmxVaRmm/F6boQgUIe815zG0KUu00Eg06tsxt5pH22H/Kr7G8WuDcJtHwmF5hWN4IsHEfSPf4GJYTK+TfL6xTC0ny8fkPhORXlFOX4xBn+ueJe0GaOsLN5/DYkOZBcWRsuyzyk0DIKfd8VA9cG/RmgFZa1S1DCu+K/Gz3I6DJETZlmWmyrjUPjRWBIt6gnTKoFOpRzYRv1E2FWfG6tj+ayY0ZMzQ8WekpTh17Y0WHD6zly7fr6S2pLvYONZwQCps7y1va4GYkFtvuvGKmS1ZxssZtOtWMTGkzXVXCKqHh+Vo7TCW9hm8FFlJe390SdhDd42gQIDAQAB'
  const encrypt = new JSEncrypt() // 1.实例化对象
  console.log('encrypt', encrypt)
  encrypt.setPublicKey(publicKey) // 2. 设置公钥
  return encrypt.encrypt(data) // 3. 返回加密的字符串
}

// 遍历数组加默认值
export function mapList(list, text = '--') {
  // 遍历数组中的每个对象
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]

    // 遍历对象的属性
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] === '' || obj[key] === null)) {
        obj[key] = text
      }
    }
  }
}

// 获取昨天日期
export function getDate_() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const year = yesterday.getFullYear()
  const month = (yesterday.getMonth() + 1).toString().padStart(2, '0')
  const day = yesterday.getDate().toString().padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

// 获取日期区间是否超过60天
export function isDateRangeExceeds60Days(startDate, endDate) {
  const startTimestamp = new Date(startDate).getTime()
  const endTimestamp = new Date(endDate).getTime()
  const dayDifference = Math.abs((endTimestamp - startTimestamp) / (24 * 60 * 60 * 1000))
  return dayDifference >= 60
}

// 传入年月获取当月开始及结束日期
export function getFirstAndLastDay(yearMonth) {
  // 将年月字符串转换为 Date 对象
  const date = new Date(yearMonth)

  // 获取该月份的第一天
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)

  // 获取下个月的第一天，然后减去一毫秒，得到当前月份的最后一天
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  lastDay.setHours(23, 59, 59, 999) // 设置为当天的最后一刻

  // 格式化日期为字符串
  const format = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes()
    ).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`

  // 返回结果数组
  return [format(firstDay), format(lastDay)]
}
