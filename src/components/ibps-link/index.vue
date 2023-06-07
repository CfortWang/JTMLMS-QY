<template>
  <div ref="link">
<!--    <el-link
      v-if="showType === 'link'&&show"
      :underline="underline"
      :icon="icon"
      :disabled="disabled"
      :type="type"
      @click.native="click"
    >{{ showText }}</el-link>
 -->
 <div v-if="showType === 'link'&&iframeShow" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
    <iframe
      v-if="showType === 'link'&&iframeShow"
      :height="height-50"
      width="100%"
      :src="iframeUrl"
      frameborder="0"
      scrolling="no"
    />
    </div>

    <el-button
      v-else-if="showType === 'button'&&show"
      :icon="icon"
      :disabled="disabled"
      :type="type"
      @click.native="click"
    >{{ showText }}</el-button>
    <!-- 弹窗模式 -->
    <custom-dialog
      ref="userDialog"
      :visible="openDialog"
      :data="formData"
      :components="customComponents"
      @close="visible => openDialog = visible"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import { getScriptValue } from '@/api/platform/form/common.js'
import customDialog from './dialog'
export default {
  name: 'ibps-hyperlink',
  components: {
    customDialog
  },
  props: {
    previewEntrance: {
      type: Boolean,
      default: false
    },
    showType: { // 是按钮还是文本
      type: String,
      default: 'link',
      validator: function(value) {
        return ['link', 'button'].indexOf(value) !== -1
      }
    },
    formData: {
      type: Object
    },
    text: {
      type: String
    },
    textJavascript: {
      type: String
    },
    linkType: { // 打开链接的类型
      type: String,
      default: 'fixed',
      validator: function(value) { // fixed 固定值; dynamic groovy脚本; javascript js 脚本
        return ['fixed', 'dynamic', 'javascript'].indexOf(value) !== -1
      }
    },
    textType: { // 文本展示的类型
      type: String,
      default: 'fixed',
      validator: function(value) { // fixed 固定值; dynamic groovy脚本; javascript js 脚本
        return ['fixed', 'dynamic', 'javascript'].indexOf(value) !== -1
      }
    },
    link: {
      type: String
    },
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // href: {
    //   type: String
    // },
    icon: {
      type: String
    },
    isNewTab: { // 新开窗口还是弹框显示
      type: Boolean,
      default: true
    },
    beforeClick: { // 方法参数（ linkData, text, cb） cb 是回调函数
      type: Function
    },
    afterClick: {
      type: Function
    }
  },
  data() {
    return {
      linkData: '',
      showText: this.text || '暂无数据',
      openType: '',
      openDialog: false,
      show: true,
      iframeUrl:'',
      iframeShow:false,
      height:document.documentElement.clientHeight,
      customComponents: {}
    }
  },

  watch: {
    textType: {
      handler: function(val) {
        if (!this.previewEntrance) return
        // this.showText = ''
        this.setVal(val, 'text', this.textJavascript)
      },
      immediate: true
    },
    linkType: {
      handler: function(val) {
        if (!this.previewEntrance) return
        setTimeout(()=>{
                 this.setVal(val, 'link', this.link);
                }, 100);
      },
      immediate: true
    }
  },
  methods: {
    /**
     * val 属性的值
     * prop [link]
     */
    setVal(val, prop, script, motion) {
      if (val === 'fixed') {
        this.showText = this.text || ''
      } else if (val === 'dynamic') {
        this.runGroovy(prop, script)
      } else if (val === 'javascript') {
        this.runScript(prop, script, motion)
      }
    },
    runScript(prop, scrip, motion) {
      var formData = this.formData
      const options = {
        formData: formData,
        request: request,
        router: this.$router,
        message: this.$message,
        link: this,
        reportPash:this.$reportPash,
        reportPashs:this.$reportPashs,
      }
      if (this.$utils.isEmpty(scrip)) return
      const promise = new window.Promise((resolve, reject) => {
        new Function('options', 'resolve', scrip)(options, resolve)
      })
      promise.then(result => {
        /* 后补 ，直接打开ifrom*/
        if(this.showType === 'link'){
         this.iframeUrl = result[0].logic.split('url:"')[1].split('"')[0]
         this.iframeShow = true
          return
        }
        if (this.$utils.isEmpty(result)) {
          this.showText = '暂无数据'
          return
        }
        options.result = result
        if (prop === 'text') {
          this.showText = result || '暂无数据'
        } else {
          result.formData = formData
          this.linkData = result || ''
          if (result.constructor === Object && result.openType && this.showType === 'link' && motion === 'click') {
            switch (result.openType) {
              case 'dialog':
                this.customComponents = result
                this.openDialog = true
                break
              case 'url':
                window.open(result.url)
                break
              case 'tab':
                this.$router.push(result.url)
                break
              default:
                break
            }
          } else if (this.showType === 'button') {
            if (result.constructor === Array) {
              const promise = new window.Promise((resolve, reject) => {
                result.forEach(item => {
                  if (item.event === 'beforeSubmit' && motion !== 'click') {
                    new Function('options', 'resolve', item.logic)(options, resolve)
                  } else if (item.event === 'afterSubmit' && motion === 'click') {
                    new Function('options', 'resolve', item.logic)(options, resolve)
                  }
                })
              })
              promise.then(res => {
                this.conditionalExecution(res.constructor === Object && res.openType, res, 'openType')
              })
            } else {
              this.$message({
                message: '请按规定脚本格式填写脚本',
                type: 'warning'
              })
            }
          }
        }
      })
    },
    conditionalExecution(condition, res, key) {
      if (condition) {
        switch (res[key]) {
          case 'dialog':
            this.customComponents = res
            this.openDialog = true
            break
          case 'url':
            window.open(res.url)
            break
          case 'tab':
            this.$router.push(res.url)
            break
          default:
            break
        }
      }
    },
    // TODO: 待完善
    runGroovy(prop, scrip) {
      var formData = this.formData
      const str = JSON.parse(JSON.stringify(scrip))
      const arr = []
      const vars = {}
      for (var i in formData.models) {
        if (str.indexOf(i) !== -1) {
          arr.push(str.substring(str.indexOf(i), str.indexOf(i) + i.length))
        }
      }
      arr.forEach(a => {
        vars[a] = formData.models[a]
      })
      if (this.$utils.isNotEmpty(scrip)) {
        getScriptValue({
          script: scrip,
          vars: JSON.stringify(vars) || ''
        }).then(res => {
          this[scrip + 'Data'] = res.content
          if (prop === 'text') {
            this.showText = res.data || '暂无数据'
          }
          this.$message({
            showClose: true,
            message: '动态脚本执行成功！',
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    click() {
      this.setVal(this.linkType, 'link', this.link, 'click')
    }
  }
}
</script>
