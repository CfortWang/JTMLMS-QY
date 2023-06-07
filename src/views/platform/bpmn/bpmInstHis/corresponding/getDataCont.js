/* 封装表名与条件 */

import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import ActionUtils from '@/utils/action'
export default {
  // 扩展 多选框
 data() {
    return {
      selection:false,
      }
   },
   // created() {
   //   // console.log("getDataCont.js被调用了")
   //   // let roleArr = this.$store.getters.userInfo.role
   //   let roleArr = this.$store.getters.userInfo.user.name
   //   console.log(roleArr)
   //   for(let i = 0 ; i < roleArr.length; i++){
   //     if(roleArr[i].alias == "xtgljs"){
   //       this.listConfig.toolbars.push({key:'remove'})
   //       this.selection  = true
   //       return;
   //     }
   //   }
   // },
   created() {
     // console.log("getDataCont.js被调用了")
     let roleArr = this.$store.getters.userInfo.role
     // let roleArr = this.$store.getters.userInfo.user.name
     // console.log(roleArr)
     for(let i = 0 ; i < roleArr.length; i++){
       if(roleArr[i].name == "系统管理角色"){
         this.listConfig.toolbars.push({key:'remove'})
         this.selection  = true
         return;
       }
     }
   },
   // 拓展多选框结束
    methods: {
    /* 封装表名与条件*/
      packNameWhere(name,where){
        let cont = {}
        cont['tableName']  = name
        cont['paramWhere'] = where
        return cont
      },
      /* 通用查询*/
      selectData(pack,key){
         return new Promise((resolve, reject) => {
              curdPost('selects',pack).then(response => {
                let data = response.variables.data
                for(let i in data){
                  data[i]['select'] = key
                }
               resolve(data)
                    }).catch(()=>{
                      reject(data)
                    })
           })
      },

     getConfigId(values,cont){
       if(!cont.dataResult || cont.dataResult.length<1){
         this.loading = false
         ActionUtils.handleListData(this, cont)
         return
       }
        //第一步 ， 拿到所有需要查询的列，去空，并进行分别查询。
        let datas = []
       for(let i in values){
         if(Object.values(values[i])[0].length>0){ //第二步 判断对象是否都有值
             let data =  this.selectData(this.packNameWhere(Object.keys(values[i])[0],Object.values(values[i])[0]),i) //将有值的进行查询结果
             datas.push(data)
          }
       }
       Promise.all(datas).then(result => {
         //第三步， 将字段全部提取
         let split = []
          for(let i in result){
            for(let j in result[i]){
             split.push(result[i][j])
            }
          }

           let processors = []
          for(let i in split){
            let processor =   new Promise((resolve, reject) => {
                   this.$options.methods[split[i].select](split[i],cont.dataResult,resolve) //动态调用方法，分辨如设备id字段
                })
              processors.push(processor)

           }
          this.loading = false
          ActionUtils.handleListData(this, cont)
         /*  Promise.all(processors).then(result => {
              this.loading = false
              ActionUtils.handleListData(this, cont)
             }) */


       })
      }


    }
}
