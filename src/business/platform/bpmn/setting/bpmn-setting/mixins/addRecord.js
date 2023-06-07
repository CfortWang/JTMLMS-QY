import curdPost from '../../../../form/utils/custom/joinCURD.js' //增删改查规则
import request from '@/utils/request'
import ActionUtils from '@/utils/action'

export default {


  methods: {
    getRecord(id){
       this.selectData(this.packNameWhere('t_lcidglbdbb',{liu_cheng_xuan_ze:id})).then(response => {
                   if(response.variables.data.length==1){
                    this.bao_biao_lu_jing_ =  response.variables.data[0].bao_biao_lu_jing_
                    this.fu_jian_nei_rong_ =  response.variables.data[0].fu_jian_nei_rong_
                    this.shi_fou_zi_biao_  =   response.variables.data[0].shi_fou_zi_biao_
                    this.guan_lian_zi_duan  =   response.variables.data[0].guan_lian_zi_duan
                    this.liu_cheng_xuan_ze = id
                   }
                })
    },
    addRecord(){
     if(this.liu_cheng_xuan_ze) return  this.updateRecord();
      this.add()
    },

   add(){
      let cont = {}
      cont['bao_biao_lu_jing_'] = this.bao_biao_lu_jing_
      cont['fu_jian_nei_rong_'] = this.fu_jian_nei_rong_
      cont['liu_cheng_xuan_ze'] = this.data.id
      cont['guan_lian_zi_duan'] = this.guan_lian_zi_duan
      cont['shi_fou_zi_biao_'] = this.shi_fou_zi_biao_
     this.addData(this.packNameWhere('t_lcidglbdbb',JSON.stringify([cont]))).then(response => {
                this.$message({
                          message: '添加成功',
                          type: 'success'
                        });
              })
    },
    updateRecord(){
       let cont = {}
       cont['bao_biao_lu_jing_'] = this.bao_biao_lu_jing_
       cont['fu_jian_nei_rong_'] = this.fu_jian_nei_rong_
       cont['guan_lian_zi_duan'] = this.guan_lian_zi_duan
       cont['liu_cheng_xuan_ze'] = this.liu_cheng_xuan_ze
       cont['shi_fou_zi_biao_'] = this.shi_fou_zi_biao_
      this.Update('t_lcidglbdbb',{"liu_cheng_xuan_ze": this.liu_cheng_xuan_ze},cont).then(response => {
                 this.$message({
                           message: '修改成功',
                           type: 'warning'
                         });
               })
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
      },
      /* 通用修改*/
    Update(name,where,cond){
      let cont = {}
      cont['tableName'] = name
      cont['paramWhere'] = where
      cont['paramCond'] = cond
      return curdPost('update',JSON.stringify(cont))
    },
      /* 通用查詢*/
    addData(data){
     return curdPost('add',data)
      }

  }

}
