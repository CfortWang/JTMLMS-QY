<template>
    <div class="paper-table">
        <el-table
            ref="elTable"
            :data="tableList"
            border
            stripe
            highlight-current-row
            header-row-class-name="exam-table-header"
            style="width: 100%"
            class="exam-table"
        >
            <el-table-column label="序号" type="index" width="80" />
            <el-table-column prop="bian_zhi_ren_" label="评估人" width="100">
                <template slot-scope="{row}">
                    <ibps-user-selector
                        type="user"
                        :value="row.bian_zhi_ren_"
                        readonly-text="text"
                        :disabled="true"
                        :multiple="false"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="bian_zhi_bu_men_" label="部门" width="140">
                <template slot-scope="{row}">
                    <ibps-user-selector
                        type="position"
                        :value="row.bian_zhi_bu_men_"
                        readonly-text="text"
                        :disabled="true"
                        :multiple="false"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="feng_xian_shu_" label="风险数" width="80" />
            <el-table-column prop="feng_xian_c_" label="风险等级分布情况" />
            <el-table-column prop="shi_fou_guo_shen_" label="识别状态" width="140">
                <template slot-scope="{row}">
                    <el-tag :type="row.shi_fou_guo_shen_==='已完成'?'success':'danger'">{{ row.shi_fou_guo_shen_ }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="200">
                <template slot-scope="{row}">
                    <el-button v-if="isZuZhang" type="primary" size="mini" :disabled="row.shi_fou_guo_shen_!=='已完成' || (params&&params.shi_fou_guo_shen_==='已完成')" @click="goBack(row)">退回</el-button>
                    <el-button type="primary" size="mini" @click="goDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <RiskDetail ref="RiskDetailRef" :cul-ways="culWays" />
    </div>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import RiskDetail from './riskDetail.vue'

export default {
    components: {
        ibpsUserSelector,
        RiskDetail
    },
    props: {
        params: {
            type: Object,
            default: () => ({})
        },
        peopleIds: {
            type: String,
            default: ''
        },
        culWays: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        const { userId } = this.$store.getters
        return {
            tableList: [],
            detail: [],
            isZuZhang: false,
            userId: userId
        }
    },
    watch: {
        peopleIds: {
            handler (val) {
                this.getPeopleList()
            }
            // immediate: true
        }
    },
    mounted () {
        this.getPeopleList()
    },
    methods: {
        // 获取人员部门
        getPersonPosition (id) {
            const userList = this.$store.getters.userList
            const bianzhiUserid = userList.find(i => i.userId === id)
            if (bianzhiUserid) {
                return bianzhiUserid.positionId
            }
        },
        getPersonStatus (id) {
            const tempList = this.detail.filter(i => i.bian_zhi_ren_ === id)
            if (tempList.length) {
                return tempList.every(i => i.shi_fou_guo_shen_ === '已完成') ? '已完成' : '未完成'
            } else {
                return '未完成'
            }
        },
        getRiskCount (id) {
            const tempList = this.detail.filter(i => i.bian_zhi_ren_ === id)
            if (tempList.length) return tempList.length
        },
        getRiskCategory (id) {
            const tempList = this.detail.filter(i => i.bian_zhi_ren_ === id)
            if (tempList.length) {
                const myMap = new Map()
                tempList.forEach(item => {
                    const category = item.feng_xian_deng_ji
                    if (!myMap.has(category)) {
                        myMap.set(category, 0)
                    }
                    myMap.set(category, myMap.get(category) + 1)
                })
                let result = ''
                myMap.forEach((value, key) => {
                    result += `${key}：${value || 0}；`
                })
                return result
            }
        },
        async getPeopleList () {
            // console.log('zi', data)
            // this.tableList = data
            this.isZuZhang = this.userId === this.params.zu_chang_id_
            if (this.peopleIds) {
                // const sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}'`
                const { variables: { data }} = await this.$common.request('query', {
                    key: 'getFxsbpgb2ByPid',
                    params: [this.params.id_]
                })
                this.detail = data
                // console.log(data)
                const people = this.peopleIds.split(',')
                if (people.length > 0) {
                    this.tableList = people.map(item => {
                        return {
                            bian_zhi_ren_: item,
                            bian_zhi_bu_men_: this.detail.find(i => i.bian_zhi_ren_ === item)?.bian_zhi_bu_men_ || this.getPersonPosition(item),
                            shi_fou_guo_shen_: this.getPersonStatus(item),
                            feng_xian_shu_: this.getRiskCount(item),
                            feng_xian_c_: this.getRiskCategory(item)
                        }
                    })
                }
            }
        },
        goDetail (row) {
            this.$refs.RiskDetailRef.open(this.params, row)
        },
        goBack (row) {
            this.$confirm('退回操作后评估人可再次修改识别项，是否继续?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const params = {
                    tableName: 't_fxsbpgb2',
                    updList: [{
                        where: {
                            bian_zhi_ren_: row.bian_zhi_ren_,
                            parent_id_: this.params.id_
                        },
                        param: {
                            shi_fou_guo_shen_: '编制中'
                        }
                    }]
                }
                console.log(params)
                await this.$common.request('update', params)
                // 发消息给评估人退回消息
                await this.$common.sendMsg({
                    subject: '风险评估与措施表单退回提醒',
                    content: `您有一份评估与措施表单已退回，请前往-风险控制-风险评估与措施页面重新提交，计划编号：${this.params.ji_hua_bian_hao_}，组长：${this.params.zu_chang_}。`,
                    receiverId: row.bian_zhi_ren_,
                    canreplay: '0',
                    skipTypeMsg: JSON.stringify({
                        skipType: 3,
                        pathInfo: '/tygl/fxkzV2/fxpgycslb' // 路由
                    })
                })
                console.log('退回提醒成功')
                console.log('退回成功')
                this.$message({
                    type: 'success',
                    message: '退回成功!'
                })
                this.$emit('goBack')
            }).catch(() => {

            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
