<template>
    <div>
        <el-dialog
            :title="title"
            center
            :visible.sync="dialogVisible"
            width="90%"
            append-to-body
            top
            style="margin-top:5vh"
            :close-on-click-modal="false"
            :show-close="false"
            :close-on-press-escape="false"
        >
            <div v-loading="loading" class="contain">
                <div class="info">
                    <div class="item">
                        <span>部门：</span>
                        <ibps-user-selector
                            style="width:60%"
                            type="position"
                            :value="position"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="false"
                            size="mini"
                        />
                    </div>
                    <div class="item">
                        <span>评估人：</span>
                        <ibps-user-selector
                            style="width:60%"
                            type="user"
                            :value="userId"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="false"
                            size="mini"
                        />
                    </div>
                    <div class="item">
                        <span>编制时间：</span>
                        <el-date-picker
                            v-model="time"
                            type="datetime"
                            placeholder="未编制"
                            :readonly="true"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"
                        />
                    </div>
                </div>
                <el-alert
                    title="说明"
                    type="success"
                    :closable="false"
                    description="1、风险指数=严重度X发生频度、风险应对优先对高风险、频次高的风险采取措施。2，风险等级判定：RPN=Severity(严重程度)×Possibility(发生的频度）。"
                />
                <div class="tab">
                    <el-tabs v-model="activeName">
                        <el-tab-pane v-for="(item) in content" :key="item.label" :label="item.label" :name="item.label">
                            <div class="text">
                                <pre>{{ item.value }}</pre>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <el-alert
                    title=""
                    type="success"
                    :closable="false"
                    description="风险应对选择风险降低后，请选择对应的措施制定人，以便开启后续部门风险改进记录流程"
                />
                <div class="choose">
                    <span>选择风险项：</span>
                    <!-- 模版弹窗 -->
                    <ibps-custom-dialog
                        v-model="form.xuan_ze_feng_xian"
                        size="mini"
                        template-key="fxkdhk"
                        multiple
                        type="dialog"
                        class="custom-dialog"
                        placeholder="请选择风险项"
                        style="width:80%"
                        icon="el-icon-search"
                        :disabled="readonly===0?true:readonly"
                    />
                </div>
                <div class="table">
                    <el-table :data="tableList" border>
                        <el-table-column
                            prop=""
                            label="序号"
                            type="index"
                            width="50"
                            :index="showIndex"
                        />
                        <el-table-column
                            prop="yao_su_tiao_kuan_"
                            label="要素条款"
                            width="120"
                        />
                        <el-table-column
                            prop="gong_zuo_huan_jie"
                            label="工作环节"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.gong_zuo_huan_jie" type="textarea" :rows="2" size="mini" :readonly="readonly" />
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            prop="gong_zuo_miao_shu"
                            label="工作描述"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.gong_zuo_miao_shu" type="textarea" :rows="2" size="mini" :readonly="readonly" />
                            </template>
                        </el-table-column> -->
                        <el-table-column
                            prop="feng_xian_miao_sh"
                            label="风险描述"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.feng_xian_miao_sh" type="textarea" :rows="2" size="mini" :readonly="readonly" />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="xian_xing_kong_zh"
                            label="现行控制方法"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.xian_xing_kong_zh" type="textarea" :rows="2" size="mini" :readonly="readonly" />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="yan_zhong_cheng_d"
                            label="严重程度"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <el-select v-model="row.yan_zhong_cheng_d" placeholder="请选择" :disabled="readonly" size="mini" @change="culRate(row)">
                                    <el-option
                                        v-for="item in yan_zhong_cheng_d_List"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="fa_sheng_pin_du_"
                            label="发生频度"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <el-select v-model="row.fa_sheng_pin_du_" placeholder="请选择" :disabled="readonly" size="mini" @change="culRate(row)">
                                    <el-option
                                        v-for="item in fa_sheng_pin_du_List"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </template>

                        </el-table-column>
                        <el-table-column
                            prop="feng_xian_zhi_shu"
                            label="风险指数"
                            width="70"
                        />
                        <el-table-column
                            prop="feng_xian_deng_ji"
                            label="风险等级"
                            width="100"
                        />
                        <el-table-column
                            prop="feng_xian_ying_du"
                            label="风险应对"
                            width="120"
                        >
                            <template slot-scope="{row}">
                                <el-select v-model="row.feng_xian_ying_du" placeholder="请选择" :disabled="readonly" size="mini">
                                    <el-option
                                        v-for="item in ['风险降低','风险接受','风险回避']"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </template>

                        </el-table-column>
                        <el-table-column
                            prop="zhi_ding_ren_"
                            label="措施制定人"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <ibps-user-selector
                                    v-model="row.zhi_ding_ren_"
                                    type="user"
                                    readonly-text="text"
                                    :disabled="readonly"
                                    :multiple="false"
                                    size="mini"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ni_cai_qu_cuo_shi"
                            label="拟采取控制措施"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.ni_cai_qu_cuo_shi" type="textarea" :rows="2" size="mini" :readonly="readonly" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- <el-pagination
                    style="margin-top: 5px; padding-bottom: 10px"
                    :current-page="pagination.currentPage"
                    :page-sizes="[10, 20,30, 50]"
                    :page-size="pagination.pageSize"
                    layout="prev,pager,next,jumper,sizes,->,total"
                    :total="categoryList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                /> -->
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button v-if="!readonly" type="primary" size="mini" icon="el-icon-takeaway-box" @click="save">保 存</el-button>
                <el-button v-if="!readonly" type="primary" size="mini" icon="el-icon-finished" @click="submit">提 交</el-button>
                <el-button size="mini" icon="el-icon-close" type="danger" @click="close">退 出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import ibpsUserSelector from '@/business/platform/org/selector'
