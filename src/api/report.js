import axios from '@/utils/request'
import Url from '../../public/proxyUrl'

//人群画像--报告信息接口
export function getInsightVo(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getInsightVo`,
    method: 'POST',
    params
  })
}
//人群画像--热力图数据
export function getThermalMap(params) {
  return axios({
    // url: `${Url.ProxyUrl}/insight/getThermalMap`,
    url:`${Url.ProxyUrl}/insight/getThermalMap`,
    method: 'POST',
    params
  })
}
//对比画像--热力图数据
export function getContrastThermalMap(params) {
  return axios({
    url:`${Url.ProxyUrl}/insight/getContrastThermalMap`,
    method: 'POST',
    params
  })
}
//报告下载
export function downloadReportFile(reportId) {
  return axios({
    url: `${Url.ProxyUrl}/insight/downloadReportFile?reportId=${reportId}`,
    method: 'POST',
    responseType:'blob',
  })
}
//对比报告下载--reportType == 3
export function downloadContrastReportFile(reportId) {
  return axios({
    url: `${Url.ProxyUrl}/insight/downloadContrastReportFile?reportId=${reportId}`,
    method: 'POST',
    responseType:'blob',
  })
}
//pdf下载
export function generalPdf(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/generalPdf`,
    method: 'POST',
    responseType:'blob',
    data:params
  })
}
//对比画像--报告信息接口
export function getContrastInsightVO(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getContrastInsightVO`,
    method: 'POST',
    params
  })
}