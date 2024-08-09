<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog paper-detail-dialog"
        top="0"
    >
        <div slot="title" class="dialog-title">
            <span class="dialogtitle">{{ title }}</span>
            <div>
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </div>
        <div class="container">
            <div class="main">
                <div class="form">
                    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="类型：" prop="lei_xing_">
                                    <el-select v-model="form.lei_xing_" placeholder="请选择" size="mini" style="width:80%">
                                        <el-option
                                            v-for="(value,key) in config"
                                            :key="key"
                                            :label="key.split('-')[1]"
                                            :value="key"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="isShowDevice">
                            <el-col :span="24">
                                <el-form-item label="设备编号：">
                                    <ibps-custom-dialog
                                        v-model="form.she_bei_bian_hao_"
                                        size="mini"
                                        template-key="sbxzmcgl"
                                        :multiple="true"
                                        :disabled="false"
                                        type="dialog"
                                        class="custom-dialog"
                                        placeholder="请选择设备"
                                        icon="el-icon-search"
                                        style="width:90%"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-alert
                            title="默认数据，配置详情中的同名字段为空则使用以下默认数据"
                            type="success"
                            :closable="false"
                        />
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="部门：">
                                    <ibps-user-selector
                                        v-model="form.bian_zhi_bu_men_"
                                        size="mini"
                                        type="position"
                                        readonly-text="text"
                                        :disabled="false"
                                        :multiple="false"
                                        style="width:80%"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="监测岗位：">
                                    <el-select v-model="form.gang_wei_" placeholder="请选择" size="mini" style="width:80%">
                                        <el-option
                                            v-for="item in jianCeGangWeiList"
                                            :key="item.id_"
                                            :label="item.wei_hu_gang_wei_"
                                            :value="item.wei_hu_gang_wei_"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="监测周期：">
                                    <el-select v-model="form.zhou_qi_" placeholder="请选择" size="mini" style="width:80%">
                                        <el-option
                                            v-for="item in period"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="form.zhou_qi_!==''">
                            <el-col :span="12">
                                <el-form-item :label="labelShow">
                                    <el-checkbox-group v-if="form.zhou_qi_==='每日'" v-model="dayCheck">
                                        <el-checkbox :label="1">周一</el-checkbox>
                                        <el-checkbox :label="2">周二</el-checkbox>
                                        <el-checkbox :label="3">周三</el-checkbox>
                                        <el-checkbox :label="4">周四</el-checkbox>
                                        <el-checkbox :label="5">周五</el-checkbox>
                                        <el-checkbox :label="6">周六</el-checkbox>
                                        <el-checkbox :label="7">周日</el-checkbox>
                                    </el-checkbox-group>
                                    <template v-if="form.zhou_qi_==='每周'">
                                        <el-radio v-model="weekCheck" :label="1">周一</el-radio>
                                        <el-radio v-model="weekCheck" :label="2">周二</el-radio>
                                        <el-radio v-model="weekCheck" :label="3">周三</el-radio>
                                        <el-radio v-model="weekCheck" :label="4">周四</el-radio>
                                        <el-radio v-model="weekCheck" :label="5">周五</el-radio>
                                        <el-radio v-model="weekCheck" :label="6">周六</el-radio>
                                        <el-radio v-model="weekCheck" :label="7">周日</el-radio>
                                    </template>
                                    <el-select v-if="form.zhou_qi_==='每月'" v-model="monthCheck" placeholder="请选择">
                                        <el-option
                                            v-for="item in 28"
                                            :key="item"
                                            :label="`第${item}天`"
                                            :value="item"
                                        />
                                    </el-select>
                                    <el-select v-if="form.zhou_qi_==='每季度'" v-model="quarterCheck" placeholder="请选择">
                                        <el-option
                                            v-for="item in 3"
                                            :key="item"
                                            :label="`第${item}个月`"
                                            :value="item"
                                        />
                                    </el-select>
                                    <el-select v-if="form.zhou_qi_==='每半年'" v-model="halfYearCheck" placeholder="请选择">
                                        <el-option
                                            v-for="item in 6"
                                            :key="item"
                                            :label="`第${item}个月`"
                                            :value="item"
                                        />
                                    </el-select>
                                    <el-select v-if="form.zhou_qi_==='每年'" v-model="yearCheck" placeholder="请选择">
                                        <el-option
                                            v-for="item in 12"
                                            :key="item"
                                            :label="`第${item}个月`"
                                            :value="item"
                                        />
                                    </el-select>
                                </el-form-item>

                            </el-col>
                            <el-col v-if="nextDate" :span="12">
                                <el-form-item label="下次监测日期为：">
                                    <el-tag>{{ nextDate }}</el-tag>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="控制条件：">
                                    <el-input v-model="form.tiao_jian_" type="textarea" :rows="2" size="mini" style="width:80%" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <FacilityData v-if="form.lie_biao_shu_ju_" :form-data="{lieBiaoShuJu:form.lie_biao_shu_ju_}" :is-cul="false" @change-data="onFacilityData" />
                            </el-col>

                        </el-row>
                    </el-form>
                </div>
                <!-- <el-divider /> -->
                <div class="table">
                    <div class="hearder">
                        <div class="search">
                            <div class="search-item">
                                <span>部门：</span>
                                <ibps-user-selector
                                    v-model="search.buMen"
                                    type="position"
                                    readonly-text="text"
                                    :disabled="false"
                                    :multiple="false"
                                    style="width:100%"
                                    size="mini"
                                />
                            </div>
                            <div class="search-item">
                                <span>区域：</span>
                                <el-input v-model="search.quYu" size="mini" style="width:100%" placeholder="请输入" />
                            </div>
                            <div class="search-item">
                                <span>房间：</span>
                                <el-input v-model="search.fangJian" size="mini" style="width:100%" placeholder="请输入" />
                            </div>
                            <div class="search-item">
                                <span>监测周期：</span>
                                <el-select v-model="search.zhouQi" placeholder="请选择" size="mini" style="width:66%" :clearable="true">
                                    <el-option
                                        v-for="item in ['每日','每周','每月','每季度','每半年','每年']"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span>监测岗位：</span>
                                <el-select v-model="search.gangWei" placeholder="请选择" size="mini" style="width:66%" :clearable="true">
                                    <el-option
                                        v-for="item in jianCeGangWeiList"
                                        :key="item.id_"
                                        :label="item.wei_hu_gang_wei_"
                                        :value="item.wei_hu_gang_wei_"
                                    />
                                </el-select>
                            </div>
                            <div class="search-item" style="width:60px">
                                <el-button size="mini" type="primary" icon="el-icon-search" @click="goSearch">查询</el-button>
                            </div>
                            <div class="search-item" style="width:60px">
                                <el-button type="success" size="mini" icon="el-icon-plus" @click="openDialog">添加</el-button>
                            </div>
                            <div class="search-item" style="width:60px">
                                <el-upload
                                    ref="uploadRef"
                                    class="upload-demo"
                                    action=""
                                    accept=".xlsx,.xls"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    :on-change="handleUploadChange"
                                >
                                    <el-button type="primary" size="mini" icon="el-icon-upload2">导入</el-button>
                                </el-upload>
                            </div>
                            <div class="search-item" style="width:60px">
                                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
                            </div>
                            <div v-if="trueList.length>0" class="search-item" style="width:110px">
                                <el-button type="info" size="mini" icon="el-icon-setting" @click="settingData">使用默认数据</el-button>
                            </div>
                            <div class="search-item" style="width:60px">
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeItem">删除</el-button>
                            </div>
                        </div>
                    </div>
                    <el-table
                        :data="showPaperList"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            width="50"
                            type="selection"
                        />
                        <el-table-column
                            prop=""
                            label="序号"
                            width="50"
                            type="index"
                            :index="showIndex"
                        />
                        <el-table-column
                            prop="bu_men_"
                            label="部门"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <ibps-user-selector
                                    type="position"
                                    :value="row.bu_men_"
                                    readonly-text="text"
                                    :disabled="true"
                                    :multiple="true"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="qu_yu_"
                            label="区域"
                        />
                        <el-table-column
                            prop="fang_jian_"
                            label="房间"
                        />
                        <el-table-column
                            v-if="isShowDevice"
                            prop="deviceno1_"
                            label="被控设备编号"
                        />
                        <el-table-column
                            v-if="isShowDevice"
                            prop="devicename1_"
                            label="被控设备名称"
                        />
                        <el-table-column
                            prop="deviceno2_"
                            label="监控设备"
                        />
                        <el-table-column
                            prop="jian_ce_zhou_qi_"
                            label="监测周期"
                            width="80"
                        />
                        <el-table-column
                            prop="jian_ce_ri_qi_"
                            label="监测日期"
                            width="110"
                        />
                        <el-table-column
                            prop="jian_ce_gang_wei_"
                            label="监测岗位"
                        />
                        <el-table-column
                            prop="shi_fou_qi_yong_"
                            label="是否启用"
                            width="80"
                        >
                            <template slot-scope="{row}">
                                <el-tag v-if="row.shi_fou_qi_yong_==='1'">启用</el-tag>
                                <el-tag v-if="row.shi_fou_qi_yong_==='0'" type="danger">停用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            prop=""
                            label="操作栏目"
                        >
                            <template slot-scope="{row}">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="openDialog(row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        style="margin-top: 5px; padding-bottom: 10px"
                        :current-page="currentPage"
                        :page-sizes="[10, 20,30, 50]"
                        :page-size="pageSize"
                        layout="prev,pager,next,jumper,sizes,->,total"
                        :total="trueList.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </div>

        </div>
        <FecDialog v-if="subDialogVisible" ref="FecDialogRef" @onSubmit="sonSubmit" @onClose="sonClose" />
    </el-dialog>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import xlsx from 'xlsx'
