<!-- 项目详情 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="1">
            <div class="title">基础信息</div>
            <ul class="Lists">
              <li class="lis ellipse">
                客户名称：
                <span class="sp">{{ Detail.customerName }}</span>
              </li>
              <li class="lis ellipse">
                创建时间：
                <span class="sp">{{ Detail.createTime }}</span>
              </li>
              <li class="lis ellipse">
                更新时间：
                <span class="sp">{{ Detail.updateTime }}</span>
              </li>
              <li class="lis ellipse">
                项目名称：
                <span class="sp">{{ Detail.projectName }}</span>
              </li>
              <li class="lis ellipse">
                项目经理：
                <span class="sp">{{ Detail.projectManage }}</span>
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
              <li class="lis flex_ ellipse">
                联系邮箱：
                <el-tooltip
                  popper-class="projectTooltip"
                  class="item"
                  effect="dark"
                  :content="Detail.contactInform"
                  placement="top"
                  :disabled="Detail.contactInform | showTooltip(120)"
                >
                  <!-- <span class="sp slat flex_ ellipse" @click="goLink(dataObj.documentLink)">
                    {{ dataObj.documentLink }}
                  </span> -->
                  <span class="sp ellipse">{{ Detail.contactInform }}</span>
                </el-tooltip>
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
                状态：
                <span
                  v-if="Detail.status == '0'"
                  class="sp"
                  style="color: #d9001b;"
                >
                  禁用
                </span>
                <span
                  v-if="Detail.status == '1'"
                  class="sp"
                  style="color: #70b603;"
                >
                  启用
                </span>
              </li>
            </ul>

            <el-dialog
              width="50%"
              title="修改项目信息"
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
                    label="项目经理"
                    prop="projectManage"
                  >
                    <el-input
                      v-model="ruleForm.projectManage"
                      maxlength="30"
                      placeholder="请输入项目经理姓名"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    v-if="showDialog2"
                    label="联系邮箱"
                    prop="contactInform"
                  >
                    <el-input
                      v-model="ruleForm.contactInform"
                      maxlength="50"
                      type="text"
                      placeholder="请输入联系邮箱"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    style="
                      padding-left: 80px;
                      box-sizing: border-box;
                      margin-top: 52px;
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

            <div class="title">密钥信息</div>
            <div class="myList">
              <div class="lis_ flex_">
                <p class="name">appId：</p>
                <el-tooltip
                  popper-class="projectTooltip"
                  :content="Detail.appId"
                  placement="top"
                >
                  <el-button class="info_ ellipse">
                    {{ Detail.appId }}
                  </el-button>
                </el-tooltip>
                <el-button
                  type="success"
                  plain
                  class="copyText1"
                  :data-clipboard-text="Detail.appId"
                  data-clipboard-action="copy"
                  @click="copyText('copyText1')"
                >
                  复制
                </el-button>
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
                  class="copyText2"
                  :data-clipboard-text="Detail.clientSecur"
                  data-clipboard-action="copy"
                  @click="copyText('copyText2')"
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
                  class="copyText3"
                  :data-clipboard-text="Detail.platformRsaPublicKey"
                  data-clipboard-action="copy"
                  @click="copyText('copyText3')"
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
                  class="copyText4"
                  :data-clipboard-text="Detail.privateEncrypt"
                  data-clipboard-action="copy"
                  @click="copyText('copyText4')"
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
                  class="copyText6"
                  :data-clipboard-text="Detail.publicEncrypt"
                  data-clipboard-action="copy"
                  @click="copyText('copyText6')"
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
                  class="copyText5"
                  :data-clipboard-text="Detail.privateKey"
                  data-clipboard-action="copy"
                  @click="copyText('copyText5')"
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
                  class="copyText7"
                  :data-clipboard-text="Detail.publicKey"
                  data-clipboard-action="copy"
                  @click="copyText('copyText7')"
                >
                  复制
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="关联服务" name="2">
            <div class="title">关联服务</div>
            <el-button
              type="primary"
              class="addBtn"
              v-if="showComputed('serviceAuthorization')"
              @click="createSq"
            >
              新建授权
            </el-button>
            <el-table
              :data="Detail.customerPowerPoolAuthEntityVOList"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              style="width: 100%;"
              border
            >
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
              v-if="powerList.length > 0"
              class="powerTab"
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
          <el-tab-pane label="成员管理" name="3">
            <div class="title">成员管理</div>
            <el-button
              v-if="showComputed('projectMemberEdit')"
              type="primary"
              size="mini"
              @click="openMember"
            >
              添加成员
            </el-button>
            <div class="form_box">
              <os-form :formFields="formFields" :formData="formData" />
            </div>
            <os-table
              ref="table"
              :tableData="tableData"
              :tableCols="tableCols"
              :page="page"
              :callbackObj="callbackObj"
              @pageChanged="pageChanged"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        class="addDialog"
        title="添加成员"
        :visible="dialogVisible"
        width="58%"
        @close="closeFrom"
      >
        <os-form
          ref="addForm"
          :formFields="addFormFields"
          :formData="addFormData"
        />
        <os-table
          ref="addTable"
          :tableData="addTableData"
          :tableCols="addTableCols"
          :tableOptions="{ multipleSelect: true }"
          :page="addPage"
          :callbackObj="addCallbackObj"
          :height="180"
          @pageChanged="addPageChanged"
        />
        <div class="selected_box" v-show="memberSeleted.length > 0">
          <div style="white-space: nowrap;">已选成员：</div>
          <div class="tag_box">
            <el-tag
              closable
              v-for="tag in memberSeleted"
              :key="tag.userId"
              @close="handleTagClose(tag)"
            >
              {{ tag.userName }}
            </el-tag>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addMember">
            添加
          </el-button>
          <el-button type="" @click="closeFrom">
            取消
          </el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import sms from '@/components/powerList/smsList'
