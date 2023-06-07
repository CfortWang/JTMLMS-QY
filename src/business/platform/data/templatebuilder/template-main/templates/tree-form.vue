<template>
  <div style="padding:4px;">
    <el-input v-model="input" :autosize="{ minRows: 10, maxRows: 11}" type="textarea" readonly resize="none" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '左树右表单'
    }
  }
}
</script>
