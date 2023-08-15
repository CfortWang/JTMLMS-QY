<template>
  <div>
    <div style="text-align: center">
      <!--表头-->
      <div class="form-header">
        <div class="title ibps-tc">用户查阅文件授权</div>
      </div>
      <el-transfer style="text-align: left; display: inline-block"
                   v-model="permissionFilesKey"
                   filterable
                   :filter-method="filterMethod"
                   :render-content="renderFunc"
                   :titles="['受限文件', '可查阅文件']"
                   :button-texts="['受限', '可查阅']"
                   :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                   @change="handleChange"
                   :data="allFiles">
      </el-transfer>
    </div>
  </div>
</template>




<script>
import { getLmitedFile, getUserByFile, saveUserByFile } from '@/api/permission/file'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

export default {
  props: {
    id: {
      type: [String, Number]
    },
  },
  data() {
    return {
      idT: '',
      allFilesDatas: [],// 所有受控文件,与个人无关
      allFiles: [],
      allFilesIds: [],
      hadper: [], // 基于权限的文件id
      noper: [], // 取消文件的id
      noPermissionFiles: [],
      permissionFiles: [],
      permissionFilesKey: [],
      renderFunc(h, option) {
        return <span>{option.type}-{option.label}</span>;
      },
      filterMethod(query, item) {
        let name = item.label + '-' + item.type
        return name.includes(query);
      }
    };
  },

  methods: {
    handleChange(value, direction, movedKeys) {
      // 批量修改，多条数据，根据条件修改指定的值
      let dataWheres = []
      if (value.length !== 0) {
        for (let i of value) {
          // 受限文件
          let dataWhere = {}
          let where1 = {}
          let param1 = {}
          where1["yong_hu_id_"] = this.id
          where1["wen_jian_id_"] = i
          param1["shou_quan_"] = '1'
          dataWhere["where"] = where1
          dataWhere["param"] = param1
          dataWheres.push(dataWhere)
        }
        for (let i of this.getArrDif(this.allFilesIds, value)) {
          // 非受限
          let dataWhere = {}
          let where1 = {}
          let param1 = {}
          where1["yong_hu_id_"] = this.id
          where1["wen_jian_id_"] = i
          param1["shou_quan_"] = '0'
          dataWhere["where"] = where1
          dataWhere["param"] = param1
          dataWheres.push(dataWhere)
        }

        let param = { tableName: "t_wjcysqb", updList: dataWheres }
        curdPost('update', param)
      } else {
        const param = {
          tableName: 't_wjcysqb',
          updList: [{
            where: {
              yong_hu_id_: this.id
            },
            param: {
              shou_quan_: '0'
            }
          }]
        }
        curdPost('update', param)
      }
    },
    getArrDif(arr1, arr2) {
      return arr1.concat(arr2).filter((v, i, arr) => {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    // 重复发放的文件，在权限表会存在重复的文件信息
    getFormData(id) {
      let sql = `select  wj.wen_jian_fu_jian_ AS wenJianFuJian,
      wj.wen_jian_ming_che AS wenJianMingCheng,
      wj.wen_jian_xi_lei_ AS wenJianXiLei ,
      qx.shou_quan_ AS shouQuan,
      qx.id_
      FROM (
         SELECT *FROM (SELECT * FROM t_wjcysqb  ORDER BY create_time_ DESC LIMIT 99999999) a GROUP BY a.yong_hu_id_,a.wen_jian_id_
      ) qx LEFT JOIN t_wjxxb wj ON qx.wen_jian_id_=wj.wen_jian_fu_jian_ where qx.yong_hu_id_='${id}' order by wj.wen_jian_xi_lei_ ASC`
      curdPost('sql', sql).then(res => {
        for (let i of res.variables.data) {
          this.allFilesDatas.push(i)
          this.allFilesIds.push(i.wenJianFuJian)
          if (i.shouQuan == '1') {
            // 已授权文件
            let filterFile = {}
            filterFile["key"] = i.wenJianFuJian
            filterFile["label"] = i.wenJianMingCheng
            filterFile["type"] = i.wenJianXiLei
            filterFile["yongHuId"] = id
            this.permissionFiles.push(filterFile)
            this.permissionFilesKey.push(i.wenJianFuJian)
            this.allFiles.push(filterFile)
          } else {
            // 未授权文件，但是已经发放
            let fileData = {}
            fileData["key"] = i.wenJianFuJian
            fileData["label"] = i.wenJianMingCheng
            fileData["type"] = i.wenJianXiLei
            fileData["yongHuId"] = id
            this.noPermissionFiles.push(fileData)
            this.allFiles.push(fileData)
          }
        }
      }).catch(res => {
      })

    },
  },
  watch: {
    id: {
      immediate: true,
      handler: function (val, oldVal) {
        this.allFilesDatas = []
        this.permissionFiles = []
        this.noPermissionFiles = []
        this.allFiles = []
        this.permissionFilesKey = []
        this.idT = val
        this.getFormData(val)
      },
    }
  }
};
</script>
  

<style  scoped lang="less">
.form-header {
  border-bottom: 1px solid #2b34410d;
  margin-bottom: 5px;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #222;
    text-align: left;
    padding: 8px 10px 10px;
    margin: 0;
  }

  .desc {
    word-wrap: break-word;
    word-break: normal;
    text-indent: 0;
    line-height: 1.6;
    margin: 0 0 11px;
    padding: 3px 30px 8px;
  }
}

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}

/deep/.el-transfer {
  width: 100%;
}

/deep/ .el-transfer-panel {
  width: 40%;
}

/deep/ .el-transfer__buttons {
  width: 10%;
  padding: 0 10px;
}

/deep/ .el-transfer-panel__body {
  height: auto;
}

/deep/.el-transfer-panel__list {
  height: 650px;
}

/deep/ .el-button {
  width: 100%;
}
</style>