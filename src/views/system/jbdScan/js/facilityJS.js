import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js'

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
      for (let item of this.listData) { //判断是否重复，重复扫码不查询
        if (item.id_ == id) {
          return
        }
      }
      this.redar=false
      this.loadData(id)
      //开始查询设备
      this.facilityId = ''
    },
    /* 获取数据 ，开始查阅记录 */
    loadData(id) {
      repostCurd('select',
        '{"tableName": "t_sbdj","paramWhere":{"id_":"' + id + '"}}'
      ).then(response => {
        if (response.variables.data && response.variables.data.length > 0) {
         this.listData.push(response.variables.data[0])
        }
      })
    },
    /* 列表市区焦点*/
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
      if(type =='入库确认'){
          this.$confirm('请再次确认 [入库操作]').then(_ => {
                    this.commitData(this.listData)
          }).catch(_ => {});
      }else{
        this.$confirm('请再次确认 [出库操作]').then(_ => {
                        this.commitData(this.listData)
                  }).catch(_ => {});
        }
    },
    /* 去除一行*/
    deleteData(val){
      this.listData = this.listData.filter((data) =>{
            return data.id_!=val
        })
        if(this.listData.length ==0){
          this.remRedar()
        }
    },
   /* 提交数据*/
    commitData(val){
   /*   for(let item of val) {
            this.Update('t_sbdj',{"id_":item.id_},{"sheng_yu_shu_lian":item.sheng_yu_shu_lian}).then(response => {
                       this.$emit('callback', true)
                       this.visible = false
                       this.$message({
                                 message: '物料出库操作成功!',
                                 type: 'success'
                               });
                     })
               } */
               this.$message({
                         message: '设备操作成功!',
                         type: 'success'
                       });
          this.remRedar()
    },
    Update (name,where,cond) {
    	  let cont = {}
    	  cont['tableName'] = name
    	  cont['paramWhere'] = where
    	  cont['paramCond'] = cond
    	  return repostCurd('update',JSON.stringify(cont))
    	},
    /* 关闭*/
    remRedar() {
      this.visible = false
      this.listData = [] //清空列表
      this.redar = false
      this.$emit('scanOff',false)
    },

  }
}
