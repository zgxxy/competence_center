////////用户登录////////
import request from '@/utils/request'
import Url from '../../public/proxyUrl'

// 登录
export function login(data) {
  return request({
    url: `${Url.ProxyUrl}/session/login`,
    // url: `${Url.ProxyUrl}/login`,
    method: 'post',
    data
  })
}
// 退出登录
export function loginOut(params) {
  return request({
    url: `${Url.ProxyUrl}/session/loginOut`,
    method: 'POST',
    params
  })
}
// 忘记密码
export function forgetPassword(params) {
  return request({
    url: `${Url.ProxyUrl}/user/forgetPassword`,
    method: 'get',
    params
  })
}
// 消息中心--获取消息信息
export function getOperationLogByPage(params) {
  return request({
    url: `${Url.ProxyUrl}/Log/getOperationLogByPage`,
    method: 'POST',
    data:params
  })
}
// 消息中心--获取未读消息数量
export function getNoReadLogNum(params) {
  return request({
    url: `${Url.ProxyUrl}/Log/getNoReadLogNum`,
    method: 'GET',
    params
  })
}
