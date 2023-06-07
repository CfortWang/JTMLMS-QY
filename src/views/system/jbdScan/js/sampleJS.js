import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js'
import { updateSample,sampleWZ } from '@/api/detection/universalCRUD.js' // 封装的接口文件

export default {
  methods: {
    /* 唤醒扫码*/
    openRedar(type) {
      this.redar = true //扫码图标
      this.visible = false //结果列表
      this.$refs.redarInput.focus(); //聚焦input
      this.listData = [] //清空列表
    },
    facilityData(id) {
      if (!id) return // 无参直接反
      /*for (let item of this.listData) { //判断是否重复，重复扫码不查询
        if (item.yang_pin_bian_hao == id) {
          return
        }
      }*/
      this.loadData(id)
      //开始查询设备
      this.facilityId = ''
    },
    /* 获取数据 ，开始查阅记录 */
    loadData(id) {
      let flag = true
      for (let index in this.listData) { // 判断是否重复，重复扫码 数量自增
          if (this.listData[index].yang_pin_bian_hao == id) {
              this.listData[index].cao_zuo_shu_liang = this.listData[index].cao_zuo_shu_liang + 1
              flag = false
          }
        }


      if(flag){
         repostCurd('select',
          '{"tableName": "t_gdyrqcyp","paramWhere":{"yang_pin_bian_hao":"' + id + '"}}'
        ).then(response => {

          if (response.variables.data && response.variables.data.length > 0) {
            let wzzt = ""
            if(response.variables.data[0].cun_fang_wei_zhi_ != ""){
              //查完之后，替换值
              sampleWZ("{id:'"+response.variables.data[0].cun_fang_wei_zhi_ +"'}").then(res=>{
                wzzt = res.variables.wzzt
                response.variables.data[0].cao_zuo_shu_liang = 1
                response.variables.data[0].cun_fang_wei_zhi_ = wzzt
                this.listData.push(response.variables.data[0])
              })
            }else{
              response.variables.data[0].cao_zuo_shu_liang = 1
              this.listData.push(response.variables.data[0])
            }

          }
        })
      }

    },
    /* 列表失去焦点*/
    handleChange(){
        this.$refs.redarInput.focus(); //聚焦input
    },
    /* 关闭弹出列表框*/
    closeDialog() {
      this.remRedar()
      //回传关闭事件。隐藏当前组件。
    },
    handleClose(){
      this.handleChange()
      this.$confirm('确认关闭扫码列表页面？').then(_ => {
         this.closeDialog();
      }).catch(_ => {
      });
      },

    submitData(type) {
      //回传关闭事件。隐藏当前组件。
      let judge = true;
      // if(type =='入库确认'){
      //     this.$confirm('请再次确认 [入库操作]').then(_ => {
      //         for (let item of this.listData) {  //入库操作时，给每个样品增加数量
      //            item.shu_liang_ =  Number(item.shu_liang_)  + Number(item.cao_zuo_shu_liang)//调用axios修改数量
      //               }
      //               this.commitData(this.listData)
      //     }).catch(_ => {});
      // }else{
        // 出库确认，给每个样品减少数量
        this.$confirm('请再次确认 [出库操作]').then(_ => {
            let data = {
              userName:this.$store.getters.userInfo.user.name,
              sign:'out',
              SampleTransfor:[]
              }
            let dataObj = []
            let temp = {}

            for(let item of this.listData) {
                    // 如果领用人和存放位置编号为空 不能出库
                      if(item.ling_yong_ren_ == null || item.ling_yong_ren_ == ''){
                          this.$message.error('领用人不能为空!')
                          return;
                      }
                      if(item.cun_fang_wei_zhi_ == null || item.cun_fang_wei_zhi_ == ''){
                          this.$message.error('存放位置不能为空!')
                          return;
                      }
                    // 出库操作时，给每个物料减少数量，若数量错误，取消执行，并报错。
                    if(Number(item.cao_zuo_shu_liang) <= Number(item.shu_liang_)){
                        item.shu_liang_ =  Number(item.shu_liang_)  - Number(item.cao_zuo_shu_liang)//调用axios修改数量
                      }else{
                          this.$message.error('操作失败，['+item.yang_pin_ming_che+'] 出库数量不得大于剩余数量。')
                          judge = false
                        }
                     }

                      if(judge){
                        for(let item of this.listData) {
                          temp = {
                            "yangPinBianHao"  : item.yang_pin_bian_hao  ,
                            "yangPinMingChe"  : item.yang_pin_ming_che  ,
                            "guiGeXingHao"    : item.gui_ge_xing_hao_  ,
                            "surplusShuLiang" : item.shu_liang_  ,
                            "updateShuLiang"  : item.cao_zuo_shu_liang  ,
                            "lingYongRen"     : item.ling_yong_ren_  ,
                            "cunFangWeiZhi"   : item.cun_fang_wei_zhi_
                          }
                          dataObj.push(temp)
                        }

                          data['SampleTransfor'] = dataObj
                          // 调用universalCRUD的 样品分发出库接口
                          updateSample("{data:'"+JSON.stringify(data)+"'}").then(response=>{
                            this.$emit('callback',true)
                            this.visable = false
                            this.$message({
                              message:'样品出库操作成功！',
                              type:'success'
                            })
                          })
                          this.closeDialog()
                      }

                  }).catch(_ => {});
        // }
    },
    /* 去除指定行数据*/
    deleteData(val){
      this.listData = this.listData.filter((data) =>{
            return data.id_!=val
        })
    },
   /* 提交数据*/
    commitData(val){
      for(let item of val) {
             let dataWhere = [] //ajax的修改字段
             dataWhere.push('{"tableName":"t_gdyrqcyp" + "," + "paramWhere":"id_:'+item.id_ +'" +","+    "shu_liang_":"'+ item.shu_liang_ +'"  +","+  "lingYongRen":"' + item.ling_yong_ren_ + '"  +","+  "cunFangWeiZhi":"' + item.cun_fang_wei_zhi_ + '"  +","+  "sign":"out"}')
               // dataWhere.push('{"yangPinBianHao":"'+ item.yang_pin_bian_hao +'"  +","+  "lingYongRen":"' + item.ling_yong_ren_ + '"  +","+  "cunFangWeiZhi":"' + item.cun_fang_wei_zhi_ + '"  +","+  "shuLiang":"' + item.shu_liang_ + '"}')

            // repostCurd('updateSample',"{data:'"+JSON.stringify(dataWhere)+"'}").then(response =>{
            //   console.log(response)
            // })

            // this.Update('t_gdyrqcyp',{"id_":item.id_},"{data:'"+JSON.stringify(dataWhere)+"'}").then(response => {
            //            this.$emit('callback', true)
            //            this.visible = false
            //            this.$message({
            //                      message: '样品出库操作成功!',
            //                      type: 'success'
            //                    });
            //          })
               }
    },
    // Update (name,where,cond) {
    // 	  let cont = {}
    // 	  cont['tableName'] = name
    // 	  cont['paramWhere'] = where
    // 	  cont['paramCond'] = cond
    // 	  return repostCurd('updateSample',JSON.stringify(cont))
    // 	},
    /* 关闭*/
    remRedar() {
      this.visible = false
      this.listData = [] //清空列表
      this.redar = false
      this.$emit('scanOff',false)
    },

  }
}
