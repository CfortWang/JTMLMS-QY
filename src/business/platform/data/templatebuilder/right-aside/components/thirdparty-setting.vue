<template>
  <div class="panel panel-default">
    <div class="panel-heading">接口数据参数处理</div>
    <div class="panel-body">
      <el-form
        size="mini"
        label-position="top"
        @submit.native.prevent
      >
        <el-form-item>
          <template slot="label">输入参数数据处理：</template>
          <el-input
            v-model="attrs.input_value"
            type="textarea"
            @input="(value)=>handleData('input_value',value)"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">输出参数数据处理:</template>
          <el-input
            v-model="attrs.output_value"
            type="textarea"
            @input="(value)=>handleData('output_value',value)"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {
      attrs: {
        input_value: '',
        output_value: ''
      }
    }
  },
  watch: {
    'data.attrs': {
      handler: function(val, oldVal) {
        this.attrs = this.data.attrs || {}
      },
      immediate: true
    }
  },
  methods: {
    handleData(key, value) {
      this.$emit('input', key, value)
    }
  }
}
</script>
