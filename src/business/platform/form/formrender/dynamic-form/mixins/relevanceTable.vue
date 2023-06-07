<template>
  <div>
    <ul style="padding: 0px;margin: 0px;">
      <li v-for="el in list" class ="tableClazz" @click="openDataTemplate(el)" >
        <el-tag>
          {{el.name}}
        </el-tag>
      </li>
    </ul>
  </div>
</template>

<script>
  import $dialog from '@/utils/dialog'
  export default {
    props:{
      list:{ //传入的开启对话框数组
          type: Array,
        },
      form:{ //当前表单示例
          type: Object,
          default:{}
        },
    },
    data() {
      return {
      }
    },
  methods: {
    openDataTemplate(el) {
      this.openDataTemplateDialog(this.form, {
        title: el.name,
        templateId: el.templateId,
        dynamicParams:el.filter,
      })
    },
   openDataTemplateDialog(form, { title, templateId, dynamicParams }) {
      // 弹窗打开
      $dialog({
         components:{
           templateList: () => import ('@/views/platform/data/dataTemplate/template-list.vue')
           },
        data() {
          return {
            // 自定义高度
            height: document.body.clientHeight - 120,
            // 要打开的数据模版id
            templateId: templateId,
            // 用于过滤的动态参数
            dynamicParams: dynamicParams
          }
        },
        template: '<template-list :template-id="templateId" :height="height" :dynamic-params="dynamicParams" />'
      }, {
        dialog: {
          appendToBody: true,
          width: '70%',
          center: true,
          title: title
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
  },
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
