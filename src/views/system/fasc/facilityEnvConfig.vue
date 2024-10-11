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
                    <el-form ref="form" :model="form" label-width="74px" :rules="rules" :hide-required-asterisk="true">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="类型：" prop="lei_xing_">
                                    <template slot="label">
                                        <span class="required">类型：</span>
                                    </template>
                                    <el-select v-model="form.lei_xing_" placeholder="请选择" size="mini" style="width:80%" :disabled="isEdit">
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
                    </el-form>
                </div>
                <!-- <el-divider /> -->
                <div class="table">
                    <el-alert type="success" title="配置详情" :closable="false" />
                    <div class="hearder">
                        <div class="search">
                            <div class="search-item">
                                <span class="label">部门：</span>
                                <ibps-user-selector
                                    v-model="search.buMen"
                                    type="position"
                                    readonly-text="text"
                                    :disabled="false"
                                    :multiple="false"
                                    :filter="filter"
                                    filterable
                                    size="mini"
                                />
                            </div>
                            <div class="search-item">
                                <span class="label">区域：</span>
                                <el-input v-model="search.quYu" size="mini" placeholder="请输入" @keyup.enter.native="goSearch" />
                            </div>
                            <div class="search-item">
                                <span class="label">房间：</span>
                                <el-input v-model="search.fangJian" size="mini" placeholder="请输入" @keyup.enter.native="goSearch" />
                            </div>
                            <div class="search-item">
                                <span class="label">监测周期：</span>
                                <el-select v-model="search.zhouQi" placeholder="请选择" size="mini" :clearable="true">
                                    <el-option
                                        v-for="item in ['每日','每周','每月','每季度','每半年','每年']"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span class="label">监测岗位：</span>
                                <el-select v-model="search.gangWei" placeholder="请选择" size="mini" :clearable="true">
                                    <el-option
                                        v-for="item in jianCeGangWeiList"
                                        :key="item.id_"
                                        :label="item.wei_hu_gang_wei_"
                                        :value="item.wei_hu_gang_wei_"
                                    />
                                </el-select>
                            </div>
                            <div class="search-item" style="width:70px">
                                <el-button size="mini" type="primary" icon="el-icon-search" @click="goSearch">查询</el-button>
                            </div>
                            <div class="search-item" style="width:68px">
                                <el-button type="success" size="mini" icon="ibps-icon-plus" @click="openDialog">添加</el-button>
                            </div>
                            <div class="search-item" style="width:100px">
                                <el-button type="info" size="mini" icon="el-icon-setting" @click="settingData">批量配置</el-button>
                            </div>
                            <div class="search-item" style="width:70px">
                                <el-button type="danger" size="mini" icon="ibps-icon-close" @click="removeItem">删除</el-button>
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
            <FecDialog v-if="subDialogVisible" ref="FecDialogRef" @onSubmit="sonSubmit" @onClose="sonClose" />
            <DefaultSettingDialog
                ref="DefaultSettingDialogRef"
                :dialog-visible.sync="defultdialogVisible"
                :jian-ce-gang-wei-list="jianCeGangWeiList"
                :params="form"
                :day="dayCheck"
                :week="weekCheck"
                :month="monthCheck"
                :quarter="quarterCheck"
                :half-year="halfYearCheck"
                :year="yearCheck"
                :sep="sepCheck"
                @emitParent="handleSetting"
            />
        </div>
    </el-dialog>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import xlsx from 'xlsx'
