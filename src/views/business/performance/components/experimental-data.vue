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
            </div>
        </div>
    </div>
</template>
<script>
export default {
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
        handleActionEvent ({ key }) {
            switch (key) {
                case 'generate':
                    this.handleGenerate()
                    break
                case 'export':
                    this.handleExport()
                    break
                case 'import':
                    this.handleImport()
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
            console.log('导出')
        },
        handleImport () {
            console.log('导入')
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
