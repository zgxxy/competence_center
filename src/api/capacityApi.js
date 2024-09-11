// 营销基础能力
import request from '@/utils/request'
import Url from '../../public/proxyUrl'

// 登录
export function login(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/user/userLogin`,
    method: 'post',
    data
  })
}

// 获取客户列表
export function getSelectByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/selectByPage`,
    method: 'post',
    data
  })
}

// 修改客户信息
export function updateCustomerEntity(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/updateCustomerEntity`,
    method: 'post',
    data
  })
}

// 新增客户
export function insertCustomerEntity(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/insertCustomerEntity`,
    method: 'post',
    data
  })
}

// 删除客户
export function deleteCustomer(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/deleteById`,
    method: 'post',
    data
  })
}

// 查看客户详情
export function selectCustomerDataById(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/selectCustomerDataById`,
    method: 'post',
    data
  })
}

// 更新客户启用禁用
export function updateCustomerStatus(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/updateCustomerStatus`,
    method: 'post',
    data
  })
}

// 客户列表检索
export function CustomerList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customer/selectListByCondition`,
    method: 'post',
    data
  })
}

// 获取项目列表
export function projectList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/selectByPage`,
    method: 'post',
    data
  })
}

// 新建项目
export function newBuildProject(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/insertProjectEntity`,
    method: 'post',
    data
  })
}

// 获取项目详情
export function projectDetail(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/selectById`,
    method: 'post',
    data
  })
}

// 删除项目
export function deleteProject(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/deleteById`,
    method: 'post',
    data
  })
}

// 更新项目
export function updateProjectEntity(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/updateProjectEntity`,
    method: 'post',
    data
  })
}

// 项目启用禁用
export function updateProjectStatus(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/updateProjectStatus`,
    method: 'post',
    data
  })
}

// 获取能力池列表
export function selectListByCondition(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/selectListByCondition`,
    method: 'post',
    data
  })
}

// 获取资源列表
export function powerList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/selectByPage`,
    method: 'post',
    data
  })
}

// 获取资源详情
export function powerDetail(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/selectById`,
    method: 'post',
    data
  })
}

// 新增资源
export function insertPowerPoolEntity(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/insertPowerPoolEntity`,
    method: 'post',
    data
  })
}

// 删除资源
export function deletePowerPool(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/deleteById`,
    method: 'post',
    data
  })
}

// 更新资源启用禁用
export function updatePowerPoolStatus(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/updatePowerPoolStatus`,
    method: 'post',
    data
  })
}

// 更新一条能力池信息
export function updatePowerPoolEntity(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPool/updatePowerPoolEntity`,
    method: 'post',
    data
  })
}

// 关联服务启用禁用
export function updateCustomerPowerPoolAuthStatus(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customerPowerPoolAuth/updateCustomerPowerPoolAuthStatus`,
    method: 'post',
    data
  })
}

// 新增授权
export function addCustomerPower(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customerPowerPoolAuth/insertCustomerPowerPoolAuthEntity`,
    method: 'post',
    data
  })
}

// 删除关联服务
export function deleteCustomerPower(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/customerPowerPoolAuth/deleteById`,
    method: 'post',
    data
  })
}

// 获取短信统计信息
export function getSmsStatisticsData(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/sms/getSmsStatisticsData`,
    method: 'post',
    data
  })
}

// 系统日志列表接口
export function selectSysLogByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/syslog/selectSysLogByPage`,
    method: 'post',
    data
  })
}

// 系统日志详情接口
export function getSysLogDataById(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/syslog/getSysLogDataById`,
    method: 'post',
    data
  })
}

// 根据appId查询密钥信息
export function getApiKeyInfo(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/apiKeyInfo/selectById`,
    method: 'post',
    data
  })
}

// 服务能力池收费模式接口
export function getAllPowerList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/powerPoolChargeMode/getAllList`,
    method: 'post',
    data
  })
}

// 分页获取OCR报表数据
export function getOcrList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getOcrStatisticsDataByPage`,
    method: 'post',
    data
  })
}

// 分页获取OCR明细数据
export function getOcrDeatail(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getOcrLogDataByPage`,
    method: 'post',
    data
  })
}

// 分页获取短信报表数据
export function getSmsListPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getSmsStatisticsDataByPage`,
    method: 'post',
    data
  })
}

// 分页获取短信二级报表数据
export function getSmsSecondList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getSmsSignStatisticsDataByPage`,
    method: 'post',
    data
  })
}

// 分页获取短信明细
export function getSmsLogDataByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getSmsLogDataByPage`,
    method: 'post',
    data
  })
}

