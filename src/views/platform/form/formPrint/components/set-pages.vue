<template>
  <div class="menu-tools-set-pages">
    <div class="title">纸张设置</div>
    <el-form ref="form" class="items" :model="form" :rules="rules" label-position="top" size="mini">
      <el-form-item label="纸张大小" prop="pageSize">
        <el-select v-model="form.pageSize" placeholder="请选择" size="mini" class="form-item-select">
          <el-option
            v-for="item in pageSizeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="form.pageSize === 'auto'" class="inline-form">
        <el-form-item label-width="0" class="inline-form-item" prop="pageWidth">
          <div class="inline-form-item-content">
            <div class="inline-form-label">宽: </div>
            <el-input v-model.number="form.pageWidth" class="inline-form-input" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" class="inline-form-item" prop="pageHeight">
          <div class="inline-form-item-content">
            <div class="inline-form-label">高: </div>
            <el-input v-model.number="form.pageHeight" class="inline-form-input" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="纸张方向" prop="pageDir">
        <el-select v-model="form.pageDir" placeholder="请选择" size="mini" class="form-item-select">
          <el-option
            v-for="item in pageDirOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="页边距" style="margin-bottom:0;" />
      <div class="inline-form">
        <el-form-item label-width="0" class="inline-form-item" prop="pagePaddingTop">
          <div class="inline-form-item-content">
            <div class="inline-form-label">上: </div>
            <el-input v-model.number="form.pagePaddingTop" class="inline-form-input" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" class="inline-form-item" prop="pagePaddingBottom">
          <div class="inline-form-item-content">
            <div class="inline-form-label">下: </div>
            <el-input v-model.number="form.pagePaddingBottom" class="inline-form-input" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
      </div>
      <div class="inline-form">
        <el-form-item label-width="0" class="inline-form-item" prop="pagePaddingLeft">
          <div class="inline-form-item-content">
            <div class="inline-form-label">左: </div>
            <el-input v-model.number="form.pagePaddingLeft" class="inline-form-input" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" class="inline-form-item" prop="pagePaddingRight">
          <div class="inline-form-item-content">
            <div class="inline-form-label">右: </div>
            <el-input v-model.number="form.pagePaddingRight" class="inline-form-input" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object
    },
    design: {
      type: Number,
      default: 96
    }
  },
  data() {
    const reg = /^\d+(\.\d+)?$/
    const isNumber = (rule, value, callback) => {
      if (!reg.test(value)) {
        return callback(new Error())
      }
      return callback()
    }
    return {
      pageSizeOptions: [{ value: 'A4', label: 'A4' }, { value: 'A3', label: 'A3' }, { value: 'A5', label: 'A5' }, { value: 'B5', label: 'B5' }, { value: 'auto', label: '自定义' }],
      pageDirOptions: [{ value: 'portrait', label: '纵向' }, { value: 'landscape', label: '横向' }],
      rules: {
        pageWidth: [
          { required: true, message: '请输入宽度', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        pageHeight: [
          { required: true, message: '请输入宽度', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        pagePaddingTop: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        pagePaddingBottom: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],

        pagePaddingLeft: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        pagePaddingRight: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ]
      },
      form: { },
      PAGE_SIZE: {
        A4: {
          width: 210,
          height: 297
        },
        A3: {
          width: 297,
          height: 420
        },
        A5: {
          width: 148,
          height: 210
        },
        B5: {
          width: 176,
          height: 250
        }
      }
    }
  },
  computed: {
    pageSize() {
      const size = this.PAGE_SIZE[this.form.size]
      let width = 0
      let height = 0
      if (size) {
        width = Math.ceil(size.width / 25.4 * this.design)
        height = Math.ceil(size.height / 25.4 * this.design)
      } else {
        width = Math.ceil((this.form.width ? this.form.width : 0) / 25.4 * this.design)
        height = Math.ceil((this.form.height ? this.form.height : 0) / 25.4 * this.design)
      }

      const pageSize = {
        width: this.form.orientation === 'portrait' ? width : height,
        height: this.form.orientation === 'portrait' ? height : width
      }
      const form = {
        top: this.form.top,
        right: this.form.right,
        left: this.form.left,
        bottom: this.form.bottom
      }
      const formatPageValue = this._formatPageValue(form)

      pageSize.width = Math.ceil(pageSize.width - formatPageValue.right - formatPageValue.left)
      pageSize.height = Math.ceil(pageSize.height - formatPageValue.top - formatPageValue.bottom)

      return pageSize
    }
  },
  watch: {
    value: {
      handler(val) {
        this.form = val
      },
      immediate: true,
      deep: true
    },
    form: {
      handler(val) {
        this.$emit('callback', val)
      },
      deep: true
    }
  },
  methods: {
    checkForm() {
      return this.$refs.form.validate()
    }
  }
}
</script>
<style  lang="scss">
.menu-tools-set-pages{
  .title{
    color: #7C7C7C;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .form-item-select{
    width: 100%;
  }
  .items{
    font-size: 12px;
    .item{
      &:not(:last-of-type){
        margin-bottom: 8px;
      }
    }
    .label{
      margin-bottom: 6px;
    }
  }
  .inline-form{
    display: flex;
    align-items: center;
    .inline-form-item{
      flex: 1;
      &:nth-of-type(2){
        margin-left: 30px;
      }
    }
    .inline-form-item-content{
      display: flex;
      align-items: center;
      .inline-form-input{
        margin: 0 8px;
      }
      .inline-form-unit{
        min-width: 30px;
      }
    }
  }
}
</style>
