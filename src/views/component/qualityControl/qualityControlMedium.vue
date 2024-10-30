<template>
    <div class="quality-control-medium">
        <el-table :data="forms">
            <el-table-column label="菌株名称" prop="junZhuMingCheng" />
            <el-table-column label="菌株编号" prop="bianHao" />
            <el-table-column label="生长情况" width="200" prop="szqk">
                <template slot-scope="{row}">
                    <el-radio-group v-model="row.szqk" :disabled="readonly">
                        <el-radio label="1">符合</el-radio>
                        <el-radio label="2">不符合</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column label="质控结果" width="200" prop="zkjg">
                <template slot-scope="{row}">
                    <el-radio-group v-model="row.zkjg" v-removeAriaHidden :disabled="readonly">
                        <el-radio label="1">在控</el-radio>
                        <el-radio label="2">失控</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column label="预期生长情况" prop="yQSCQingKuang" />
            <el-table-column
                v-if="!readonly"
                label="操作"
                width="100"
            >
                <template slot-scope="scope">
                    <el-button type="text" size="small" style="color:red;" @click="handleDelete(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            forms: [],
            isFirst: true
        }
    },
    watch: {
        formData: {
            handler (val) {
                if (val.lieBiaoShuJu && this.isFirst) {
                    this.isFirst = false
                    const data = JSON.parse(val.lieBiaoShuJu)
                    if (!val.id) {
                        data.forEach(item => {
                            item.szqk = '1'
                            item.zkjg = '1'
                        })
                        this.$emit('change-data', 'lieBiaoShuJu', JSON.stringify(val))
                    }
                    this.forms = data
                }
            },
            deep: true,
            immediate: true
        },
        'formData.piHao': {
            handler (val) {
                if (this.forms.length > 0) {
                    const data = JSON.parse(JSON.stringify(this.forms))
                    data.forEach(item => {
                        item.wai_guan_jian_cha = this.formData.waiGuanJianCha
                        item.wu_jun_shi_yan_ = this.formData.wuJunShiYan
                        item.pei_yang_ji_ = this.formData.peiYangJi
                        item.pi_hao_ = val
                        item.you_xiao_qi_ = this.formData.youXiaoQi
                    })
                    this.$emit('change-data', 'lieBiaoShuJu', JSON.stringify(data))
                }
            }
        },
        'formData.youXiaoQi': {
            handler (val) {
                if (this.forms.length > 0) {
                    const data = JSON.parse(JSON.stringify(this.forms))
                    data.forEach(item => {
                        item.wai_guan_jian_cha = this.formData.waiGuanJianCha
                        item.wu_jun_shi_yan_ = this.formData.wuJunShiYan
                        item.pei_yang_ji_ = this.formData.peiYangJi
                        item.pi_hao_ = this.formData.piHao
                        item.you_xiao_qi_ = val
                    })
                    this.$emit('change-data', 'lieBiaoShuJu', JSON.stringify(data))
                }
            }
        },
        forms: {
            handler (val) {
                const data = JSON.parse(JSON.stringify(val))
                data.forEach(item => {
                    item.wai_guan_jian_cha = this.formData.waiGuanJianCha
                    item.wu_jun_shi_yan_ = this.formData.wuJunShiYan
                    item.pei_yang_ji_ = this.formData.peiYangJi
                    item.pi_hao_ = this.formData.piHao
                    item.you_xiao_qi_ = this.formData.youXiaoQi
                })
                this.$emit('change-data', 'lieBiaoShuJu', JSON.stringify(data))
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleDelete (index) {
            this.$confirm('是否删除该条数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.forms.length === 1) {
                    this.$message.warning('删除失败，培养基菌株不能为空!')
                } else {
                    this.forms.splice(index, 1)
                }
            })
        }
    }
}
</script>

<style>

</style>