import ocr from '@/components/powerList/ocrList'
import vin from '@/components/powerList/vinList'
import { mapList, getFirstAndLastDay, getDate_ } from '@/utils/public'
import Clipboard from 'clipboard'
import * as echarts from 'echarts'
import {
  projectDetail,
  updateProjectEntity,
  getOcrList,
  getSmsListPage,
  getVinCarDataByPage,
  getRoleByCondition,
  selectProjectUserByPage,
  removeProjectUser,
  addProjectUser,
} from '@/api/capacityApi'
export default {
  components: { sms, ocr, vin },
  data() {
    const validateEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    return {
      powerIndex: 0,
      hasShow: false,
      hasShowCustomer: false,
      powerList: [], // 能力列表
      currentPower: '', // 当前选中能力
      ruleForm: {
        projectManage: '',
        contactInform: '',
      },
      rules: {
        projectManage: [
          { required: true, message: '请输入项目经理姓名', trigger: 'blur' },
        ],
        contactInform: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'blur',
            validator: validateEmail,
          },
        ],
      },
      activeIndex: 0,
      btnList: ['日', '周', '月'],
      tabList: ['身份证二要素查询', '产品/服务2', '产品/服务3'],
      tabIndex: 0,
      dialogTableVisible: false,
      activeName: '1',
      projectId: '', // 项目id
      customerId: '', // 客户id
      Detail: {}, // 详情
      clipboard_: null,
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
      ///////////  成员管理数据start //////////////
      //表单字段
      formData: {
        userName: '',
        userType: '',
        status: '',
      },
      //表单内容配置
      formFields: [
        {
          type: 'empty',
          span: 4,
        },
        {
          labelName: '',
          field: 'userName',
          type: 'input',
          placeholder: '请输入用户姓名',
          span: 6,
        },
        {
          labelName: '',
          field: 'userType',
          type: 'select',
          placeholder: '请选择',
          // optionLabel: 'roleName',
          // optionValue: 'roleId',
          options: [
            { label: '内部', value: 1 },
            { label: '外部客户', value: 2 },
          ],
          span: 5,
        },
        {
          labelName: '',
          field: 'status',
          type: 'select',
          placeholder: '请选择',
          options: [
            { label: '启用中', value: '1' },
            { label: '已禁用', value: '0' },
            { label: '已过期', value: '2' },
          ],
          span: 4,
        },
        {
          type: 'button',
          span: 5,
          btnList: [
            {
              type: 'primary',
              label: '查询',
              size: 'mini',
              click: () => this.getList(1),
            },
            {
              label: '重置',
              size: 'mini',
              click: 'reset',
            },
          ],
        },
      ],
      //成员管理--表格分页
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [], //表格数据
      callbackObj: {}, //表格回调
      //表格字段配置
      tableCols: [
        { prop: 'userName', label: '姓名' },
        {
          prop: 'userType',
          label: '用户类型',
          filter: [
            { label: '内部', value: 1 },
            { label: '外部客户', value: 2 },
          ],
        },
        { prop: 'acName', label: '用户名' },
        {
          prop: 'status',
          label: '帐号状态',
          filter: [
            { label: '已禁用', value: 0 },
            { label: '启用中', value: 1 },
            { label: '已过期', value: 2 },
          ],
        },
        { prop: 'joinProjectTime', label: '入项时间', width: 150 },
        // { prop: 'outTime', label: '出项时间' },
        {
          prop: 'role',
          label: '角色',
          filter: [
            { label: '普通用户', value: 0 },
            { label: '管理员', value: 1 },
            { label: '运营', value: 2 },
            { label: '项目经理', value: 3 },
          ],
        },
        {
          // hidden: true,
          label: '操作',
          fixed: 'right',
          // width: 150,
          comps: [
            // {
            //   type: 'button',
            //   btnType: 'text',
            //   labelName: '绑定服务',
            //   click: 'openBinding({})',
            //   dataOptions: {
            //     deleteName: '绑定服务',
            //     deleteKey: 'status',
            //     deleteVal: ['2'],
            //   },
            // },
            {
              type: 'button',
              btnType: 'text',
              labelName: '移除',
              click: 'delete({})',
              show: this.showComputed('projectMemberEdit'),
            },
            // {
            //   type: 'button',
            //   btnType: 'text',
            //   labelName: '日志',
            //   click: 'detailView({})',
            //   dataOptions: {
            //     deleteName: '日志',
            //     deleteKey: 'status',
            //     deleteVal: ['2'],
            //   },
            // },
          ],
        },
      ],
      dialogVisible: false, //添加成员弹窗
      //添加成员弹窗form
      addFormData: {
        userName: '',
        role: '',
      },
      addFormFields: [
        {
          labelName: '',
          field: 'userName',
          type: 'input',
          placeholder: '请输入用户姓名',
          position: 'left',
          suffixOptions: {
            isSuffix: true,
            click: () => this.getList(2),
          },
          span: 8,
        },
        {
          labelName: '',
          field: 'role',
          type: 'select',
          placeholder: '请选择',
          position: 'left',
          optionLabel: 'roleName',
          optionValue: 'roleId',
          change: () => this.getList(2),
          span: 8,
          // pull: 1,
        },
      ],
      addPage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      memberSeleted: [], //已选成员
      addTableData: [], //添加成员弹窗--列表数据
      addTableCols: [
        { prop: 'userName', label: '姓名' },
        {
          prop: 'userType',
          label: '用户类型',
          filter: [
            { label: '内部', value: 1 },
            { label: '外部客户', value: 2 },
          ],
        },
        { prop: 'acName', label: '用户名' },
        {
          prop: 'role',
          label: '角色',
          filter: [
            { label: '普通用户', value: 0 },
            { label: '管理员', value: 1 },
            { label: '运营', value: 2 },
            { label: '项目经理', value: 3 },
          ],
        },
      ],
      addCallbackObj: {
        onCheckSelectChange: (response) => {
          this.memberSeleted = response
        },
      },
      ///////////  成员管理数据end //////////////
    }
  },
  created() {
    this.projectId = this.$route.query.projectId
    this.customerId = this.$route.query.customerId
    this.smsParams.customerId = this.$route.query.customerId
    this.smsParams.projectId = this.$route.query.projectId
    this.ocrParams.customerId = this.$route.query.customerId
    this.ocrParams.projectId = this.$route.query.projectId
    this.ocrParams.startDate = getDate_()
    this.ocrParams.endDate = getDate_()
    this.smsParams.startDate = getDate_()
    this.smsParams.endDate = getDate_()
    this.vinParams.startDate = getDate_()
    this.vinParams.endDate = getDate_()
  },
  mounted() {
    // this.getOptions1()
    // this.getOptions2()
    this.projectDetail()
    this.getList(1)
    this.getRoleList()
  },
  beforeDestroy() {
    this.clipboard_?.destroy()
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
    // 新建授权
    createSq() {
      this.$router.push({
        path: '/customerManagement/serviceAuthorization',
        query: {
          selected: this.selected,
          customerId: this.customerId,
          projectId: this.projectId,
          page: 'customDetail',
        },
      })
    },
    // 提交修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateProjectEntity()
        } else {
          return false
        }
      })
    },
    // 复制
    copyText(st) {
      this.$nextTick(() => {
        if (this.clipboard_) {
          this.clipboard_.destroy()
        } else {
        }
        this.clipboard_ = new Clipboard(`.${st}`)
        this.clipboard_.on('success', (e) => {
          e.clearSelection()
          this.$message.success('复制成功')
        })
      })
    },
    // 获取项目详情
    projectDetail() {
      const params = {
        projectId: this.projectId,
        powerList: this.$store.getters.userInfo.powerList,
      }
      projectDetail(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.Detail = data_
          this.selected = this.Detail.customerPowerPoolAuthEntityVOList.map(
            (item) => item.powerId,
          )
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
          mapList(this.Detail.customerPowerPoolAuthEntityVOList)
        }
      })
    },
    // 更新项目
    updateProjectEntity() {
      const params = {
        projectId: this.projectId,
        contactInform: this.ruleForm.contactInform,
        projectManage: this.ruleForm.projectManage,
      }
      updateProjectEntity(params).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('修改成功，请稍候')
          setTimeout(() => {
            this.dialogTableVisible = false
            this.showDialog1 = false
            this.showDialog2 = false
            this.projectDetail()
          }, 800)
        }
      })
    },
    // tab切换
    handleClick(tab) {},
    // 打开修改弹窗
    openDialogTable(num) {
      this.dialogTableVisible = true
      if (num === '1') {
        this.showDialog1 = true
        this.ruleForm.projectManage = this.Detail.projectManage
      } else if (num === '2') {
        this.showDialog2 = true
        this.ruleForm.contactInform = this.Detail.contactInform
      }
    },
    // 关闭修改弹窗
    closeDialogTable() {
      this.dialogTableVisible = false
      this.showDialog1 = false
      this.showDialog2 = false
      this.reset()
    },
    //重置
    reset() {
      this.ruleForm.projectManage = ''
      this.ruleForm.contactInform = ''
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
      // this.$router.push('/usingWater')
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
    // 获取昨天日期
    getDate() {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      const year = yesterday.getFullYear()
      const month = (yesterday.getMonth() + 1).toString().padStart(2, '0')
      const day = yesterday.getDate().toString().padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`
      return formattedDate
    },
    //成员管理--分页表格查询
    async getList(type, isPage) {
      if (isPage !== true) {
        if (type == 1) {
          this.page.pageIndex = 1
        } else {
          this.addPage.pageIndex = 1
        }
      }
      const params1 = {
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        projectId: this.projectId,
        excludeProject: '0',
        userName: this.formData.userName,
        userType: this.formData.userType,
        status: this.formData.status,
      }
      const params2 = {
        pageNum: this.addPage.pageIndex,
        pageSize: this.addPage.pageSize,
        projectId: this.projectId,
        excludeProject: '1',
        roleId: this.addFormData.role,
        userName: this.addFormData.userName,
      }
      let res = null
      if (type == 1) {
        res = await selectProjectUserByPage(params1)
        if (res.data.code === '0') {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
        }
      } else {
        res = await selectProjectUserByPage(params2)
        if (res.data.code === '0') {
          this.addTableData = res.data.data.records
          this.addPage.total = res.data.data.total
        }
      }
    },
    //查询角色下拉框数据
    getRoleList() {
      getRoleByCondition({ roleName: '' }).then((res) => {
        if (res.data.code === '0') {
          this.$set(
            this.getComponent('role', 'addFormFields'),
            'options',
            res.data.data,
          )
          this.roleData = res.data.data
        }
      })
    },
    getRowKeys(row) {
      return row.userId
    },
    //打开弹窗
    openMember() {
      this.getList(2)
      this.dialogVisible = true
    },
    //删除标签
    handleTagClose(tag) {
      this.memberSeleted.splice(this.memberSeleted.indexOf(tag), 1)
      let refs = this.$refs.addTable
      refs?.$refs?.osTable?.selection?.forEach((i) => {
        if (i.userId === tag.userId) {
          refs.$refs.osTable.toggleRowSelection(i, false)
        }
      })
    },
    //添加成员
    addMember() {
      if (this.memberSeleted.length == 0) {
        this.$message.warning('请至少选择一名成员！')
        return
      }
      let userIdList = this.memberSeleted.map((el) => {
        return el.userId
      })
      let params = {
        projectId: this.projectId,
        userIdList: userIdList,
      }
      addProjectUser(params).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('添加成员成功！')
          this.closeFrom()
          this.getList(1)
        }
      })
    },
    //关闭弹窗
    closeFrom() {
      this.dialogVisible = false
      this.$refs.addForm.emptyFormData()
    },
    openBinding() {},
    //成员管理--移除
    delete(row) {
      this.$confirm(`是否移除该成员${'“' + row.userName + '”'}？`, '移除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        removeProjectUser({
          projectId: this.projectId,
          userId: row.userId,
        }).then((res) => {
          if (res.data.code === '0') {
            this.$message.success('移除成功')
            this.getList(1)
          }
        })
      })
    },
    //成员管理--分页方法
    pageChanged(val) {
      this.page.pageIndex = val.pageIndex
      this.page.pageSize = val.pageSize
      this.getList(1, true)
    },
    addPageChanged(val) {
      this.addPage.pageIndex = val.pageIndex
      this.addPage.pageSize = val.pageSize
      this.getList(2, true)
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

.addBtn {
  margin-bottom: 15px;
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
    margin-bottom: 15px;
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
        min-width: 271px;
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
      }
    }
  }

  .Lists {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-bottom: 5px;

    .lis {
      width: 50%;
      height: auto;
      padding: 10px 20px;
      box-sizing: border-box;
      font-size: 14px;
      color: #999;

      .sp {
        color: #222;
        max-width: 25%;
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
      // width: 40%;
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
.form_box {
  margin: 15px 0;
  padding: 15px 15px 0;
  background: #eef5ff;
  border-radius: 5px;
}
.selected_box {
  display: flex;
  .tag_box {
    display: flex;
    flex-wrap: wrap;
    max-height: 80px;
    overflow-y: auto;
    border: 1px dashed #eee;
    padding: 5px;
    :nth-child(n) {
      margin: 0 5px 5px;
    }
  }
}
::v-deep .el-tabs__item {
  font-size: 16px;
}
</style>
