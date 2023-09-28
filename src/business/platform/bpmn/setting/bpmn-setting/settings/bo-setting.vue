<template>
    <div class="panel-body">
        <el-form v-model="bo" label-width="100px" @submit.native.prevent>
            <el-form-item label="保存方式：">
                <el-radio-group v-model="bo.saveMode" :disabled="disabled">
                    <el-radio label="table">业务表</el-radio>
                    <el-radio label="instance">实例表</el-radio>
                </el-radio-group>

            </el-form-item>
            <el-form-item label="绑定对象：">
                <bo-def-selector
                    v-model="bo.code"
                    :version="bo.version"
                    :disabled="disabled"
                    value-key="code"
                    @change="changeBo"
                />
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { findTreeData } from '@/api/platform/bo/boDef'
import { mapActions } from 'vuex'
import BoDefSelector from '@/business/platform/bo/def/selector'

export default {
    components: {
        BoDefSelector
    },
    props: {
        data: {
            type: Object
        },
        hasCallActivity: {
            type: Boolean,
            default: false
        },
        parentDefKey: String // 父类key
    },
    data () {
        return {
            oldCode: '',
            init: false
        }
    },
    computed: {
        bo () {
            return this.data
        },
        disabled () {
            return this.$utils.isNotEmpty(this.parentDefKey)
        }
    },
    watch: {
        'bo.code' (val, oldVal) {
            if (val !== oldVal && !this.init) {
                this.init = true
                this.oldCode = val
            }
            this.setBoData(val)
        }
    },
    methods: {
        ...mapActions({
            setBoDefData: 'ibps/bpmn/setBoDefData'
        }),
        changeBo (data) {
            this.bo.name = data ? data.name : ''
            this.bo.version = data ? data.version : ''
            const code = data ? data.code : ''
            if (code !== this.oldCode) {
                this.init = false
                // 有子流程节点提示
                if (this.hasCallActivity) {
                    this.$alert('业务对象发生变化，请注意修改外部子流程配置，否则无法正常工作！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                }
                // 清空表单
                this.$emit('clean')
            }
        },
        setBoData (code) {
            if (this.$utils.isEmpty(code)) {
                this.setBoDefData([])
                return
            }
            findTreeData({ code: code }).then(response => {
                this.setBoDefData(response.data)
            }).catch(() => {
            })
        }

    }
}
</script>