export default {
    components: {
        ibpsUserSelector,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    data () {
        const { userId, position, level } = this.$store.getters
        return {
            form: {
                xuan_ze_feng_xian: ''
            },
            activeName: '严重程度分级描述',
            content: [
                { label: '严重程度分级描述', value: `1级：轻微，不会对检验科人员、设备、环境、形象造成损害；不会对检验质量造成影响；造成轻微的财产损失；无检验科信息泄露。
2级：一般，对检验科人员、设备、环境、形象造成轻微损害，对检验质量和TAT造成影响，能通过现场及时处置解决或缓解出现的损害和影响；造成一定的财产损失；未造成投诉；无检验科信息泄露。
3级：较严重，对检验科人员、设备、环境、形象造成损害，对检验质量和TAT造成影响，无法通过现场及时处置解决或缓解出现的损害和影响；被投诉至检验科管理层；造成较大的财产的损失；有检验科信息泄露。
4级：严重，对检验科人员造成较大伤害；对仪器设备造成损坏；对周边较少的人员或环境产生损害；对检验质量、TAT、临床诊疗造成严重影响；造成重大的的经济损失；被投诉至上级主管部门；造成不良的社会影响。
5级：非常严重，对检验科人员造成重大伤害甚至死亡；对仪器设备造成损毁；极度影响检验质量和TAT，对临床造成极大误诊致使病人死亡；对周边人员或环境产生重大损害；造成恶劣的社会影响；导致检验科停工停业 ` },
                { label: '发生概率分级表说明', value: `1级:基本不可能发生，评估范围内未发生过，类似区域/行业也极少发生
2级:较不可能发生，评估范围内未发生过，类似区域/行业偶有发生
3级:可能发生，评估范围内发生过，类似区域/行业也偶有发生； 评估范围内未发生过，但类似区域/行业发生频率较高
4级:很有可能发生，评估范围内发生频率较高
5级:必定会发生，评估范围内发生频率很高` },
                { label: '风险等级及应对措施说明', value: `中风险级:5-11，可采取措施降低风险。
低风险级:1-4，风险较低,当采取措施消除风险引起的成本比风险本身引起的损失较大时，接受风险。
高风险级:12-25，应采取措施规避或降低风险。` }
            ],
            yan_zhong_cheng_d_List: ['1', '2', '3', '4', '5'],
            fa_sheng_pin_du_List: ['1', '2', '3', '4', '5'],
            userId: userId,
            position: position,
            level: level.second || level.first,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            params: {},
            rowParams: {},
            refresh: true,
            loading: false,
            title: '',
            pagination: {
                pageSize: 10,
                currentPage: 1
            },
            dialogVisible: false,
            tableList: [],
            Ids: [],
            fengXianJiSuan: []
        }
    },
    computed: {
        showPaperList () {
            const start = (this.pagination.currentPage - 1) * this.pagination.pageSize
            const end = start + this.pagination.pageSize
            return this.categoryList.slice(start, end)
        },
        readonly () {
            if (this.rowParams.bian_zhi_ren_) {
                return true
            } else {
                if (this.tableList.length) {
                    return this.tableList.every(item => item.shi_fou_guo_shen_ === '已完成')
                } else {
                    return false
                }
            }
        }
    },
    watch: {
        params: {
            handler (val) {
                this.getTableData()
            }
        },
        rowParams: {
            handler (val) {
                this.getTableData()
            }
        },
        'form.xuan_ze_feng_xian': {
            handler (data) {
                this.loading = true
                data = data.split(',')
                data = "'" + data.join("','") + "'"
                const sql = `select * from t_fxkzb where  id_ in (${data}) ORDER BY FIELD(id_, ${data})`
                this.$common.request('sql', sql).then(response => {
                    let data1 = []
                    if (response.variables != null && response.variables.data != null && response.variables.data.length > 0) {
                        data1 = response.variables.data
                        // console.log(data1)
                        for (const item of data1) {
                            const chongfu = this.tableList.find(i => i.shi_bie_xiang_ === item.id_)
                            if (!chongfu) {
                                this.tableList.push({
                                    di_dian_: this.level,
                                    bian_zhi_ren_: this.userId,
                                    bian_zhi_bu_men_: this.position,
                                    bian_zhi_shi_jian: this.time,
                                    parent_id_: this.params.id_,

                                    shi_bie_xiang_: item.id_,
                                    yao_su_tiao_kuan_: item.tiao_kuan_,
                                    gong_zuo_huan_jie: item.huan_jie_,
                                    // gong_zuo_miao_shu: item.gong_zuo_miao_shu,
                                    feng_xian_miao_sh: item.feng_xian_miao_sh,

                                    xian_xing_kong_zh: item.gong_zuo_miao_shu,
                                    ni_cai_qu_cuo_shi: '',
                                    zhi_ding_ren_: ''
                                })
                            }
                        }
                    }
                    this.tableList.forEach(item => {
                        const cunZai = data1.find(i => i.id_ === item.shi_bie_xiang_)
                        if (!cunZai) {
                            this.tableList = this.tableList.filter(ii => ii.shi_bie_xiang_ !== item.shi_bie_xiang_)
                        }
                    })
                    this.loading = false
                })
            }
        }
    },
    methods: {
        async getTableData () {
            this.loading = true
            // console.log(this.params)
            if (!this.params.id_) return
            let sql = ''
            if (this.readonly) {
                sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}' and bian_zhi_ren_='${this.rowParams.bian_zhi_ren_}'`
            } else {
                sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}' and bian_zhi_ren_='${this.userId}'`
            }
            const { variables: { data }} = await this.$common.request('sql', sql)
            if (data.length > 0) {
                // console.log('data', data)
                this.position = data[0].bian_zhi_bu_men_
                this.userId = data[0].bian_zhi_ren_
                this.time = data[0].bian_zhi_shi_jian
                this.form.xuan_ze_feng_xian = data[0].xuan_ze_feng_xian
                this.tableList = data
                // 存储原始数据的 id 数组
                this.Ids = this.tableList.map(item => item.shi_bie_xiang_)
            } else {
                if (this.rowParams.bian_zhi_ren_) {
                    this.position = this.rowParams.bian_zhi_bu_men_
                    this.userId = this.rowParams.bian_zhi_ren_
                    this.time = ''
                }
                this.tableList = []
                this.Ids = []
            }

            // 获取风险等级相关
            const degreeSql = `select yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE parent_id_ =(select id_ FROM t_yzcdfjb WHERE fen_lei_ ='严重程度' and di_dian_ = ${this.level} ORDER BY create_time_ DESC LIMIT 1) ORDER BY fen_ji_ ASC`
            const gailvSql = `select yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE parent_id_ =(select id_ FROM t_yzcdfjb WHERE fen_lei_ ='发生概率' and di_dian_ = ${this.level} ORDER BY create_time_ DESC LIMIT 1) ORDER BY fen_ji_ ASC`
            const dengjiSql = `select yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE parent_id_ =(select id_ FROM t_yzcdfjb WHERE fen_lei_ ='风险等级' and di_dian_ = ${this.level} ORDER BY create_time_ DESC LIMIT 1) ORDER BY fen_ji_ ASC`
            Promise.all([
                this.$common.request('sql', degreeSql),
                this.$common.request('sql', gailvSql),
                this.$common.request('sql', dengjiSql)
            ]).then(responses => {
                let degreeData = []
                let gailvData = []
                let dengjiData = []

                if (responses[0].variables != null && responses[0].variables.data != null && responses[0].variables.data.length > 0) {
                    degreeData = responses[0].variables.data
                }
                if (responses[1].variables != null && responses[1].variables.data != null && responses[1].variables.data.length > 0) {
                    gailvData = responses[1].variables.data
                }
                if (responses[2].variables != null && responses[2].variables.data != null && responses[2].variables.data.length > 0) {
                    dengjiData = responses[2].variables.data
                }
                let degreeWord = ''
                let gailvWord = ''
                let dengjiWord = ''
                for (const el of degreeData) {
                    degreeWord += `${el.fen_ji_}级：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                }
                for (const el of gailvData) {
                    gailvWord += `${el.fen_ji_}级：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                }
                for (const el of dengjiData) {
                    dengjiWord += `${el.fen_ji_}级：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                }
                this.content[0].value = degreeWord
                this.content[1].value = gailvWord
                this.content[2].value = dengjiWord
                this.yan_zhong_cheng_d_List = degreeData.map(item => item.fen_ji_)
                this.fa_sheng_pin_du_List = gailvData.map(item => item.fen_ji_)
                this.fengXianJiSuan = dengjiData
                this.loading = false
            }).catch(error => {
                // 处理错误
                console.error('Error fetching data:', error)
                this.loading = false
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
            setTimeout(() => {
                this.rowParams = {}
                this.params = {}
                this.form.xuan_ze_feng_xian = ''
            }, 500)
        },
        open (val, row) {
            this.params = val
            if (row) {
                this.rowParams = row
            }
            this.dialogVisible = true
        },
        // 计算风险指数
        culRate (row) {
            if (row.yan_zhong_cheng_d && row.fa_sheng_pin_du_) {
                let degree = ''
                let rate = ''
                rate = +row.yan_zhong_cheng_d * +row.fa_sheng_pin_du_
                if (this.fengXianJiSuan.length === 0) {
                    if (rate >= 1 && rate <= 4) {
                        degree = '低风险'
                    }
                    if (rate >= 5 && rate <= 11) {
                        degree = '中风险'
                    }
                    if (rate >= 12 && rate <= 25) {
                        degree = '高风险'
                    }
                } else {
                    for (let i = 0; i < this.fengXianJiSuan.length; i++) {
                        const item = this.fengXianJiSuan[i]
                        if (item.yan_zhong_cheng_d) {
                            const [a, b] = item.yan_zhong_cheng_d.split('-')
                            if (a && b) {
                                if (rate >= +a && rate <= +b) {
                                    degree = item.fen_ji_
                                    break
                                }
                            }
                        }
                    }
                }

                this.$set(row, 'feng_xian_ying_du', (!row.feng_xian_ying_du && degree === '低风险') ? '风险接受' : '风险降低')
                row.feng_xian_zhi_shu = rate + ''
                row.feng_xian_deng_ji = degree
            }
        },
        check () {
            if (this.tableList.length === 0) {
                throw new Error('请选择风险项！')
            }
            for (let i = 0; i < this.tableList.length; i++) {
                const item = this.tableList[i]
                if (!item.feng_xian_zhi_shu) {
                    throw new Error(`第${i + 1}请选择严重程度和发生频度！`)
                }
                if (item.feng_xian_ying_du !== '风险接受' && !item.zhi_ding_ren_) {
                    throw new Error(`第${i + 1}行缺少措施制定人！`)
                }
                // 格式化成需要的数据
                item.xuan_ze_feng_xian = this.form.xuan_ze_feng_xian
                delete item.create_by_
                delete item.create_time_
            }
        },
        submit () {
            // console.log(this.Ids)
            this.$confirm('提交后不可再修改，是否确认保存并提交?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 提交时自动保存
                await this.save()
                const params = {
                    tableName: 't_fxsbpgb2',
                    updList: this.Ids.map(item => ({
                        where: {
                            shi_bie_xiang_: item,
                            bian_zhi_ren_: this.userId,
                            parent_id_: this.params.id_
                        },
                        param: {
                            shi_fou_guo_shen_: '已完成'
                        }
                    }))
                }
                console.log(params)
                await this.$common.request('update', params)
                // 判断是否是最后一个提交的评估人
                const pinGuRenNum = this.params.ping_gu_ren_yuan_.split(',').length
                const sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}'`
                const { variables: { data }} = await this.$common.request('sql', sql)
                const submitNum = new Set(data.map(item => item.bian_zhi_ren_)).size
                if (submitNum === pinGuRenNum && data.every(item => item.shi_fou_guo_shen_ === '已完成')) {
                    // 提醒组长
                    await this.$common.sendMsg({
                        subject: '风险评估与措施表单待提交',
                        content: `您有一份评估与措施表单待提交，请前往-风险控制-风险评估与措施页面提交，计划编号：${this.params.ji_hua_bian_hao_}。`,
                        receiverId: this.params.zu_chang_id_,
                        canreplay: '0',
                        skipTypeMsg: JSON.stringify({
                            skipType: 3,
                            pathInfo: '/tygl/fxkzV2/fxpgycslb' // 路由
                        })
                    })
                    console.log('通知组长成功')
                }
                console.log('提交成功')
                this.$message({
                    type: 'success',
                    message: '提交成功!'
                })
                this.close()
            }).catch(() => {

            })
        },
        // 判断状态是否已完成
        async getIsFinish () {
            let sql = ''
            if (this.readonly) {
                sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}' and bian_zhi_ren_='${this.rowParams.bian_zhi_ren_}'`
            } else {
                sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}' and bian_zhi_ren_='${this.userId}'`
            }
            const { variables: { data }} = await this.$common.request('sql', sql)
            if (data.length > 0 && data.every(item => item.shi_fou_guo_shen_ === '已完成')) {
                throw new Error('已提交，不可再次提交！')
            }
            const sql2 = `select * from t_fxpgjlb2 where id_='${this.params.id_}'`
            const { variables: { data: data2 }} = await this.$common.request('sql', sql2)
            if (data2.length > 0 && data2[0].shi_fou_guo_shen_ === '已完成') {
                throw new Error('已结束，不可再次提交！')
            }
        },
        async save () {
            try {
                this.check()
                await this.getIsFinish()
                const curIds = this.tableList.map(item => item.shi_bie_xiang_)

                // 计算需要增加项
                const addedIds = this.tableList.filter(item => !this.Ids.includes(item.shi_bie_xiang_))
                // 计算需要更新项
                const updatedIds = this.tableList.filter(item => this.Ids.includes(item.shi_bie_xiang_))
                // 计算需要删除项
                const deletedIds = this.Ids.filter(id => !curIds.includes(id))
                console.log(addedIds, updatedIds, deletedIds)

                // 新增
                if (addedIds.length > 0) {
                    const params = {
                        tableName: 't_fxsbpgb2',
                        paramWhere: addedIds
                    }
                    console.log(params)
                    await this.$common.request('add', params)
                    console.log('添加成功')
                }
                // 更新
                if (updatedIds.length > 0) {
                    const params = {
                        tableName: 't_fxsbpgb2',
                        updList: updatedIds.map(item => ({
                            where: {
                                id_: item.id_
                            },
                            param: {
                                ...item,
                                xuan_ze_feng_xian: this.form.xuan_ze_feng_xian
                            }
                        }))
                    }
                    console.log(params)
                    await this.$common.request('update', params)
                    console.log('更新成功')
                }
                // 删除
                if (deletedIds.length > 0) {
                    const sql3 = `select * from t_fxsbpgb2 where bian_zhi_ren_='${this.userId}' and parent_id_='${this.params.id_}' and shi_bie_xiang_ in (${deletedIds.map(id => `'${id}'`).join(', ')})`
                    const { variables: { data: data3 }} = await this.$common.request('sql', sql3)
                    if (data3.length > 0) {
                    // console.log('data3', data3)
                        const params = {
                            tableName: 't_fxsbpgb2',
                            paramWhere: {
                                id_: data3.map(item => item.id_).join(',')
                            }
                        }
                        console.log(params)
                        await this.$common.request('delete', params)
                        console.log('删除成功')
                    }
                }
                await this.getTableData()
                this.$message.success('保存成功')
            // this.close()
            } catch (error) {
                this.$message.warning(error.message)
                throw new Error(error.message)
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.contain{
    padding: 20px;
    .info{
        padding: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        .item{
            display: flex;
            align-items: center;
            width: 30%;
        }

    }
    .tab{
        pre{
            overflow: auto;
            margin: 0;
            padding-bottom: 10px;
        }
    }
    .choose{
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
    .table{
        height:300px;
        overflow: auto;
        margin-top: 20px;
    }
}
</style>