import fs from 'file-saver'
import FecDialog from './fecDialog.vue'
import FacilityData from '@/views/component/facility/facilityData.vue'
import DefaultSettingDialog from './defaultSettingDialog.vue'
export default {
    components: {
        DefaultSettingDialog,
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
            defultdialogVisible: false,
            filter: [{
                descVal: '2',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
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
            toolbars: [{ key: 'save', label: '保存' }, { key: 'cancel', label: '退出', type: 'danger', icon: 'ibps-icon-close' }],
            dayCheck: [],
            weekCheck: '',
            monthCheck: '',
            quarterCheck: '',
            halfYearCheck: '',
            yearCheck: '',
            sepCheck: '',
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
                lie_biao_shu_ju_: '',
                kai_shi_shi_jian_: ''
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
                },
                '15-日常防护消毒': {
                    keyword: '',
                    path: '/sshjgl/aqgl/rcfhxd'
                }
            },
            subIdList: [],
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
            return !!(this.parentData instanceof Object && this.parentData.mainId)
        }
    },
    watch: {
        'form.lei_xing_' (val) {
            this.form.mo_kuai_lu_jing_ = this.config[val].path
            if (!this.isFirstLieBiao) {
                switch (val) {
                    case '01-室内温湿度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '上午温度', range: [], fixValue: '', value: '', result: '', status: '', unit: '℃' },
                            { label: '上午湿度', range: [], fixValue: '', value: '', result: '', status: '', unit: '%' },
                            { label: '下午温度', range: [], fixValue: '', value: '', result: '', status: '', unit: '℃' },
                            { label: '下午湿度', range: [], fixValue: '', value: '', result: '', status: '', unit: '%' }
                        ])
                        break
                    case '02-冰箱温度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '冷藏', range: [], fixValue: '', value: '', result: '', status: '', unit: '℃' },
                            { label: '冷冻', range: [], fixValue: '', value: '', result: '', status: '', unit: '℃' }
                        ])
                        break
                    case '03-温浴箱温度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '温度', range: [], fixValue: '', value: '', result: '', status: '', unit: '℃' }
                        ])
                        break
                    case '04-阴凉柜温度监控':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '温度', range: [], fixValue: '', value: '', result: '', status: '', unit: '℃' }
                        ])
                        break
                    case '05-纯水机水质监测':
                        this.form.lie_biao_shu_ju_ = JSON.stringify([
                            { label: '电阻率', range: [10, null], fixValue: '', value: '', result: '', status: '', unit: 'MΩ·CM' },
                            { label: '电导率', range: [0, 1], fixValue: '', value: '', result: '', status: '', unit: 'uS/cm' },
                            { label: '微生物含量', range: [0, 10], fixValue: '', value: '', result: '', status: '', unit: 'cfu/ml' }
                        ])
                        break
                    default:
                        delete this.form.lie_biao_shu_ju_
                        break
                }
            }
        }
    },
    mounted () {
        this.init()
        if (this.isEdit) {
            this.loadData()
            this.loadSubData()
        } else {
            this.isFirstLieBiao = false
        }
    },
    methods: {
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
            const sql = `select * from t_sshjpzb where id_='${this.parentData.mainId}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                // console.log('主表', data)
                if (!data.length) {
                    return this.$message.warning(``)
                }
                Object.assign(this.form, data[0])
                // this.form = data[0]
                const jian_ce_ri_qi_ = data[0].jian_ce_ri_qi_
                const ri_qi_lie_biao_ = data[0].ri_qi_lie_biao_
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
                            case '间隔':
                                this.sepCheck = +ri_qi_lie_biao_
                                break
                            default:
                                break
                        }
                    })
                }
                this.$nextTick(() => {
                    this.isFirstLieBiao = false
                })
            })
        },
        loadSubData () {
            const sql = `select * from t_sshjpzxq where parent_id_='${this.parentData.mainId}'`
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
        handleSetting (type) {
            this.form = this.$refs.DefaultSettingDialogRef.form
            if (this.subForm.length === 0) return this.$message.warning('配置详情列表中无数据，请先添加数据！')
            if (type === 'settingEmpty') this.settingEmpty()
            else if (type === 'settingAll') this.settingAll()
            this.defultdialogVisible = false
        },
        // 使用默认数据
        settingData () {
            if (this.form.lei_xing_ === '') {
                return this.$message.warning('请先选择类型！')
            }
            this.defultdialogVisible = true
        },
        settingAll () {
            this.subForm.forEach(item => {
                item.bu_men_ = this.form.bian_zhi_bu_men_
                item.jian_ce_gang_wei_ = this.form.gang_wei_
                item.kong_zhi_tiao_jia = this.form.tiao_jian_
                item.jian_ce_ri_qi_ = this.form.jian_ce_ri_qi_
                item.ri_qi_lie_biao_ = this.form.ri_qi_lie_biao_
                item.jian_ce_zhou_qi_ = this.form.zhou_qi_
                item.lie_biao_shu_ju_ = this.form.lie_biao_shu_ju_
                item.kai_shi_shi_jian_ = this.form.kai_shi_shi_jian_
            })
            this.$message.success('完全批量替换成功！')
            this.defultdialogVisible = false
        },
        // 使用默认数据
        settingEmpty () {
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
                if (item.kai_shi_shi_jian_ === '') {
                    item.kai_shi_shi_jian_ = this.form.kai_shi_shi_jian_
                }
                if (this.form.lie_biao_shu_ju_) {
                    if (item.lie_biao_shu_ju_) {
                        const main = JSON.parse(this.form.lie_biao_shu_ju_)
                        const sub = JSON.parse(item.lie_biao_shu_ju_)
                        if (sub.length === 0) {
                            item.lie_biao_shu_ju_ = JSON.stringify(sub)
                        }
                        if (sub.length > 0) {
                            sub.forEach((i, index) => {
                                if (i.label === main[index].label && (i.range.length === 0 || i.range.join(',') === [null, null].join(',') || i.range.join(',') === ['', ''].join(','))) {
                                    i.range = main[index].range
                                }
                                if (i.label === main[index].label && i.fixValue === '') {
                                    i.fixValue = main[index].fixValue
                                }
                                if (i.label === main[index].label && i.unit === '') {
                                    i.unit = main[index].unit
                                }
                            })
                            item.lie_biao_shu_ju_ = JSON.stringify(sub)
                        } else {
                            item.lie_biao_shu_ju_ = this.form.lie_biao_shu_ju_
                        }
                    } else {
                        item.lie_biao_shu_ju_ = this.form.lie_biao_shu_ju_
                    }
                }
            })
            this.$message.success('空值批量替换成功！')
            this.defultdialogVisible = false
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
        async submit () {
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
                if (this.isShowDevice && item.deviceno1_ === '') {
                    return this.$message.warning(`子表第${i + 1}行设备信息缺失！`)
                }
                if (this.form.lei_xing_ === '01-室内温湿度监控' && item.fang_jian_ === '') {
                    return this.$message.warning(`子表第${i + 1}行房间信息缺失！`)
                }
                if (item.lie_biao_shu_ju_) {
                    const lie_biao_shu_ju_ = JSON.parse(item.lie_biao_shu_ju_)
                    for (let i = 0; i < lie_biao_shu_ju_.length; i++) {
                        const item = lie_biao_shu_ju_[i]
                        if (!item.label && (item.range.length !== 2 || item.range[0] === null || item.range[1] === null) && (!item.fixValue) && (!item.unit)) {
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
                                lie_biao_shu_ju_: this.form.lie_biao_shu_ju_,
                                kai_shi_shi_jian_: this.form.kai_shi_shi_jian_
                            }

                        }
                    ]
                }
                await this.$common.request('update', params).then(async () => {
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
                                    deviceid1_: item.deviceid1_,
                                    deviceno2_: item.deviceno2_,
                                    deviceid2_: item.deviceid2_,
                                    fang_jian_: item.fang_jian_,
                                    fang_jian_id_: item.fang_jian_id_,
                                    jian_ce_gang_wei_: item.jian_ce_gang_wei_,
                                    jian_ce_ri_qi_: item.jian_ce_ri_qi_,
                                    jian_ce_zhou_qi_: item.jian_ce_zhou_qi_,
                                    kong_zhi_tiao_jia: item.kong_zhi_tiao_jia,
                                    lie_biao_shu_ju_: item.lie_biao_shu_ju_,
                                    qu_yu_: item.qu_yu_,
                                    ri_qi_lie_biao_: item.ri_qi_lie_biao_,
                                    shi_fou_qi_yong_: item.shi_fou_qi_yong_,
                                    zi_wai_deng_wai_j: item.zi_wai_deng_wai_j,
                                    kai_shi_shi_jian_: item.kai_shi_shi_jian_
                                }
                            })
                        }
                        await this.$common.request('add', params).then(() => { console.log('子表添加数据成功') })
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
                                    fang_jian_id_: item.fang_jian_id_,
                                    bu_men_: item.bu_men_,
                                    deviceno1_: item.deviceno1_,
                                    deviceid1_: item.deviceid1_,
                                    devicename1_: item.devicename1_,
                                    deviceno2_: item.deviceno2_, // 监控设备
                                    deviceid2_: item.deviceid2_,
                                    jian_ce_zhou_qi_: item.jian_ce_zhou_qi_,
                                    jian_ce_gang_wei_: item.jian_ce_gang_wei_,
                                    shi_fou_qi_yong_: item.shi_fou_qi_yong_,
                                    kong_zhi_tiao_jia: item.kong_zhi_tiao_jia,
                                    jian_ce_ri_qi_: item.jian_ce_ri_qi_,
                                    ri_qi_lie_biao_: item.ri_qi_lie_biao_,
                                    lie_biao_shu_ju_: item.lie_biao_shu_ju_,
                                    kai_shi_shi_jian_: item.kai_shi_shi_jian_
                                }
                            }))
                        }
                        await this.$common.request('update', params).then(() => { console.log('子表更新数据成功') })
                    }
                    if (deleteList.length) {
                        const params = {
                            tableName: 't_sshjpzxq',
                            paramWhere: { zi_wai_deng_wai_j: deleteList.join(',') }
                        }
                        await this.$common.request('delete', params).then(() => { console.log('子表删除数据成功') })
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
                await this.$common.request('add', params).then(async (res) => {
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
                                    deviceid1_: item.deviceid1_,
                                    deviceno2_: item.deviceno2_,
                                    deviceid2_: item.deviceid2_,
                                    fang_jian_: item.fang_jian_,
                                    fang_jian_id_: item.fang_jian_id_,
                                    jian_ce_gang_wei_: item.jian_ce_gang_wei_,
                                    jian_ce_ri_qi_: item.jian_ce_ri_qi_,
                                    jian_ce_zhou_qi_: item.jian_ce_zhou_qi_,
                                    kong_zhi_tiao_jia: item.kong_zhi_tiao_jia,
                                    lie_biao_shu_ju_: item.lie_biao_shu_ju_,
                                    qu_yu_: item.qu_yu_,
                                    ri_qi_lie_biao_: item.ri_qi_lie_biao_,
                                    shi_fou_qi_yong_: item.shi_fou_qi_yong_,
                                    zi_wai_deng_wai_j: item.zi_wai_deng_wai_j,
                                    kai_shi_shi_jian_: item.kai_shi_shi_jian_
                                }
                            })
                        }
                        await this.$common.request('add', params).then(() => {
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
                        she_shi_id_: item.zi_wai_deng_wai_j,
                        gang_wei_: item.jian_ce_gang_wei_,
                        shi_fou_ting_yong: item.shi_fou_qi_yong_
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
                            zi_wai_deng_ming_: item.devicename1_,
                            gang_wei_: item.jian_ce_gang_wei_,
                            shi_fou_ting_yong: item.shi_fou_qi_yong_
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
                await Promise.all(allRequests)
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
.sub-dialog{
    .contain{
        padding: 20px;
    }
}
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
        right:8vw;
    }
    .dialogtitle{
        font-size: 22px;
        font-family: SimHei;
        font-weight: bold;
        color: #222;
    }
}
.container {
        display: flex;
        width: 100%;
        justify-content: center;
        .el-row{
            margin: 0 !important;
        }
        .required{
            color: #606266 !important;
            &::before{
                content: '*';
                margin: 0 4px 0 -7.5px;
                color: #F56C6C;
            }
        }
        .main{
            width: 80%;
            height: calc(100vh - 100px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            overflow-y: auto;
            .form{
                .el-row{
                    margin: 10px 0;
                }
            }
        }
        .table{
            margin-top: 20px;
           .el-alert{
             margin-bottom: 20px;
           }
            .search{
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                .search-item{
                    .label{
                        font-size: 12px;
                        min-width: 74px;
                    }
                    display: flex;
                    align-items: center;
                    width: 240px;
                    margin: 0 10px 8px 0;
                }
            }
        }

    }
}
    ::v-deep {
        .el-form-item__label{
            text-align: left
        }
        .el-form-item__content{
            font-size: 12px !important;
            display: flex;
         }
    }
</style>
