<template>
    <div class="template-main">
        <el-header :height="'40px'" class="layout-header">
            <div class="layout-header-title">
                模版设计
            </div>
            <div class="layout-tools">
                <el-button type="info" size="mini" icon="el-icon-view" @click="handlePreview()">预览</el-button>
                <el-button type="primary" size="mini" icon="ibps-icon-save" @click="saveTemplate()">保存</el-button>
                <el-button v-if="$utils.isNotEmpty(dataTemplate.id)&&dataTemplate.type!=='dialog'" type="primary" size="mini" icon="ibps-icon-telegram" @click="addMenu()">添加为菜单</el-button>
                <!-- <el-button type="primary" size="mini" icon="ibps-icon-question-circle-o" @click.prevent.stop="guide()">介绍</el-button> -->
                <el-button size="mini" icon="ibps-icon-close" @click="closeDialog()">关闭</el-button>
            </div>
        </el-header>
        <!--标题-->
        <div :class="{selected:selected}" class="template-header">
            <div class="title">{{ dataTemplate.name||'未设置模版标题' }}</div>
        </div>
        <component
            :is="templateType"
            v-if="template"
            :template="template"
            :data-template="dataTemplate"
            @cloumClick="handleCloumClick"
        />
        <!--数据模版预览-动态参数-->
        <dynamic-params-preview
            :visible="dynamicParamsDialogVisible"
            :conditions="conditions"
            @close="visible => dynamicParamsDialogVisible = visible"
            @callback="handleDynamicParams"
        />
        <!--数据模版预览-->
        <data-template-render-preview
            v-if="templateRendererDialogVisible"
            :visible="templateRendererDialogVisible"
            :data="dataTemplate"
            :value="selectedValue"
            :multiple="multiple"
            :label-key="labelKey"
            :dynamic-params="dynamicParams"
            preview
            apply-modle="dataTemplate"
            @close="visible => templateRendererDialogVisible = visible"
            @action-event="handleTemplaterenderActionEvent"
        />
        <!--数据模版预览数据-->
        <data-template-render-preview-data
            :visible="previewDialogVisible"
            :data="previewFormData"
            @close="visible => previewDialogVisible = visible"
        />
        <!-- 添加菜单 -->
        <add-menu
            :visible="addMenuDialogVisible"
            :edit-id="dataTemplate.id"
            @close="visible => addMenuDialogVisible = visible"
        />
    </div>
</template>
<script>
import DataTemplate from './templates'
import PreviewMixin from '@/business/platform/data/templaterender/preview/mixins/preview'

import DynamicParamsPreview from '@/business/platform/data/templaterender/preview/dynamic-params'
import DataTemplateRenderPreview from '@/business/platform/data/templaterender/preview'
import DataTemplateRenderPreviewData from '@/business/platform/data/templaterender/preview/preview-data'

import AddMenu from '@/business/platform/auth/resources/add-menu'

export default {
    components: Object.assign({
        DynamicParamsPreview,
        DataTemplateRenderPreview,
        DataTemplateRenderPreviewData,
        AddMenu
    }, DataTemplate),
    mixins: [PreviewMixin],
    props: {
        data: {
            type: Object
        }
    },
    data () {
        return {
            selected: false,
            addMenuDialogVisible: false
        }
    },
    computed: {
        dataTemplate () {
            return this.data ? this.data : {}
        },
        templateType () {
            if (!this.dataTemplate) {
                return
            }
            let key = ''
            if (this.dataTemplate.type === 'valueSource') {
                key = 'value-source'
            } else {
                if (this.dataTemplate.showType === 'compose') {
                    if (this.dataTemplate.composeType === 'listTree') {
                        key = 'treeList'
                    } else {
                        key = this.dataTemplate.composeType
                    }
                } else {
                    key = this.dataTemplate.showType
                }
            }
            if (this.$utils.isEmpty(key)) { return }
            return 'ibps-data-template-fake-' + key
        },
        template () {
            if (!this.dataTemplate) {
                return
            }
            const templates = this.dataTemplate.templates || []
            if (this.dataTemplate.showType === 'compose') {
                return templates
            } else {
                return templates.length > 0 ? templates[0] : {}
            }
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = val
            },
            immediate: true
        }
    },
    methods: {
        handleCloumClick (value) {
            this.$emit('cloumClick', value)
        },
        closeDialog () {
            this.$emit('close')
        },
        saveTemplate () {
            this.$emit('save')
        },
        addMenu () {
            this.addMenuDialogVisible = true
        },
        handlePreview () {
            this.previewTemplate()
        }
    }
}
</script>
