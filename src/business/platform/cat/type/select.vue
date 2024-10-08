<template>
    <div>
        <template v-if="!readonly">
            <ibps-tree-select
                v-if="treeData"
                v-model="selectData"
                :data="treeData"
                :props="props"
                :node-key="nodeKey"
                :placeholder="placeholder"
                :empty-text="emptyText"
                :clearable="clearable"
                :filterable="filterable"
                :filter-method="filterMethod"
            />
        </template>
        <template v-else>
            <el-tag v-if="$utils.isNotEmpty(value)">
                {{ value|optionsFilter(treeDataOptions,'label') }}
            </el-tag>
        </template>
    </div>
</template>
<script>
import { findTreeData } from '@/api/platform/cat/type'
import TreeUtils from '@/utils/tree'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
    components: {
        IbpsTreeSelect
    },
    props: {
        value: {
            type: [String, Number, Array, Object],
            default: ''
        },
        data: {
            type: Array
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        emptyText: {
            type: String,
            default: '暂无分类'
        },
        readonly: { // 是否只读
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: true
        },
        categoryKey: {
            type: String
        },
        nodeKey: {
            type: String
        },
        filterable: {
            type: Boolean,
            default: false
        },
        filterLabel: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            props: {
                children: 'children',
                label: 'name'
            },
            selectData: this.value,
            treeData: [],
            treeDataOptions: []
        }
    },
    watch: {
        categoryKey: {
            handler (val, oldVal) {
                if (this.$utils.isEmpty(this.data)) {
                    this.loadTreeData()
                } else {
                    this.treeData = JSON.parse(JSON.stringify(this.data)) || []
                }
            },
            immediate: true
        },
        selectData (val, oldVal) {
            this.$emit('input', val)
        },
        value: {
            handler (val, oldVal) {
                this.selectData = val
            },
            immediate: true
        }
    },
    methods: {
        loadTreeData (categoryKey = this.categoryKey) {
            findTreeData({ categoryKey: categoryKey }).then(response => {
                const treeData = response.data.filter((d) => {
                    return d.parentId !== '-1'
                })
                this.treeData = TreeUtils.transformToTreeFormat(treeData)
                this.treeDataOptions = treeData.map(item => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
            }).catch(() => {
            })
        },
        filterMethod (value, data) {
            if (!value || !this.filterLabel) return true
            return data[this.filterLabel].indexOf(value) !== -1
        }
    }
}
</script>
