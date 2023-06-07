import curdPost from '../../../business/platform/form/utils/custom/joinCURD.js' //增删改查规则
import request from '@/utils/request'
import ActionUtils from '@/utils/action'

export default {
  methods: {

    clickRow(row){
     this.selectData(this.packNameWhere('t_rypxjjhx',{parent_id_:row.id_})).then(response => {
                this.planData = response.variables.data
              })
    },
    /* 编辑计划项*/
    editData(){
      
    },

    selectYear(year) {
      if(!year) return
      let _this =this
       request({
            url: 'business/v3/data/template/queryDataTable',
            method: 'post',
            data: _this.getSearcFormData(year)
            }).then(response => {
                this.yearsData = response.data.dataResult
              })

    },
    /**
     * 获取格式化参数
     */
    getSearcFormData(year) {
         /* let cont = [{"Q^create_time_^DL^yyyy":year}
          ,{"response_data": {"template_id":"715538937963085824","template_type":"","attrs":{"init_query":"Y","need_page":"Y","page_size":20,"display_field":"N","manage_effect":"Y"},"query_columns":[{"label":"培训计划年度","name":"create_time_","rights":[{"type":"all"}],"common":"Y","same":"N","field_type":"datePicker","field_options":{"datefmt_type":"custom","datefmt":"yyyy"},"data_type":"date"}],"display_columns":[{"label":"培训计划年度","name":"create_time_","rights":[{"type":"all"}],"noRightStyle":"","align":"left","sortable":true,"width":"","same":"Y","field_type":"datePicker","field_options":{"datefmt":"yyyy-MM-dd"},"data_type":"date"}],"orig_display_columns":[{"label":"培训计划年度","name":"create_time_","rights":[{"type":"all"}],"noRightStyle":"","align":"left","sortable":true,"width":"","same":"Y","field_type":"text","field_options":{"datefmt_type":"date","datefmt":"yyyy-MM-dd","selector_type":"user","number_type":"orig","options":[{"val":"","label":""}],"store":"id","dictionary":""}}],"filter_conditions":[{"label":"默认条件","key":"cea14742-3a39-4f7b-b7a5-aac348e3c289","type":"condition","rights":[{"type":"all"}],"filter":{"condition":"AND","rules":[{"id":"shi_fou_guo_shen_","field":"shi_fou_guo_shen_","label":"是否过审","type":"string","input":"text","operator":"equal","source":"fixed","value":"1"}]}}],"sort_columns":"","buttons":{"function_buttons":[{"button_type":"search","label":"查询","rights":[{"type":"all"}],"position":"all"},{"label":"详情","button_type":"edit","rights":[{"type":"all"}],"position":"manage","icon":"list-alt"},{"label":"编制","button_type":"custom","rights":[{"type":"all"}],"position":"toolbar","code":"openTask","style":"success","icon":"hand-pointer-o"}],"edit_buttons":[{"button_type":"close","label":"关闭"}]},"export_columns":{"select_field":"Y","export_type":"page","fields":[{"name":"create_time_","label":"创建时间","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"bu_men_","label":"部门","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"bian_zhi_ren_","label":"编制人","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"pei_xun_fang_shi_","label":"培训方式","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"pei_xun_dui_xiang","label":"培训对象","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]}]},"datasetKey":"ndpxjh","unique":"id_"}},
          ,{"filter_condition_key":""}
          ] */
          let cont = {}
          cont ['Q^create_time_^DL^yyyy'] =year
          let json =  {"template_id":"715538937963085824","template_type":"","attrs":{"init_query":"Y","need_page":"Y","page_size":20,"display_field":"N","manage_effect":"Y"},"query_columns":[{"label":"培训计划年度","name":"create_time_","rights":[{"type":"all"}],"common":"Y","same":"N","field_type":"datePicker","field_options":{"datefmt_type":"custom","datefmt":"yyyy"},"data_type":"date"}],"display_columns":[{"label":"培训计划年度","name":"create_time_","rights":[{"type":"all"}],"noRightStyle":"","align":"left","sortable":true,"width":"","same":"Y","field_type":"datePicker","field_options":{"datefmt":"yyyy-MM-dd"},"data_type":"date"}],"orig_display_columns":[{"label":"培训计划年度","name":"create_time_","rights":[{"type":"all"}],"noRightStyle":"","align":"left","sortable":true,"width":"","same":"Y","field_type":"text","field_options":{"datefmt_type":"date","datefmt":"yyyy-MM-dd","selector_type":"user","number_type":"orig","options":[{"val":"","label":""}],"store":"id","dictionary":""}}],"filter_conditions":[{"label":"默认条件","key":"cea14742-3a39-4f7b-b7a5-aac348e3c289","type":"condition","rights":[{"type":"all"}],"filter":{"condition":"AND","rules":[{"id":"shi_fou_guo_shen_","field":"shi_fou_guo_shen_","label":"是否过审","type":"string","input":"text","operator":"equal","source":"fixed","value":"1"}]}}],"sort_columns":"","buttons":{"function_buttons":[{"button_type":"search","label":"查询","rights":[{"type":"all"}],"position":"all"},{"label":"详情","button_type":"edit","rights":[{"type":"all"}],"position":"manage","icon":"list-alt"},{"label":"编制","button_type":"custom","rights":[{"type":"all"}],"position":"toolbar","code":"openTask","style":"success","icon":"hand-pointer-o"}],"edit_buttons":[{"button_type":"close","label":"关闭"}]},"export_columns":{"select_field":"Y","export_type":"page","fields":[{"name":"create_time_","label":"创建时间","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"bu_men_","label":"部门","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"bian_zhi_ren_","label":"编制人","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"pei_xun_fang_shi_","label":"培训方式","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]},{"name":"pei_xun_dui_xiang","label":"培训对象","fieldType":"text","rights":[{"type":"all","rightsId":"","rightsName":""}]}]},"datasetKey":"ndpxjh","unique":"id_"}
          cont ['response_data']= JSON.stringify(json)
          cont ['filter_condition_key']=""

          return ActionUtils.formatParams(
            cont,
            this.pagination,
            this.sorts)
    },
    /* 封装表名与条件*/
    packNameWhere(name,where){
      let cont = {}
      cont['tableName'] = name
      cont['paramWhere'] = where
      return cont
    },
    /* 通用查詢*/
    selectData(data){
     return curdPost('select',data)
      }




  }

}
