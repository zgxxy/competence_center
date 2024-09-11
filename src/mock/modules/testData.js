// 引入随机函数
import { Random } from 'mockjs'
// 引入Mock
const Mock = require('mockjs')

// 定义数据
const listData = Mock.mock({
  'data|10': [{
    dataSource: () => Random.ctitle(3,5),
    crowdName: () => Random.csentence(1,7),
    sampleSize:()=>Random.integer(10,100),
    price:()=>Random.integer(10,100),
    priceRange:()=>Random.integer(10,100),
    scale:()=>Random.integer(10,100),
    startDate:()=>Random.date('yyyy-MM-dd HH:mm:ss'),
    remark:()=>Random.csentence(1,7),
    isOpen:()=>Random.boolean (),
  }]
})

function list (res) {
  // res是一个请求对象，包含: url, type, body
  return {
    code: 200,
    data: listData.data,
    msg: '请求成功'
  }
}

export default { list }
