<template>
    <div class="panel panel-default">
        <div class="panel-heading">列表</div>
        <div class="panel-body">
            <el-form
                size="mini"
                label-width="120px"
                @submit.native.prevent
            >
                <el-form-item>
                    <template slot="label">初始化是否查询:</template>
                    <el-switch
                        v-model="attrs.init_query"
                        active-value="Y"
                        inactive-value="N"
                        @change="(value)=>handleData('init_query',value)"
                    />
                </el-form-item>
                <el-form-item>
                    <template slot="label">是否显示序号:</template>
                    <el-switch
                        v-model="attrs.indexRow"
                        :active-value="true"
                        :inactive-value="false"
                        @change="(value)=>handleData('index',value)"
                    />
                </el-form-item>
                <el-form-item>
                    <template slot="label">是否分页:</template>
                    <el-switch
                        v-model="attrs.need_page"
                        active-value="Y"
                        inactive-value="N"
                        @change="(value)=>handleData('need_page',value)"
                    />
                </el-form-item>
                <el-form-item v-if="attrs.need_page==='Y'">
                    <template slot="label">分页大小:</template>
                    <el-select
                        v-model="attrs.page_size"
                        placeholder="分页大小"
                        @change="(value)=>handleData('page_size',value)"
                    >
                        <el-option
                            v-for="item in pageSizeOptions"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <template slot="label">表头提示语:</template>
                    <!-- <el-switch
                        v-model="attrs.display_field"
                        active-value="Y"
                        inactive-value="N"
                        @change="(value)=>handleData('display_field',value)"
                    /> -->
                    <el-input
                        v-model="attrs.display_field"
                        placeholder="输入表头提示语"
                        size="mini"
                        clearable
                        @change="(value)=>handleData('display_field',value)"
                    />
                </el-form-item>

                <el-form-item>
                    <template slot="label">表单名称:</template>
                    <el-input
                        v-model="attrs.form_name"
                        placeholder="输入表单名称"
                        size="mini"
                        clearable
                        @change="(value)=>handleData('form_name',value)"
                    />
                </el-form-item>

                <el-form-item>
                    <template slot="label">管理列主题:</template>
                    <el-switch
                        v-model="attrs.manage_effect"
                        active-value="Y"
                        inactive-value="N"
                        active-text="按钮"
                        inactive-text="默认"
                        @change="(value)=>handleData('manage_effect',value)"
                    />
                    <!-- <el-input
                        v-model="attrs.manage_effect"
                        placeholder="输入管理主题"
                        size="mini"
                        clearable
                        @change="(value)=>handleData('manage_effect',value)"
                    /> -->
                </el-form-item>
                <el-form-item>
                    <template slot="label">管理列宽:</template>
                    <el-input
                        v-model="attrs.col_width"
                        placeholder="请输入管理列宽（数值）"
                        size="mini"
                        clearable
                        @change="(value)=>handleData('col_width',value)"
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
    data () {
        return {
            attrs: {},
            pageSizeOptions: [10, 20, 50, 100]
        }
    },
    watch: {
        'data.attrs': {
            handler: function (val, oldVal) {
                this.attrs = this.data.attrs || {}
            },
            immediate: true
        }
    },
    methods: {
        handleData (key, value) {
            this.$emit('input', key, value)
        }
    }
}
</script>
