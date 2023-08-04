<template>
    <div>
        <div style="text-align: center">
            <!--表头-->
            <div class="form-header">
                <div class="title ibps-tc">用户查阅文件授权</div>
            </div>
            <el-transfer
                v-model="permissionFilesKey"
                style="text-align: left; display: inline-block"
                filterable
                :filter-method="filterMethod"
                :render-content="renderFunc"
                :titles="['受限文件', '可查阅文件']"
                :button-texts="['受限', '可查阅']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                :data="allFiles"
                @change="handleChange"
            />
        </div>
    </div>
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    props: {
        id: {
            type: [String, Number]
        }
    },
    data () {
        return {
            idT: '',
            allFilesDatas: [], // 所有受控文件,与个人无关
            allFiles: [],
            allFilesIds: [],
            hadper: [], // 基于权限的文件id
            noper: [], // 取消文件的id
            noPermissionFiles: [],
            permissionFiles: [],
            permissionFilesKey: [],
            renderFunc (h, option) {
                return <span>{option.type}-{option.label}</span>
            },
            filterMethod (query, item) {
                const name = item.label + '-' + item.type
                return name.includes(query)
            }
        }
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
            }
        }
    },

    methods: {
        handleChange (value, direction, movedKeys) {
            // 批量修改，多条数据，根据条件修改指定的值
            const dataWheres = []
            if (value.length !== 0) {
                for (const i of value) {
                    // 受限文件
                    const dataWhere = {}
                    const where1 = {}
                    const param1 = {}
                    // where1['yong_hu_id_'] = this.id
                    where1['id_'] = i
                    param1['shou_quan_'] = '1'
                    dataWhere['where'] = where1
                    dataWhere['param'] = param1
                    dataWheres.push(dataWhere)
                }
                for (const i of this.getArrDif(this.allFilesIds, value)) {
                    // 非受限
                    const dataWhere = {}
                    const where1 = {}
                    const param1 = {}
                    // where1['yong_hu_id_'] = this.id
                    where1['id_'] = i
                    param1['shou_quan_'] = '0'
                    dataWhere['where'] = where1
                    dataWhere['param'] = param1
                    dataWheres.push(dataWhere)
                }
                const param = { tableName: 't_wjcysqb', updList: dataWheres }
                curdPost('update', param)
            } else {
                const param = {
                    tableName: 't_wjcysqb',
                    updList: [
                        {
                            where: {
                                yong_hu_id_: this.id
                            },
                            param: {
                                shou_quan_: '0'
                            }
                        }
                    ]
                }
                curdPost('update', param)
            }
        },
        getArrDif (arr1, arr2) {
            return arr1.concat(arr2).filter((v, i, arr) => {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        // 重复发放的文件，在权限表会存在重复的文件信息
        getFormData (id) {
            const sql = `select qx.id_ as id , wj.wen_jian_fu_jian_ AS wenJianId, wj.wen_jian_ming_che AS wenJianMingChe,   
   wj.wen_jian_xi_lei_ AS neiLeiXing ,      qx.shou_quan_ AS shouQuan     FROM (
           SELECT a.id_,a.create_by_,MAX(a.create_time_) create_time_ ,a.yong_hu_id_,a.wen_jian_id_,
                   a.fa_bu_ri_qi_,a.shou_quan_ FROM t_wjcysqb a  GROUP BY yong_hu_id_,wen_jian_id_      
                   ) qx LEFT JOIN t_wjxxb wj ON qx.wen_jian_id_=wj.wen_jian_fu_jian_ WHERE qx.yong_hu_id_='${id}' ORDER BY wj.xi_lei_id_ DESC
`
            curdPost('sql', sql).then(res => {
                for (const i of res.variables.data) {
                    this.allFilesDatas.push(i)
                    this.allFilesIds.push(i.id)
                    if (i.shouQuan == '1') {
                        // 已授权文件
                        const filterFile = {}
                        filterFile['key'] = i.id
                        filterFile['label'] = i.wenJianMingChe
                        filterFile['type'] = i.neiLeiXing
                        filterFile['yongHuId'] = i.yong_hu_id_
                        this.permissionFiles.push(filterFile)
                        this.permissionFilesKey.push(i.id)
                        this.allFiles.push(filterFile)
                    } else {
                        // 未授权文件，但是已经发放
                        const fileData = {}
                        fileData['key'] = i.id
                        fileData['label'] = i.wenJianMingChe
                        fileData['type'] = i.neiLeiXing ? i.neiLeiXing : i.waiLeiXing
                        fileData['yongHuId'] = id
                        this.noPermissionFiles.push(fileData)
                        this.allFiles.push(fileData)
                    }
                }
            }).catch(res => {
            })
        }
    }
}
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
