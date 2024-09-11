////////账号管理页////////
import axios from '@/utils/request'
import Url from '../../public/proxyUrl'

// 文件上传
export function uploadFile(params) {
    return axios({
      url: `${Url.ProxyUrl}/User/getByPage`,
      method: 'POST',
      data:params
    })
  }