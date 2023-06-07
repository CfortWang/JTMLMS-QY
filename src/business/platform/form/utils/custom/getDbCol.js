import curdPost from '@/business/platform/form/utils/custom/joinCURD.js' //增删改查规则

const getDbCol =async (tid,cols) => {
    let sql = "select attr_code_,field_name_ from ibps_bo_attr_column where table_id_ = '"+tid+"'"
    let rtsql = "";
    await curdPost('sql',sql).then(response => {
      let colArray = response.variables.data
      let rtArray = []
      colArray.forEach(function(a){
        cols.forEach(function(e){
          if(a.attr_code_==e.prop){
            rtArray.push(a.field_name_+" as "+e.prop)
          }
        })
      })
      rtsql = rtArray.join(",").toString()
    })
    return rtsql
  }
export default getDbCol
