<template>
    <div class="test2">
        <div class="mb-md">
            <div v-if="grooveData.xlsxTitleShow" class="demo-input-suffix">
                表格名称：
                <el-input v-model="title" placeholder="请输入表格名称" style="width: 400px" />
            </div>
            <div v-if="grooveData.saveShow" class="demo-input-suffix">
                <el-button type="success" @click="save">保存</el-button>
            </div>
            <div v-if="grooveData.clickHandleShow" class="demo-input-suffix">
                <el-button type="warning" @click="clickHandle">上传xlsx</el-button>
            </div>
            <div class="demo-input-suffix">
                <el-button type="info" @click="exportExcelBtn">导出xlsx</el-button>
            </div>
            <input ref="inputFile" type="file" style="display: none" @change="chageFile">
            <!-- <div v-if="!grooveData.xlsxTitleShow && !grooveData.saveShow && !grooveData.clickHandleShow && !grooveData.exportExcelShow" style="height: 30px"></div> -->
        </div>
        <!--web spreadsheet组件-->
        <div class="excel" :style="{height: height + 'px'}">
            <div id="luckysheetDom" ref="luckysheet" style="margin: 0px; padding: 0px; width:100%; height: 100%;z-index: 100;" />

            <!-- <div id="luckysheetDom" ref="luckysheet" style="margin: 0px; padding: 0px; width: calc(100% + 200px); height: calc(100% + 50px);z-index: 100;" /> -->
        </div>
    </div>
</template>

