<!-- 客户详情 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="1">
            <div class="title">客户信息填写</div>
            <ul class="Lists">
              <li class="lis ellipse">
                客户名称：
                <span class="sp">{{ customerObj.customerName }}</span>
              </li>
              <li class="lis ellipse">
                帐号开通时间：
                <span class="sp">{{ customerObj.createTime }}</span>
              </li>
              <li class="lis ellipse">
                联系人：
                <span class="sp">{{ customerObj.linkPerson }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="right"
                >
                  <i
                    class="el-icon-edit el-icon"
                    @click="openDialogTable('1')"
                  />
                </el-tooltip>
              </li>
              <li class="lis ellipse">
                联系电话：
                <span class="sp">{{ customerObj.linkPhone }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="right"
                >
                  <i
                    class="el-icon-edit el-icon"
                    @click="openDialogTable('2')"
                  />
                </el-tooltip>
              </li>
              <li class="lis ellipse">
                联系邮箱：
                <span class="sp">{{ customerObj.email || '--' }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="right"
                >
                  <i
                    class="el-icon-edit el-icon"
                    @click="openDialogTable('3')"
                  />
                </el-tooltip>
              </li>
            </ul>

            <div class="title">关联账号信息</div>
            <el-tag class="smallTitle" type="success">子账号信息</el-tag>
            <div class="tableBox">
              <el-table
                :data="customerObj.userEntityVOList"
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
                border
              >
                <el-table-column label="用户姓名" prop="userName" />
                <el-table-column label="用户手机号" prop="phone" />
                <el-table-column label="用户id" prop="userId" />
                <el-table-column label="创建时间" prop="createTime" />
                <el-table-column label="有效期限" prop="">长期</el-table-column>
                <el-table-column label="状态" prop="status">
                  <template slot-scope="scope1">
                    <span
                      v-if="scope1.row.status == '1'"
                      class=""
                      style="color: #70b603;"
                    >
                      启用
                    </span>
                    <span
                      v-if="scope1.row.status == '0'"
                      class=""
                      style="color: #d9001b;"
                    >
                      禁用
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-dialog
              width="50%"
              title="修改客户信息"
              :visible.sync="dialogTableVisible"
              @close="closeDialogTable"
            >
              <div class="popup">
                <el-form
                  ref="ruleForm"
                  :model="ruleForm"
                  :rules="rules"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item
                    v-if="showDialog1"
                    label="联系人"
                    prop="linkPerson"
                  >
                    <el-input
                      v-model="ruleForm.linkPerson"
                      maxlength="30"
                      placeholder="请输入联系人"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    v-if="showDialog2"
                    label="联系电话"
                    prop="linkPhone"
                  >
                    <el-input
                      v-model="ruleForm.linkPhone"
                      max-length="11"
                      placeholder="请输入联系电话"
                      @input="restrictInput"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    v-if="showDialog3"
                    label="联系邮箱"
                    prop="email"
                  >
                    <el-input
                      v-model="ruleForm.email"
                      type="text"
                      maxlength="30"
                      placeholder="请输入联系邮箱"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    style="
                      padding-left: 80px;
                      box-sizing: border-box;
                      margin-top: 32px;
                    "
                  >
                    <el-button
                      class="btn"
                      type="primary"
                      @click="submitForm('ruleForm')"
                    >
                      提交
                    </el-button>
                    <el-button class="btn" @click="closeDialogTable">
                      取消
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="关联服务" name="2">
            <div class="title" style="margin-bottom: 20px;">关联服务</div>
            <!-- <el-button type="primary" class="addBtn" @click="createSq">新建授权</el-button> -->
            <el-table
              :data="customerObj.customerPowerPoolAuthEntityVOList"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              style="width: 100%;"
              border
            >
              <el-table-column label="项目名称" prop="projectName" />
              <el-table-column label="产品/服务名称" prop="powerName" />
              <el-table-column label="交付方式" prop="deliveryMode" />
              <el-table-column label="状态" prop="status">
                <template slot-scope="scope1">
                  <template v-if="scope1.row.powerStatus == '1'">
                    <span
                      v-if="scope1.row.status == '0'"
                      class=""
                      style="color: #d9001b;"
                    >
                      禁用
                    </span>
                    <span
                      v-if="scope1.row.status == '1'"
                      class=""
                      style="color: #70b603;"
                    >
                      启用
                    </span>
                    <span
                      v-if="scope1.row.status == '2'"
                      class=""
                      style="color: #909399;"
                    >
                      禁用待生效
                    </span>
                  </template>
                  <template v-else>
                    <span
                      v-if="scope1.row.powerStatus == '0'"
                      class=""
                      style="color: #d9001b;"
                    >
                      禁用
                    </span>
                    <span
                      v-if="scope1.row.powerStatus == '1'"
                      class=""
                      style="color: #70b603;"
                    >
                      启用
                    </span>
                    <span
                      v-if="scope1.row.powerStatus == '2'"
                      class=""
                      style="color: #909399;"
                    >
                      禁用待生效
                    </span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="计费模式" prop="chargeMode">
                <template slot-scope="scope">
                  <span v-if="scope.row.chargeMode === '1'">按次数收费</span>
                  <span v-if="scope.row.chargeMode === '2'">按套餐收费</span>
                </template>
              </el-table-column>
              <el-table-column label="是否限量" prop="isLimit">
                <template slot-scope="scope1">
                  <span v-if="scope1.row.isLimit == '1'" class="">是</span>
                  <span v-if="scope1.row.isLimit == '0'" class="">否</span>
                </template>
              </el-table-column>
              <el-table-column label="限制数量" prop="limitNum">
                <template slot-scope="scope1">
                  <span v-if="scope1.row.isLimit == '1'" class="">
                    {{ scope1.row.limitNum }}
                  </span>
                  <span v-if="scope1.row.isLimit == '0'" class="">--</span>
                </template>
              </el-table-column>
              <el-table-column label="服务开通时间" prop="createTime" />
              <el-table-column label="服务到期时间" prop="endTime" />
            </el-table>

            <el-tabs
              class="powerTab"
              v-if="powerList.length > 0"
              type="card"
              @tab-click="handleClick2"
            >
              <el-tab-pane
                v-for="(item, index) in powerList"
                :key="index"
                :label="item"
              >
                <div class="powerBox">
                  <div v-if="item == '短信'" class="group">
                    <sms
                      :smsParams="smsParams"
                      :linkList2="linkList2"
                      :smsListLength="smsListLength"
                      :tableData3="tableData3"
                      :statistics2="statistics2"
                      :hasShow="hasShow"
                      @selectDate3="selectDate3"
                      @selectStatistics2="selectStatistics2"
                      @goDetail2="goDetail2"
                      @handleCurrentChange3="handleCurrentChange3"
                      @Search7="Search5"
                      @Search6="Search6"
                    />
                  </div>
                  <div v-if="item == 'OCR文字识别'" class="group">
                    <ocr
                      :ocrParams="ocrParams"
                      :linkList="linkList"
                      :ocrListLength="ocrListLength"
                      :tableData2="tableData2"
                      :statistics="statistics"
                      :hasShowCustomer="hasShowCustomer"
                      @selectDate2="selectDate2"
                      @selectStatistics="selectStatistics"
                      @goDetail="goDetail"
                      @handleCurrentChange2="handleCurrentChange2"
                      @Search2_="Search2"
                      @Search3_="Search3"
                      @Search4_="Search4"
                    />
                  </div>
                  <div v-if="item == 'VIN车系查询'" class="group">
                    <vin
                      :vinParams="vinParams"
                      :linkList="linkList3"
                      :vinListLength="vinListLength"
                      :tableData4="tableData4"
                      :statistics="statistics3"
                      @selectDate4="selectDate4"
                      @selectStatistics="selectStatistics3"
                      @handleCurrentChange4="handleCurrentChange4"
                      @vinSearch1="vinSearch1"
                      @vinSearch2="vinSearch2"
                    />
                  </div>
                  <div
                    v-if="
                      item !== '短信' &&
                      item !== 'OCR文字识别' &&
                      item !== 'VIN车系查询'
                    "
                    class="group"
                  >
                    <el-empty
                      style="margin-top: 20px;"
                      :image-size="120"
                      :description="item + ' 暂无报表数据...'"
                    />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="关联项目" name="3">
            <div class="title" style="margin-bottom: 30px;">关联项目</div>
            <el-table
              :data="customerObj.projectEntityVOList"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              border
            >
              <el-table-column label="项目名称" prop="projectName" />
              <el-table-column label="项目id" prop="projectId" />
              <el-table-column label="创建时间" prop="createTime" />
              <el-table-column prop="" label="项目经理/联系方式" align="center">
                <template slot-scope="scope">
                  <span class="">{{ scope.row.projectManage || '--' }}</span>
                  /
                  <span class="">{{ scope.row.contactInform || '--' }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="结束时间" prop=""></el-table-column> -->
              <el-table-column label="状态" prop="status">
                <template slot-scope="scope1">
                  <span
                    v-if="scope1.row.status == '1'"
                    class=""
                    style="color: #70b603;"
                  >
                    启用
                  </span>
                  <span
                    v-if="scope1.row.status == '0'"
                    class=""
                    style="color: #d9001b;"
                  >
                    禁用
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="关联服务" prop=""></el-table-column> -->
              <!-- <el-table-column label="备注" prop="" /> -->
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="秘钥信息" name="4">
            <div v-if="options2.length > 0" class="Info">
              <div class="title" style="margin-bottom: 30px;">秘钥信息</div>
              <div class="box2 flex_">
                <p class="p1">请选择appId：</p>
                <el-select
                  v-model="value3"
                  placeholder="请选择appId"
                  @change="changeAppid"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div class="myList">
                <div class="lis_ flex_">
                  <p class="name">秘钥名称：</p>
                  <p class="info_ ellipse">{{ Detail.appKeyName }}</p>
                </div>
                <div class="lis_ flex_">
                  <p class="name">备注：</p>
                  <p class="info_ ellipse">{{ Detail.remark }}</p>
                </div>
                <div class="lis_ flex_">
                  <p class="name">开发者秘钥明文（clientSecur）：</p>
                  <el-tooltip
                    popper-class="projectTooltip"
                    :content="Detail.clientSecur"
                    placement="top"
                  >
                    <el-button class="info_ ellipse">
                      {{ Detail.clientSecur }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="success"
                    plain
                    class="copy2"
                    :data-clipboard-text="Detail.clientSecur"
                    data-clipboard-action="copy"
                    @click="copyText('copy2')"
                  >
                    复制
                  </el-button>
                </div>
                <div class="lis_ flex_">
                  <p class="name">平台公钥明文（platformRsaPublicKey）：</p>
                  <el-tooltip
                    popper-class="projectTooltip"
                    :content="Detail.platformRsaPublicKey"
                    placement="top"
                  >
                    <el-button class="info_ ellipse">
                      {{ Detail.platformRsaPublicKey }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="success"
                    plain
                    class="copy1"
                    :data-clipboard-text="Detail.platformRsaPublicKey"
                    data-clipboard-action="copy"
                    @click="copyText('copy1')"
                  >
                    复制
                  </el-button>
                </div>
                <div class="lis_ flex_">
                  <p class="name">开发者秘钥密文（privateEncrypt）：</p>
                  <el-tooltip
                    popper-class="projectTooltip"
                    :content="Detail.privateEncrypt"
                    placement="top"
                  >
                    <el-button class="info_ ellipse">
                      {{ Detail.privateEncrypt }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="success"
                    plain
                    class="copy3"
                    :data-clipboard-text="Detail.privateEncrypt"
                    data-clipboard-action="copy"
                    @click="copyText('copy3')"
                  >
                    复制
                  </el-button>
                </div>
                <div class="lis_ flex_">
                  <p class="name">开发者公钥密文（publicEncrypt）：</p>
                  <el-tooltip
                    popper-class="projectTooltip"
                    :content="Detail.publicEncrypt"
                    placement="top"
                  >
                    <el-button class="info_ ellipse">
                      {{ Detail.publicEncrypt }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="success"
                    plain
                    class="copy5"
                    :data-clipboard-text="Detail.publicEncrypt"
                    data-clipboard-action="copy"
                    @click="copyText('copy5')"
                  >
                    复制
                  </el-button>
                </div>
                <div class="lis_ flex_">
                  <p class="name">开发者私钥明文（privateKey）：</p>
                  <el-tooltip
                    popper-class="projectTooltip"
                    :content="Detail.privateKey"
                    placement="top"
                  >
                    <el-button class="info_ ellipse">
                      {{ Detail.privateKey }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="success"
                    plain
                    class="copy4"
                    :data-clipboard-text="Detail.privateKey"
                    data-clipboard-action="copy"
                    @click="copyText('copy4')"
                  >
                    复制
                  </el-button>
                </div>
                <div class="lis_ flex_">
                  <p class="name">开发者公钥明文（publicKey）：</p>
                  <el-tooltip
                    popper-class="projectTooltip"
                    :content="Detail.publicKey"
                    placement="top"
                  >
                    <el-button class="info_ ellipse">
                      {{ Detail.publicKey }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    type="success"
                    plain
                    class="copy6"
                    :data-clipboard-text="Detail.publicKey"
                    data-clipboard-action="copy"
                    @click="copyText('copy6')"
                  >
                    复制
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else class="noData">
              <el-empty
                style="margin-top: 20px;"
                :image-size="200"
                description="暂无秘钥信息数据"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="false" label="业务统计" name="5">
            <div class="title">业务统计</div>
            <div class="box2 flex_">
              <p class="p1">统计粒度：</p>
              <el-select v-model="value1" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <el-table
              :data="gridData5"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column property="name1" label="产品/服务名称" />
              <el-table-column property="name2" label="交付方式" />
              <el-table-column property="name3" label="状态" />
              <el-table-column property="name4" label="服务开通时间" />
              <el-table-column property="name5" label="服务结束时间" />
              <el-table-column property="name6" label="计费方式" />
              <el-table-column property="name7" label="月用量" />
              <el-table-column property="name8" label="历史用量" />
              <el-table-column property="name9" label="关联授权" />
              <el-table-column property="exit" label="操作">
                <template slot-scope="scope3">
                  <span class="slat" @click="seeDetail(scope3.row)">明细</span>
                  <span class="slat">禁用</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="tabList flex_">
              <div
                v-for="(item, index) in tabList"
                :key="index"
                class="lis"
                :class="index == tabIndex ? 'active' : ''"
                @click="tabChange(index)"
              >
                {{ item }}
              </div>
            </div>

            <div v-show="tabIndex == 0" class="chatBox">
              <el-tag class="smallTitle" type="success" style="margin: 0;">
                使用量统计图
              </el-tag>

              <div class="dateGroup flex_">
                <el-button
                  v-for="(item, index) in btnList"
                  :key="index"
                  size="mini"
                  :type="activeIndex == index ? 'primary' : ''"
                  :plain="activeIndex == index"
                  @click="changeDate(index)"
                >
                  {{ item }}
                </el-button>
                <p class="p1">自定义时间：</p>
                <el-date-picker
                  v-model="value2"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :unlink-panels="true"
                  @change="selectDate"
                />
              </div>

              <div class="Chats flex_">
                <div class="box_ left">
                  <el-tag type="danger">分类占比</el-tag>
                  <div
                    id="myChart1"
                    ref="myChart1"
                    class="charts"
                    style="height: 300px;"
                  />
                </div>
                <div class="box_ right">
                  <el-tag type="danger">用量分布统计</el-tag>
                  <div
                    id="myChart2"
                    ref="myChart2"
                    class="charts"
                    style="height: 300px;"
                  />
                </div>
              </div>
            </div>
            <div v-show="tabIndex == 1" class="chatBox">
              2
            </div>
            <div v-show="tabIndex == 2" class="chatBox">
              3
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import sms from '@/components/powerList/smsList'
import ocr from '@/components/powerList/ocrList'
import vin from '@/components/powerList/vinList'
import Clipboard from 'clipboard'
import { getFirstAndLastDay, mapList, getDate_ } from '@/utils/public'
import {
  selectCustomerDataById,
  getApiKeyInfo,
  updateCustomerEntity,
  getSmsListPage,
  getOcrList,
  getVinCarDataByPage,
} from '@/api/capacityApi'
import * as echarts from 'echarts'
export default {
  components: { sms, ocr, vin },
  data() {
    const validatelinkPhone = (rule, value, callback) => {
      const regex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    return {
      hasShow: false,
      hasShowCustomer: false,
      customerId: '', // 客户id
      activeIndex: 0,
      btnList: ['日', '周', '月'],
      tabList: ['身份证二要素查询', '产品/服务2', '产品/服务3'],
      tabIndex: 0,
      dialogTableVisible: false,
      activeName: '1',
      ruleForm: {
        linkPerson: '',
        linkPhone: '',
        email: '',
      },
      rules: {
        linkPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        linkPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'change',
            validator: validatelinkPhone,
          },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'blur',
            validator: validateEmail,
          },
        ],
      },
      gridData3: [
        {
          name1: '身份证二要素....',
          name2: '项目1',
          name3: '次',
          name4: '50000',
          name5: '21263416',
          name6: '2023-06-01 23:00:50',
          name7: '2023-06-01 23:00:50',
          name8: 'MY70650JK3HG0765',
          name9: '********',
          name10: '启用',
        },
      ],
      gridData5: [
        {
          name1: '客户画像洞察平台',
          name2: 'SASS',
          name3: '已开通',
          name4: '2023-01-31 11:30:25',
          name5: '2023-01-31 11:30:25',
          name6: '包年',
          name7: '100次',
          name8: '500次',
          name9: '2',
        },
      ],
      options1: [
        {
          value: '1',
          label: '月',
        },
        {
          value: '2',
          label: '季',
        },
        {
          value: '3',
          label: '年',
        },
      ],
      options2: [],
      value1: '1',
      value2: '',
      value3: '',
      clipboard2_: null,
      powerList: [], // 能力列表
      powerIndex: 0,
      currentPower: '', // 当前选中能力
      customerObj: {},
      selected: [], // 已授权服务
      Detail: {}, // 秘钥信息
      dateRange3: [
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      ], // 短信日期范围
      statistics: '1',
      statistics2: '1',
      statistics3: '1',
      linkList: [
        {
          name: '日',
          id: '1',
        },
        {
          name: '月',
          id: '2',
        },
      ],
      linkList2: [
        {
          name: '日',
          id: '1',
        },
        {
          name: '月',
          id: '2',
        },
      ],
      linkList3: [
        {
          name: '日',
          id: '1',
        },
        {
          name: '月',
          id: '2',
        },
      ],
      smsParams: {
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      tableData2: [],
      tableData3: [],
      tableData4: [], // VIN车系
      smsListLength: 0,
      ocrListLength: 0,
      vinListLength: 0,
      ocrParams: {
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        ocrType: '', // ocr类别
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      vinParams: {
        appId: '', // appID
        customerId: '', // 客户id
        projectId: '', // 项目id
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      showDialog1: false,
      showDialog2: false,
      showDialog3: false,
    }
  },
  created() {
    // this.customerObj.appIdList
    this.customerId = this.$route.query.customerId
    this.smsParams.customerName = this.$route.query.customerName
    this.smsParams.customerId = this.$route.query.customerId
    this.ocrParams.customerId = this.$route.query.customerId

    this.ocrParams.startDate = getDate_()
    this.ocrParams.endDate = getDate_()
    this.smsParams.startDate = getDate_()
    this.smsParams.endDate = getDate_()
    this.vinParams.startDate = getDate_()
    this.vinParams.endDate = getDate_()

    if (this.customerId) {
      this.getCustomerData()
    }
  },
  mounted() {},
  beforeDestroy() {
    this.clipboard2_ && this.clipboard2_.destroy()
  },
  methods: {
    // 获取OCR报表数据
    getOcrList() {
      const params = this.ocrParams
      getOcrList(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData2 = data_.records
          this.ocrListLength = Number(data_.total)
          mapList(this.tableData2)
        }
      })
    },
    // 获取VIN报表数据
    getVinCarDataByPage() {
      const params = this.vinParams
      getVinCarDataByPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData4 = data_.records
          this.vinListLength = Number(data_.total)
          mapList(this.tableData4)
        }
      })
    },
    // 获取短信报表数据
    getSmsListPage() {
      const params = this.smsParams
      getSmsListPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data.pageData
          // this.totalNum = res.data.data.totalNum
          this.tableData3 = data_.records
          this.smsListLength = Number(data_.total)

          mapList(this.tableData3)
        }
      })
    },
    // OCR选择日期范围
    selectDate2(date) {
      if (this.statistics === '1') {
        this.ocrParams.dimension = 'day'
        if (date != null) {
          this.ocrParams.startDate = date[0]
          this.ocrParams.endDate = date[1]
          this.getOcrList()
        } else {
          this.ocrParams.startDate = ''
          this.ocrParams.endDate = ''
          this.getOcrList()
        }
      } else if (this.statistics === '2') {
        this.ocrParams.dimension = 'month'
        this.ocrParams.startDate = date[0] + '-01'
        this.ocrParams.endDate = this.getLastDayOfMonth(date[1])
        this.getOcrList()
      }
    },
    // 短信选择日期范围
    selectDate3(date) {
      if (this.statistics2 === '1') {
        this.smsParams.dimension = 'day'
        if (date != null) {
          this.smsParams.startDate = date[0]
          this.smsParams.endDate = date[1]
          this.getSmsListPage()
        } else {
          this.smsParams.startDate = ''
          this.smsParams.endDate = ''
          this.getSmsListPage()
        }
      } else if (this.statistics2 === '2') {
        this.smsParams.dimension = 'month'
        this.smsParams.startDate = date[0] + '-01'
        this.smsParams.endDate = this.getLastDayOfMonth(date[1])
        this.getSmsListPage()
      }
    },
    // vin选择日期范围
    selectDate4(date) {
      if (this.statistics3 === '1') {
        this.vinParams.dimension = 'day'
        if (date != null) {
          this.vinParams.startDate = date[0]
          this.vinParams.endDate = date[1]
          this.getVinCarDataByPage()
        } else {
          this.vinParams.startDate = ''
          this.vinParams.endDate = ''
          this.getVinCarDataByPage()
        }
      } else if (this.statistics3 === '2') {
        this.vinParams.dimension = 'month'
        this.vinParams.startDate = date[0] + '-01'
        this.vinParams.endDate = this.getLastDayOfMonth(date[1])
        this.getVinCarDataByPage()
      }
    },
    // 获取月份最后一天
    getLastDayOfMonth(dateString) {
      const [year, month] = dateString.split('-').map(Number) // 将字符串分割并转换为数字
      const lastDay = new Date(year, month, 0).getDate() // 传入年份和月份，Day设为0即为取得上一个月的最后一天
      // 格式化成 YYYY-MM-DD 形式
      const formattedLastDay = `${year}-${month
        .toString()
        .padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
      return formattedLastDay
    },
    selectStatistics(e, text) {
      this.statistics = text
    },
    selectStatistics2(e, text) {
      this.statistics2 = text
    },
    selectStatistics3(e, text) {
      this.statistics3 = text
    },
    // OCR客户名称搜索
    Search2(e) {
      this.ocrParams.customerName = e
      this.getOcrList()
    },
    // OCR项目名称搜索
    Search3(e) {
      this.ocrParams.projectName = e
      this.getOcrList()
    },
    // OCR类别搜索
    Search4(e) {
      this.ocrParams.ocrType = e
      this.getOcrList()
    },
    // 短信客户名称搜索
    Search5(e) {
      this.smsParams.customerName = e
      this.getSmsListPage()
    },
    // 短信项目名称搜索
    Search6(e) {
      this.smsParams.projectName = e
      this.getSmsListPage()
    },
    // 跳转至OCR详情
    goDetail(row) {
      console.log(row)
      let startTime = ''
      let endTime = ''
      if (this.statistics === '1') {
        // 日
        startTime = row.statisticsDate + ' 00:00:00'
        endTime = row.statisticsDate + ' 23:59:59'
      } else if (this.statistics === '2') {
        // 月
        const parmas = row.statisticsYear + '-' + row.statisticsMonth
        const Date_ = getFirstAndLastDay(parmas)
        startTime = Date_[0]
        endTime = Date_[1]
      }
      this.$router.push({
        path: '/resourceManagement/resourceDetail/ocrText',
        query: {
          appId: row.appId,
          ocrType: row.ocrType,
          startTime: startTime,
          endTime: endTime,
        },
      })
    },
    // 跳转至短信详情
    goDetail2(row) {
      console.log(row)
      let startTime = ''
      let endTime = ''
      if (this.statistics2 === '1') {
        // 日
        startTime = row.statisticsDate + ' 00:00:00'
        endTime = row.statisticsDate + ' 23:59:59'
      } else if (this.statistics2 === '2') {
        // 月
        const parmas = row.statisticsYear + '-' + row.statisticsMonth
        const Date_ = getFirstAndLastDay(parmas)
        startTime = Date_[0]
        endTime = Date_[1]
      }
      this.$router.push({
        path: '/resourceManagement/resourceDetail/textMessage',
        query: {
          appId: row.appId,
          startTime: startTime,
          endTime: endTime,
        },
      })
    },
    // 短信分页
    handleCurrentChange3(currentPage) {
      this.smsParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
    },
    // OCR分页
    handleCurrentChange2(currentPage) {
      this.ocrParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getOcrList()
    },
    // vin分页
    handleCurrentChange4(currentPage) {
      this.vinParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getVinCarDataByPage()
    },
    // 能力tab切换
    changePower(item, index) {
      this.currentPower = item
      this.powerIndex = index
    },
    // 获取客户详情
    getCustomerData() {
      const params = {
        customerId: this.customerId,
      }
      selectCustomerDataById(params).then((res) => {
        if (res.data.code === '0') {
          this.customerObj = res.data.data
          this.options2 = this.customerObj.appIdList
          this.powerList = Array.from(
            new Set(
              res.data.data.customerPowerPoolAuthEntityVOList.map(
                (item) => item.powerName,
              ),
            ),
          )
          this.currentPower = this.powerList[0]
          if (this.currentPower === '短信') {
            this.getSmsListPage()
          } else if (this.currentPower === 'OCR文字识别') {
            this.getOcrList()
          }
          console.log('能力列表', this.powerList, this.currentPower)
          if (this.options2.length > 0) {
            this.value3 = this.options2[0]
            this.getApiKeyInfo(this.value3)
          }
          console.log('id列表', this.options2)
          this.selected = this.customerObj.customerPowerPoolAuthEntityVOList.map(
            (item) => item.powerId,
          )
          console.log('获取客户详情', this.customerObj)
        }
      })
    },
    // 修改客户信息
    updateCustomerEntity() {
      const params = {
        customerId: this.customerId,
        email: this.ruleForm.email,
        linkPerson: this.ruleForm.linkPerson,
        linkPhone: this.ruleForm.linkPhone,
      }
      updateCustomerEntity(params).then((res) => {
        if (res.data.code === '0') {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.dialogTableVisible = false
          this.showDialog1 = false
          this.showDialog2 = false
          this.showDialog3 = false
          setTimeout(() => {
            this.getCustomerData()
          }, 800)
        }
      })
    },
    // 打开修改弹窗
    openDialogTable(num) {
      this.dialogTableVisible = true
      if (num === '1') {
        this.showDialog1 = true
        this.ruleForm.linkPerson = this.customerObj.linkPerson
      } else if (num === '2') {
        this.showDialog2 = true
        this.ruleForm.linkPhone = this.customerObj.linkPhone
      } else if (num === '3') {
        this.showDialog3 = true
        this.ruleForm.email = this.customerObj.email
      }
    },
    // 关闭修改弹窗
    closeDialogTable() {
      this.dialogTableVisible = false
      this.showDialog1 = false
      this.showDialog2 = false
      this.showDialog3 = false
      this.reset()
    },
    reset() {
      this.ruleForm.linkPerson = ''
      this.ruleForm.linkPhone = ''
      this.ruleForm.email = ''
    },
    // 复制
    copyText(st) {
      this.$nextTick(() => {
        if (this.clipboard2_) {
          this.clipboard2_.destroy()
        }
        this.clipboard2_ = new Clipboard(`.${st}`)
        this.clipboard2_.on('success', (e) => {
          e.clearSelection()
          this.$message.success('复制成功')
        })
      })
    },
    // 提交修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateCustomerEntity()
        } else {
          // this.$message.warning('请填写完信息！')
          return false
        }
      })
    },
    // 手机号码输入限制
    restrictInput() {
      // 使用正则表达式检查输入
      this.ruleForm.linkPhone = this.ruleForm.linkPhone.replace(/[^0-9]/g, '') // 只允许数字
      if (this.ruleForm.linkPhone.length > 11) {
        this.ruleForm.linkPhone = this.ruleForm.linkPhone.slice(0, 11) // 限制长度为11位
      }
    },
    // 根据appId查询秘钥信息
    getApiKeyInfo(id) {
      const params = {
        appId: id,
      }
      getApiKeyInfo(params).then((res) => {
        if (res.data.code === '0') {
          this.Detail = res.data.data
        }
      })
    },
    // 选择appId
    changeAppid(e) {
      this.getApiKeyInfo(e)
    },
    // tab切换
    handleClick(tab) {
      if (tab.index === 3) {
        this.$nextTick(() => {
          this.getOptions1()
          this.getOptions2()
        })
      }
    },
    // 二级tab切换
    handleClick2(tab) {
      if (tab.label === '短信') {
        this.getSmsListPage()
      } else if (tab.label === 'OCR文字识别') {
        this.getOcrList()
      } else if (tab.label === 'VIN车系查询') {
        this.getVinCarDataByPage()
      }
    },
    // 明细
    seeDetail(row) {
      this.$router.push('/projectManagement/usingWater')
    },
    // 查看
    seeDetail2(row) {
      this.$router.push('/projectManagement/projectDetail')
    },
    // 切换
    tabChange(index) {
      this.tabIndex = index
    },
    // 选择日期
    changeDate(index) {
      this.activeIndex = index
    },
    // 选择日期范围
    selectDate(date) {},
    // 新建授权
    createSq() {
      this.$router.push({
        path: '/customerManagement/serviceAuthorization',
        query: {
          selected: this.selected,
          customerId: this.customerId,
          page: 'customDetail',
        },
      })
    },
    // vin客户名称搜索
    vinSearch1(e) {
      this.vinParams.customerName = e
      this.getVinCarDataByPage()
    },
    // vin项目名称搜索
    vinSearch2(e) {
      this.vinParams.projectName = e
      this.getVinCarDataByPage()
    },
    getOptions1() {
      var chartDom = document.getElementById('myChart1')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 40, name: '交付项目' },
              { value: 60, name: '独立产品' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }

      option && myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    getOptions2() {
      var chartDom = document.getElementById('myChart2')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        grid: {
          x: 80,
          y: 30,
          x2: 60,
          y2: 80,
        },
        xAxis: {
          type: 'category',
          data: ['独立产品', '东风日产数字化转型项目', '618保客营销活动'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 240, 150],
            type: 'bar',
            barWidth: '16',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  // x=0,y=1,柱子的颜色在垂直方向渐变
                  x: 0,
                  y: 1,
                  colorStops: [
                    // 0%处的颜色
                    {
                      offset: 0,
                      color: '#0068fd',
                    },
                    // 100%处的颜色
                    {
                      offset: 1,
                      color: '#12c2e9',
                    },
                  ],
                }, // 改变折线点的颜色
                lineStyle: {
                  color: '#0068fd', // 改变折线颜色
                },
              },
            },
          },
        ],
      }

      option && myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;
}

.box {
  width: 100%;
  height: auto;
  margin-bottom: 10px;

  .h1 {
    font-size: 18px;
    color: #222;
    font-weight: 600;
  }

  .icon {
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
    font-weight: bold;
    padding: 10px;
    box-sizing: border-box;
  }

  .el-select2 {
    width: 80px;
  }
}

.box2 {
  margin-right: 25px;
  padding-left: 15px;
  box-sizing: border-box;
  margin: 12px 0 0;

  ::v-deep .el-input {
    margin-left: 8px !important;

    .el-input__inner {
      height: 39px !important;
      line-height: 39px !important;
    }
  }

  .p1 {
    font-size: 15px;
    color: #444;
    min-width: 273px;
    text-align: right;
  }

  .el-select {
    min-width: 400px;
  }
}

.tabList {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #eee;
  margin: 20px 0;
  padding: 0 10px;
  box-sizing: border-box;

  .lis {
    width: 160px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    text-align: center;
    border-radius: 5px 5px 0 0;
    // border: 1px solid #fff;
    position: relative;
    top: 1px;
    box-sizing: border-box;

    &.active {
      color: #409eff;
      border: 1px solid #eee;
      border-bottom: 1px solid #fff;
      box-sizing: border-box;
    }
  }
}

.chatBox {
  width: 100%;
  height: auto;
  padding: 0 10px;
  box-sizing: border-box;

  .Chats {
    width: 100%;
    height: auto;

    .box_ {
      width: 50%;
      height: 300px;

      .charts {
        margin-top: 20px;
      }
    }
  }
}

.addBtn {
  margin: 18px 0;
}

.content {
  width: 100%;
  height: auto;
  padding: 0 0 30px 10px;
  box-sizing: border-box;

  .title {
    width: 100%;
    height: 35px;
    line-height: 35px;
    border-radius: 2px;
    background: #f1f1f1;
    color: #444;
    padding: 0 15px;
    box-sizing: border-box;
    margin-top: 10px;
  }

  .smallTitle {
    margin-top: 12px;
    margin-left: 12px;
  }

  .tableBox {
    padding: 12px;
    box-sizing: border-box;
  }

  .Lists {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px 0 5px;

    .lis {
      width: 50%;
      height: auto;
      padding: 10px 20px;
      box-sizing: border-box;
      font-size: 14px;
      color: #999;

      .sp {
        color: #222;
      }

      ::v-deep .el-icon {
        font-size: 16px;
        color: #444;
        margin-left: 8px;
        cursor: pointer;
      }
    }

    &.Lists2 {
      padding-top: 12px;

      .lis {
        width: 33.3333%;
      }
    }
  }

  .info {
    width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 15px;
    color: #444;
  }

  ::v-deep .el-form-item {
    display: flex;
    align-items: center;

    .el-form-item__label {
      text-align: left;
      width: 80px !important;
    }

    .el-form-item__content {
      margin-left: 10px !important;
      width: 40%;
      display: flex;
      align-items: center;
    }
  }

  .slat {
    color: #409eff;
    margin: 0 6px;
    cursor: pointer;
  }

  .btn {
    min-width: 90px;
  }

  .addTxt {
    font-size: 13px;
    color: #999;
    margin-top: -20px;
  }
}

.dateGroup {
  width: 100%;
  height: auto;
  margin: 12px 0;

  .el-button {
    margin-left: 0;
    margin-right: 12px;
    min-width: 90px;
  }

  .el-date-editor {
    height: 32px;
  }

  .p1 {
    font-size: 14px;
    color: #444;
    margin-left: 30px;
  }
}

.myList {
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;

  .lis_ {
    width: 100%;
    height: auto;
    margin-bottom: 10px;

    .name {
      font-size: 14px;
      color: #777;
      margin-right: 5px;
      text-align: right;
      min-width: 270px;
    }

    .info_ {
      font-size: 14px;
      color: #444;
      margin-right: 15px;
      max-width: 400px;
      min-width: 400px;
      background: #f9f9f9;
      padding: 8px 20px;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #e9e9e9;
      text-align: left;
    }
  }
}

.popup {
  width: 100%;
  height: auto;

  .el-form {
    width: 100%;
    padding: 40px 40px 0;
    box-sizing: border-box;

    ::v-deep .el-form-item {
      display: flex;
      align-items: center;

      .el-form-item__label {
        text-align: left;
        width: 80px !important;
        color: #666;
      }

      .el-form-item__content {
        margin-left: 10px !important;
        width: 60%;
        display: flex;
        align-items: center;

        .el-select {
          width: 100%;
        }
      }
    }

    .btn {
      min-width: 90px;
    }

    .addTxt {
      font-size: 13px;
      color: #999;
      margin-top: -20px;
    }
  }
}

.powerTab {
  width: 100%;
  height: auto;
  padding: 30px 0;
  box-sizing: border-box;
  ::v-deep .el-tabs__nav {
    height: 40px !important;
    .el-tabs__item {
      font-size: 14px;
      min-width: 100px;
      max-width: 200px;
      text-align: center;
      transition: all 0.3s ease;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 12px !important;
      box-sizing: border-box;
      &.is-active {
        background: #fff;
      }
      &:hover {
        max-width: fit-content;
      }
    }
  }
}

.searchBar {
  width: 100%;
  height: auto;
  margin-bottom: 22px;
  padding-left: 15px;
  box-sizing: border-box;

  .box {
    margin-right: 20px;
    width: auto;

    .p1 {
      font-size: 14px;
      color: #444;
      margin-left: 10px;
      min-width: 70px;
    }

    .el-input {
      width: 200px !important;
    }
  }
}
</style>
