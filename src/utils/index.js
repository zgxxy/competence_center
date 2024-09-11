/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

export function filterEchartsData(mainKey, data) {
  for (const key in mainKey) {
    mainKey[key] = []
  }
  data.map(item => {
    let marr = []
    for (const mkey in mainKey) {
      marr.push(mkey)
    }
    for (const key in item) {
      marr = marr.filter(v => v !== key)
    }
    marr.map(v => {
      item[v] = 0
    })

    for (const key in item) {
      for (const mkey in mainKey) {
        if (key === mkey) {
          mainKey[mkey].push(item[key])
        }
      }
    }
  })
  return mainKey
}

export function filterEchartsData3(mainKey) {
  const series = []
  for (const mkey in mainKey) {
    const obj = {
      name: 'Direct',
      barMaxWidth: 30,
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    }
    if (mkey !== 'time') {
      obj.name = mkey
      obj.data = mainKey[mkey]
      series.push(obj)
    }
  }
  return series
}

/**
 * @param {string} fmt:日期格式'YYYY-mm-dd HH:MM:SS'
 * @param data:new Date()
 * @returns {string}
 */
export function dateFormat(fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

export function replaceAll(val,mapReplace) {
  let res = ''
  const replace = ({ str, reg, replacer }) =>
    str.replace(new RegExp(reg, 'g'), replacer)
  res = Object.keys(mapReplace).reduce(
    (str, reg) => replace({ str, reg, replacer: mapReplace[reg] }),
    val,
  )
  return res
}

// 手机号做脱敏处理
export function encryptPhone(phone) {
  if(phone){
    let reg = /^(1[3-9][0-9])\d{4}(\d{4}$)/;
    phone = phone.replace(reg, '$1****$2');
    return phone; // 185****6696
  }
}

//卡号/身份证号脱敏
export function encryptId(card) {
  if(card){
    const reg = /^(.{4})(?:\d+)(.{4})$/; // 号码前4位和后4位的正则表达式
    const maskedIdCard = card.replace(reg, '$1******$2');
    return maskedIdCard; // 1234******5678
  }
}

//姓名脱敏
export function encryptName(name) {
  if(name){
    if (name.length == 2) {
      name = name.substring(0, 1) + '*'; //截取字符串第1个字符
      return name; // 张三：张*
    } else if (name.length == 3) {
        name = name.substring(0, 1) + '*' + name.substring(2, 3); // 截取第1个和第3个字符
        return name; // 李大爷：李*爷
    } else if (name.length > 3) {
        name = name.substring(0, 1) + '*' + '*' + name.substring(3, name.length); // 截取第1个和大于第4个字符
        return name; // 成吉思汗：成**汗
    }
  }
}

//邮箱脱敏
export function encryptEmail(email) {
  var avg;
  var splitted;
  var email1;
  var email2;
  splitted = email.split('@');
  email1 = splitted[0];
  avg = email1.length / 2;
  email1 = email1.substring(0, email1.length - avg);
  email2 = splitted[1];
  return email1 + '***@' + email2; // 输出为81226***@qq.com
}