<template>
    <div>
        <el-dialog
            title="签到信息"
            center
            :visible.sync="dialogVisible"
            width="70%"
            append-to-body
            top
            style="margin-top:100px"
            :close-on-click-modal="false"
            :show-close="true"
            :close-on-press-escape="false"
        >
            <div class="contain">
                <div class="selector">
                    <div>
                        签到状态：
                        <el-select v-model="selectItem" placeholder="请选择" @change="onSelectorChange">
                            <el-option
                                v-for="item in ['全部','已签到','未签到','已补签']"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </div>
                    <div class="rate">
                        <div>
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                :content="`应到：${calRate.total}人，实到：${calRate.signIn}人`"
                            >
                                <div slot="reference" style="cursor: pointer;">出勤率：{{ calRate.signInRate }}%</div>
                            </el-popover>
                        </div>
                        <div>
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                :content="`应到：${calRate.total}人，未到：${calRate.noSignIn}人`"
                            >
                                <div slot="reference" style="cursor: pointer;">缺勤率：{{ calRate.noSignInRate }}%</div>
                            </el-popover>
                        </div>
                        <div>
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                :content="`应到：${calRate.total}人，补签：${calRate.laterSignIn}人`"
                            >
                                <div slot="reference" style="cursor: pointer;">补签率：{{ calRate.laterSignInRate }}%</div>
                            </el-popover>
                        </div>
                    </div>

                </div>
                <div class="table">
                    <el-table :data="showPaperList" row-key="ren_yuan_id_">
                        <el-table-column
                            prop=""
                            label="序号"
                            type="index"
                            width="100"
                            :index="showIndex"
                        />
                        <el-table-column
                            prop="ren_yuan_id_"
                            label="应参训人员"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <ibps-user-selector
                                    type="user"
                                    :value="row.ren_yuan_id_"
                                    readonly-text="text"
                                    :disabled="true"
                                    :multiple="true"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="签到状态"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-tag :type="showType(row)">{{ row.status }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="qian_dao_shi_jian"
                            label="签到时间"
                            align="center"
                        />
                    </el-table>
                </div>

                <el-pagination
                    style="margin-top: 5px; padding-bottom: 10px"
                    :current-page="pagination.currentPage"
                    :page-sizes="[10, 20,30, 50]"
                    :page-size="pagination.pageSize"
                    layout="prev,pager,next,jumper,sizes,->,total"
                    :total="categoryList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="close">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
export default {
    components: {
        ibpsUserSelector
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            pagination: {
                pageSize: 10,
                currentPage: 1
            },

            dialogVisible: true,
            tableList: [],
            selectItem: '全部'
        }
    },
    computed: {
        // 计算各种统计率
        calRate () {
            const total = this.tableList.length
            let noSignIn = 0
            let signIn = 0
            let laterSignIn = 0
            this.tableList.forEach(item => {
                if (item.status === '已签到') signIn++
                if (item.status === '未签到') noSignIn++
                if (item.status === '已补签') laterSignIn++
            })

            const signInRate = signIn / total * 100
            const noSignInRate = noSignIn / total * 100
            const laterSignInRate = laterSignIn / total * 100
            return {
                total,
                signIn,
                noSignIn,
                laterSignIn,
                signInRate: signInRate.toFixed(2),
                noSignInRate: noSignInRate.toFixed(2),
                laterSignInRate: laterSignInRate.toFixed(2)
            }
        },
        categoryList () {
            const list = { '已签到': 1, '已补签': 2, '未签到': 3 }
            const tempList = this.selectItem === '全部' ? this.tableList : this.tableList.filter(item => item.status === this.selectItem)
            // 默认排序显示
            tempList.sort((a, b) => {
                if (list[a.status] && list[b.status]) { return list[a.status] - list[b.status] }
            })
            return tempList
        },
        showPaperList () {
            const start = (this.pagination.currentPage - 1) * this.pagination.pageSize
            const end = start + this.pagination.pageSize
            return this.categoryList.slice(start, end)
        }
    },
    async mounted () {
        // console.log(this.params)
        await this.getAllPeople()
    },
    methods: {
        // 选择器切换
        onSelectorChange () {
            this.pagination = {
                pageSize: 10,
                currentPage: 1
            }
        },
        // tag 类型
        showType (row) {
            let type = ''
            switch (row.status) {
                case '已签到':
                    type = 'success'
                    break
                case '未签到':
                    type = 'danger'
                    break
                case '已补签':
                    type = 'warning'
                    break
                default:
                    break
            }
            return type
        },
        // 手动签到的
        addPeople () {
            if (!this.params.addPeople) return
            this.params.addPeople.split(',').forEach(person => {
                const p = this.tableList.find(item => item.ren_yuan_id_ === person)
                if (!p) {
                    this.tableList.push({
                        ren_yuan_id_: person,
                        status: '已签到'
                    })
                } else {
                    p.status = '已签到'
                }
            })
        },
        // 获取全部培训人员
        async getAllPeople () {
            const sql = `select * from t_rypxcjb where id_='${this.params.guan_lian_id_}'`
            const { variables: { data }} = await this.$common.request('sql', sql)
            if (data.length <= 0) {
                return this.$message.warning('数据异常！')
            }
            // console.log('全部人员', data)
            const peopleList = data[0].pei_xun_ren_yuan_?.split(',')
            peopleList.forEach(person => {
                if (person) {
                    this.tableList.push({
                        ren_yuan_id_: person,
                        status: '未签到',
                        qian_dao_shi_jian: ''
                    })
                }
            })
            await this.getRegisterPeople()
            if (data[0].shi_fou_guo_shen_ === '进行中') {
                this.addPeople()
            }
            if (data[0].shi_fou_guo_shen_ === '已结束' && data[0].bu_qian_ren_yuan_) {
                data[0].bu_qian_ren_yuan_.split(',').forEach(person => {
                    const p = this.tableList.find(item => item.ren_yuan_id_ === person)
                    if (p) {
                        p.status = '已补签'
                    } else {
                        this.tableList.push({
                            ren_yuan_id_: person,
                            status: '已补签',
                            qian_dao_shi_jian: ''
                        })
                    }
                })
            }
        },

        // 获取已签到人员
        async getRegisterPeople () {
            const sql = `select * from t_qdxxb where guan_lian_id_='${this.params.guan_lian_id_}'`
            const { variables: { data }} = await this.$common.request('sql', sql)
            // console.log('已签到', data)
            data.forEach(person => {
                const p = this.tableList.find(item => item.ren_yuan_id_ === person.ren_yuan_id_)
                if (!p) {
                    this.tableList.push({
                        ren_yuan_id_: person.ren_yuan_id_,
                        status: '已签到',
                        qian_dao_shi_jian: person.qian_dao_shi_jian
                    })
                } else {
                    p.status = '已签到'
                    p.qian_dao_shi_jian = person.qian_dao_shi_jian
                }
            })
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.pagination.currentPage = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.pagination.pageSize = val
            this.pagination.currentPage = 1
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.pagination.currentPage - 1) * this.pagination.pageSize
        },
        close () {
            this.dialogVisible = false
        }
    }

}
</script>

<style lang="scss" scoped>
.contain{
    padding: 20px;
    .table{
        height:440px;
        overflow: auto;
        margin-top: 20px;
    }
    .selector{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rate{
            display: flex;
            div{
                margin: 0 8px;
                font-size: 16px;
            }
        }
    }
}
</style>
