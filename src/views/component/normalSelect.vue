<template>
    <el-select
        id="normalSelect"
        ref="test"
        v-model="selected"
        filterable
        :multiple="field.field_options.custom_class === 'multiple'"
        :disabled="field.disabled"
        placeholder="请选择"
    >
        <el-option
            v-for="item in options"
            :key="item.val"
            :label="item.label"
            :value="item.val"
        ></el-option>
    </el-select>
</template>

<script>
    export default {
        props: {
            formData: {
                type: Object,
                default: {}
            },
            field: {
                type: Object,
                default: {}
            },
            value: {
                type: String,
                default: ''
            }
        },
        watch: {
            selected(v) {
                this.$emit('change-data', this.field.field_options.component_name, v)
            }
        },
        data() {
            return {
                options: [],
                selected: this.field.field_options.custom_class === 'multiple' ? [] : ''
            }
        }
    }
</script>
