<template>
    <div class="item-table">
        <el-table
            v-if="statisItemData[0].ti_xing_==='单选题' || statisItemData[0].ti_xing_==='多选题'"
            ref="elTable"
            :data="tableData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            max-height="400px"
            class="exam-table"
        >
            <el-table-column
                prop="xx"
                label="选项"
                width="100"
            />
            <el-table-column
                prop="xuan_xiang_"
                label="选项内容"
                min-width="200"
            />
            <el-table-column
                prop="xiao_ji_"
                label="小计"
                width="100"
            />
            <el-table-column
                prop="bi_li_"
                label="比例"
                width="100"
            />
        </el-table>

        <el-table
            v-else
            ref="elTable2"
            :data="tableData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            max-height="400px"
            class="exam-table"
        >
            <el-table-column
                type="index"
                label="序号"
                width="50"
            />

            <el-table-column
                prop="hui_da_"
                label="回答"
            />
        </el-table>

    </div>
</template>

<script>
export default {
    props: {
        statisItemData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            // tableData: []
        }
    },
    computed: {
        tableData () {
            let arr = []
            if (this.statisItemData[0].ti_xing_ === '单选题' || this.statisItemData[0].ti_xing_ === '多选题') {
                if (this.statisItemData[0].xuan_xiang_) {
                    let ind = 1
                    const t = JSON.parse(this.statisItemData[0].xuan_xiang_)
                    for (const key in t) {
                        const cnt = this.statisItemData.filter(item => item.da_an_ === key).length
                        arr.push({
                            xx: `选项${ind}`,
                            xuan_xiang_: t[key],
                            xiao_ji_: cnt,
                            bi_li_: (cnt / this.statisItemData.length * 100).toFixed(2) + ' %'
                        })
                        ind++
                    }
                }
            } else {
                arr = this.statisItemData.map(item => ({ hui_da_: item.da_an_ }))
            }
            // console.log('item-arr', arr)

            return arr
        }
    },
    mounted () {
    }

}
</script>
