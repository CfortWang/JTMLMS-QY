<!-- 表单内预览统计页面及记录合资页面 -->
<template>
    <div class="relev">
        <div v-for="(el, index) in list" :key="index" class="sin" @click="handleOpen(el)">
            <!-- 统计页面呈现-->
            <el-tag effect="dark" size="small">
                {{ el.title }}
            </el-tag>
            <el-popover
                v-if="el.type =='Statis'"
                v-model="isShow"
                width="380"
                style="margin-left: 90px; padding-left: 100px;"
                trigger="manual"
            >
                <span class="el-icon-close" style="float: right;" @click.stop="closePopover" />
                <template-statis v-if="isShow" static="line" :shows="el.show" />
            </el-popover>
        </div>
    </div>
</template>

<script>
import $dialog from '@/utils/dialog'
import templateStatis from '@/views/statistics/index.vue'

export default {
    components: {
        templateStatis
    },
    props: {
        list: { // 传入的开启对话框数组
            type: Array
        },
        form: { // 当前表单实例
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            isShow: false,
            templateData: {
                Record: {
                    setting: {}
                },
                normal: {
                    setting: {
                        center: true
                    }
                }
            }
        }
    },
    methods: {
        handleOpen (el) {
            if (el.type === 'Statis') {
                this.isShow = true
                return
            }
            this.openDataTemplateDialog(this.form, {
                type: el.type,
                title: el.title,
                templateId: el.templateId,
                dynamicParams: el.filter
            })
        },
        openDataTemplateDialog (form, { type, title, templateId, dynamicParams }) {
            $dialog({
                components: {
                    templateList: type === 'normal' ? () => import ('@/views/platform/data/dataTemplate/template-list.vue') : () => import ('@/views/platform/bpmn/bpmInstHis/list.vue')
                },
                data () {
                    return {
                        height: document.body.clientHeight - 150,
                        type,
                        title,
                        templateId,
                        dynamicParams
                    }
                },
                template: type === 'normal' ? `<template-list v-if="type === 'normal'" :template-id="templateId" :height="height" :dynamic-params="dynamicParams" />` : `<div style="height:600px;"><template-list v-if="type === 'Record'" location="absolute" /></div>`
            }, {
                dialog: {
                    appendToBody: true,
                    width: '80%',
                    ...this.templateData[type].setting
                }
            }, (tpl) => {
                // 关掉自定义浮窗
                form.customComponent = null
                // 打开弹窗
                form.dialogTemplate = tpl
            }).catch((_this) => {
                // 标识为不显示
                _this.visible = false
                // 关掉弹窗
                form.dialogTemplate = null
            })
        },
        closePopover () {
            this.isShow = false
        }
    }
}
</script>

<style lang="less" scoped>
    .relev{
        width: 100%;
        display: flex;
        flex-flow: wrap;
        justify-content: flex-end;
        .sin{
            margin: 5px;
            cursor: pointer;
        }
    }
</style>