// 分页获取VIN车系查询报表
export function getVinCarDataByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getVinCarSeriesStatisticsDataByPage`,
    method: 'post',
    data
  })
}

// 分页获取VIN车系签名报表明细
export function getVinCarDetail(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/getVinCarSeriesLogDataByPage`,
    method: 'post',
    data
  })
}

//导出OCR报表数据
export function exportOcrStatisticsData(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/statistics/exportOcrStatisticsData`,
    method: 'post',
    data,
    responseType:'arraybuffer',
    // responseType:'blob',
  })
}

//项目管理--项目详情-分页查询项目成员
export function selectProjectUserByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/selectProjectUserByPage`,
    method: 'post',
    data,
  })
}
//项目管理--项目详情-添加项目成员
export function addProjectUser(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/addProjectUser`,
    method: 'post',
    data,
  })
}
//项目管理--项目详情-移除项目成员
export function removeProjectUser(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/removeProjectUser`,
    method: 'post',
    data,
  })
}

//////////  用户管理 start ////////////
// 用户管理--分页查询
export function userSelectByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/user/selectByPage`,
    method: 'post',
    data
  })
}

// 用户管理--关联客户、关联项目下拉框查询
export function getCustomerProjectList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/project/getCustomerProjectList`,
    method: 'post',
    data
  })
}

// 用户管理--新增用户
export function addUser(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/user/addUser`,
    method: 'post',
    data
  })
}

// 用户管理--禁用、启用
export function disableUser(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/user/disableUser`,
    method: 'post',
    data
  })
}

//用户管理--绑定角色
export function userBoundRole(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/user/userBoundRole`,
    method: 'post',
    data
  })
}

//用户管理--续期
export function renewUser(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/user/renewUser`,
    method: 'post',
    data
  })
}
//////////  用户管理 end ////////////

//////////  角色管理 start ////////////
// 角色管理--分页查询
export function selectRoleByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/role/selectRoleByPage`,
    method: 'post',
    data
  })
}
// 角色管理--详情查询
export function getRoleData(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/role/getRoleData`,
    method: 'post',
    data
  })
}
// 角色管理--新增角色保存
export function addRole(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/role/addRole`,
    method: 'post',
    data
  })
}

// 角色管理--编辑角色保存
export function updateRole(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/role/updateRole`,
    method: 'post',
    data
  })
}
// 关联角色下拉框数据查询
export function getRoleByCondition(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/role/getRoleByCondition`,
    method: 'post',
    data
  })
}

// 查询角色已关联的策略
export function getStrategyItemListByRole(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/strategy/getStrategyItemListByRole`,
    method: 'post',
    data
  })
}
//////////  角色管理 end ////////////

//////////  策略管理 start ////////////
// 策略管理--分页查询
export function selectStrategyByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/strategy/selectStrategyByPage`,
    method: 'post',
    data
  })
}

// 策略管理--关联角色
export function addRoleStrategyRelation(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/strategy/addRoleStrategyRelation`,
    method: 'post',
    data
  })
}

// 策略管理--批量启用/停用
export function updateStrategyStatus(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/strategy/updateStrategyStatus`,
    method: 'post',
    data
  })
}

// 策略管理--获取全量策略
export function getStrategyItemListByCodition(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/strategy/getStrategyItemListByCodition`,
    method: 'post',
    data
  })
}

// 策略管理--策略已关联的角色
export function getRoleListByStrategyId(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/strategy/getRoleListByStrategyId`,
    method: 'post',
    data
  })
}

//////////  策略管理 end ////////////

//////////  服务组管理 start ////////////
// 服务组管理--分页查询
export function selectServiceGroupByPage(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/selectServiceGroupByPage`,
    method: 'post',
    data
  })
}

// 服务组管理--服务组授权下拉框
export function getServiceGroupByCondition(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/getServiceGroupByCondition`,
    method: 'post',
    data
  })
}

// 服务组管理--新增服务
export function addServiceGroup(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/addServiceGroup`,
    method: 'post',
    data
  })
}

// 服务组管理--编辑服务
export function updateServiceGroup(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/updateServiceGroup`,
    method: 'post',
    data
  })
}

// 服务组管理--关联资源查询
export function getAssocServiceList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/getAssocServiceList`,
    method: 'post',
    data
  })
}

// 服务组管理--删除服务
export function deleteServiceGroup(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/deleteServiceGroup`,
    method: 'post',
    data
  })
}

// 服务组管理--关联用户列表查询
export function getServiceGroupUserList(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/getServiceGroupUserList`,
    method: 'post',
    data
  })
}

// 服务组管理--关联用户
export function serviceGroupAssocUser(data) {
  return request({
    url: `${Url.ProxyUrl}/powerManage/manage/serviceGroup/serviceGroupAssocUser`,
    method: 'post',
    data
  })
}
//////////  服务组管理 end ////////////