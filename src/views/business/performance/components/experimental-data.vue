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
                <el-table
                    v-if="showTemplate"
                    :data="pageInfo.dataDTO.list"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    max-height="250px"
                >
                    <el-table-column
                        v-for="(h, hIndex) in pageInfo.dataDTO.header"
                        :key="h.children && h.children.length ? hIndex : h.prop"
                        :prop="h.prop"
                        :label="h.label"
                        width="80"
                        header-align="center"
                        align="center"
                    >
                        <template slot="header" slot-scope="scope">
                            <span v-html="scope.column.label" />
                        </template>
                        <el-table-column
                            v-for="c in h.children"
                            :key="c.prop"
                            :prop="c.prop"
                            :label="c.label"
                            header-align="center"
                            align="center"
                        >
                            <template slot="header" slot-scope="scope">
                                <span v-html="scope.column.label" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
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
            repeatNum: 1,
            toolbars: [
                { key: 'export', icon: 'ibps-icon-cloud-download', label: '导出模板', type: 'info', hidden: this.readonly },
                { key: 'import', icon: 'ibps-icon-cloud-upload', label: '导入数据', type: 'warning', hidden: this.readonly },
                { key: 'generate', icon: 'ibps-icon-file-text-o', label: '查看实验报告', type: 'success', hidden: true }
            ]
        }
    },
    mounted () {
        this.pageInfo = JSON.parse(JSON.stringify(this.info))
        if (!this.showTemplate && this.$utils.isNotEmpty(this.pageInfo)) {
            this.showTemplate = true
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
        objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
            // 判断当前列是否需要进行同值合并
            if (column.merge) {
                const firstSameRowIndex = this.getFirstSameRowIndex(this.tableData, rowIndex, column.property)
                const firstSameColIndex = this.getFirstSameColIndex(this.tableData, columnIndex, rowIndex)

                return {
                    rowspan: firstSameRowIndex === -1 ? 1 : rowIndex - firstSameRowIndex + 1,
                    colspan: firstSameColIndex === -1 ? 1 : columnIndex - firstSameColIndex + 1
                }
            }
        },
        // 获取行同值合并的起始下标
        getFirstSameRowIndex (data, rowIndex, prop) {
            for (let i = rowIndex; i >= 0; i--) {
                if (data[i][prop] === data[rowIndex][prop]) {
                    return i
                }
            }
            return -1
        },
        // 获取列同值合并的起始下标
        getFirstSameColIndex (data, colIndex, rowIndex) {
            for (let i = colIndex; i >= 0; i--) {
                if (data[rowIndex][i] === data[rowIndex][colIndex]) {
                    return i
                }
            }
            return -1
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
                        this.pageInfo = res.data
                        this.showTemplate = true
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
            }
        }
    }
</style>
