<!-- 表单内预览统计页面及记录合资页面 -->
<template>
    <div>
        <ul style="padding: 0px;margin: 0px;">
            <li v-for="(el, index) in staOrRec" :key="index" class="tableClazz" @click="openDataTemplate(el)">
                <!-- 统计页面呈现-->
                <el-tag>
                    {{ el.title }}
                </el-tag>
                <el-popover
                    v-if="el.type =='Statis'"
                    v-model="isShow"
                    width="380"
                    style="margin-left: 90px; padding-left: 100px;"
                    trigger="manual"
                >
                    <span class="el-icon-close" style="float: right;" @click.stop="closePopo" />
                    <template-statis v-if="isShow" static="line" :shows="el.show" />
                </el-popover>
            </li>
        </ul>

    </div>
</template>

<script>
import $dialog from '@/utils/dialog'
import templateStatis from '@/views/statistics/index.vue'
export default {
    components: {
        templateStatis: templateStatis
    },
    props: {
        staOrRec: { // 传入的开启对话框数组
            type: Array
        },
        form: { // 当前表单示例
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            isShow: false
        }
    },
    methods: {
        openDataTemplate (el) {
            if (el.type === 'Record') {
                this.openDataTemplateDialog(this.form, {
                    type: el.type
                })
            } else if (el.type === 'Statis') { // 如果是统计， 则用另外的形式展示组件页面
                this.isShow = true
            } else if (el.type === 'param') { // 如果是统计， 则用另外的形式展示组件页面
                this.openDataTemplateParamDialog(this.form, {
                    type: el.type
                })
            } else {
                alert('当前点击的数据，参数type错误')
            }
        },
        openDataTemplateDialog (form, { type }) {
            // 弹窗打开
            /*
            templateStatis: () => import ('@/views/statistics/index.vue')
            <template-statis v-if="type =='Statis'" static="line" shows="[]" />
            */
            $dialog({
                components: {
                    templateList: () => import ('@/views/platform/bpmn/bpmInstHis/list.vue')
                },
                data () {
                    return {
                        type: type
                    }
                },
                template: `<div style="height:600px;">

                        <template-list v-if="type =='Record'" location="absolute" />

                  </div>`
            }, {
                dialog: {
                    appendToBody: true,
                    width: '80%'
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
        /* 关闭*/
        closePopo () {
            this.isShow = false
        },
        openDataTemplateParamDialog (form, { type }) {
            // 弹窗打开
            /*
            templateStatis: () => import ('@/views/statistics/index.vue')
            <template-statis v-if="type =='Statis'" static="line" shows="[]" />
            */

            $dialog({
                components: {
                    //    templateList: () => import ('@/views/detection/jtsjpz/view.vue'),
                },
                data () {
                    return {
                        type: type
                    }
                },
                template: `<div style="height:600px;">
                        <template-list v-if="type =='param'" location="absolute" />
                        </div>`
            }, {
                dialog: {
                    appendToBody: true,
                    width: '60%'
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
        }
    }
}
</script>

<style>
  .tableClazz{
    cursor: pointer;
    padding: 5px 5px;
    font-size: 12px;
     float: right;
     margin-top: -1.25rem;
  }
</style>
