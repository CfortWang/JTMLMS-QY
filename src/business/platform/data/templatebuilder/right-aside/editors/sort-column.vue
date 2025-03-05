<template>
    <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="120px"
        size="mini"
        class="template-result-column"
        @submit.native.prevent
    >
        <el-form-item label="显示名称" prop="name">
            <el-input v-model="formData.label" placeholder="显示名称" />
        </el-form-item>
        <!-- 默认显示字段标识 原显示条件: v-if="datasetType === 'thirdparty'"-->
        <el-form-item label="字段标识" prop="name">
            <el-input v-model="formData.name" placeholder="字段标识" readonly disabled />
        </el-form-item>
        <el-form-item label="排序">
            <el-switch
                v-model="formData.direction"
                active-text="降序"
                inactive-text="升序"
                active-value="desc"
                inactive-value="asc"
            />
        </el-form-item>

    </el-form>
</template>
<script>

export default {
    props: {
        data: {
            type: Object
        },
        datasetType: {
            type: String,
            default: 'table'
        }
    },
    data () {
        return {
            formName: 'form',
            formData: {},
            rules: {
                name: [{ required: true, message: this.$t('validate.required') }],
                label: [{ required: true, message: this.$t('validate.required') }]
            }
        }
    },
    watch: {
        data: {
            handler (val) {
                if (val) {
                    this.formData = val
                }
            },
            immediate: true
        }
    },
    methods: {
        // 获取表单数据
        getFormData (callback) {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    callback(this.formData)
                } else {
                    callback()
                }
            })
        }
    }
}
</script>

<style lang="scss">
.template-result-column {
    .el-select {
        width:100%;
    }
}
</style>
