<template>
    <div class="info-container">
        <div class="experimental-data info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验数据</span>
            </div>
            <div class="operate">
                <template v-for="btn in toolbars">
                    <el-button
                        v-if="!btn.hidden"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        plain
                        @click="handleActionEvent(btn.key)"
                    >
                        {{ btn.label }}
                    </el-button>
                </template>
            </div>
            <div class="content">
                <div v-if="showTemplate" class="data-table">
                    <div class="table-header">
                        <div v-for="(h, index) in tableData.headerData" :key="index" class="th">{{ h }}</div>
                    </div>
                    <div class="table-content">
                        <div v-for="(row, trIndex) in tableData.tableContent" :key="trIndex" class="tr">
                            <div
                                v-for="(item, tdIndex) in row"
                                :key="tdIndex"
                                class="td"
                                :class="tdIndex === 1 ? trIndex % repeatNum === 0 ? 'merge' : 'hidden' : ''"
                            >{{ item }}</div>
                        </div>
                    </div>
                </div>
                <el-empty v-else description="暂无数据，请导出模板填写后导入" />
            </div>
        </div>
        <!-- <import-table
            :visible="showImportTable"
            title="导入"
            @close="visible => (showImportTable = visible)"
            @action-event="handleImport"
        /> -->
    </div>
</template>
<script>
// import IbpsImport from '@/plugins/import'
import ActionUtils from '@/utils/action'
import { exportTemplate, importTemplate } from '@/api/business/pv'