import fs from 'file-saver'
import FecDialog from './fecDialog.vue'
import FacilityData from '@/views/component/facility/facilityData.vue'
export default {
    components: {
        FacilityData,
        ibpsUserSelector,
        FecDialog,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        parentData: {
            type: [Object, Array],
            default: () => {}
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userId, level = {}, position } = this.$store.getters || {}
        return {
            search: {
                buMen: '',
                quYu: '',
                fangJian: '',
                gangWei: '',
                zhouQi: ''
            },
            searchData: [],
            isSearch: false,
            level: level.second || level.first,
            userId: userId,
            pageSize: 10,
            currentPage: 1,
            multipleSelection: [],
            nextDate: '',
            rules: {
                lei_xing_: [
                    { required: true, message: '请选择类型', trigger: 'blur' }
                ]
            },
            jianCeGangWeiList: [],
            dialogVisible: true,
            subDialogVisible: false,
            title: '设施环境配置表',
            toolbars: [{ key: 'save', label: '保存' }, { key: 'cancel', label: '退出', type: 'danger' }],
            dayCheck: [],
            weekCheck: '',
            monthCheck: '',
            quarterCheck: '',
            halfYearCheck: '',
            yearCheck: '',
            form: {
                di_dian_: level.second || level.first,
                bian_zhi_ren_: userId,
                lei_xing_: '',
                bian_zhi_bu_men_: position && position.split(',')[0],
                zhou_qi_: '',
                gang_wei_: '',
                tiao_jian_: '',
                she_bei_bian_hao_: '', // 设备编号
                jian_ce_ri_qi_: '',
                ri_qi_lie_biao_: '',
                mo_kuai_lu_jing_: '',
                lie_biao_shu_ju_: ''
            },
            subForm: [

            ],
            period: [
                { label: '日监测', value: '每日' },
                { label: '周监测', value: '每周' },
                { label: '月监测', value: '每月' },
                { label: '季度监测', value: '每季度' },
                { label: '半年监测', value: '每半年' },
                { label: '年监测', value: '每年' }
            ],
            config: {
                '01-室内温湿度监控': {
                    keyword: '',
                    path: '/sshjgl/wdjc/snwsdjkcd'
                },
                '02-冰箱温度监控': {
                    keyword: '冰箱，冰柜，冷藏，冷冻，低温，恒温，生化培养箱',
                    path: '/sshjgl/wdjc/bxwdjc',
                    showDevice: true
                },
                '03-温浴箱温度监控': {
                    keyword: '',
                    path: '/sshjgl/wdjc/wyxwdjkywh',
                    showDevice: true
                },
                '04-阴凉柜温度监控': {
                    keyword: '',
                    path: '/sshjgl/wdjc/ylgwdjc',
                    showDevice: true
                },
                '05-纯水机水质监测': {
                    keyword: '',
                    path: '/sshjgl/csjszjcb',
                    showDevice: true
                },
                '06-每日安全检查': {
                    keyword: '',
                    path: '/sshjgl/aqgl/mraqjc'
                },
                // '07-每月安全检查': {
                //     keyword: '',
                //     path: '/sshjgl/aqgl/myaqjc'
                // },
                '08-含氯有效性监测': {
                    keyword: '',
                    path: '/sshjgl/aqgl/hlyxxjc'
                },
                // '09-紫外灯辐照测定': {
                //     keyword: '',
                //     path: '/sshjgl/aqgl/zwdfzd',
                //     showDevice: true
                // },
                '10-洗眼器检查': {
                    keyword: '',
                    path: '/sshjgl/aqgl/xyqjc',
                    showDevice: true
                },
                '11-紧急淋浴器检查': {
                    keyword: '',
                    path: '/sshjgl/aqgl/jjlyqjc',
                    showDevice: true
                },
                '12-紫外灯消毒': {
                    keyword: '',
                    path: '/sshjgl/aqgl/jykzwdxdjlb',
                    showDevice: true
                },
                '13-高压灭菌': {
                    keyword: '',
                    path: '/sshjgl/aqgl/gymjjlb',
                    showDevice: true
                },
                '14-空气消毒机': {
                    keyword: '',
                    path: '/sshjgl/aqgl/xdjsyjlb',
                    showDevice: true
                }
            },
            listHander: {
                bu_men_: '部门',
                qu_yu_: '区域',
                fang_jian_: '房间',
                deviceno1_: '被控设备编号',
                devicename1_: '被控设备名称',
                deviceno2_: '监控设备编号',
                jian_ce_zhou_qi_: '监测周期',
                jian_ce_ri_qi_: '监测日期',
                jian_ce_gang_wei_: '监测岗位',
                kong_zhi_tiao_jia: '控制条件'
            },
            subIdList: [],
            isFirstDevice: true,
            isFirstLieBiao: true
        }
    },
    computed: {
        // 分页结果
        showPaperList () {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.trueList.slice(start, end)
        },
        // 过滤结果
        trueList () {
            return this.isSearch ? this.searchData : this.subForm
        },
        isShowDevice () {
            return this.form.lei_xing_ !== '' && this.form.lei_xing_ !== '01-室内温湿度监控' && this.form.lei_xing_ !== '06-每日安全检查' && this.form.lei_xing_ !== '08-含氯有效性监测'
        },
        isEdit () {
            return this.parentData instanceof Object && this.parentData.mainId
        },
        labelShow () {
            return this.form.zhou_qi_.split('每')[1] + '监测日期：'
        }
    },
    watch: {
        'form.she_bei_bian_hao_' (val) {
            if (!this.isFirstDevice) {
                const sql = `select yuan_she_bei_bian,she_bei_ming_cheng_ from t_sbdj where find_in_set(id_, '${val}')`
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    data.forEach(item => {
                        const bianHao = item.yuan_she_bei_bian
                        const mingChneg = item.she_bei_ming_cheng_
                        const t = this.subForm.find(sub => sub.deviceno1_ === bianHao)
                        if (!t) {
                            this.subForm.push({
                                deviceno1_: bianHao,
                                devicename1_: mingChneg,
                                shi_fou_qi_yong_: '1',
                                bu_men_: this.form.bian_zhi_bu_men_,
                                jian_ce_gang_wei_: this.form.gang_wei_,
                                jian_ce_zhou_qi_: this.form.zhou_qi_,
                                kong_zhi_tiao_jia: this.form.tiao_jian_,
                                fang_jian_: '',
                                qu_yu_: '',
                                deviceno2_: '',
                                jian_ce_ri_qi_: this.form.jian_ce_ri_qi_,
                                ri_qi_lie_biao_: this.form.ri_qi_lie_biao_,
                                zi_wai_deng_wai_j: this.$utils.guid(),
                                lie_biao_shu_ju_: this.form.lie_biao_shu_ju_
                            })
                        }
                    })
                })
            }
        },
        'form.lei_xing_' (val) {
            this.form.mo_kuai_lu_jing_ = this.config[val].path
            if (!this.isFirstLieBiao) {
                switch (val) {
                    case '01-室内温湿度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '上午温度', range: [], fixValue: '', value: '', result: '', status: '' },
                            { label: '上午湿度', range: [], fixValue: '', value: '', result: '', status: '' },
                            { label: '下午温度', range: [], fixValue: '', value: '', result: '', status: '' },
                            { label: '下午湿度', range: [], fixValue: '', value: '', result: '', status: '' }
                        ])
                        break
                    case '02-冰箱温度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '冷藏', range: [], fixValue: '', value: '', result: '', status: '' },
                            { label: '冷冻', range: [], fixValue: '', value: '', result: '', status: '' }
                        ])
                        break
                    case '03-温浴箱温度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '温度', range: [], fixValue: '', value: '', result: '', status: '' }
                        ])
                        break
                    case '04-阴凉柜温度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '温度', range: [], fixValue: '', value: '', result: '', status: '' }
                        ])
                        break
                    default:
                        delete this.form.lie_biao_shu_ju_
                        break
                }
            }
        },
        'form.zhou_qi_' (val) {
            this.dayCheck = []
            this.weekCheck = ''
            this.monthCheck = ''
            this.quarterCheck = ''
            this.halfYearCheck = ''
            this.yearCheck = ''
            this.nextDate = ''
        },
        dayCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val.length === 0) {
                    this.nextDate = ''
                    return
                }
                const temp_val = JSON.parse(JSON.stringify(val))
                const today = new Date()
                temp_val.sort(function (a, b) {
                    return a - b
                })
                const num = temp_val.findIndex(e => e > today.getDay())
                if (temp_val.length > 0 && num !== -1) {
                    this.nextDate = this.getDayDate(temp_val[num], 0)
                } else if (temp_val.length > 0 && num === -1) {
                    this.nextDate = this.getDayDate(temp_val[0], 1)
                } else {
                    this.nextDate = ''
                }
            },
            immediate: true
        },
        weekCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const today = new Date()
                const weekNum = []
                weekNum.push(val)
                const num = weekNum.findIndex(e => e > today.getDay())
                if (val !== '' && num !== -1) {
                    this.nextDate = this.getDayDate(weekNum[0], 0)
                } else if (val !== '' && num === -1) {
                    this.nextDate = this.getDayDate(weekNum[0], 1)
                } else {
                    this.nextDate = ''
                }
            },
            immediate: true
        },
        monthCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const today = new Date()
                const day = today.getDate()
                const nextMonth = this.getNextMonthDate(today, val, 1)
                const currentMonth = this.getNextMonthDate(today, val, 0)
                this.nextDate = val > day ? currentMonth : nextMonth
            }
            // immediate: true
        },
        quarterCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const quarterList = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]
                const today = new Date()
                const month = today.getMonth() + 1
                const qu = this.getQuarter(today)
                const nowM = quarterList[qu - 1][val - 1]
                const nextM = quarterList[qu % 4][val - 1]

                const endMonth = month >= nowM ? nextM : nowM
                const yearPJ = today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.nextDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        halfYearCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const midList = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]]
                const today = new Date()
                const month = today.getMonth() + 1
                const qu = month > 6 ? 2 : 1
                const nowM = midList[qu - 1][val - 1]
                const nextM = midList[qu % 2][val - 1]

                const endMonth = month >= nowM ? nextM : nowM
                const yearPJ = today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.nextDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        yearCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const today = new Date()
                const month = today.getMonth() + 1
                const year = today.getFullYear()
                const qu = month >= val ? year + 1 : year
                const monthPJ = val > 9 ? val : '0' + val

                this.nextDate = qu + '-' + monthPJ + '-01'
            }
            // immediate: true
        }
    },
    mounted () {
        this.init()
        if (this.isEdit) {
            this.loadData()
            this.loadSubData()
        } else {
            this.isFirstDevice = false
            this.isFirstLieBiao = false
        }
    },
    methods: {
        // 接收自定义组件数据
        onFacilityData (...arg) {
            if (arg.length > 1) {
                this.form.lie_biao_shu_ju_ = arg[1]
            }
        },
        init () {
            this.loadSelectorData()
        },
        loadSelectorData () {
            const pos = this.$store.getters.level.second ? this.$store.getters.level.second : this.$store.getters.level.first
            const sql = `select * from t_sbwhgwpzb where di_dian_='${pos}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                this.jianCeGangWeiList = data
            })
        },
        loadData () {
            const sql = `select * from t_sshjpzb where id_=${this.parentData.mainId}`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                // console.log('主表', data)
                if (!data.length) {
                    return this.$message.warning(``)
                }
                this.form = data[0]
                const jian_ce_ri_qi_ = data[0].jian_ce_ri_qi_
                if (this.form.jian_ce_ri_qi_) {
                    this.$nextTick(() => {
                        switch (this.form.zhou_qi_) {
                            case '每日':
                                if (jian_ce_ri_qi_ === '每天') {
                                    this.dayCheck = [1, 2, 3, 4, 5, 6, 7]
                                } else {
                                    this.dayCheck = jian_ce_ri_qi_.split('每周')[1].split(',').map(item => +item)
                                }
                                break
                            case '每周':
                                this.weekCheck = +jian_ce_ri_qi_.split('每周')[1]
                                break
                            case '每月':
                                this.monthCheck = +jian_ce_ri_qi_.split('每个月第')[1].split('天')[0]
                                break
                            case '每季度':
                                this.quarterCheck = +jian_ce_ri_qi_.split('每季度第')[1].split('个月')[0]
                                break
                            case '每半年':
                                this.halfYearCheck = +jian_ce_ri_qi_.split('每半年第')[1].split('个月')[0]
                                break
                            case '每年':
                                this.yearCheck = +jian_ce_ri_qi_.split('每年第')[1].split('个月')[0]
                                break
                            default:
                                break
                        }
                    })
                }
                this.$nextTick(() => {
                    this.isFirstDevice = false
                    this.isFirstLieBiao = false
                })
            })
        },
        loadSubData () {
            const sql = `select * from t_sshjpzxq where parent_id_=${this.parentData.mainId}`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                // console.log('子表', data)
                if (!data.length) {
                    return this.$message.warning(``)
                }
                this.subForm = data
                this.subIdList = data.map(item => item.zi_wai_deng_wai_j)
            })
        },
        formatRiQi () {
            switch (this.form.zhou_qi_) {
                case '每日':
                    if (!this.dayCheck || this.dayCheck.length === 0) {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    } else if (this.dayCheck.length === 7) {
                        this.form.jian_ce_ri_qi_ = '每天'
                        this.form.ri_qi_lie_biao_ = '1,2,3,4,5,6,7'
                    } else {
                        const temp_dayCheck = JSON.parse(JSON.stringify(this.dayCheck))
                        temp_dayCheck.sort(function (a, b) {
                            return a - b
                        })
                        this.form.ri_qi_lie_biao_ = temp_dayCheck.join(',')
                        this.form.jian_ce_ri_qi_ = '每周' + temp_dayCheck.join(',')
                    }
                    break
                case '每周':
                    if (this.weekCheck) {
                        this.form.jian_ce_ri_qi_ = '每周' + this.weekCheck
                        this.form.ri_qi_lie_biao_ = this.weekCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每月':
                    if (this.monthCheck) {
                        this.form.jian_ce_ri_qi_ = '每个月第' + this.monthCheck + '天'
                        this.form.ri_qi_lie_biao_ = this.monthCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每季度':
                    if (this.quarterCheck) {
                        this.form.jian_ce_ri_qi_ = '每季度第' + this.quarterCheck + '个月'
                        this.form.ri_qi_lie_biao_ = this.quarterCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每半年':
                    if (this.halfYearCheck) {
                        this.form.jian_ce_ri_qi_ = '每半年第' + this.halfYearCheck + '个月'
                        this.form.ri_qi_lie_biao_ = this.halfYearCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每年':
                    if (this.yearCheck) {
                        this.form.jian_ce_ri_qi_ = '每年第' + this.yearCheck + '个月'
                        this.form.ri_qi_lie_biao_ = this.yearCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                default:
                    this.form.jian_ce_ri_qi_ = ''
                    this.form.ri_qi_lie_biao_ = ''
                    break
            }
        },
        // 使用默认数据
        settingData () {
            this.$confirm('使用默认数据后子表中为空的字段将会被以上数据代替，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.subForm.forEach(item => {
                        if (item.bu_men_ === '') {
                            item.bu_men_ = this.form.bian_zhi_bu_men_
                        }
                        if (item.jian_ce_gang_wei_ === '') {
                            item.jian_ce_gang_wei_ = this.form.gang_wei_
                        }
                        if (item.kong_zhi_tiao_jia === '') {
                            item.kong_zhi_tiao_jia = this.form.tiao_jian_
                        }
                        if (item.jian_ce_ri_qi_ === '') {
                            item.jian_ce_ri_qi_ = this.form.jian_ce_ri_qi_
                        }
                        if (item.ri_qi_lie_biao_ === '') {
                            item.ri_qi_lie_biao_ = this.form.ri_qi_lie_biao_
                        }
                        if (item.jian_ce_zhou_qi_ === '') {
                            item.jian_ce_zhou_qi_ = this.form.zhou_qi_
                        }
                        if (item.lie_biao_shu_ju_ && this.form.lie_biao_shu_ju_) {
                            const main = JSON.parse(this.form.lie_biao_shu_ju_)
                            const sub = JSON.parse(item.lie_biao_shu_ju_)
                            sub.forEach((i, index) => {
                                if (i.range.length === 0 || i.range === [null, null]) {
                                    i.range = main[index].range
                                }
                                if (i.fixValue === '') {
                                    i.fixValue = main[index].fixValue
                                }
                            })
                            item.lie_biao_shu_ju_ = JSON.stringify(sub)
                        }
                    })
                })
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.currentPage = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.currentPage - 1) * this.pageSize
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.dialogVisible = false
                    break
                case 'save':
                    this.saveResult()
                    break
                default:
                    break
            }
        },
        // 子表关闭事件
        sonClose () {
            this.subDialogVisible = false
        },
        // 子表单添加/编辑按钮
        openDialog (row) {
            if (this.form.lei_xing_ === '') {
                return this.$message.warning('请先选择类型！')
            }
            this.subDialogVisible = true
            this.$nextTick(() => {
                this.$refs.FecDialogRef.open(row, this.jianCeGangWeiList, this.form)
            })
        },
        // 子表的提交事件
        sonSubmit (data) {
            const { form, isEdit } = data
            if (isEdit) {
                const sub = this.subForm.find(item => item.zi_wai_deng_wai_j === form.zi_wai_deng_wai_j)
                if (sub) {
                    Object.assign(sub, form)
                }
            } else {
                this.subForm.push(form)
            }
            this.isEdit && this.goSearch()
            this.sonClose()
        },
        // 关闭当前窗口
        closeDialog () {
            this.dialogVisible = false
            this.$emit('close', false)
        },
        // 子表删除
        removeItem () {
            if (this.multipleSelection.length === 0) {
                return this.$message.warning('请选择要删除的数据！')
            } else {
                this.$confirm('请确认是否删除所选项?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(item => {
                        const index = this.subForm.indexOf(item)
                        this.subForm.splice(index, 1)
                    })
                    this.isEdit && this.goSearch()
                    this.$message.success('删除成功！')
                    this.multipleSelection = []
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        },
        // table复选框
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        submit () {
            if (this.subForm.length === 0) {
                return this.$message.warning('请添加子表数据')
            }
            for (var i = 0; i < this.subForm.length; i++) {
                const item = this.subForm[i]
                if (item.bu_men_ === '') {
                    return this.$message.warning(`子表第${i + 1}行部门信息缺失！`)
                }
                if (item.jian_ce_ri_qi_ === '') {
                    return this.$message.warning(`子表第${i + 1}行监测日期信息缺失！`)
                }
                if (item.jian_ce_gang_wei_ === '') {
                    return this.$message.warning(`子表第${i + 1}行监测岗位信息缺失！`)
                }
                if (item.lie_biao_shu_ju_) {
                    const lie_biao_shu_ju_ = JSON.parse(item.lie_biao_shu_ju_)
                    for (let i = 0; i < lie_biao_shu_ju_.length; i++) {
                        const item = lie_biao_shu_ju_[i]
                        if (!item.label && (item.range.length !== 2 || item.range[0] === null || item.range[1] === null) && (!item.fixValue)) {
                            return this.$message.warning(`第${i + 1}行数据非法！`)
                        }
                    }
                }
            }

            // console.log('主表', this.form)
            // console.log('子表', this.subForm)
            const allUid = this.subForm.map(item => item.zi_wai_deng_wai_j)
            const existUid = this.subIdList
            const addList = this.subForm.filter(item => !existUid.includes(item.zi_wai_deng_wai_j))
            const deleteList = existUid.filter(item => !allUid.includes(item))
            const updateList = this.subForm.filter(item => existUid.includes(item.zi_wai_deng_wai_j))
            // 主表修改
            if (this.isEdit) {
                const params = {
                    tableName: 't_sshjpzb',
                    updList: [
                        {
                            where: {
                                id_: this.parentData.mainId
                            },
                            param: {
                                lei_xing_: this.form.lei_xing_,
                                bian_zhi_bu_men_: this.form.bian_zhi_bu_men_,
                                zhou_qi_: this.form.zhou_qi_,
                                gang_wei_: this.form.gang_wei_,
                                tiao_jian_: this.form.tiao_jian_,
                                she_bei_bian_hao_: this.form.she_bei_bian_hao_,
                                jian_ce_ri_qi_: this.form.jian_ce_ri_qi_,
                                ri_qi_lie_biao_: this.form.ri_qi_lie_biao_,
                                mo_kuai_lu_jing_: this.form.mo_kuai_lu_jing_,
                                lie_biao_shu_ju_: this.form.lie_biao_shu_ju_
                            }

                        }
                    ]
                }
                this.$common.request('update', params).then(() => {
                    console.log('主表更新数据成功')
                    if (addList.length) {
                        const params = {
                            tableName: 't_sshjpzxq',
                            paramWhere: addList.map(item => {
                                return {
                                    parent_id_: this.parentData.mainId,
                                    bu_men_: item.bu_men_,
                                    devicename1_: item.devicename1_,
                                    deviceno1_: item.deviceno1_,
                                    deviceno2_: item.deviceno2_,
                                    fang_jian_: item.fang_jian_,
                                    jian_ce_gang_wei_: item.jian_ce_gang_wei_,
                                    jian_ce_ri_qi_: item.jian_ce_ri_qi_,
                                    jian_ce_zhou_qi_: item.jian_ce_zhou_qi_,
                                    kong_zhi_tiao_jia: item.kong_zhi_tiao_jia,
                                    lie_biao_shu_ju_: item.lie_biao_shu_ju_,
                                    qu_yu_: item.qu_yu_,
                                    ri_qi_lie_biao_: item.ri_qi_lie_biao_,
                                    shi_fou_qi_yong_: item.shi_fou_qi_yong_,
                                    zi_wai_deng_wai_j: item.zi_wai_deng_wai_j
                                }
                            })
                        }
                        this.$common.request('add', params).then(() => { console.log('子表添加数据成功') })
                    }
                    if (updateList.length) {
                        const params = {
                            tableName: 't_sshjpzxq',
                            updList: updateList.map(item => ({
                                where: {
                                    zi_wai_deng_wai_j: item.zi_wai_deng_wai_j
                                },
                                param: {
                                    qu_yu_: item.qu_yu_,
                                    fang_jian_: item.fang_jian_,
                                    bu_men_: item.bu_men_,
                                    deviceno1_: item.deviceno1_,
                                    devicename1_: item.devicename1_,
                                    deviceno2_: item.deviceno2_, // 监控设备
                                    jian_ce_zhou_qi_: item.jian_ce_zhou_qi_,
                                    jian_ce_gang_wei_: item.jian_ce_gang_wei_,
                                    shi_fou_qi_yong_: item.shi_fou_qi_yong_,
                                    kong_zhi_tiao_jia: item.kong_zhi_tiao_jia,
                                    jian_ce_ri_qi_: item.jian_ce_ri_qi_,
                                    ri_qi_lie_biao_: item.ri_qi_lie_biao_,
                                    lie_biao_shu_ju_: item.lie_biao_shu_ju_
                                }
                            }))
                        }
                        this.$common.request('update', params).then(() => { console.log('子表更新数据成功') })
                    }
                    if (deleteList.length) {
                        const params = {
                            tableName: 't_sshjpzxq',
                            paramWhere: { zi_wai_deng_wai_j: deleteList.join(',') }
                        }
                        this.$common.request('delete', params).then(() => { console.log('子表删除数据成功') })
                    }
                    this.$nextTick(() => {
                        this.$message.success('修改成功！')
                        this.closeDialog()
                    })
                })
            } else {
                const params = {
                    tableName: 't_sshjpzb',
                    paramWhere: [{
                        ...this.form
                    }]
                }
                this.$common.request('add', params).then((res) => {
                    console.log('主表新增数据成功')
                    const { cont = [] } = res.variables || {}
                    if (addList.length) {
                        const params = {
                            tableName: 't_sshjpzxq',
                            paramWhere: addList.map(item => {
                                return {
                                    parent_id_: cont[0].id_,
                                    bu_men_: item.bu_men_,
                                    devicename1_: item.devicename1_,
                                    deviceno1_: item.deviceno1_,
                                    deviceno2_: item.deviceno2_,
                                    fang_jian_: item.fang_jian_,
                                    jian_ce_gang_wei_: item.jian_ce_gang_wei_,
                                    jian_ce_ri_qi_: item.jian_ce_ri_qi_,
                                    jian_ce_zhou_qi_: item.jian_ce_zhou_qi_,
                                    kong_zhi_tiao_jia: item.kong_zhi_tiao_jia,
                                    lie_biao_shu_ju_: item.lie_biao_shu_ju_,
                                    qu_yu_: item.qu_yu_,
                                    ri_qi_lie_biao_: item.ri_qi_lie_biao_,
                                    shi_fou_qi_yong_: item.shi_fou_qi_yong_,
                                    zi_wai_deng_wai_j: item.zi_wai_deng_wai_j
                                }
                            })
                        }
                        this.$common.request('add', params).then(() => {
                            this.$message.success('添加成功！')
                            console.log('子表添加数据成功')
                            this.closeDialog()
                        })
                    }
                })
            }

            // 紫外灯数据同步更新紫外灯消毒记录表
            if (this.form.lei_xing_.includes('12')) {
                const tableName = 't_jykzwdxdjlbsc'
                // 生成添加请求参数
                const addParams = addList.length ? {
                    tableName,
                    paramWhere: addList.map(item => ({
                        di_dian_: this.level,
                        bian_zhi_bu_men_: item.bu_men_,
                        bian_zhi_ren_: this.userId,
                        zi_wai_deng_ming_: item.devicename1_,
                        she_shi_id_: item.zi_wai_deng_wai_j
                    }))
                } : null

                // 生成更新请求参数
                const updateParams = updateList.length ? {
                    tableName,
                    updList: updateList.map(item => ({
                        where: {
                            she_shi_id_: item.zi_wai_deng_wai_j
                        },
                        param: {
                            bian_zhi_bu_men_: item.bu_men_,
                            zi_wai_deng_ming_: item.devicename1_
                        }
                    }))
                } : null

                // 生成删除请求参数
                const deleteParams = deleteList.length ? {
                    tableName,
                    paramWhere: { she_shi_id_: deleteList.join(',') }
                } : null

                // 合并所有请求
                const allRequests = []

                if (addParams) {
                    allRequests.push(this.$common.request('add', addParams).then(() => console.log('添加紫外灯数据成功')))
                }

                if (updateParams) {
                    allRequests.push(this.$common.request('update', updateParams).then(() => console.log('更新紫外灯数据成功')))
                }

                if (deleteParams) {
                    allRequests.push(this.$common.request('delete', deleteParams).then(() => console.log('删除紫外灯数据成功')))
                }

                // 执行所有请求
                Promise.all(allRequests)
                    .then(() => console.log('所有请求完成'))
                    .catch(error => console.error('请求出错：', error))
            }
        },
        saveResult () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submit()
                } else {
                    this.$message.warning('请填写必填项')
                    return false
                }
            })
        },
        /* 读取文件 */
        readFile (file) {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.readAsBinaryString(file)
                reader.onload = ev => {
                    resolve(ev.target.result)
                }
            })
        },
        // 获取 excel 的 json 数据
        async handleUploadChange (file) {
            const dataBinary = await this.readFile(file.raw)
            const workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
            const workSheet = workBook.Sheets[workBook.SheetNames[0]]
            const data = xlsx.utils.sheet_to_json(workSheet)
            if (!this.form.lei_xing_) {
                return this.$message.warning('请先选择类型！')
            }
            if (data.length === 0) {
                return this.$message.warning('文件内容为空！')
            }
            data.forEach(item => {
                this.subForm.push({
                    deviceno1_: item['被控设备编号'] || '',
                    devicename1_: item['被控设备名称'] || '',
                    shi_fou_qi_yong_: '1',
                    bu_men_: this.switchDeptid(item['部门']),
                    jian_ce_gang_wei_: item['监测岗位'] || '',
                    jian_ce_zhou_qi_: item['监测周期'] || '',
                    kong_zhi_tiao_jia: item['控制条件'] || '',
                    fang_jian_: item['房间'] || '',
                    qu_yu_: item['区域'] || '',
                    deviceno2_: item['监控设备编号'] || '',
                    jian_ce_ri_qi_: '',
                    ri_qi_lie_biao_: '',
                    zi_wai_deng_wai_j: this.$utils.guid(),
                    lie_biao_shu_ju_: this.form.lie_biao_shu_ju_
                })
            })
            this.$message.success('导入成功！')
        },
        // 部门id转部门
        switchDept (dep) {
            const userList = this.$store.getters.userList
            for (let i = 0; i < userList.length; i++) {
                const user = userList[i]
                const positionId = user.positionId.split(',')
                const positions = user.positions.split(',')
                const pos = positionId.findIndex(p => p === dep)
                if (pos >= 0) {
                    return positions[pos]
                }
            }
        },
        // id 转部门
        switchDeptid (id) {
            const userList = this.$store.getters.userList
            for (let i = 0; i < userList.length; i++) {
                const user = userList[i]
                const positionId = user.positionId.split(',')
                const positions = user.positions.split(',')
                const pos = positions.findIndex(p => p === id)
                if (pos >= 0) {
                    return positionId[pos]
                }
            }
            return ''
        },
        // 导出
        exportExcel () {
            const temp_subForm = JSON.parse(JSON.stringify(this.subForm))
            temp_subForm.forEach(item => {
                item.bu_men_ = this.switchDept(item.bu_men_)
            })
            this.xlsx(temp_subForm, this.listHander, '设施环境配置表')
            this.$message.success('导出成功！')
        },
        xlsx (json, fields, filename = '.xlsx') { // 导出xlsx
            json.forEach(item => {
                for (const i in item) {
                    if (fields.hasOwnProperty(i)) {
                        item[fields[i]] = item[i]
                    }
                    delete item[i] // 删除原先的对象属性
                }
            })
            const sheetName = filename // excel的文件名称
            const wb = xlsx.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
            const ws = xlsx.utils.json_to_sheet(json, { header: Object.values(fields) }) // 将JS对象数组转换为工作表。
            wb.SheetNames.push(sheetName)
            wb.Sheets[sheetName] = ws
            const defaultCellStyle = { font: { name: 'Verdana', sz: 13, color: 'FF00FF88' }, fill: { fgColor: { rgb: 'FFFFAA00' }}}// 设置表格的样式
            const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } // 写入的样式
            const wbout = xlsx.write(wb, wopts)
            const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' })
            fs.saveAs(blob, filename + '.xlsx')
        },

        s2ab (s) {
            let buf
            if (typeof ArrayBuffer !== 'undefined') {
                buf = new ArrayBuffer(s.length)
                const view = new Uint8Array(buf)
                for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
                return buf
            } else {
                buf = new Array(s.length)
                for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
                return buf
            }
        },
        getDayDate (type, dates) {
            const now = new Date()
            const nowTime = now.getTime()
            const day = now.getDay()
            const longTime = 24 * 60 * 60 * 1000
            const n = longTime * 7 * (dates || 0)
            let dd = nowTime - (day - type) * longTime + n
            dd = new Date(dd)
            const y = dd.getFullYear()
            let m = dd.getMonth() + 1
            let d = dd.getDate()
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            const daynow = y + '-' + m + '-' + d
            return daynow
        },
        // 获取往后几个月相应的日期
        // currentDate：当前日期
        // dayOfMonth：获取几号
        // val：往后几个月
        getNextMonthDate (currentDate, dayOfMonth, val) {
            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.getMonth()
            const nextMonth = currentMonth + val

            const nextMonthDate = new Date(currentYear, nextMonth, dayOfMonth)
            const formattedDate = nextMonthDate.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            return formattedDate
        },
        // 获取当前季度
        getQuarter (date) {
            return Math.floor(date.getMonth() / 3) + 1
        },
        // 查询
        goSearch () {
            console.log(this.search)
            if (!this.search.buMen && !this.search.quYu && !this.search.fangJian && !this.search.zhouQi && !this.search.gangWei) {
                this.isSearch = false
            } else {
                // 条件过滤
                const searchData = this.subForm
                    .filter(item => item.bu_men_.indexOf(this.search.buMen) > -1)
                    .filter(item => item.qu_yu_.indexOf(this.search.quYu) > -1)
                    .filter(item => item.fang_jian_.indexOf(this.search.fangJian) > -1)
                    .filter(item => item.jian_ce_zhou_qi_.indexOf(this.search.zhouQi) > -1)
                    .filter(item => item.jian_ce_gang_wei_.indexOf(this.search.gangWei) > -1)
                this.isSearch = true
                this.searchData = searchData
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.paper-detail-dialog {
    ::v-deep {
        .el-dialog__header {
            text-align: center;
        }
    }
    .dialog-title{
    display: flex;
    align-items: center;
    justify-content: center;
    div{
        position: absolute;
        right:20px;
    }
    .dialogtitle{
        font-weight: 900;
    }
}
.container {
        display: flex;
        width: 100%;
        justify-content: center;

        .main{
            width: 80%;
            height: calc(100vh - 70px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            // overflow-y: auto;
            .form{
                .el-row{
                    margin: 10px 0;
                }
            }
        }
        .table{
            margin-top: 40px;
            .search{
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                .search-item{
                    span{
                        font-size: 12px;
                        width: 70px;
                        margin-right: 5px;
                    }
                    display: flex;
                    align-items: center;
                    width: 220px;
                    margin: 0 10px 10px 10px;
                }
            }
        }

    }
}
    ::v-deep {
        .el-form-item__label{
        text-align: left
        }
    }
</style>
