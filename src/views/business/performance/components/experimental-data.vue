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
                    1
                </div>
                <el-empty v-else description="暂无数据，请导出模板填写后导入" />
            </div>
        </div>
        <import-table
            :visible="showImportTable"
            title="导入"
            @close="visible => (showImportTable = visible)"
            @action-event="handleImport"
        />
    </div>
</template>
<script>
import IbpsImport from '@/plugins/import'
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
            toolbars: [
                // { key: 'generate', icon: 'ibps-icon-plus', label: '生成模板', type: 'success', hidden: this.readonly },
                { key: 'export', icon: 'ibps-icon-cloud-download', label: '导出模板', type: 'info', hidden: this.readonly },
                { key: 'import', icon: 'ibps-icon-cloud-upload', label: '导入数据', type: 'warning', hidden: this.readonly }
            ]
        }
    },
    watch: {
        info: {
            handler (val, oldVal) {
                this.pageInfo = val
            },
            immediate: true,
            deep: true
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
                    this.handleImport2()
                    break
            }
        },
        handleGenerate () {
            this.showTemplate = true
            this.$nextTick(() => {
                this.$refs.template.init()
            })
        },
        handleExport () {
            exportTemplate({
                id: this.info.id || '123456',
                name: this.info.fangAnLeiXing || '精密度'
            }).then(res => {
                ActionUtils.download(res.data, '实验数据模板.xlsx')
            })
        },
        handleImport (file, options) {
            this.loading = false
            IbpsImport.xlsx(file, options).then(res => {
                console.log(res)
            })
        },
        handleImport2 () {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.xlsx'
            input.onchange = event => {
                const file = event.target.files[0]
                const reader = new FileReader()
                reader.onload = event => {
                    const data = new FormData()
                    data.append('id', '123456')
                    data.append('name', '线性范围')
                    data.append('applyFiles', file)
                    importTemplate(data).then(res => {
                        if (res.state === 200) {
                            this.$message.success('实验数据导入成功')
                        } else {
                            this.$message.error(res.message)
                        }
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
                height: 100%;
                overflow: auto;
            }
        }
    }
</style>
