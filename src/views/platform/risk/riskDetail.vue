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
                            v-model="position"
                            style="width:60%"
                            type="position"
                            readonly-text="text"
                            :disabled="readonly"
                            :multiple="false"
                            size="mini"
                            :filter="filter"
                            filtrate
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
                            :disabled="readonly"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"
                        />
                    </div>
                </div>
                <el-alert
                    title="说明"
                    type="success"
                    :closable="false"
                    :description="descriptionContent"
                />
                <div class="tab">
                    <el-tabs v-model="activeName">
                        <el-tab-pane v-for="(item) in content.filter(i=>!!!i.hide)" :key="item.label" :label="item.label" :name="item.label">
                            <div class="content">
                                <div class="left">
                                    <pre>{{ item.value }}</pre>
                                </div>
                                <div v-if="activeName==='风险等级及应对措施说明' && muban==='1'" class="right">
                                    <el-image
                                        style="width: 100%; height: 100%"
                                        :src="photo"
                                        fit="contain"
                                        :preview-src-list="[photo]"
                                        alt="风险矩阵参照图"
                                    />
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <el-alert
                    title=""
                    type="success"
                    :closable="false"
                    description="风险应对选择风险降低后，需要填写对应的措施制定人，以便开启后续部门风险改进记录流程"
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
                                <el-input v-model="row.gong_zuo_huan_jie" type="textarea" :rows="2" size="mini" :disabled="readonly" />
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
                                <el-input v-model="row.feng_xian_miao_sh" type="textarea" :rows="2" size="mini" :disabled="readonly" />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="xian_xing_kong_zh"
                            label="现行控制方法"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.xian_xing_kong_zh" type="textarea" :rows="2" size="mini" :disabled="readonly" />
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
                            v-if="muban==='2'"
                            prop="ke_jian_ce_du_"
                            label="可检测度"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <el-select v-model="row.ke_jian_ce_du_" placeholder="请选择" :disabled="readonly" size="mini" @change="culRate(row)">
                                    <el-option
                                        v-for="item in ke_jian_ce_du_List"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </template>

                        </el-table-column>
                        <el-table-column
                            prop="feng_xian_zhi_shu"
                            label="风险系数"
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
                            prop="qian_zai_yuan_yin"
                            label="潜在原因分析"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.qian_zai_yuan_yin" type="textarea" :rows="2" size="mini" :disabled="readonly" />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ni_cai_qu_cuo_shi"
                            label="拟采取控制措施"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <el-input v-model="row.ni_cai_qu_cuo_shi" type="textarea" :rows="2" size="mini" :disabled="readonly" />
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
                                    :multiple="true"
                                    size="mini"
                                    :filter="filter"
                                    filtrate
                                />
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
                <el-button size="mini" icon="ibps-icon-close" type="danger" @click="close">退 出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import ibpsUserSelector from '@/business/platform/org/selector'
