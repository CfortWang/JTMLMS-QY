<template>
    <div class="all">
        <el-table
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
                prop="xu_hao_"
                label="序号"
                width="50"
            />
            <el-table-column
                prop="ti_gan_"
                label="题干"
                min-width="200"
            />
            <el-table-column
                v-for="(item,index) in xuanXiangCount"
                :key="index"
                :prop="`xuan_xiang_${index+1}`"
                :label="`选项${index+1}`"
                width="100"
            />
        </el-table>

    </div>
</template>

<script>
export default {
    props: {
        statisItemData: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            // tableData: []
        }
    },
    computed: {
        tableData () {
            // console.log('statisItemData', this.statisItemData)
            const arr = []
            let xu_hao_ = 1
            for (const key in this.statisItemData) {
                const val = this.statisItemData[key]
                const obj = {}
                if (val[0].xuan_xiang_) {
                    const t = Object.keys(JSON.parse(val[0].xuan_xiang_)).length
                    for (let i = 1; i <= 8; i++) {
                        if (i <= t) {
                            obj[`xuan_xiang_${i}`] = (val.filter(item => item.da_an_ === String.fromCharCode('A'.charCodeAt() + i - 1)).length / val.length * 100).toFixed(2) + ' %'
                        } else {
                            obj[`xuan_xiang_${i}`] = '/'
                        }
                    }
                }
                if (val[0].ti_xing_ === '单选题' || val[0].ti_xing_ === '多选题') {
                    arr.push({
                        xu_hao_: xu_hao_,
                        ti_gan_: val[0].ti_gan_,
                        ...obj
                    })
                }
                xu_hao_++
            }
            // console.log('arr', arr)
            return arr
        },
        // 计算最长选项
        xuanXiangCount () {
            let ans = 4
            for (const key in this.statisItemData) {
                const val = this.statisItemData[key]
                if (val[0].xuan_xiang_) {
                    const t = JSON.parse(val[0].xuan_xiang_)
                    ans = Math.max(Object.keys(t).length, ans)
                }
            }
            return ans
        }
    },
    mounted () {

    }

}
</script>
