<template>
  <div class="panel panel-default">
    <div class="panel-heading">开关设置</div>
    <div class="panel-body">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <td width="30%">类型</td>
            <td width="35%">关闭状态</td>
            <td width="35%">打开状态</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>存储值</td>
            <td><el-input v-model="fieldOptions.inactive_value" placeholder="关闭时的值" /></td>
            <td><el-input v-model="fieldOptions.active_value" placeholder="打开时的值" /></td>
          </tr>
          <tr>
            <td>文字描述</td>
            <td><el-input v-model="fieldOptions.inactive_text" placeholder="文字描述" /></td>
            <td><el-input v-model="fieldOptions.active_text" placeholder="文字描述" /></td>
          </tr>
          <tr>
            <td>背景色</td>
            <td><el-color-picker v-model="fieldOptions.inactive_color" :predefine="predefineColors" /></td>
            <td><el-color-picker v-model="fieldOptions.active_color" :predefine="predefineColors" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      predefineColors: [
        '#409EFF',
        '#C0CCDA',
        '#FF4500',
        '#FF8C00',
        '#FFD700',
        '#90EE90',
        '#00CED1',
        '#1E90FF',
        '#C71585'
      ]
    }
  }
}
</script>
