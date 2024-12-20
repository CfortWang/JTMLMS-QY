<template>
    <div class="qualityControl">
        <div v-if="!readonly && shiFouGuoShen" class="btn">
            <el-button type="primary" icon="ibps-icon-plus" @click="onAddClick">添加</el-button>
            <el-button type="danger" icon="ibps-icon-close" @click="onRemoveClick">删除</el-button>
            <el-button type="primary" icon="ibps-icon-import" @click="onImportClick">导入</el-button>
            <el-button type="primary" icon="ibps-icon-export" @click="onExportClick">导出</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" border @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                />
                <el-table-column
                    label="序号"
                    width="50"
                    type="index"
                />
                <el-table-column label="项目" prop="xiangMu" width="160" />
                <el-table-column label="质控批号" prop="zhiKongPinPiHao" width="100" />
                <el-table-column label="批号开始时间" prop="piHaoKaiShiShiJia" width="100" />
                <el-table-column label="质控图的界限">
                    <el-table-column label="单位" prop="zhiKongTuDanWei" />
                    <el-table-column label="水平" prop="zhiKongTuShuiPing" />
                    <el-table-column label="均值" prop="zhiKongTuJunZhi" />
                    <el-table-column label="SD" prop="zhiKongTuSd" />
                    <el-table-column label="CV%" prop="zhiKongTuCv" />
                </el-table-column>
                <el-table-column label="原始测定数据统计">
                    <el-table-column label="均值" prop="yuanShiJunZhi" />
                    <el-table-column label="SD" prop="yuanShiSd" />
                    <el-table-column label="CV%" prop="yuanShiCv" />
                    <el-table-column label="N" prop="yuanShiN" />
                    <el-table-column label="失控数" prop="shiKongShu" />
                </el-table-column>
                <el-table-column label="除失控数据后的数据统计">
                    <el-table-column label="均值" prop="chuJunZhi" />
                    <el-table-column label="SD" prop="chuSd" />
                    <el-table-column label="CV%" prop="chuCv" />
                </el-table-column>
                <el-table-column label="累积数据统计">
                    <el-table-column label="均值" prop="leiJunZhi" />
                    <el-table-column label="SD" prop="leiSd" />
                    <el-table-column label="CV%" prop="leiCv" />
                    <el-table-column label="N" prop="leiN" />
                    <el-table-column label="在控率%" prop="zaiKongLv" />
                </el-table-column>
                <el-table-column label="CV%控制范围">
                    <el-table-column label="%" prop="cvKongZhiFanWei" />
                </el-table-column>
                <el-table-column v-if="!readonly && shiFouGuoShen" label="操作栏位" fixed="right">
                    <template slot-scope="{row,$index}">
                        <el-button type="text" icon="ibps-icon-edit" @click="onEditClick(row,$index)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <input id="" ref="file1" style="display:none" type="file" name="" accept=".xlsx,.xls" @change="handleUploadChange1">
    </div>
</template>