<script>
// 引入依赖包
import LuckyExcel from 'luckyexcel'
const luckysheet = window.luckysheet
// 代码见下
import { exportExcel } from './js/export'
import { upload } from '@/api/detection/jtsjpz'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    name: 'xspreadsheet-demo',
    props: {
        id: {
            type: String,
            default: ''
        },
        dialogShow: {
            type: Boolean,
            default: false
        },
        grooveData: {
            type: Object,
            default: function () {
                return {
                    title: '提示',
                    saveShow: true,
                    exportExcelShow: true,
                    clickHandleShow: true,
                    xlsxTitleShow: true,
                    readOnly: true,
                    showtoolbarConfig: null,
                    cellRightClickConfig: null,
                    showstatisticBarConfig: null
                }
            }
        },
        grooveList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            option: null,

            showtoolbarConfig: {
                // //自定义配置工具栏
                undoRedo: true, // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
                paintFormat: true, // 格式刷
                currencyFormat: true, // 货币格式
                percentageFormat: true, // 百分比格式
                numberDecrease: true, // '减少小数位数'
                numberIncrease: true, // '增加小数位数
                moreFormats: true, // '更多格式'
                font: true, // '字体'
                fontSize: true, // '字号大小'
                bold: true, // '粗体 (Ctrl+B)'
                italic: true, // '斜体 (Ctrl+I)'
                strikethrough: true, // '删除线 (Alt+Shift+5)'
                underline: true, // '下划线 (Alt+Shift+6)'
                textColor: true, // '文本颜色'
                fillColor: true, // '单元格颜色'
                border: true, // '边框'
                mergeCell: true, // '合并单元格'
                horizontalAlignMode: true, // '水平对齐方式'
                verticalAlignMode: true, // '垂直对齐方式'
                textWrapMode: true, // '换行方式'
                textRotateMode: false, // '文本旋转方式'
                image: false, // '插入图片'
                link: false, // '插入链接'
                chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
                postil: false, // '批注'
                pivotTable: false, // '数据透视表'
                function: true, // '公式'
                frozenMode: false, // '冻结方式'
                sortAndFilter: false, // '排序和筛选'
                conditionalFormat: false, // '条件格式'
                dataVerification: false, // '数据验证'
                splitColumn: false, // '分列'
                screenshot: true, // '截图'
                findAndReplace: true, // '查找替换'
                protection: false, // '工作表保护'
                print: false // '打印'
            },
            cellRightClickConfig: {
                // 右键单元格菜单设置
                copy: true, // 复制
                copyAs: true, // 复制为
                paste: true, // 粘贴
                insertRow: true, // 插入行
                insertColumn: true, // 插入列
                deleteRow: true, // 删除选中行
                deleteColumn: true, // 删除选中列
                deleteCell: true, // 删除单元格
                hideRow: false, // 隐藏选中行和显示选中行
                hideColumn: false, // 隐藏选中列和显示选中列
                rowHeight: true, // 行高
                columnWidth: true, // 列宽
                clear: true, // 清除内容
                matrix: false, // 矩阵操作选区
                sort: false, // 排序选区
                filter: false, // 筛选选区
                chart: false, // 图表生成
                image: false, // 插入图片
                link: false, // 插入链接
                data: false, // 数据验证
                cellFormat: true // 设置单元格格式
            },
            showstatisticBarConfig: {
                // 自定义配置底部计数栏
                count: false, // 计数栏
                view: true, // 打印视图
                zoom: true // 缩放
            },
            title: this.grooveData.title,
            height: ''
        }
    },
    created () {
        if (this.dialogShow) {
            this.height = window.innerHeight - 110
        } else {
            this.height = window.innerHeight - 150
        }

        if (this.grooveData.showtoolbarConfig && Object.keys(this.grooveData.showtoolbarConfig).length > 0) {
            Object.keys(this.grooveData.showtoolbarConfig).forEach(item => {
                this.showtoolbarConfig[item] = this.grooveData.showtoolbarConfig[item]
            })
        }

        if (this.grooveData.cellRightClickConfig && Object.keys(this.grooveData.cellRightClickConfig).length > 0) {
            Object.keys(this.grooveData.cellRightClickConfig).forEach(item => {
                this.cellRightClickConfig[item] = this.grooveData.cellRightClickConfig[item]
            })
        }

        if (this.grooveData.showstatisticBarConfig && Object.keys(this.grooveData.showstatisticBarConfig).length > 0) {
            Object.keys(this.grooveData.showstatisticBarConfig).forEach(item => {
                this.showstatisticBarConfig[item] = this.grooveData.showstatisticBarConfig[item]
            })
        }
    },
    mounted () {
        if (this.id) {
            this.getInitData(this.id)
            // this.init()
        } else {
            this.init()
        }
    },
    destroyed () {
        luckysheet.destroy()
        // this.$refs.luckysheet.remove()
    },
    methods: {
        init () {
            let options = ''
            if (!options) {
                options = {
                    container: 'luckysheetDom',
                    title: '',
                    lang: 'zh',
                    data: [
                        {
                            name: 'sheet1'
                        }
                    ],
                    showtoolbarConfig: this.showtoolbarConfig,
                    showinfobar: false,
                    cellRightClickConfig: this.cellRightClickConfig,
                    showstatisticBarConfig: this.showstatisticBarConfig
                }
            }
            if (this.grooveList.length > 0) {
                this.grooveList.forEach((item, index) => {
                    if (!item.name) {
                        item.name = 'sheet' + index
                    }
                })
                options.data = this.grooveList
            }
            // 可开启只读模式
            // options.allowEdit = false
            // this.option = options
            luckysheet.create(options)
        },
        // 获取数据表的数据
        getInitData (id) {
            const sql = `select * from t_pbgl where id_ = '${id}'`
            curdPost('sql', sql).then((res) => {
                if (res.state === '200') {
                    const dataItem = res.variables.data[0]
                    this.title = dataItem.shu_ju_ming_cheng
                    const options = JSON.parse(dataItem.shu_ju_cun_chu_)
                    luckysheet.create(options)
                }
            })
        },
        save () {
            const data = luckysheet.toJson()
            if (this.id) {
                this.updateSumbit(data)
            } else {
                this.getSumbit(data)
            }
        },
        // 下载文档
        exportExcelBtn () {
            console.log(luckysheet.toJson())
            const title = this.title ? this.title : '下载'
            exportExcel(luckysheet.getluckysheetfile(), title)
        },

        // 上传文档
        clickHandle () {
            this.$refs.inputFile.click()
        },
        chageFile () {
            this.importExcel(this.$refs.inputFile.files[0])
        },
        importExcel (file) {
            const name = file.name
            this.title = name.split('.xlsx')[0]
            // 获取文件后缀
            const suffixArr = name.split('.')
            const suffix = suffixArr[suffixArr.length - 1]
            if (suffix !== 'xlsx') {
                alert('目前只能导入xlsx类型的文件')
                return
            }
            LuckyExcel.transformExcelToLucky(file, this.fileCb, this.errorCb)
        },
        fileCb (exportJson, luckysheetfile) {
            // 转换后获取工作表数据
            if (exportJson.sheets === null || exportJson.sheets.length === 0) {
                alert('无法读取excel文件的内容，当前不支持xls文件!')
                return
            }

            luckysheet.destroy()

            luckysheet.create({
                container: 'luckysheetDom', // luckysheet is the container id
                data: exportJson.sheets,
                title: exportJson.info.name,
                userInfo: exportJson.info.name.creator,
                lang: 'zh',
                showtoolbarConfig: this.showtoolbarConfig,
                showinfobar: false,
                cellRightClickConfig: this.cellRightClickConfig,
                showstatisticBarConfig: this.showstatisticBarConfig
            })
        },
        errorCb (error) {},
        printFn () {
            // 1. 实现全选
            $('#luckysheet-left-top').click()
            // 2. 生成选区的截图
            const src = luckysheet.getScreenshot()
            const $img = `<img src=${src} style="max-width: 90%;" />`
            this.$nextTick(() => {
                document.querySelector('#print_html').innerHTML = $img
            })
            // 3. 调用系统打印：已经用v-print指令绑定在打印按钮上
        },

        getSumbit (option) {
            if (this.title === '') {
                this.$message({
                    showClose: true,
                    message: '请填写表格名称',
                    type: 'warning'
                })
                return
            }
            const data = {
                shu_ju_cun_chu_: JSON.stringify(option),
                shu_ju_lei_xing_: '在线编辑',
                shu_ju_ming_cheng: this.title,
                bao_cun_dao_chu_s: JSON.stringify(luckysheet.getluckysheetfile())
            }
            const params = {
                tableName: 't_pbgl',
                paramWhere: [data]
            }
            curdPost('add', params).then((res) => {
                if (res.state == '200') {
                    const dataItem = res.variables.cont[0]
                    this.id = dataItem.id_
                    this.$emit('addClick', dataItem.id_, dataItem)
                    this.$message({
                        showClose: true,
                        message: this.title + '的文档' + '保存成功',
                        type: 'success'
                    })
                }
            })
        },
        updateSumbit (option) {
            if (this.title === '') {
                this.$message({
                    showClose: true,
                    message: '请填写表格名称',
                    type: 'warning'
                })
                return
            }
            const data = {
                where: {
                    id_: this.id
                },
                param: {
                    shu_ju_cun_chu_: JSON.stringify(option),
                    shu_ju_lei_xing_: '在线编辑',
                    shu_ju_ming_cheng: this.title,
                    bao_cun_dao_chu_s: JSON.stringify(luckysheet.getluckysheetfile())
                }
            }
            const allSampleParams = {
                tableName: 't_pbgl',
                updList: [data]
            }
            curdPost('update', allSampleParams).then((res) => {
                if (res.state === '200') {
                    this.$emit('addClick', this.id, option)
                    this.$message({
                        showClose: true,
                        message: this.title + '的文档' + '修改成功',
                        type: 'success'
                    })
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
.mb-md {
    padding: 10px;
    display: flex;
}
.demo-input-suffix {
    margin-right: 10px;
}
.test2 {
    // width: 100%;
    // height: 100%;
    // display: flex;
    // flex-direction: column;
    .excel {
        flex: 1;
        height: 500px;
    }
}

</style>
