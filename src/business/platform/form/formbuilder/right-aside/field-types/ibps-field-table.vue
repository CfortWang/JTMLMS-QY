<template>
    <div>
        <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
            <!-- 基本属性 -->
            <editor-base
                :field-item="fieldItem"
                :bo-data="boData"
                :fields="fields"
                types="label,name,desc,display"
            />
            <!-- 表单字段和按钮 -->
            <editor-field-table
                :field-item="fieldItem"
                :fields="fields"
                :bo-data="boData"
                @select="handleSelect"
            />
            <!-- 校验规则 -->
            <editor-rules
                :field-item="fieldItem"
                types="required"
            />
            <!-- 字段权限 -->
            <editor-rights
                :field-item="fieldItem"
            />
            <!-- 布局设置 -->
            <editor-layout
                :field-item="fieldItem"
                types="mode,page,index,summary,summaryMethod,customClass,colWidth"
            />
        </el-form>
    </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
    name: 'ibps-field-table',
    mixins: [typeMixin]
}
</script>
