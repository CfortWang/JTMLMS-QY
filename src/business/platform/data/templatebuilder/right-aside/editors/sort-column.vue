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
            <!-- <el-switch
                v-model="formData.direction"
                active-text="降序"
                inactive-text="升序"
                active-value="desc"
                inactive-value="asc"
            /> -->
            <el-radio-group v-model="formData.direction">
                <el-radio label="desc">降序</el-radio>
                <el-radio label="asc">升序</el-radio>
                <el-radio label="custom">指定字段值排序</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.direction === 'custom'" prop="fieldValue">
            <div slot="label">指定值排序<ibps-help content="值为字段排序，标签为字段值" /></div>
            <field-options v-model="formData.fieldValue" />
        </el-form-item>
    </el-form>
</template>
<script>

export default {
    components: {
        FieldOptions: () => import('@/business/platform/data/components/field/options')
    },
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
                    val.fieldValue = val.direction === 'custom'
                        ? val.fieldValue?.map((item, index) => ({ val: index + 1, label: item }))
                        : undefined
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
