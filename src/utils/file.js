//下载，导出文件
 export function downloadFile(data,type) {
    const resData = data.data
    let jsonData = null
    return new Promise((resolve) => {
      if (resData.type === 'application/json') {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          // 获取后台信息
          jsonData = JSON.parse(fileReader.result)
          resolve(jsonData)
        }
        fileReader.readAsText(resData)
      }else{
        let blob = new Blob([data.data], {
          type: type||'application/zip;charset=UTF-8', //文件类型
        })
        let url = window.URL.createObjectURL(blob)
        let fileName = decodeURIComponent(
          data.headers['content-disposition'].split('=')[1],
        ) //文件名称
        if ('download' in document.createElement('a')) {
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        // const link = document.createElement('a');
        // link.href = url;
        // link.target = '_blank';
        // link.download = 'filename.xlsx';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      }
    })
  }

  //判断文件类型
  export function matchFileType(fileName) {
    // 后缀获取
    let suffix = ''
    // 获取类型结果
    let result = ''
    if (!fileName) return false
    try {
      // 截取文件后缀
      suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length)
      // 文件后缀转小写，方便匹配
      suffix = suffix.toLowerCase()
    } catch (err) {
      suffix = ''
    }
    // fileName无后缀返回 false
    if (!suffix) {
      result = false
      return result
    }

    let fileTypeList = [
      // 图片类型
      { typeName: 'image', types: ['png', 'jpg', 'jpeg', 'bmp', 'gif'] },
      // 文本类型
      { typeName: 'txt', types: ['txt', 'csv'] },
      // excel类型
      { typeName: 'excel', types: ['xls', 'xlsx'] },
      { typeName: 'word', types: ['doc', 'docx'] },
      { typeName: 'pdf', types: ['pdf'] },
      { typeName: 'ppt', types: ['ppt'] },
      // 视频类型
      { typeName: 'video', types: ['mp4', 'm2v', 'mkv'] },
      // 音频
      { typeName: 'radio', types: ['mp3', 'wav', 'wmv'] },
    ]
    // let fileTypeList = ['image', 'txt', 'excel', 'word', 'pdf', 'video', 'radio']
    for (let i = 0; i < fileTypeList.length; i++) {
      const fileTypeItem = fileTypeList[i]
      const typeName = fileTypeItem.typeName
      const types = fileTypeItem.types
      result = types.some(function (item) {
        return item === suffix
      })
      if (result) {
        return typeName
      }
    }
    return 'other'
  }

  //计算文件大小
  export function computeFileZise(size) {
    if (size == 0) return '0 B'
    var k = 1024
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(size) / Math.log(k))
    return (size / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
  }

  //随机生成uuid
  export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
}