<script>
import xlsx from 'xlsx'
import fs from 'file-saver'
import dayjs from 'dayjs'
export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableData: [],
            multipleSelection: [],
            columns: {
                xiangMu: '项目',
                zhiKongPinPiHao: '质控批号',
                piHaoKaiShiShiJia: '批号开始时间',

                zhiKongTuDanWei: '质控图的界限单位',
                zhiKongTuShuiPing: '质控图的界限水平',
                zhiKongTuJunZhi: '质控图的界限均值',
                zhiKongTuSd: '质控图的界限SD',
                zhiKongTuCv: '质控图的界限CV%',

                yuanShiJunZhi: '原始测定数据统计均值',
                yuanShiSd: '原始测定数据统计SD',
                yuanShiCv: '原始测定数据统计CV%',
                yuanShiN: '原始测定数据统计N',
                shiKongShu: '原始测定数据统计失控数',

                chuJunZhi: '除失控数据后的数据统计均值',
                chuSd: '除失控数据后的数据统计SD',
                chuCv: '除失控数据后的数据统计CV%',

                leiJunZhi: '累积数据统计均值',
                leiSd: '累积数据统计SD',
                leiCv: '累积数据统计CV%',
                leiN: '累积数据统计N',
                zaiKongLv: '累积数据统计在控率%',

                cvKongZhiFanWei: 'CV%控制范围'
            }
        }
    },
    computed: {
        shiFouGuoShen () {
            if (!this.formData.shiFouGuoShen || this.formData.shiFouGuoShen === '已退回' || this.formData.shiFouGuoShen === '已暂存') {
                return true
            }
            return false
        }
    },
    watch: {
        'formData.dlxmsnzkyfxzb': {
            handler (val) {
                if (val && val.length) {
                    // console.log(this.formData)
                    this.tableData = val
                }
            }
        },
        tableData: {
            handler (val) {
                this.$emit('change-data', 'dlxmsnzkyfxzb', val)
            },
            deep: true
        }
    },

    methods: {
        xlsx (json, fields, filename = '.xlsx') { // 导出xlsx
            json.forEach(item => {
                for (const i in item) {
                    if (fields.hasOwnProperty(i)) {
                        item[fields[i]] = item[i]
                    }
                    delete item[i] // 删除原先的对象属性
                }
            })
            const sheetName = filename // excel的文件名称
            const wb = xlsx.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
            const ws = xlsx.utils.json_to_sheet(json, { header: Object.values(fields) }) // 将JS对象数组转换为工作表。
            wb.SheetNames.push(sheetName)
            wb.Sheets[sheetName] = ws
            const defaultCellStyle = { font: { name: 'Verdana', sz: 13, color: 'FF00FF88' }, fill: { fgColor: { rgb: 'FFFFAA00' }}}// 设置表格的样式
            const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } // 写入的样式
            const wbout = xlsx.write(wb, wopts)
            const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' })
            fs.saveAs(blob, filename + '.xlsx')
        },
        s2ab (s) {
            let buf
            if (typeof ArrayBuffer !== 'undefined') {
                buf = new ArrayBuffer(s.length)
                const view = new Uint8Array(buf)
                for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
                return buf
            } else {
                buf = new Array(s.length)
                for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
                return buf
            }
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        onAddClick () {
            const btn = document.querySelector('.dynamic-form-table .ibps-icon-add')
            btn.click()
        },
        onImportClick () {
            // const btn = document.querySelector('.dynamic-form-table .ibps-icon-import')
            // btn.click()
            this.$refs.file1.click()
            console.log('导入')
        },
        /* 读取文件 将文件转换为二进制 */
        readFile (file) {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.readAsBinaryString(file)
                reader.onload = ev => {
                    resolve(ev.target.result)
                }
            })
        },
        // 转换对象的key
        switchDeviceObj (data, originalObj) {
            const result = []
            data.forEach(item => {
                const obj = {}
                for (const key in originalObj) {
                    // 对日期格式的数据做兼容处理
                    if (item[originalObj[key]] instanceof Date) {
                        obj[key] = dayjs(item[originalObj[key]]).add(8, 'hour').format('YYYY-MM-DD') || ''
                    } else {
                        obj[key] = String(item[originalObj[key]] || '')
                    }
                }
                result.push(obj)
            })
            return result
        },
        async switchXmToId (list) {
            const sql = `select id_,jian_yan_xiang_mu from t_nlfwb`
            const { variables: { data = {}} = {}} = await this.$common.request('sql', sql)
            for (let i = 0; i < list.length; i++) {
                const row = list[i]
                const t = data.find(item => item.jian_yan_xiang_mu.trim() === row.xiangMu.trim())
                row.xuanZeXiangMu = t?.id_ || ''
            }
        },
        checkDate (data) {
            // 校验日期字段是否符合要求
            const dateRegex = /^(\d{4})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])$/
            for (let i = 0; i < data.length; i++) {
                const row = data[i]
                if (row.piHaoKaiShiShiJia && !dateRegex.test(row.piHaoKaiShiShiJia)) {
                    throw new Error(`第${i + 1}行时间格式错误！`)
                }
            }
        },
        async handleUploadChange1 (file) {
            try {
                const dataBinary = await this.readFile(file.target.files[0])
                file.target.value = null // 注意上传后要将input的值设为空
                const workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
                const workSheet = workBook.Sheets[workBook.SheetNames[0]]
                const data = xlsx.utils.sheet_to_json(workSheet)
                const importData = this.switchDeviceObj(data, this.columns)
                // console.log(JSON.parse(JSON.stringify(importData)))
                this.checkDate(importData)
                await this.switchXmToId(importData)
                this.tableData.push(...importData)
                // console.log(JSON.parse(JSON.stringify(this.tableData)))
            } catch (error) {
                this.$message.warning(error?.message || '导入失败')
            }
        },
        getTimeStamp () {
            return dayjs().format('YYYYMMDDHHmmss')
        },
        onExportClick () {
            // const btn = document.querySelector('.dynamic-form-table .ibps-icon-export')
            // btn.click()
            const copyData = JSON.parse(JSON.stringify(this.tableData))
            this.xlsx(copyData, this.columns, '定量项目室内质控月分析表' + this.getTimeStamp())
            this.$message.success('导出成功！')
        },
        onRemoveClick () {
            if (this.multipleSelection.length === 0) {
                return this.$message.warning('请先选择需要删除的数据!')
            }
            this.$confirm('是否确认删除所选项?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData = this.tableData.filter(item => !this.multipleSelection.includes(item))
            }).catch(() => {
            })
        },
        onEditClick (row, $index) {
            const btns = document.querySelectorAll('.dynamic-form-table .ibps-icon-edit')
            btns[Math.floor(btns.length / 2) + $index].click()
        }
    }
}
</script>

<style lang="scss" scoped>
.qualityControl{
    margin-top: 20px;
    .btn{
        padding: 0;
        display: flex;
        justify-content: flex-end;
        .el-button{
            margin: 0;
        }
    }
}
</style>