import { getImage } from '@/api/platform/file/attachment'
export default {
    components: {
        ibpsUserSelector,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        culWays: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        const { userId, position, level } = this.$store.getters
        return {
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            form: {
                xuan_ze_feng_xian: ''
            },
            activeName: '风险等级及应对措施说明',
            content: [
                { label: '严重程度分级描述', value: '/' },
                { label: '发生概率分级表说明', value: '/' },
                { label: '事件可检测度描述', value: '/' },
                { label: '风险等级及应对措施说明', value: `未找到配置数据，使用默认配置：
低：可保持已有的安全措施。
中：需采取有效措施对风险进行控制。
高：需采取有效措施对风险进行控制。
极高：需采取有效措施对风险进行控制。` }
            ],
            fengXianDengJi2: { label: '风险等级及应对措施说明', value: `未找到配置数据，使用默认配置：
可忽略的:1-8，稍有危险，可以接受。
可接受的:9-27，一般危险，需要注意。
中度的:28-63，显著危险，需要整改。
重大的:64-99，高度危险，需立即整改。
不可接受的:100-125，极其危险，不能继续作业。` },
            fengXianDengJi3: { label: '风险等级及应对措施说明', value: `未找到配置数据，使用默认配置：
低风险:1-4，风险较低,当采取措施消除风险引起的成本比风险本身引起的损失较大时，接受风险。
中风险:5-11，可采取措施降低风险或风险规避。
高风险:12-25，应采取措施规避或降低风险。` },
            yan_zhong_cheng_d_List: ['1', '2', '3', '4', '5'],
            fa_sheng_pin_du_List: ['1', '2', '3', '4', '5'],
            ke_jian_ce_du_List: ['1', '2', '3', '4', '5'],
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
            fengXianJiSuan: [],
            muban: '2',
            leixing: '安全'
        }
    },
    computed: {
        photo () {
            return getImage('risk_fxjz') // 风险矩阵参照图
        },
        descriptionContent () {
            const msg1 = `1.当前风险系数计算公式为模板一：'${this.culWays[this.muban]}'。2.风险等级由严重程度和发生频度组成的坐标值映射成为矩阵坐标。`
            const msg2 = `1.当前风险系数计算公式为模板二：'${this.culWays[this.muban]}'。2.风险系数 RPN = Severity(严重度) × Occurrence(发生度）× Likelihood of Detection(检测度)。`
            const msg3 = `1.当前风险系数计算公式为模板三：'${this.culWays[this.muban]}'。2.风险系数 RPN = Severity(严重程度) × Possibility(发生的可能性）。`
            switch (this.muban) {
                case '1':
                    return msg1
                case '2':
                    return msg2
                case '3':
                    return msg3
                default:
                    break
            }
            return msg1
        },
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
                                    zhi_ding_ren_: '',
                                    qian_zai_yuan_yin: ''
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
                this.tableList.forEach(i => {
                    if (!Object.hasOwn(i, 'qian_zai_yuan_yin')) i.qian_zai_yuan_yin = ''
                })
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
            this.muban = this.params.ji_suan_fang_shi_
            this.leixing = this.params.feng_xian_lei_xin
            if (this.muban === '2') {
                this.content[3] = this.fengXianDengJi2
            } else if (this.muban === '3') {
                this.content[3] = this.fengXianDengJi3
            }
            // 获取风险等级相关
            const degreeSql = `select feng_xian_lei_xin,yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE zi_fen_lei_ ='严重程度' and di_dian_ = '${this.level}' and mo_ban_fen_lei_='${this.muban}' and feng_xian_lei_xin='${this.leixing}' ORDER BY fen_ji_ ASC`
            const gailvSql = `select feng_xian_lei_xin,yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE zi_fen_lei_ ='发生概率' and di_dian_ = '${this.level}' and mo_ban_fen_lei_='${this.muban}' and feng_xian_lei_xin='${this.leixing}' ORDER BY fen_ji_ ASC`
            const dengjiSql = `select feng_xian_lei_xin,yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE zi_fen_lei_ ='风险等级' and di_dian_ = '${this.level}' and mo_ban_fen_lei_='${this.muban}' and feng_xian_lei_xin='${this.leixing}'`
            const jianCeSql = `select feng_xian_lei_xin,yan_zhong_cheng_d, fen_ji_, miao_shu_ FROM t_yzcdfjbzb WHERE zi_fen_lei_ ='可检测度' and di_dian_ = '${this.level}' and mo_ban_fen_lei_='${this.muban}' and feng_xian_lei_xin='${this.leixing}' ORDER BY fen_ji_ ASC`
            Promise.all([
                this.$common.request('sql', degreeSql),
                this.$common.request('sql', gailvSql),
                this.$common.request('sql', dengjiSql),
                this.$common.request('sql', jianCeSql)
            ]).then(responses => {
                let degreeData = []
                let gailvData = []
                let dengjiData = []
                let jianCeData = []

                if (responses[0].variables != null && responses[0].variables.data != null && responses[0].variables.data.length > 0) {
                    degreeData = responses[0].variables.data
                }
                if (responses[1].variables != null && responses[1].variables.data != null && responses[1].variables.data.length > 0) {
                    gailvData = responses[1].variables.data
                }
                if (responses[2].variables != null && responses[2].variables.data != null && responses[2].variables.data.length > 0) {
                    dengjiData = responses[2].variables.data
                }
                if (responses[3].variables != null && responses[3].variables.data != null && responses[3].variables.data.length > 0) {
                    jianCeData = responses[3].variables.data
                }
                (this.muban === '1' || this.muban === '3') && (this.content[2].hide = true)
                if (degreeData.length === 0 || gailvData.length === 0 || dengjiData.length === 0 || (this.muban === '2' && jianCeData.length === 0)) {
                    throw new Error(`检测到风险类型为${this.leixing}且计算方式为'${this.culWays[this.muban] || this.muban}'的配置数据不完整，建议配置完成后再使用！`)
                }
                let degreeWord = ''
                let gailvWord = ''
                let dengjiWord = ''
                let jianCeWord = ''
                for (const el of degreeData) {
                    degreeWord += `${el.fen_ji_}级：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                }
                for (const el of gailvData) {
                    gailvWord += `${el.fen_ji_}级：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                }
                for (const el of dengjiData) {
                    if (this.muban === '1') {
                        dengjiWord += `${el.fen_ji_}：${el.miao_shu_}\n`
                    } else {
                        dengjiWord += `${el.fen_ji_}：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                    }
                }
                for (const el of jianCeData) {
                    jianCeWord += `${el.fen_ji_}级：${el.yan_zhong_cheng_d}，${el.miao_shu_}\n`
                }
                if (degreeData.length > 0) {
                    this.content[0].value = degreeWord
                    this.yan_zhong_cheng_d_List = degreeData.map(item => item.fen_ji_)
                }
                if (gailvData.length > 0) {
                    this.content[1].value = gailvWord
                    this.fa_sheng_pin_du_List = gailvData.map(item => item.fen_ji_)
                }
                if (jianCeData.length > 0) {
                    this.content[2].value = jianCeWord
                    this.ke_jian_ce_du_List = jianCeData.map(item => item.fen_ji_)
                }
                if (dengjiData.length > 0) {
                    this.content[3].value = dengjiWord
                }
                this.fengXianJiSuan = dengjiData
                this.loading = false
            }).catch(error => {
                // 处理错误
                this.$message.warning(error.message)
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
            try {
                if (this.muban === '1') {
                    if (row.yan_zhong_cheng_d && row.fa_sheng_pin_du_) {
                        let degree = ''
                        let rate = ''
                        rate = +row.yan_zhong_cheng_d * +row.fa_sheng_pin_du_
                        if (this.fengXianJiSuan.length === 0) {
                            if (rate >= 1 && rate < 4) {
                                degree = '低'
                            }
                            if (rate > 4 && rate <= 9) {
                                degree = '中'
                            }
                            if (rate >= 10 && rate <= 16) {
                                degree = '高'
                            }
                            if (rate >= 20 && rate <= 25) {
                                degree = '极高'
                            }
                            if (rate === 4) {
                                if (+row.yan_zhong_cheng_d === 2 && +row.fa_sheng_pin_du_ === 2) {
                                    degree = '低'
                                } else {
                                    degree = '中'
                                }
                            }
                        } else {
                            for (let i = 0; i < this.fengXianJiSuan.length; i++) {
                                const item = this.fengXianJiSuan[i]
                                if (item.yan_zhong_cheng_d) {
                                    const arr = JSON.parse(item.yan_zhong_cheng_d) || []
                                    for (let j = 0; j < arr.length; j++) {
                                        const [a, b] = arr[j]
                                        if (+a === +row.yan_zhong_cheng_d && +b === +row.fa_sheng_pin_du_) {
                                            degree = item.fen_ji_
                                            break
                                        }
                                    }
                                }
                            }
                        }

                        this.$set(row, 'feng_xian_ying_du', (!row.feng_xian_ying_du && degree === '低') ? '风险接受' : '风险降低')
                        row.feng_xian_zhi_shu = rate + ''
                        row.feng_xian_deng_ji = degree
                    }
                } else if (this.muban === '2') {
                    if (row.yan_zhong_cheng_d && row.fa_sheng_pin_du_ && row.ke_jian_ce_du_) {
                        let degree = ''
                        let rate = ''
                        rate = +row.yan_zhong_cheng_d * +row.fa_sheng_pin_du_ * +row.ke_jian_ce_du_
                        if (this.fengXianJiSuan.length === 0) {
                            if (rate >= 1 && rate <= 8) {
                                degree = '可忽略的'
                            }
                            if (rate >= 9 && rate <= 27) {
                                degree = '可接受的'
                            }
                            if (rate >= 28 && rate <= 63) {
                                degree = '中度的'
                            }
                            if (rate >= 64 && rate <= 99) {
                                degree = '重大的'
                            }
                            if (rate >= 100 && rate <= 125) {
                                degree = '不可接受的'
                            }
                        } else {
                            for (let i = 0; i < this.fengXianJiSuan.length; i++) {
                                const item = this.fengXianJiSuan[i]
                                if (item.yan_zhong_cheng_d) {
                                    const [a, b] = item.yan_zhong_cheng_d.split('-')
                                    if (a && b) {
                                        if (rate >= +a.trim() && rate <= +b.trim()) {
                                            degree = item.fen_ji_
                                            break
                                        }
                                    }
                                }
                            }
                        }

                        this.$set(row, 'feng_xian_ying_du', (!row.feng_xian_ying_du && (degree === '可忽略的' || degree === '可接受的')) ? '风险接受' : '风险降低')
                        row.feng_xian_zhi_shu = rate + ''
                        row.feng_xian_deng_ji = degree
                    }
                } else if (this.muban === '3') {
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
                                        if (rate >= +a.trim() && rate <= +b.trim()) {
                                            degree = item.fen_ji_
                                            break
                                        }
                                    }
                                }
                            }
                        }

                        this.$set(row, 'feng_xian_ying_du', (!row.feng_xian_ying_du && (degree === '低风险')) ? '风险接受' : '风险降低')
                        row.feng_xian_zhi_shu = rate + ''
                        row.feng_xian_deng_ji = degree
                    }
                }
            } catch (error) {
                this.$message.warning('风险系数计算错误，请检查风险模板配置数据是否正确！')
            }
        },
        check () {
            if (this.tableList.length === 0) {
                throw new Error('请选择风险项！')
            }
            for (let i = 0; i < this.tableList.length; i++) {
                const item = this.tableList[i]
                if (!item.feng_xian_zhi_shu) {
                    throw new Error(`第${i + 1}未计算风险指数，请填写相关数据！`)
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
        }
        .content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right{
                width: 300px;
            }
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
