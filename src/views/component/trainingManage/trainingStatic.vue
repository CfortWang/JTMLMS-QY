<template>
    <div>
        <el-dialog
            :title="title"
            center
            :visible.sync="dialogVisible"
            width="70%"
            append-to-body
            top
            style="margin-top:5vh"
            :close-on-click-modal="false"
            :show-close="false"
            :close-on-press-escape="false"
        >
            <div v-if="refresh" v-loading="loading" class="contain">
                <div class="selector">
                    <div>
                        签到状态：
                        <el-select v-model="selectItem2" placeholder="请选择" size="mini" style="width:100px" @change="onSelectorChange">
                            <el-option
                                v-for="item in ['全部','已签到','未签到','已补签']"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </div>
                    <div>
                        培训时间：
                        <el-date-picker
                            v-model="selectItem3"
                            size="mini"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyy-MM-dd"
                            style="width:240px"
                        />
                    </div>
                    <div>
                        <span style="width:110px">培训主题：</span>
                        <el-input v-model="selectItem1" placeholder="请输入培训主题" size="mini" />
                    </div>
                </div>
                <div class="table">
                    <el-table :data="showPaperList" row-key="id_" border>
                        <el-table-column
                            prop=""
                            label="序号"
                            type="index"
                            width="100"
                            :index="showIndex"
                        />
                        <el-table-column
                            prop="pei_xun_nei_rong_"
                            label="培训主题"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="bian_zhi_ren_"
                            label="培训负责人"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <ibps-user-selector
                                    type="user"
                                    :value="row.bian_zhi_ren_"
                                    readonly-text="text"
                                    :disabled="true"
                                    :multiple="true"
                                />
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="pei_xun_shi_jian_"
                            label="培训时间"
                            width="150"
                        />
                        <el-table-column
                            prop="pei_xun_lei_bie_"
                            label="培训类型"
                            width="100"
                        />
                        <el-table-column
                            prop="shi_fou_guo_shen_"
                            label="培训状态"
                            width="100"
                        />
                        <el-table-column
                            prop="status"
                            label="签到状态"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <el-tag :type="showType(row)">{{ row.status }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="操作"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <el-button type="primary" size="mini" :disabled="row.status!=='未签到'" :title="showTitle(row)" icon="el-icon-finished" @click="onRegister(row)">补签</el-button>
                            </template>
                        </el-table-column>

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
            refresh: true,
            loading: false,
            title: '',
            pagination: {
                pageSize: 10,
                currentPage: 1
            },

            dialogVisible: true,
            tableList: [],
            selectItem1: '',
            selectItem2: '全部',
            selectItem3: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    computed: {
        categoryList () {
            const list = { '已签到': 1, '已补签': 2, '未签到': 3 }
            let tempList = this.tableList
            // 第一次过滤
            if (this.selectItem1) {
                tempList = tempList.filter(item => item.pei_xun_nei_rong_.indexOf(this.selectItem1) >= 0)
            }
            // 第二次过滤
            if (this.selectItem2 !== '全部') {
                tempList = tempList.filter(item => item.status === this.selectItem2)
            }
            // 第三次过滤
            if (this.selectItem3 && this.selectItem3.length > 0) {
                tempList = tempList.filter(item => {
                    let [start, end] = this.selectItem3
                    const now = new Date(item.pei_xun_shi_jian_).getTime()
                    start = new Date(start)
                    end = new Date(end)
                    return start <= now && now <= end
                })
            }

            // 按培训时间排序
            tempList.sort((a, b) => {
                return new Date(b.pei_xun_shi_jian_).getTime() - new Date(a.pei_xun_shi_jian_).getTime()
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
        this.loading = true
        if (this.params.time && this.params.time.length) {
            this.selectItem3 = this.params.time
        }
        this.getTitle()
        await this.fetchPaperList()
        await this.fetchRegisterList()
        this.loading = false
    },
    methods: {
        showTitle (row) {
            if (row.shi_fou_guo_shen_ !== '已结束') {
                return '未结束的培训不允许补签'
            }
            if (row.status !== '未签到') {
                return '只有未签到才能补签'
            }
            return ''
        },
        getTitle () {
            const { userList } = this.$store.getters
            const user = userList.find(item => item.userId === this.params.peixunrenyuan)
            if (user) {
                this.title = `${user.userName} 的培训记录`
            }
        },

        async onRegister (row) {
            // const sql = `select * from t_qdxxb where ren_yuan_id_='${this.params.peixunrenyuan}' and guan_lian_id_='${row.id_}'`
            const { variables: { data }} = await this.$common.request('query', {
                key: 'getSignInfoByBizKey',
                params: [row.id_]
            })
            const isSign = data.some(item => item.ren_yuan_id_ === this.params.peixunrenyuan)
            if (isSign) {
                return this.$message.warning('已签到，请不要重复签到！')
            }

            const peiXunRen = row.pei_xun_ren_yuan_
            const buQianRen = row.bu_qian_ren_yuan_
            // 1.签到表补签操作
            // 2.培训记录表更新操作
            const paramWhere = [{
                guan_lian_id_: row.id_,
                ren_yuan_id_: this.params.peixunrenyuan,
                qian_dao_shi_jian: this.$common.getDateNow(19)
            }]

            const addParams = {
                tableName: 't_qdxxb',
                paramWhere
            }

            const params = {
                tableName: 't_rypxcjb',
                updList: [{
                    where: {
                        id_: row.id_
                    },
                    param: {
                        bu_qian_ren_yuan_: buQianRen === '' ? this.params.peixunrenyuan : buQianRen + ',' + this.params.peixunrenyuan
                    }
                }]
            }
            // 更新人员培训记录的培训人
            const params2 = {
                tableName: 't_xygpx',
                updList: [{
                    where: {
                        pei_xun_ming_chen: row.id_
                    },
                    param: {
                        parent_id_: buQianRen === '' ? this.params.peixunrenyuan : buQianRen + ',' + this.params.peixunrenyuan
                    }
                }]
            }
            // 合并请求
            Promise.all([
                this.$common.request('add', addParams),
                this.$common.request('update', params),
                this.$common.request('update', params2)
            ]).then(async ([addRes, updateRes]) => {
                console.log('补签签到数据成功', addRes)
                console.log('更新补签考试人员', updateRes)
                this.$message.success('补签成功!')
                this.loading = true
                await this.fetchPaperList()
                await this.fetchRegisterList()
                this.loading = false
            }).catch(error => {
                console.error('补签签到或更新失败', error)
                this.$message.error('补签失败，请重试！')
                this.loading = false
            })

            // 为补签的人发考试与消息 更新试卷人员信息  1.17 考试与培训取消关联
            // if (row.ti_ku_ming_cheng_) {
            //     // todo 1.给考试参加人员替换掉2.结束培训判断谁没签到提示补签

            //     const sql1 = `select qb.id_ as tkid,qb.ti_ku_ming_cheng_ as bankName, qb.ti_shu_ as questionCount, qb.zong_fen_ as totalScore, ex.kao_shi_ming_chen as examName, ex.xian_kao_ci_shu_ as limitCount, ex.xian_kao_shi_jian as limitDate, ex.kao_shi_shi_chang as duration, ex.can_kao_ren_yuan_ as examinee, ex.da_biao_zhan_bi_ as qualifiedRadio, ex.ji_fen_fang_shi_ as scoringType, ex.yun_xu_bao_ming_ as allowRegist, ex.sui_ji_chou_ti_ as isRand, ex.sui_ji_ti_shu_ as randNumber,ex.chou_ti_zong_fen_ as randScore,ex.ti_mu_zong_shu_ as randTotal  from t_exams ex, t_question_bank qb where ex.ti_ku_id_ = qb.id_ and ex.id_ = '${row.ti_ku_ming_cheng_}'`
            //     this.$common.request('sql', sql1).then(res => {
            //         const { data = [] } = res.variables || {}
            //         if (!data.length) {
            //             return
            //         } else {
            //             if (data[0].isRand === '1') {
            //                 data[0].questionCount = data[0].randTotal
            //                 data[0].totalScore = data[0].randScore
            //             }
            //             console.log('data对象', data)
            //             const { first, second } = this.$store.getters.level || {}
            //             const { tkid, examName, questionCount, totalScore, duration, qualifiedRadio, limitDate, limitCount } = data[0] || {}
            //             const paramWhere = [{
            //                 exam_id_: row.ti_ku_ming_cheng_,
            //                 ti_ku_id_: tkid,
            //                 di_dian_: second || first,
            //                 kao_shi_ren_: this.params.peixunrenyuan,
            //                 bu_men_: '',
            //                 bao_ming_shi_jian: this.$common.getDateNow(19),
            //                 ti_ku_zong_fen_: totalScore,
            //                 zhuang_tai_: '未开始',
            //                 sheng_yu_shi_chan: duration,
            //                 da_biao_zhan_bi_: qualifiedRadio
            //             }]
            //             const addParams = {
            //                 tableName: 't_examination',
            //                 paramWhere
            //             }
            //             console.log('添加考试信息', addParams)
            //             this.$common.request('add', addParams).then(res => {
            //                 // 发送通知
            //                 const limitTime = duration === '不限' || !duration ? '不限' : this.transformTime(duration)
            //                 const msgContent = `您参加的考试【${examName}】已发布，该考试限考时间【${limitDate}】，限考次数【${limitCount}】，考试时长【${limitTime}】，题数【${questionCount}】，总分【${totalScore}】，请及时完成考试！`
            //                 console.log('消息msgContent', msgContent)
            //                 this.$common.sendMsg({
            //                     subject: '考试信息提醒',
            //                     content: msgContent,
            //                     receiverId: this.params.peixunrenyuan,
            //                     canreplay: '0'
            //                 })
            //             }).then(res => {
            //                 this.$message.success('补签报名考试成功，参与人员可到考试中心考试!')
            //             })
            //         }
            //     })
            // }
            // 补签更新培训记录表"参加人员"字段与"参加人数字段" 更新操作
            // 更新培训记录表 todo
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
        // 查询指定人员的培训记录
        async fetchPaperList () {
            // const sql = `select * from t_rypxcjb where FIND_IN_SET('${this.params.peixunrenyuan}', pei_xun_ren_yuan_) > 0 and shi_fou_guo_shen_='已结束'`
            const { variables: { data }} = await this.$common.request('query', {
                key: 'getTrainRecordById',
                params: [this.params.peixunrenyuan]
            })
            this.tableList = data
        },
        // 获取签到状态
        async fetchRegisterList () {
            // const sql = `select guan_lian_id_,ren_yuan_id_ from t_qdxxb where ren_yuan_id_='${this.params.peixunrenyuan}'`
            const { variables: { data }} = await this.$common.request('query', {
                key: 'getTrainSignStatus',
                params: [this.params.peixunrenyuan]
            })
            this.tableList.forEach(item => {
                const id_ = item.id_
                const index = data.findIndex(i => i.guan_lian_id_ === id_)
                this.$set(item, 'status', index >= 0 ? '已签到' : '未签到')
                if (item.bu_qian_ren_yuan_) {
                    const person = item.bu_qian_ren_yuan_.split(',').find(i => i === this.params.peixunrenyuan)
                    if (person) {
                        item.status = '已补签'
                    }
                }
            })
        },
        // 选择器切换
        onSelectorChange () {
            this.pagination = {
                pageSize: 10,
                currentPage: 1
            }
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
            this.$emit('close')
        }
    }

}
</script>

<style lang="scss" scoped>
.contain{
    padding: 20px;
    .table{
        height:436px;
        overflow: auto;
        margin-top: 20px;
    }
    .selector{
        display: flex;
        align-items: center;
        div{
            display: flex;
            align-items: center;
            margin: 0 10px;
        }
    }
}
</style>
