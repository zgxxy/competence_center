import store from '@/store'
//全局方法
exports.install = function (Vue, options) {
    //获取osForm表单对应字段的formFields配置数据————field：字段名、formFields：表单字段配置名
    Vue.prototype.getComponent = function (field, formFields){
        for (const obj of this[formFields]) {
            if (obj.field == field) {
              return obj
            }
        }
    };

    //批量替换————val：要替换的数据（object）、mapReplace：替换规则（object，--替换成||,1替换成01————例：{'--': '||' , '1': '01'}）
    Vue.prototype.replaceAll = function (val,mapReplace){
        let res = ''
        const replace = ({ str, reg, replacer }) =>
          str.replace(new RegExp(reg, 'g'), replacer)
        res = Object.keys(mapReplace).reduce(
          (str, reg) => replace({ str, reg, replacer: mapReplace[reg] }),
          val,
        )
        return res
    };

    //随机生成密码串（length：密码长度，passwordArray：密码串包含内容）
    Vue.prototype.randPassword = function (length, passwordArray){
        length = length || 8
      //默认：大写字母、小写字母、数字、特殊字符（'!@#$%&',）
      passwordArray = passwordArray || [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '1234567890',
        '!@#$%&',
      ]
      var password = ''
      // 随机生成开始字符串
      var startIndex = parseInt(Math.random() * length)
      var randIndex = []
      for (var i = 0; i < length; i++) {
        // 创建数组，用于取随机位置  [0,1,2,3,4,5,....]
        randIndex.push(i)
      }
      for (var i = 0; i < length; i++) {
        // 根据随机数组生成随机位置
        var r = parseInt(Math.random() * randIndex.length)
        var num = randIndex[r] + startIndex
        // 根据随机值取余数
        var randRemainder = num % passwordArray.length
        // 当前密码串【大写字母，小写字母，数字、指定字符】
        var currentPassword = passwordArray[randRemainder]
        // 根据当前密码串长度取随机数
        var index = parseInt(Math.random() * currentPassword.length)
        // 获取随机字符串
        var str = currentPassword.substr(index, 1)
        // 删除随机数组中已经使用的值
        randIndex.splice(r, 1)
        password += str
      }
      return password
    };

    //手机号脱敏
    Vue.prototype.encryptPhone = function (phone){
        if(phone){
            let reg = /^(1[3-9][0-9])\d{4}(\d{4}$)/;
            phone = phone.replace(reg, '$1****$2');
            return phone; // 185****6696
        }
    };

    //卡号/身份证号脱敏
    Vue.prototype.encryptId = function (card){
        if(card){
            const reg = /^(.{4})(?:\d+)(.{4})$/; // 号码前4位和后4位的正则表达式
            const maskedIdCard = card.replace(reg, '$1******$2');
            return maskedIdCard; // 1234******5678
        }
    };
    
    //姓名脱敏
    Vue.prototype.encryptName = function (name){
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
    };

    //邮箱脱敏
    Vue.prototype.encryptEmail = function (email){
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
    };
    //按钮显示判断
    Vue.prototype.showComputed = function (val){
      var list = store.getters.userInfo.strategyList;
      let result = list.some(ele => ele === val)
      return result // 输出布尔值
  };
};