<template>
    <el-dialog
        class="import-columns-dialog"
        :visible.sync="dialogTableVisible"
        append-to-body
        width="70%"
        title="导入数据"
        @close="closeDialog"
        @open="openDialog"
    >
        <!-- <span slot="title">
      <label style="font-size:18px;">导入数据</label>
      <i class="el-icon-warning" style="font-size:12px;margin-left:5px;color:#E6A23C;">数据库元数据的格式，否则针对key-vue存储的数据会有误！</i>
    </span> -->
        <el-steps
            :active="active"
            finish-status="success"
            align-center
            simple
            class="steps"
        >
            <el-step title="上传Excel" />
            <el-step title="预览数据" />
            <el-step title="选择字段" />
            <el-step title="导入数据" />
        </el-steps>
        <el-row class="manual-operation">
            <el-col
                v-if="active === 1 || active === 2"
                :span="24"
                class="buttonGround"
            >
                <el-button
                    style="margin-top: 12px;"
                    @click="before"
                >上一步</el-button>
                <el-button
                    style="margin-top: 12px;"
                    :disabled="active === 2 && disabledShow"
                    @click="after"
                >下一步</el-button>
            </el-col>
            <!-- 上传Excel -->
            <el-col
                v-if="active === 0"
                :span="24"
                class="upload-the-excel"
            >
                <div class="upload-the-excel-detail">您可以便捷地将Excel中的数据导入到该表单中。</div>
                <el-upload
                    drag
                    :before-upload="beforeUpload"
                    action="https://www.bpmhome.cn/post"
                    accept=".xls,.xlsx"
                    class="margin-20"
                >
                    <i class="el-icon-upload" />
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div
                        slot="tip"
                        class="el-upload__tip"
                    >
                        <i style="color:red">Excel文件请符合以下标准：</i>
                        <dl>
                            <li>仅支持xls或xlsx格式的文件</li>
                            <li>确保第一行为字段名，数据在第一个Sheet中，没有合并单元格</li>
                            <li>文件大小请勿超过2.0 MB</li>
                            <li>文件所含数据行数请勿超过2000行</li>
                            <li>导入只做简单数据类型校验，不做数据有效性校验，请自行确保导入数据的正确性。</li>
                        </dl>
                    </div>
                </el-upload>
            </el-col>
            <!-- 预览数据 -->
            <el-col
                v-if="active === 1"
                :span="24"
                class="preview-the-data padding-20"
            >
                <el-table
                    ref="table"
                    v-bind="tableData"
                    border
                    :height="tableHeight - tableHeight / 9"
                    style="width: 100%"
                >
                    <el-table-column>
                        <template slot="header">
                            <div class="cell">1</div>
                        </template>
                        <template slot-scope="scope">
                            <div class="cell">{{ scope.$index + 2 }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-for="(item, index) in tableData.columns"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                    />
                </el-table>
                <div class="form-control">
                    以第 <el-input-number
                        v-model="input"
                        :min="1"
                    />行作为表单各字段的名称
                </div>
            </el-col>
            <!-- 选择字段 -->
            <el-col
                v-if="active === 2"
                :span="24"
                class="select-fields padding-20"
            >
                <el-row v-if="positionsList.length > 1" style="margin: 15px">
                    <el-col :span="2">
                        <el-tooltip class="item" effect="dark" content="导入数据到选择的编制部门" placement="top-start">
                            <i class="el-icon-info" style="color: red" />
                        </el-tooltip>
                        部门：
                    </el-col>
                    <el-col :span="22">
                        <el-radio-group v-model="buMenRadio">
                            <el-radio v-for="(item,index) in positionsList" :key="index" :label="item.id">{{ item.name }}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>

                <el-table
                    ref="selectFieldsTable"
                    border
                    :height="tableHeight - tableHeight / 9"
                    row-key="title"
                    :data="selectFieldsTableData"
                    style="width: 100%"
                >
                    <el-table-column>
                        <template slot="header">
                            <div class="cell">导入</div>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox
                                :disabled="scope.row.disabled"
                                :checked="scope.row.checked"
                                @change="handleChange(scope.$index, scope.row)"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="标题"
                        width="180"
                    />
                    <el-table-column
                        prop="dataType"
                        label="数据类型"
                    />
                </el-table>
            </el-col>
            <!-- 导入数据 -->
            <el-col
                v-if="active === 4"
                :span="24"
                class="import-data"
            >
                <div class="padding-20" style="display: flex; margin-top: 20px; height: 100px; ">
                    <div
                        v-if="!show"
                        class="transition-box importing"
                        style="color:white;"
                    >导入中...</div>
                    <div
                        v-if="show"
                        class="transition-box imported"
                    >导入成功！只导入数据库元数据的格式，否则针对key-vue存储的数据会有误！</div>
                </div>
            </el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import { saveUpload } from '@/api/platform/data/dataTemplate'
import IbpsImport from '@/plugins/import'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

export default {
    props: {
        data: {
            type: Object
        },
        dataTemplate: {
            type: Object
        },
        fields: Object,
        visible: {
            type: Boolean,
            default: false
        },
        action: String
    },
    data () {
        return {
            active: 0,
            fileList: [],
            input: 1,
            tableData: {
                columns: [],
                data: [],
                size: 'mini',
                stripe: true,
                border: true
            },
            tableHeight: '',
            selectFieldsTableData: [],
            initTableData: {},
            importData: [],
            dialogTableVisible: false,
            show: false,

            buMenRadio: '',
            positionsList: [],
            disabledShow: true
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.getPositionsList()
                this.dialogTableVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
        before () {
            if (this.active === 0) return
            this.active = this.active - 1
        },
        after () {
            if (this.active === 4) return
            if (this.active === 1) {
                this.selectFieldsTable()
            } else {
                if (this.$utils.isEmpty(this.importData)) {
                    this.selectFieldsTableData.forEach(s => {
                        if (s.checked) {
                            this.$refs['selectFieldsTable'].toggleRowSelection(s)
                        }
                    })
                    this.importData = this.$refs['selectFieldsTable'].selection
                }
                this.active = this.active + 1
                this.handleSaveUpload()
            }
        },
        handleChange (index, row) {
            if (this.$utils.isEmpty(this.importData)) {
                this.selectFieldsTableData.forEach(s => {
                    if (s.checked) {
                        this.$refs['selectFieldsTable'].toggleRowSelection(s)
                    }
                })
                this.importData = this.$refs['selectFieldsTable'].selection
            }
            row.checked = !row.checked
            this.$refs['selectFieldsTable'].toggleRowSelection(row)
            this.importData = this.$refs['selectFieldsTable'].selection
        },
        selectFieldsTable () {
            const tableData = this.$refs['table']
            let selectFieldsTableData = []
            if (this.input === 1) {
                selectFieldsTableData = tableData.$attrs.columns.map(c => {
                    return {
                        title: c.label,
                        dataType: '',
                        disabled: true,
                        checked: false,
                        key: ''
                    }
                })
            } else {
                const target = this.tableData.data[this.input - 2]
                for (var f in target) {
                    selectFieldsTableData.push({ title: target[f] || null, dataType: '', disabled: true, checked: false, key: '' })
                }
            }
            const labelList = Object.keys(this.fields).map(key => ({
                key,
                label: this.fields[key].label,
                field_type: this.fields[key].field_type || this.fields[key].type
            }))
            selectFieldsTableData.forEach(s => {
                const t = labelList.find(i => i.label === s.title)
                if (t) {
                    s.dataType = t.field_type || t.type
                    s.disabled = !t.label === s.title
                    s.checked = t.label === s.title
                    s.key = t.key
                }
            })
            this.selectFieldsTableData = selectFieldsTableData
            this.active = this.active + 1
        },
        checkExcel (fileName) {
            const fileNameAry = fileName.split('.')
            return (fileNameAry[fileNameAry.length - 1] === 'xlsx' ||
        fileNameAry[fileNameAry.length - 1] === 'xls' ||
        fileNameAry[fileNameAry.length - 1] === 'xltx' ||
        fileNameAry[fileNameAry.length - 1] === 'xlt' ||
        fileNameAry[fileNameAry.length - 1] === 'xlsm' ||
        fileNameAry[fileNameAry.length - 1] === 'xlsb' ||
        fileNameAry[fileNameAry.length - 1] === 'xltm' ||
        fileNameAry[fileNameAry.length - 1] === 'csv')
        },
        beforeUpload (file) {
            if (!this.checkExcel(file.name)) {
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: '1.仅支持xls或xlsx格式的文件<br>2.请检查导入的excel数据格式是否与被导入列表一致',
                    type: 'warning'
                })
                return
            }
            if (file.size > 2048000) {
                this.$message({
                    message: '文件大小请勿超过2.0 MB',
                    type: 'warning'
                })
                return
            }
            IbpsImport.xlsx(file)
                .then(({ header, results }) => {
                    this.tableData.columns = header.map(e => {
                        return {
                            label: e,
                            prop: e
                        }
                    })
                    this.tableData.data = results
                    this.active = 1
                    this.tableHeight = this.$el.firstChild.clientHeight - 200
                })
            return false
        },
        // changeField(fields) {
        //   const str = '_'
        //   const arr = []
        //   let target = ''
        //   const re = /^[a-z]$/
        //   for (var s in fields) { arr.push(fields[s]) }
        //   arr.forEach((a, i) => {
        //     if (a === str) {
        //       if (i < arr.length - 1) {
        //         if (re.test(arr[i + 1])) {
        //           arr[i + 1] = arr[i + 1].toUpperCase()
        //         }
        //       }
        //     }
        //   })
        //   let transform = ''
        //   arr.forEach(f => {
        //     transform += f
        //   })
        //   for (var t in transform) {
        //     if (transform[t] !== str) {
        //       target += transform[t]
        //     }
        //   }
        //   return target
        // },
        async handleSaveUpload () {
            // 获取勾选字段

            var fields = {}
            var formKey = this.dataTemplate.attrs.form_key
            this.importData.forEach(i => {
                fields[this.fields[i.key].form_field_name] = i.title
            })
            // 列表数据处理
            const tableData = JSON.parse(JSON.stringify(this.tableData.data))
            const saveData = []
            switch (formKey) {
                default:
                    tableData.forEach(data => {
                        const obj = {}
                        for (var d in data) {
                            for (var f in fields) {
                                if (d === fields[f]) {
                                    obj[f] = data[d]
                                }
                            }
                        }
                        saveData.push(obj)
                    })
            }
            const frist = this.$store.getters.level.frist
            const second = this.$store.getters.level.second
            const userId = this.$store.getters.userId
            saveData.forEach(item => {
                item.bianZhiBuMen = this.buMenRadio
                item.bianZhiRen = userId
                item.bianZhiShiJian = this.getTime(16)
                item.diDian = second || frist
            })
            // 提交
            this.active = this.active + 1
            saveUpload({
                data: JSON.stringify(saveData),
                formKey
            }).then(res => {
                this.show = true
                this.$emit('saveUpload')
            }).catch(err => {
                console.error(err)
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
            this.active = 0
            this.importData = []
            this.tableData = JSON.parse(JSON.stringify(this.initTableData))
        },
        openDialog () {
            this.initTableData = JSON.parse(JSON.stringify(this.tableData))
        },
        getTime (index = 10) {
            var nowDate = new Date((new Date()).getTime() + 8 * 60 * 60 * 1000)
            var time = nowDate.toJSON().split('T').join(' ').substr(0, index)
            return time
        },
        getPositionsList () {
            const positions = this.$store.getters.userInfo.positions || []
            this.positionsList = positions
            if (positions.length > 0) {
                this.disabledShow = false
                this.buMenRadio = positions[0].id
            } else {
                this.$message.warning('该账户未绑定部门')
            }
        }
    }
}
</script>
<style lang="scss">
.import-columns-dialog {
  height: calc(80vh) !important;

  .steps {
    padding-bottom: 6px;
    border-bottom: 1px solid #eeeeee;
    margin: 20px;
  }

  .manual-operation {
    .buttonGround {
      text-align: center;
    }

    .upload-the-excel {
      .el-upload-dragger,
      .el-upload {
        width: 100%;
      }

      .upload-the-excel-detail {
        margin: 5px 20px;
      }

      .el-upload__tip {
        line-height: 18px;
      }

      .el-upload-list {
        display: none;
      }
    }
  }

  .preview-the-data {
    margin-top: 10px;

    .form-control {
      margin-top: 5px;

      .el-input {
        input {
          padding: 0 2px;
        }
      }
    }
  }

  .select-fields {
    margin-top: 10px;
  }

  .import-data {
    .transition-box {
      width: 100%;
      height: 100px;
      border-radius: 4px;
      text-align: center;
      color: #fff;
      padding: 40px 20px;
      box-sizing: border-box;
    }

    .importing {
      background-color: #777777;
    }

    .imported {
      background-color: #69aa46;
    }
  }
}
.margin-20{
    margin: 20px;
}
.padding-20{
    padding: 20px;
}
</style>
