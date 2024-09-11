// 引入
import osTable from './table/osTable.vue'
import osForm from './form/osForm.vue'
import tableTransfer from './tableTransfer/tableTransfer.vue'

export default {
  install(Vue) {
    //全局表格组件
    Vue.component('osTable', osTable)
    Vue.component('osForm', osForm)
    Vue.component('tableTransfer', tableTransfer)
  }
}