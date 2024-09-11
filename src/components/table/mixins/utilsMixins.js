export const utilsMixins = {
  methods: {
    // 事件适配
    eventAdapter(clickEvent, dto, beforeFn, afterFn) {
      let _self = this
      let func = null
      let paramArg = {}
      if (typeof clickEvent === "function") {
        func = clickEvent;
      } else {
        if (clickEvent) {
          let parent = _self.componentUUID ? _self.$parent : _self; // 按钮组件（包含componentUUID）直接读取上级组件
          let evnName = clickEvent.split('(')[0].trim();
          while (parent && !parent[evnName]) {
            parent = parent.$parent;
          }
          if (!parent) {
            typeof beforeFn === 'function' ? beforeFn() : false;
            _self.$message('事件[' + evnName + ']未定义或不存在');
            typeof afterFn === 'function' ? afterFn() : false;
            return;
          }
          func = parent[evnName];
          if (clickEvent.split('(').length > 1) {
            let strArg = clickEvent.substring(clickEvent.indexOf('(') + 1, clickEvent.indexOf(')'));
            let arrArg = strArg.split(',');
            if (strArg.indexOf(':') < 0 && strArg.indexOf('{') < 0) {
              paramArg = arrArg
            } else {
              // configObj传递当前按钮配置对象（用于获取按钮配置信息，如：API、参数等，可以处理请求）
              // row传递行数据（如果有）
              paramArg = Object.assign(paramArg, dto);
              arrArg.forEach(o => {
                const strO = o.replace('{', '').replace('}', '');
                if (strO.indexOf(':') > -1) {
                  paramArg[strO.split(':')[0].trim()] = strO.split(':')[1].trim();
                }
              })
            }
          }
        }
      }
      if (typeof func === 'function') {
        typeof beforeFn === 'function' ? beforeFn() : false;
        if (paramArg instanceof Array) {
          func(...paramArg);
        } else {
          // func({ ...paramArg });
          func(paramArg.row,paramArg);
        }
        typeof afterFn === 'function' ? afterFn() : false;
      }
    },
    // API参数适配
    apiDataAdapter(response) {
      this.$utils && this.$utils.eventAdapter(this, response);
    },
    // 参数类型适配
    paramTypeAdapter(param1, param2) {
      const paramType = typeof param1;
      let returnObj = param2;
      if (paramType !== typeof param2) {
        if (param2 instanceof Array) {
          returnObj = param2.join(',');
        }
      }
      return returnObj;
    },
    // 下拉框查询事件（_this：页面上下文，current：组件配置对象，dataObj：数据对象(如：this.formData或row)）
    // queryObj：field中的obj对象，apiStyle：graphql、restful
    // 下拉选项绑定的对象: optinosObj.options，randStr：随机字符（放在重复提交cancel）
    dropdownOptionsAdapter(params, self) {
      let {_this, current, queryObj, dataObj, optinosObj, optionsName, randStr, cb} = params
      let source = current.dataOptions.dataSource
      let apiQueryRow = []
      const curOptionsObj = optinosObj || source
      const curOptionsName = optinosObj ? optionsName || 'options' : 'options'
      if (curOptionsObj) {
        if (!curOptionsObj[curOptionsName]) {
          _this.$set(curOptionsObj, curOptionsName, [])
        } else {
          curOptionsObj[curOptionsName].splice(0)
        }
        // 添加“全部”选项
        if (current.dataOptions.needAllOption) {
          let emptyObj = {}
          if (current.dataOptions.allOption) {
            emptyObj = current.dataOptions.allOption
          } else {
            // 必须配置默认参数
            emptyObj = {
              label: '全部',
              value: ''
            }
            if (current.dataOptions.otherFields) {
              current.dataOptions.otherFields.forEach(otherField => {
                const queryParamName = otherField.split('-')[0]
                emptyObj[queryParamName] = ""
              })
            }
          }
          curOptionsObj[curOptionsName].push(emptyObj)
        }
      }
      // 必须条件检查
      let notMust = true;
      if (current.dataOptions.triggerMustParams && current.dataOptions.triggerMustParams.length > 0) {
        current.dataOptions.triggerMustParams.forEach(p => {
          // 下拉框字段-表单数据字段
          const mustParam = p.split('-').length > 1 ? p.split('-')[1] : p
          if (!dataObj[mustParam]) {
            notMust = false;
          }
          // 拼接graphql返回参数(rows中的参数)
          if (source.apiStyle === 'graphql' && !apiQueryRow[p.split('-')[0]]) {
            apiQueryRow.push(p.split('-')[0])
          }
        })
      }
      // 查询条件赋值
      if (dataObj) {
        for(let i in source.apiParams){
          if (!['pageIndex','pageSize'].includes(i)) {
            // 联动字段名称转换（组件中查询条件-formData属性，如：queryCode-formCode）
            const param = current.dataOptions && current.dataOptions.triggerParams ? 
                              current.dataOptions.triggerParams.filter(o => o.split('-')[0] === i)[0] : '';
            const formParam = param && param.split('-').length > 1 ? param.split('-')[1] : param;
            if (formParam && Object.prototype.hasOwnProperty.call(dataObj, formParam)) {
              const paramType = typeof source.apiParams[i];
              if (paramType !== typeof dataObj[formParam]) {
                if (dataObj[formParam] instanceof Array) {
                  source.apiParams[i] = dataObj[formParam].join(',');
                } else {
                  source.apiParams[i] = dataObj[formParam];
                }
              } else {
                source.apiParams[i] = dataObj[formParam];
              }
            }
          }
        }
      }
      if (!notMust) {
        if (typeof cb === 'function') {
          cb.call()
        }
        return;
      }
      // 适配层级参数
      let dataInfo = {}
      if (source.apiParamName) {
        dataInfo[source.apiParamName] = source.apiParams ? JSON.parse(JSON.stringify(source.apiParams)) || {} : {}
      } else {
        dataInfo = source.apiParams ? JSON.parse(JSON.stringify(source.apiParams)) : {}
      }
      // 转换默认值
      if (self && self.$utils) {
        self.$utils.changeDefaultValue(dataInfo, self);
      }
      let data = {
        variables: source.apiStyle === 'graphql' ? { dataInfo: {...dataInfo} } : {...dataInfo},
        apiUrl: source.apiUrl + (randStr ? '?ran=' + randStr : ''),
        apiConfig: {ServiceCode: source.serviceCode, APIUrl: source.apiUrl, InputType: source.inputType},
        method: source.method
      };
      if (!data.variables.pageIndex) {
        data.variables.pageIndex = 1;
      }
      if (!data.variables.pageSize) {
        data.variables.pageSize = -1;
      }
      if (source.apiStyle === 'graphql') {
        // 拼接下拉字段
        if (source.optionsConfig.label && !apiQueryRow[source.optionsConfig.label]) {
          apiQueryRow.push(source.optionsConfig.label)
        }
        if (source.optionsConfig.value && !apiQueryRow[source.optionsConfig.value]) {
          apiQueryRow.push(source.optionsConfig.value)
        }
        // 拼接其他字段
        if (current.dataOptions.otherFields && current.dataOptions.otherFields.length > 0) {
          current.dataOptions.otherFields.forEach(p => {
            // 拼接graphql返回参数(rows中的参数)
            if (!apiQueryRow[p.split('-')[0]]) {
              apiQueryRow.push(p.split('-')[0])
            }
          })
        }
        data.apiServices = [{
          apiQueryRow: apiQueryRow
        }]
      }
      let currentVersion = 0;
      if (queryObj && queryObj.queryVersion !== undefined && queryObj.queryVersion !== null) {
        queryObj.queryVersion++;
        currentVersion = queryObj.queryVersion;
      }
      // 转换了中台请求格式数据
      var paramD = source.apiStyle === 'graphql' ? this.$fastGetParams(data, null, source.apiStyle) : data;
      _this.$fastRequestAPI(paramD, source.apiStyle).then(response => {
        if (currentVersion === 0 || currentVersion === queryObj.queryVersion) {
          const rec = this.$utils.apiDataAdapter(this, response);
          let rows = null;
          if (source.apiStyle === 'graphql') {
            if (rec.data && rec.data[data.serviceCode] && rec.data[data.serviceCode].rows) {
              rows = rec.data[data.serviceCode].rows
            }
          } else {
            rows = rec.rows
          }
          rows ? rows.forEach(item => {
            let obj = {}
            // 必须配置默认参数
            if (source.optionsConfig && source.optionsConfig.label && item[source.optionsConfig.label]) {
              obj = {
                label: item[source.optionsConfig.label],
                value: item[source.optionsConfig.value]
              }
              if (current.dataOptions.otherFields) {
                current.dataOptions.otherFields.forEach(otherField => {
                  const queryParamName = otherField.split('-')[0]
                  if (item[queryParamName] !== undefined) {
                    obj[queryParamName] = item[queryParamName]
                  }
                })
              }
            }
            curOptionsObj[curOptionsName].push(obj)
          }) : false
          
          if (typeof cb === 'function') {
            cb.call()
          }
        }
      })
    }
  }
}
