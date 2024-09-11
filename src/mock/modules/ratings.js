// 引入随机函数
import { Random } from 'mockjs'
// 引入Mock
const Mock = require('mockjs')

// 定义数据
const listData = Mock.mock({
  'data|3': [{
    marketName: () => Random.ctitle(5,15),
    address: () => Random.province()+Random.city()+Random.county()+Random.integer(10,500)+'号',
    commerceArea:()=>Random.integer(10,100),
    openTime:()=>Random.date(),
    rent:()=>Random.integer(100,2000),
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