export default {
    components: {
        ImportTable: () => import('@/business/platform/form/formrender/dynamic-form/components/import-table')
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        formId: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            pageInfo: {},
            showTemplate: false,
            showImportTable: false,
            tableData: {},
            repeatNum: 1,
            toolbars: [
                { key: 'export', icon: 'ibps-icon-cloud-download', label: '导出模板', type: 'info', hidden: this.readonly },
                { key: 'import', icon: 'ibps-icon-cloud-upload', label: '导入数据', type: 'warning', hidden: this.readonly },
                { key: 'generate', icon: 'ibps-icon-file-text-o', label: '查看实验报告', type: 'success', hidden: true }
            ]
        }
    },
    // watch: {
    //     info: {
    //         handler (val, oldVal) {
    //             this.pageInfo = val
    //             if (!this.showTemplate && this.$utils.isNotEmpty(val.shiYanShuJu)) {
    //                 this.dealData(val.shiYanShuJu)
    //             }
    //         },
    //         immediate: true,
    //         deep: true
    //     }
    // },
    mounted () {
        this.pageInfo = JSON.parse(JSON.stringify(this.info))
        if (!this.showTemplate && this.$utils.isNotEmpty(this.pageInfo)) {
            this.dealData(this.pageInfo)
        }
    },
    methods: {
        handleActionEvent (key) {
            switch (key) {
                case 'generate':
                    this.handleGenerate()
                    break
                case 'export':
                    this.handleExport()
                    break
                case 'import':
                    // this.showImportTable = true
                    this.handleImport()
                    break
            }
        },
        handleGenerate () {
            this.$message.info('waiting...')
        },
        handleExport () {
            if (!this.formId) {
                return this.$message.error('请先保存数据！')
            }
            exportTemplate({
                id: this.formId
            }).then(res => {
                ActionUtils.download(res.data, '实验数据模板.xlsx')
            })
        },
        // handleImport (file, options) {
        //     this.loading = false
        //     IbpsImport.xlsx(file, options).then(res => {
        //         console.log(res)
        //     })
        // },
        handleImport () {
            if (!this.formId) {
                return this.$message.error('请先保存数据！')
            }
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.xlsx'
            input.onchange = event => {
                const file = event.target.files[0]
                const reader = new FileReader()
                reader.onload = event => {
                    const data = new FormData()
                    data.append('id', this.formId)
                    data.append('applyFiles', file)
                    importTemplate(data).then(res => {
                        this.$message.success('实验数据导入成功')
                        this.info.shiYanShuJu = res.data
                        this.dealData(res.data)
                    }).catch(({ state, cause }) => {
                        const errMsg = JSON.parse(cause)
                        let msgContent = ''
                        Object.keys(errMsg).forEach(key => {
                            let msgItem = '<div >'
                            errMsg[key].forEach(item => {
                                msgItem += `<div>${item}</div>`
                            })
                            msgContent += `<div><div style="font-weight: bold;">${key}：</div>${msgItem}<div>`
                        })
                        this.$confirm(`<div style="font-size: 14px;">${msgContent}</div>`, '数据校验失败，请根据以下提示完善您的数据！', {
                            confirmButtonText: '确认',
                            showClose: false,
                            showCancelButton: false,
                            closeOnClickModal: false,
                            dangerouslyUseHTMLString: true,
                            customClass: 'errorTips',
                            type: 'error'
                        }).then(() => {}).catch(() => {})
                    })
                }
                reader.readAsBinaryString(file)
            }
            input.click()
        },
        dealData (res) {
            const { data, config, reportData } = res || {}
            const { days, repeatNum, specimensName = [] } = config || {}
            this.repeatNum = repeatNum
            const headerData = ['序号', '日期'].concat(specimensName)
            const tableContent = []
            const snList = Array.from({ length: days * repeatNum }, (_, index) => index + 1)
            const dateList = Array.from({ length: days * repeatNum }, (_, index) => `第${Math.floor(index / repeatNum) + 1}天`)
            data['序号'] = snList
            data['日期'] = dateList

            // 将data按表头顺序排序
            const sortedData = Object.entries(data)
                .sort(([keyA], [keyB]) => headerData.indexOf(keyA) - headerData.indexOf(keyB))
                .reduce((obj, [key, value]) => {
                    obj[key] = value
                    return obj
                }, {})

            for (let i = 0; i < snList.length; i++) {
                const row = []
                for (const key in sortedData) {
                    row.push(sortedData[key][i])
                }
                tableContent.push(row)
            }
            this.tableData = {
                headerData,
                tableContent
            }
            this.showTemplate = true
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .experimental-data {
            position: relative;
            .operate {
                position: absolute;
                right: 0;
                top: -2px;
            }
            .content {
                padding: 10px;
                position: relative;
                .data-table {
                    max-height: 400px;
                    overflow: auto;
                    padding: 0 5px 5px 0;
                    .table-header {
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        background: #fff;
                        display: flex;
                        .th {
                            font-size: 14px;
                            font-weight: bold;
                            text-align: center;
                            height: 28px;
                            line-height: 28px;
                            padding: 2px 6px;
                            border: 1px solid #ddd;
                            border-right: none;
                            flex: 1;
                            flex-basis: 0;
                            &:first-child {
                                flex: 0 0 60px
                            }
                            &:nth-child(2) {
                                flex: 0 0 90px
                            }
                            &:last-child {
                                border-right: 1px solid #ddd;
                            }
                        }
                    }
                    .table-content {
                        .tr {
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            text-align: center;
                            border: 1px solid #ddd;
                            border-top: none;
                            position: relative;
                            .td {
                                position: relative;
                                flex: 1;
                                flex-basis: 0;
                                height: 28px;
                                line-height: 28px;
                                padding: 2px 6px;
                                border-right: 1px solid #ddd;
                                &:first-child {
                                    flex: 0 0 60px
                                }
                                &:nth-child(2) {
                                    flex: 0 0 90px
                                }
                                &:last-child {
                                    border-right: none;
                                }
                            }
                            // .merge {
                            //     height: 72px;
                            //     position: relative;
                            //     float: left;
                            //     top: 0;
                            //     left: 0;
                            // }
                            // .hidden {
                            //     visibility: hidden;
                            // }
                        }
                    }
                }
            }
        }
    }
</style>
