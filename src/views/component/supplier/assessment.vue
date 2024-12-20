<!-- 供应商考核 -->
<template>
    <div class="assessment">
        <div class="table">
            <el-table :data="tableData">
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column label="考核类型" prop="pingJiaLeiXing" />
                <el-table-column label="考核内容" prop="pingJiaNeiRong" />
                <el-table-column label="考核结果" prop="pingJiaJieGuo">
                    <template slot-scope="{row}">
                        <span v-if="readonly || !shiFouGuoShen">{{ row.pingJiaJieGuo }}</span>
                        <el-radio-group v-else v-model="row.pingJiaJieGuo">
                            <el-radio v-for="(item,index) in generateRadio(row)" :key="index" :label="item.label">{{ item.label+(item.score?'('+item.score+')':'') }}</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        formData: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableData: []
        }
    },
    computed: {
        shiFouGuoShen () {
            if (!this.formData.shiFouGuoShen || this.formData.shiFouGuoShen === '已退回' || this.formData.shiFouGuoShen === '已暂存') {
                return true
            }
            return false
        }
    },
    watch: {
        'formData.gyspjbzb': {
            handler (val) {
                if (val && val.length) {
                    // console.log(this.formData)
                    this.tableData = val
                }
            }
        },
        tableData: {
            handler (val) {
                this.$emit('change-data', 'gyspjbzb', val)
            },
            deep: true
        }
    },
    methods: {
        generateRadio (row) {
            const result = []
            // "满意：10；一般：6；不满意：1"
            const t = row.miaoShuHeDeFen?.replace(/;/g, '；').replace(/:/g, '：').replace(/[;；]+$/, '') || '是；否' // 默认值
            const arr = t.split('；')
            arr.forEach(item => {
                const [label, score] = item.split('：')
                result.push({ label, score })
            })
            // console.log('radio', result)
            return result
        }
    }
}
</script>

<style lang="scss" scoped>
.assessment{
    margin-top: 20px;
}
</style>
