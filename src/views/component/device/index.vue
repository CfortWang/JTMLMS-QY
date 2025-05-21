<template>
    <div class="main-container">
        <ibps-container
            class="page"
        >
            <template>
                <ibps-crud
                    key="istree"
                    ref="crud"
                    :data="listData"
                    :toolbars="listConfig.toolbars"
                    :search-form="listConfig.searchForm"
                    :pk-key="pkKey"
                    :columns="listConfig.columns"
                    :loading="loading"
                    :pagination="pagination"
                    :display-field="tableTitle"
                    :index-row="false"
                    @sort-change="handleSortChange"
                    @action-event="handleAction"
                    @pagination-change="handlePaginationChange"
                >
                    <template
                        slot="posSlot"
                        slot-scope="{row}"
                    >
                        <ibps-user-selector
                            v-model="row.bianZhiBuMen"
                            type="position"
                            readonly-text="text"
                            :multiple="false"
                            :disabled="true"
                        />

                    </template>
                    <template
                        slot="userSlot"
                        slot-scope="{row}"
                    >
                        <ibps-user-selector
                            v-model="row.guanLiRen"
                            type="user"
                            readonly-text="text"
                            :multiple="true"
                            :disabled="true"
                        />

                    </template>

                    <template
                        slot="deviceSlot"
                        slot-scope="{row}"
                    >
                        <ibps-custom-dialog
                            v-model="row.weiHuFangShi"
                            size="mini"
                            template-key="sbbqdhk"
                            multiple
                            :disabled="true"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                            icon="el-icon-search"
                        />

                    </template>

                    <template
                        slot="deviceStateSlot"
                        slot-scope="{row}"
                    >
                        <span>{{ stateList[row.sheBeiZhuangTa] || row.sheBeiZhuangTa || '' }}</span>
                    </template>
                    <template
                        slot="deviceTypeSlot"
                        slot-scope="{row}"
                    >
                        <span>{{ typeList[row.sheBeiLeiXing] || row.sheBeiLeiXing || '' }}</span>
                    </template>

                    <template
                        slot="placeSlot"
                        slot-scope="{row}"
                    >
                        <ibps-custom-dialog
                            v-model="row.cunFangWeiZhi"
                            size="mini"
                            template-key="fjxzkdd"
                            multiple
                            :disabled="true"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                            icon="el-icon-search"
                        />

                    </template>

                    <template
                        slot="customButton"
                        slot-scope="{row}"
                    >
                        <el-button type="text" :icon="hasRole?'el-icon-edit-outline':'ibps-icon-eye'" @click="goEdit(row)">{{ hasRole?'修改':'查阅' }}</el-button>
                        <!-- <el-button type="text" icon="el-icon-view" @click="goLook(row)">查阅</el-button> -->
                        <el-button type="text" icon="ibps-icon-table" @click="goLookForm(row)">表单</el-button>

                    </template>
                    <template
                        slot="expandSlot"
                        slot-scope="{row}"
                    >
                        <el-row :gutter="20" style="height:145px;padding:0 20px 0 0" type="flex" align="middle">
                            <el-col :span="5" :push="2">
                                <el-row>
                                    <el-col :span="3">
                                        <el-image
                                            class="icon-image"
                                            :src="images[0]"
                                            fit="contain"
                                        />
                                    </el-col>
                                    <el-col :span="21">
                                        <div class="title">验收信息</div>
                                        <div class="ctx">
                                            <div class="item">接收日期：{{ row.jieShouRiQi || '/' }}</div>
                                            <div class="item">验收日期：{{ row.yanShouRiQi || '/' }}</div>
                                            <div class="item">核查日期：{{ row.biXuSheShi || '/' }}</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="5" :push="2">
                                <el-row>
                                    <el-col :span="3">
                                        <el-image
                                            class="icon-image"
                                            :src="images[1]"
                                            fit="contain"
                                        />
                                    </el-col>
                                    <el-col :span="21">
                                        <div class="title">建档信息</div>
                                        <div class="ctx">
                                            <div class="item">
                                                <div class="cusitem">
                                                    <span class="span">建档人：</span>
                                                    <ibps-user-selector
                                                        :value="row.bianZhiRen"
                                                        type="user"
                                                        readonly-text="text"
                                                        :multiple="true"
                                                        :disabled="true"
                                                        size="mini"
                                                        style="width:100px"
                                                    />
                                                </div>
                                            </div>
                                            <div class="item">
                                                <div class="cusitem">
                                                    <span class="span">建档部门：</span>
                                                    <ibps-user-selector
                                                        :value="row.bianZhiBuMen"
                                                        type="position"
                                                        readonly-text="text"
                                                        :disabled="true"
                                                        :multiple="false"
                                                        size="mini"
                                                        style="width:100px"
                                                    />
                                                </div>
                                            </div>
                                            <div class="item">建档时间：{{ row.bianZhiShiJian || '/' }}</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="5" :push="2">
                                <el-row>
                                    <el-col :span="3">
                                        <el-image
                                            class="icon-image"
                                            :src="images[2]"
                                            fit="contain"
                                        />
                                    </el-col>
                                    <el-col :span="21">
                                        <div class="title">维护信息</div>
                                        <div class="ctx">
                                            <div class="item">是否维护：{{ row.shiFouWeiHu || '/' }}</div>
                                            <div class="item">是否24H开机：{{ row.jianKongYiJu || '/' }}</div>
                                            <div class="item">是否限用：{{ row.xiaoZhunWuCha || '/' }}</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="5" :push="2">
                                <el-row>
                                    <el-col :span="3">
                                        <el-image
                                            class="icon-image"
                                            :src="images[3]"
                                            fit="contain"
                                        />
                                    </el-col>
                                    <el-col :span="21">
                                        <div class="title">校准信息</div>
                                        <div class="ctx">
                                            <div class="item">是否校准：{{ row.shiFouXiaoZhun || '/' }}</div>
                                            <div class="item">校准周期：{{ row.xiaoZhunZQ?`${row.xiaoZhunZQ}月` : '/' }}</div>
                                            <div class="item">最近校准时间：{{ row.yiXiaoRiQi || '/' }}</div>
                                            <div class="item">校准有效期至：{{ row.xiaoZhunYouXia || '/' }}</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" :push="1">
                                <el-row>
                                    <el-col :span="24">
                                        <el-image
                                            class="device-image"
                                            :src="ImageUrl(row)"
                                            fit="fill"
                                            :preview-src-list="ImageAllUrl(row)"
                                            :title="`[${row.sheBeiMingCheng}]设备首图，点击查看更多`"
                                        >
                                            <div slot="error" class="image-slot">
                                                <el-empty class="device-image" description="暂无图片" :image-size="70" />
                                            </div>
                                        </el-image>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                    <!-- 搜索条件 -->
                    <template slot="pos">
                        <ibps-user-selector
                            v-model="search.pos"
                            type="position"
                            readonly-text="text"
                            :multiple="true"
                            size="mini"
                            :filter="filter"
                            filtrate
                        />
                    </template>
                    <template slot="time">
                        <el-date-picker
                            v-model="search.time"
                            size="mini"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyy-MM-dd"
                        />
                    </template>
                    <template slot="validity">
                        <el-date-picker
                            v-model="search.validity"
                            size="mini"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyy-MM-dd"
                        />
                    </template>
                    <template slot="nowNumber">
                        <el-input v-model="search.nowNumber" size="mini" />
                    </template>
                    <template slot="preNumber">
                        <el-input v-model="search.preNumber" size="mini" />
                    </template>
                    <template slot="deviceName">
                        <el-input v-model="search.deviceName" size="mini" />
                    </template>
                    <template slot="deviceType">
                        <el-select v-model="search.deviceType" placeholder="请选择" size="mini" :clearable="true">
                            <el-option
                                v-for="(v,k) in typeList"
                                :key="k"
                                :label="v"
                                :value="k"
                            />
                        </el-select>
                    </template>
                    <template slot="deviceStatus">
                        <el-select v-model="search.deviceStatus" placeholder="请选择" size="mini" :clearable="true">
                            <el-option
                                v-for="(v,k) in stateList"
                                :key="k"
                                :label="v"
                                :value="k"
                            />
                        </el-select>
                    </template>
                    <!-- <template slot="place">
                        <el-input v-model="search.place" size="mini" />
                    </template> -->
                    <template slot="place">
                        <ibps-custom-dialog
                            v-model="search.place"
                            size="mini"
                            template-key="fjxzkdd"
                            multiple
                            :disabled="false"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                            icon="el-icon-search"
                        />
                    </template>
                    <template slot="managePeople">
                        <ibps-user-selector
                            v-model="search.managePeople"
                            type="user"
                            readonly-text="text"
                            :multiple="true"
                            size="mini"
                            :filter="filter"
                            filtrate
                        />
                    </template>
                    <template slot="deviceClass">
                        <ibps-custom-dialog
                            v-model="search.deviceClass"
                            size="mini"
                            template-key="sbbqdhk"
                            multiple
                            :disabled="false"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                            icon="el-icon-search"
                        />
                    </template>
                </ibps-crud>
            </template>
        </ibps-container>
        <DeviceDialog
            v-if="deviceDialogShow"
            :params="params"
            :state-list="stateList"
            :type-list="typeList"
            :tab-list="tabList"
            :hide-sys-device-no="hideSysDeviceNo"
            :readonly="!hasRole"
            @close="close"
        />
        <input id="" ref="file1" type="file" name="" accept=".xlsx,.xls" @change="handleUploadChange1">
        <input id="" ref="file2" type="file" name="" accept=".xlsx,.xls" @change="handleUploadChange2">

        <custom-dialog
            :visible="customDialogVisible"
            :value="[]"
            template-key="sbfzpz"
            :dynamic-params="{}"
            @close="(visible) => (customDialogVisible = visible)"
        />

        <bpmn-formrender
            :visible="npmDialogFormVisible"
            def-id="1120718364969271296"
            @close="visible => npmDialogFormVisible = visible"
        />
        <!-- <DeviceTagWeiNing v-if="tagName==='deviceTagWeiNing'" :scan-visible="printVisible" :obj="printObj" :state-list="stateList" @scanOff="scanOff" /> -->
        <DeviceTagTemplateTwo v-if="tagName==='deviceTagTemplateTwo'" :tag-data="tagData" :scan-visible="printVisible" :obj="printObj" :state-list="stateList" @scanOff="scanOff" />
        <DeviceTag v-else :scan-visible="printVisible" :obj="printObj" :tag-data="tagData" :state-list="stateList" @scanOff="scanOff" />
        <el-dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :top="'3vh'"
            :width="'90%'"
            class="js-custom-dialog"
            append-to-body
            :fullscreen="false"
            :visible.sync="iframeVisible"
        >
            <iframe :src="srcUrl" :height="'100%'" :width="'100%'" frameborder="0" scrolling="no" />
        </el-dialog>
    </div>
</template>

<script>
import { getSetting } from '@/utils/query'
import image01 from '@/assets/images/device/01.png'
import image02 from '@/assets/images/device/02.png'
import image03 from '@/assets/images/device/03.png'
import image04 from '@/assets/images/device/04.png'
import { getImage } from '@/api/platform/file/attachment'
import { download } from '@/api/platform/file/attachment'

import xlsx from 'xlsx'
import fs from 'file-saver'
import DataTemplateFormrenderDialog from '@/business/platform/data/templaterender/form/dialog.vue'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import ibpsUserSelector from '@/business/platform/org/selector'
import DeviceDialog from './deviceDialog.vue'
import { queryequipmentCard, removeEquipmentCard, getequipmentCard, saveEquipmentCard } from '@/api/platform/device/device'
import CustomDialog from '@/business/platform/data/templaterender/custom-dialog/dialog'
import dayjs from 'dayjs'
import DeviceTag from '@/views/system/jbdScan/goods/deviceTag.vue'
// import DeviceTagWeiNing from '@/views/system/jbdScan/goods/deviceTagWeiNing.vue'
import DeviceTagTemplateTwo from '@/views/system/jbdScan/goods/deviceTagTemplateTwo'
export default {
    components: {
        DeviceTag,
        // DeviceTagWeiNing,
        DeviceTagTemplateTwo,
        DataTemplateFormrenderDialog,
        DeviceDialog,
        ibpsUserSelector,
        CustomDialog,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    mixins: [FixHeight],
    data () {
        const { userId, level = {}, position } = this.$store.getters || {}
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
            images: [image01, image02, image03, image04],
            ImportDeviceType: '',
            iframeVisible: false,
            srcUrl: '',
            printObj: [],
            printVisible: false,
            DialogVisible: true,
            npmDialogFormVisible: false,
            customDialogVisible: false,
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
            },
            params: {},
            deviceDialogShow: false,
            position: position,
            level: level.second || level.first,
            userId: userId,
            search: {
                pos: '',
                time: [],
                nowNumber: '',
                preNumber: '',
                deviceName: '',
                deviceType: '',
                deviceStatus: '',
                place: '',
                managePeople: '',
                deviceClass: '',
                validity: ''
            },
            loading: false,
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            pkValue: '',
            templateKey: '',
            visible: false,
            categoryKey: '',
            tableTitle: '设备基本信息列表', // 标题
            listData: [],
            selectListData: [], // 全部数据
            bianlistData: {
                dataResult: [],
                pageResult: {
                    limit: 0,
                    page: 0,
                    totalCount: 0,
                    totalPages: 0
                }
            },
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    { key: 'customAdd', label: '设备建档', icon: 'ibps-icon-plus', type: 'success' },
                    { key: 'customBpm', label: '设备台账', icon: 'ibps-icon-file-text', type: 'info' },
                    { key: 'customPrint', label: '打印标签', icon: 'ibps-icon-cog', type: 'warning' },
                    { key: 'customExport', label: '导出数据', icon: 'ibps-icon-sign-in', type: 'primary' },
                    { key: 'customImport', label: '导入数据', icon: 'ibps-icon-sign-in', type: 'primary' },
                    { key: 'customSetting', label: '岗位/分组配置', icon: 'ibps-icon-cogs', type: 'info' },
                    { key: 'customRemove', label: '删除', icon: 'ibps-icon-close', type: 'danger', hidden: () => { return !this.hasRole } }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: '', label: '部门', fieldType: 'slot', slotName: 'pos' }, // user 插槽
                        { prop: '', label: '建档时间', fieldType: 'slot', slotName: 'time' },
                        { prop: '', label: '设备编号', fieldType: 'slot', slotName: 'nowNumber' },
                        { prop: '', label: '原设备编号', fieldType: 'slot', slotName: 'preNumber' },
                        { prop: '', label: '设备名称', fieldType: 'slot', slotName: 'deviceName' },
                        { prop: '', label: '设备类型', fieldType: 'slot', slotName: 'deviceType' },
                        { prop: '', label: '设备状态', fieldType: 'slot', slotName: 'deviceStatus' },
                        { prop: '', label: '放置地点', fieldType: 'slot', slotName: 'place' },
                        { prop: '', label: '管理人', fieldType: 'slot', slotName: 'managePeople' },
                        { prop: '', label: '岗位/分组', fieldType: 'slot', slotName: 'deviceClass' },
                        { prop: '', label: '校准有效期', fieldType: 'slot', slotName: 'validity' }
                    ]
                },
                // 表格字段配置
                columns: [
                    { type: 'expand', slotName: 'expandSlot' },
                    { prop: 'bianZhiBuMen', label: '部门', slotName: 'posSlot', sortable: true },
                    { prop: 'bianZhiShiJian', label: '建档时间', sortable: true },
                    { prop: 'sheBeiShiBieH', label: '设备编号', sortable: true },
                    { prop: 'yuanSheBeiBian', label: '原设备编号', sortable: true },
                    { prop: 'sheBeiMingCheng', label: '设备名称', sortable: true },
                    { prop: 'sheBeiLeiXing', label: '设备类型', sortable: true, slotName: 'deviceTypeSlot' },
                    { prop: 'guiGeXingHao', label: '规格型号', sortable: true },
                    { prop: 'sheBeiZhuangTa', label: '设备状态', sortable: true, slotName: 'deviceStateSlot' },
                    { prop: 'guanLiRen', label: '保管人', slotName: 'userSlot', sortable: true },
                    { prop: 'weiHuFangShi', label: '岗位/分组', slotName: 'deviceSlot', sortable: true },
                    { prop: 'cunFangWeiZhi', label: '放置地点', slotName: 'placeSlot', sortable: true },
                    { prop: '', label: '操作', width: 130, slotName: 'customButton' }
                ]
            },
            pagination: {
                limit: 20, page: 1
            },
            sorts: [{ field: 'BIAN_ZHI_SHI_JIAN', order: 'desc' }],
            sqlWhere: {},
            searchWhere: {},
            deviceColumns: {
                bianZhiBuMen: '部门',
                sheBeiMingCheng: '设备名称',
                // sheBeiShiBieH: '设备编号（导入无需填写）',
                yuanSheBeiBian: '原设备编号（必填，且不可重复）',
                sheBeiZhuangTa: '设备状态（合格/停用/限用）',
                sheBeiLeiXing: '设备类型（检验系统/通用设备/软件/信息系统）',
                shiFouWeiHu: '是否维护（是/否）',
                shiFouXiaoZhun: '是否校准（是/否）',
                weiHuFangShi: '岗位/分组',
                guiGeXingHao: '规格型号',
                cunFangDiDian: '存放地点（格式：房间号+空格+房间名）',
                guanLiRen: '保管人',
                ziChanBianHao: '资产编号',
                ziChanYuanZhi: '资产原值(元)',
                gongYingShang: '供应商',
                lianXiFangShi: '联系方式',
                changShang: '厂商',
                jiShenXuHao: '机身序号',
                zhuCeZhengHao: '注册证号',
                heChaXiaoZhun: '使用年限（年）',
                chuChangRiQi: '出厂日期',
                yanShouRiQi: '验收日期',
                jieShouRiQi: '接收日期',
                qiYongRiQi: '投入日期',
                yiXiaoRiQi: '已校日期',
                xiaoZhunZQ: '检定/校准周期（以月为单位）',
                xiaoZhunYouXia: '校准有效期至',
                shiYongKeShi: '检定/校准单位',
                ceLiangGongZuo: '预期测量范围',
                huanJingYaoQiu: '环境要求',
                dianYuanYaoQiu: '电源要求',
                jieShouZhuangTai: '接收时状态（新设备/二手或翻新设备）',
                jianDingXiao: '检定/校准参数',
                zuiDaYunCha: 'U/精确度/最大允差',
                zhengShuBianHa: '证书编号',
                xiuZhengZhiXiu: '修正值/修正因子',
                wenDuYingYong: '温度应用修正值',
                shiDuYingYong: '湿度应用修正值'
                // biXuDeHuanJin: '核查人',
                // biXuSheShi: '核查日期',
            },
            projectColums: {
                yuanSheBeiBian: '原设备编号*',
                sheBeiMingCheng: '设备名称*',
                weiHuLeiXing: '维护类型*(日保养/周保养/月保养/季度保养/半年保养/年保养/按需保养)',
                weiHuRiQi: '维护日期*',
                weiHuXiangMuC: '维护项目*'
            },
            dateFieldRange: ['chuChangRiQi', 'yanShouRiQi', 'jieShouRiQi', 'qiYongRiQi', 'yiXiaoRiQi', 'xiaoZhunYouXia'],
            requiredFieldMap: {
                bianZhiBuMen: '部门',
                sheBeiMingCheng: '设备名称',
                yuanSheBeiBian: '原设备编号',
                sheBeiZhuangTa: '设备状态',
                sheBeiLeiXing: '设备类型',
                shiFouWeiHu: '是否维护',
                shiFouXiaoZhun: '是否校准'
            },
            dateFieldsMap: {
                'chuChangRiQi': '出厂日期',
                'yanShouRiQi': '验收日期',
                'jieShouRiQi': '接收日期',
                'qiYongRiQi': '投入日期',
                'yiXiaoRiQi': '已校日期',
                'xiaoZhunYouXia': '校准有效期至'
                // 'biXuSheShi': '核查日期'
            },
            validationRules: {
                '设备状态': {
                    field: 'sheBeiZhuangTa',
                    range: ['合格', '停用', '限用']
                },
                '设备类型': {
                    field: 'sheBeiLeiXing',
                    range: ['检验系统', '通用设备', '软件', '信息系统']
                },
                '接收时状态': {
                    field: 'jieShouZhuangTai',
                    range: ['新设备', '二手或翻新设备']
                },
                '是否校准': {
                    field: 'shiFouXiaoZhun',
                    range: ['是', '否']
                },
                '是否维护': {
                    field: 'shiFouWeiHu',
                    range: ['是', '否']
                }
            },
            numberFieldsMap: {
                'xiaoZhunZQ': '检定/校准周期（以月为单位）',
                'heChaXiaoZhun': '使用年限（年）',
                'ziChanYuanZhi': '资产原值(元)'
            },
            maintenanceRequiredFieldMap: {
                yuanSheBeiBian: '原设备编号',
                sheBeiMingCheng: '设备名称',
                weiHuLeiXing: '维护类型',
                weiHuRiQi: '维护日期',
                weiHuXiangMuC: '维护项目'
            },
            maintenanceValidationRules: {
                '维护类型': {
                    field: 'weiHuLeiXing',
                    range: ['日保养', '周保养', '月保养', '季度保养', '半年保养', '年保养', '按需保养']
                }
            },
            maintenanceDateValidationRules: {
                '日保养': this.generateDayRule(),
                '周保养': this.generateRule(7, `每周`, ``),
                '月保养': this.generateRule(28, `每月第`, `日`),
                '半年保养': this.generateRule(6, `每半年第`, `个月`),
                '季度保养': this.generateRule(3, `每季度第`, `个月`),
                '年保养': this.generateRule(12, `每年第`, `个月`),
                '按需保养': ['/']
            },
            stateList: { '停用': '停用', '报废': '报废', '合格': '合格' },
            hideSysDeviceNo: false,
            tabList: {},
            hasRole: true,
            typeList: { '检验系统': '检验系统', '通用设备': '通用设备', '软件': '软件', '信息系统': '信息系统' },
            tagName: '',
            tagData: {}
        }
    },
    async mounted () {
        const { stateList, hideSysDeviceNo, tabList, hasDeviceRole, typeList } = await getSetting('device') || {}
        const { tagData, tagName } = await getSetting('deviceTag') || {}
        if (tagName) {
            console.debug('tagName', tagName)
            this.tagName = tagName
            this.tagData = tagData
        }
        if (hasDeviceRole) {
            console.debug('hasDeviceRole', hasDeviceRole)
            const { role, isSuper } = this.$store.getters || {}
            this.hasRole = isSuper || role.some(r => hasDeviceRole.includes(r.alias))
        }
        if (stateList) {
            console.debug('stateList', stateList)
            this.stateList = stateList
        }
        if (typeList) {
            console.debug('typeList', typeList)
            this.typeList = typeList
        }
        if (hideSysDeviceNo) {
            this.hideSysDeviceNo = hideSysDeviceNo
            // 列表隐藏设备编号 将原设备编号改为设备编号
            this.listConfig.columns = this.listConfig.columns.filter(i => i.prop !== 'sheBeiShiBieH')
            this.listConfig.columns.find(i => i.prop === 'yuanSheBeiBian').label = '设备编号'
            // 查询条件隐藏设备编号 将原设备编号改为设备编号
            this.listConfig.searchForm.forms = this.listConfig.searchForm.forms.filter(i => i.slotName !== 'nowNumber')
            this.listConfig.searchForm.forms.find(i => i.slotName === 'preNumber').label = '设备编号'
        }
        if (tabList) {
            console.debug('tabList', tabList)
            this.tabList = tabList
        }
        this.getDatas()
    },
    methods: {
        ImageAllUrl (row) {
            if (row && row.buMen) {
                const imgId = row.buMen.split(',')
                return imgId.map(item => getImage(item))
            }
            return []
        },
        ImageUrl (row) {
            if (row && row.buMen) {
                const imgId = row.buMen.split(',')[0]
                return getImage(imgId)
            }
            return ''
        },
        async getDatas () {
            this.loading = true
            const parameters = {
                relation: 'AND',
                parameters: []
            }
            // 增加地点过滤
            const obj = { relation: 'AND', parameters: [] }
            obj.parameters.push({ key: 'Q^di_dian_^S', value: this.level, param: this.$utils.guid() })
            parameters.parameters.push(obj)

            // 部门搜索(可多选)
            if (this.search.pos) {
                const obj = { relation: 'OR', parameters: [] }
                this.search.pos.split(',').forEach(item => {
                    obj.parameters.push({ key: 'Q^bian_zhi_bu_men_^S', value: item, param: this.$utils.guid() })
                })
                parameters.parameters.push(obj)
            }
            // 建档时间搜索
            if (this.search.time && this.search.time.length === 2) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^bian_zhi_shi_jian^DL^yyyy-MM-dd', value: this.search.time[0], param: this.$utils.guid() })
                obj.parameters.push({ key: 'Q^bian_zhi_shi_jian^DG^yyyy-MM-dd', value: this.search.time[1], param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            if (this.search.validity && this.search.validity.length === 2) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^xiao_zhun_you_xia^DL^yyyy-MM-dd', value: this.search.validity[0], param: this.$utils.guid() })
                obj.parameters.push({ key: 'Q^xiao_zhun_you_xia^DG^yyyy-MM-dd', value: this.search.validity[1], param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            // 设备编号搜索
            if (this.search.nowNumber) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^she_bei_shi_bie_h^SL', value: this.search.nowNumber, param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            // 原设备编号搜索
            if (this.search.preNumber) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^yuan_she_bei_bian^SL', value: this.search.preNumber, param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            // 设备名称搜索
            if (this.search.deviceName) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^she_bei_ming_cheng_^SL', value: this.search.deviceName, param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            // 设备类型搜索
            if (this.search.deviceType) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^she_bei_lei_xing_^S', value: this.search.deviceType, param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            // 设备状态搜索
            if (this.search.deviceStatus) {
                const obj = { relation: 'AND', parameters: [] }
                obj.parameters.push({ key: 'Q^she_bei_zhuang_ta^S', value: this.search.deviceStatus, param: this.$utils.guid() })
                parameters.parameters.push(obj)
            }
            // 放置地点搜索
            // if (this.search.place) {
            //     const obj = { relation: 'AND', parameters: [] }
            //     obj.parameters.push({ key: 'Q^cun_fang_di_dian_^SL', value: this.search.place, param: this.$utils.guid() })
            //     parameters.parameters.push(obj)
            // }
            if (this.search.place) {
                const obj = { relation: 'OR', parameters: [] }
                this.search.place.split(',').forEach(item => {
                    obj.parameters.push({ key: 'Q^cun_fang_wei_zhi_^S', value: item, param: this.$utils.guid() })
                })
                parameters.parameters.push(obj)
            }
            // 保管人搜索(可多选)
            if (this.search.managePeople) {
                const obj = { relation: 'OR', parameters: [] }
                this.search.managePeople.split(',').forEach(item => {
                    obj.parameters.push({ key: 'Q^guan_li_ren_^S', value: item, param: this.$utils.guid() })
                })
                parameters.parameters.push(obj)
            }
            // 岗位/分组搜索(可多选)
            if (this.search.deviceClass) {
                const obj = { relation: 'OR', parameters: [] }
                this.search.deviceClass.split(',').forEach(item => {
                    obj.parameters.push({ key: 'Q^wei_hu_fang_shi_^SL', value: item, param: this.$utils.guid() })
                })
                parameters.parameters.push(obj)
            }
            const params = {
                requestPage: {
                    pageNo: this.pagination.page,
                    limit: this.pagination.limit
                },
                sorts: this.sorts
            }
            if (parameters.parameters.length > 0) {
                params.parameters = [parameters]
            }

            const { data: { dataResult, pageResult }} = await queryequipmentCard(params)

            this.bianlistData.pageResult = pageResult
            this.bianlistData.dataResult = dataResult
            ActionUtils.handleListData(this, this.bianlistData) // 调用内置方法
            this.loading = false
        },
        // 查看表单
        goLookForm (row) {
            const first = this.$store.getters.level.first
            this.srcUrl = this.$reportPath.replace('show', 'pdf') + '设备/设备档案卡.rpx&id_=' + row.id + '&org_=' + first
            this.iframeVisible = true
        },
        // 按钮事件处理
        handleAction (command, position, selection, data, index, button) {
            switch (command) {
                case 'search':// 查询
                    this.getDatas()
                    break
                case 'customAdd':
                    this.handleCustomAdd()
                    break
                case 'customSetting':
                    this.handleCustomSetting()
                    break
                case 'customRemove':
                    this.handleCustomRemove(selection)
                    break
                case 'customExport':
                    this.handleCustomExport(selection, data)
                    break
                case 'customImport':
                    this.handleCustomImport()
                    break
                case 'customBpm':
                    this.handleCustomBpm()
                    break
                case 'customPrint':
                    this.handleCustomPrint(selection)
                    break
                default:
                    break
            }
        },
        // 打印标签
        handleCustomPrint (selection = []) {
            if (selection.length === 0) {
                return this.$message.warning('请先选择需要打印标签的数据！')
            }
            this.printObj = selection
            this.printVisible = true
        },
        // 关闭标签
        scanOff () {
            this.printVisible = false
        },
        // 设备台账
        handleCustomBpm () {
            this.npmDialogFormVisible = true
        },
        // 处理分页事件
        async handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.getDatas()
        },
        // 处理排序
        handleSortChange (sort) {
            function removeUnderscores (str) {
                return str.replace(/^_+|_+$/g, '')
            }
            const { order, sortBy } = sort
            let s = ''
            switch (sortBy) {
                case 'BIAN_ZHI_SHI_JIAN_':
                case 'SHE_BEI_SHI_BIE_H_':
                case 'YUAN_SHE_BEI_BIAN_':
                case 'SHE_BEI_ZHUANG_TA_':
                    s = removeUnderscores(sortBy)
                    break
                default:
                    s = sortBy
            }
            let o = null
            if (order === 'descending') {
                o = 'desc'
            } else if (order === 'ascending') {
                o = 'asc'
            }
            this.sorts = [{ field: s, order: o }]
            this.getDatas()
        },
        handleCustomAdd () {
            this.params = {}
            this.deviceDialogShow = true
        },
        close () {
            this.deviceDialogShow = false
            this.getDatas()
        },
        goEdit (row) {
            this.params = row
            this.deviceDialogShow = true
        },
        handleCustomSetting () {
            this.customDialogVisible = true
        },
        handleCustomRemove (selection) {
            if (!this.hasRole) return
            console.log('selection', selection)
            if (!selection || selection.length === 0) {
                return this.$message.warning('请选择要删除的数据！')
            }
            this.$confirm('确定删除所选项？删除后无法恢复！', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await removeEquipmentCard({
                    ids: selection + ''
                })
                // 删除后刷新
                await this.getDatas()
                this.$message.success('删除成功！')
            }).catch(() => {})
        },
        // 导出
        handleCustomExport (selection, data) {
            this.$confirm('请选择导出的类型', '提示', {
                confirmButtonText: '导出设备',
                cancelButtonText: '导出维护项目',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                distinguishCancelAndClose: true,
                type: 'info'
            }).then(() => {
                this.ExportDevice(selection, data)
            }).catch((action) => {
                if (action === 'close') return
                if (action === 'cancel') {
                    this.ExportProject(selection, data)
                }
            })
        },
        // 导入
        handleCustomImport () {
            this.$confirm('确请选择导入的类型', '提示', {
                confirmButtonText: '导入设备',
                cancelButtonText: '导入维护项目',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                distinguishCancelAndClose: true,
                type: 'info'
            }).then(() => {
                this.ImportDevice()
            }).catch((action) => {
                if (action === 'close') return
                if (action === 'cancel') {
                    this.$confirm('请选择设备维护项目导入类型', '提示', {
                        confirmButtonText: '增量添加',
                        cancelButtonText: '全量替换',
                        closeOnClickModal: false,
                        closeOnPressEscape: false,
                        distinguishCancelAndClose: true,
                        type: 'info'
                    }).then(() => {
                        this.ImportDeviceType = '增量添加'
                        this.ImportProject()
                    }).catch((action) => {
                        if (action === 'close') return
                        if (action === 'cancel') {
                            this.ImportDeviceType = '全量替换'
                            this.ImportProject()
                        }
                    })
                }
            })
        },
        // 导入设备
        ImportDevice () {
            this.$refs.file1.click()
            console.log('导入设备')
        },
        // 导入维护项目
        ImportProject () {
            this.$refs.file2.click()
            console.log('导入维护项目')
        },
        getTimeStamp () {
            return dayjs().format('YYYYMMDDHHmmss')
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
        async switchExportData (data) {
            const deviceGroupSql = `select id_,wei_hu_gang_wei_ from t_sbwhgwpzb` // 岗位/分组信息
            const supplierSql = `select id_,gong_ying_shang_m from t_gysxxb` // 供应商信息
            const { variables: { data: deviceGroupData }} = await this.$common.request('sql', deviceGroupSql)
            const { variables: { data: gysData }} = await this.$common.request('sql', supplierSql)
            const exportData = JSON.parse(JSON.stringify(data))
            for (let i = 0; i < exportData.length; i++) {
                const item = exportData[i]
                item.bianZhiBuMen = this.switchIdToDept(item.bianZhiBuMen.split(',')[0])
                item.guanLiRen = this.switchIdToUserName(item.guanLiRen.split(',')[0])
                // item.biXuDeHuanJin = this.switchIdToUserName(item.biXuDeHuanJin.split(',')[0])
                item.weiHuFangShi = this.switchDeviceIdToName(item.weiHuFangShi, deviceGroupData)
                item.shiYongKeShi = this.switchGYSIdToName(item.shiYongKeShi, gysData)
                if (this.stateList[item.sheBeiZhuangTa]) {
                    item.sheBeiZhuangTa = this.stateList[item.sheBeiZhuangTa]
                }
                if (this.typeList[item.sheBeiLeiXing]) {
                    item.sheBeiLeiXing = this.typeList[item.sheBeiLeiXing]
                }
            }
            return exportData
        },
        // 岗位/分组id 转 岗位/分组名称
        switchDeviceIdToName (val, deviceGroupList) {
            const result = []
            const valList = val?.split(',') || []
            valList.forEach(item => result.push((deviceGroupList?.find(i => i.id_ === item)?.wei_hu_gang_wei_) || ''))
            return result.join(',')
        },
        // 供应商id 转 供应商名称 检定/校准单位
        switchGYSIdToName (val, gysList) {
            const result = gysList.find(item => item.id_ === val)?.gong_ying_shang_m || ''
            return result
        },
        // 部门id 转 部门名称
        switchIdToDept (id) {
            const { deptList } = this.$store.getters
            const temp = deptList.find(item => item.positionId === id)
            return temp ? temp.positionName : ''
        },
        // 部门名称 转 部门id
        switchDeptToId (dep) {
            const { deptList } = this.$store.getters
            const temp = deptList.find(item => item.positionName === dep)
            return temp ? temp.positionId : ''
        },
        // 人员id 转人员名称
        switchIdToUserName (id) {
            const { userList } = this.$store.getters
            const temp = userList.find(item => item.userId === id)
            return temp ? temp.userName : ''
        },
        // 人员名称 转 人员id
        switchUserNameToId (name) {
            const { userList } = this.$store.getters
            const temp = userList.find(item => item.userName === name)
            return temp ? temp.userId : ''
        },
        // 导出设备
        async ExportDevice (selection, data = []) {
            const exportData = await this.switchExportData(data)
            this.xlsx(exportData, this.deviceColumns, '设备档案卡基本数据' + this.getTimeStamp())
            this.$message.success('导出设备成功！')
        },
        // 导出维护项目
        async ExportProject (selection = []) {
            let exportData = []
            console.log('导出维护项目')
            if (selection.length > 0) {
                const sql = `select b.yuan_she_bei_bian as yuanSheBeiBian,b.she_bei_ming_cheng_ as sheBeiMingCheng,a.parent_id_,a.wei_hu_xiang_mu_c as weiHuXiangMuC,a.wei_hu_ri_qi_ as weiHuRiQi,a.wei_hu_lei_xing_ as weiHuLeiXing,a.ri_qi_shu_zi_ as riQiShuZi from t_whzqjxm a,t_sbdj b where a.parent_id_=b.id_ and a.parent_id_ in (${selection.map(i => `'${i}'`).join(',')})`
                const { variables: { data }} = await this.$common.request('sql', sql)
                exportData = data
                this.xlsx(exportData, this.projectColums, '设备维护项目数据' + this.getTimeStamp())
            } else {
                const attachmentId = 'device_maintainProject'
                const res = await download({ attachmentId })
                // 判断 ArrayBuffer 的大小，主要用于兼容没有文件的情况
                if (res.data?.byteLength === 0) {
                    this.xlsx([], this.projectColums, '设备维护项目模板' + this.getTimeStamp())
                } else {
                    // const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    // a.href = URL.createObjectURL(blob)
                    a.href = res.request.responseURL
                    // a.download = '设备维护项目导入模板'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                }
            }
            this.$message.success('导出维护项目成功！')
        },
        // value 转 key
        switchV2K (value, obj) {
            const key = Object.keys(obj).find(key => obj[key] === value)
            return key || ''
        },
        // 转换对象的key
        switchDeviceObj (data, originalObj) {
            const result = []
            // data.forEach(item => {
            //     const obj = {}
            //     for (const key in item) {
            //         obj[this.switchV2K(key, originalObj)] = item[key]
            //     }
            //     result.push(obj)
            // })
            data.forEach(item => {
                const obj = {}
                for (const key in originalObj) {
                    // 对日期格式的数据做兼容处理
                    if (item[originalObj[key]] instanceof Date) {
                        obj[key] = dayjs(item[originalObj[key]]).add(8, 'hour').format('YYYY-MM-DD') || ''
                    } else {
                        obj[key] = String(item[originalObj[key]] || '')
                    }
                }
                result.push(obj)
            })
            return result
        },
        /* 读取文件 将文件转换为二进制 */
        readFile (file) {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.readAsBinaryString(file)
                reader.onload = ev => {
                    resolve(ev.target.result)
                }
            })
        },
        checkDeviceRequiredFieldsIfEmpty (list, requiredMap) {
            const msgList = []
            list.forEach((item, index) => {
                const invalidFieldNames = []
                Object.entries(requiredMap).forEach(([field, name]) => {
                    if (item.weiHuLeiXing === '按需保养' && field === 'weiHuRiQi') {
                        console.log('按需pass1')
                    } else {
                        if (!item[field]) {
                            invalidFieldNames.push(name)
                        }
                    }
                })
                if (invalidFieldNames.length > 0) {
                    msgList.push({ row: index + 2, field: invalidFieldNames })
                }
            })
            return msgList
        },
        /**
     * 专门发送提示
     * @param {*} allResult
     * @returns
     */
        sendWarningMessages (allResult, mark = 'range') {
            if (allResult.length < 1) {
                return
            }
            console.log('%c Msg Obj %c', 'background:#FF5733; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;', 'background:transparent', allResult)
            const item = allResult[0]
            switch (mark) {
                case 'required':
                    this.$message.warning(`第${item.row}行，字段【${item.field.join(',')}】的值不能为空！`)
                    break
                case 'range':
                    this.$message.warning(`第${item.row}行，字段【${item.field}】的值【${item.value}】不在限定范围内！`)
                    break
                case 'dateFormat':
                    this.$message.warning(`第${item.row}行，字段【${item.field}】日期格式错误!格式支持【2024-01-01】、【2024/01/01】，请检查您的数据！`)
                    break
                case 'duplicateOriginalDevice':
                    this.$message.warning(`${item.field}！`)
                    break
                default:
                    throw new Error(`${mark}类型未定义!`)
            }
        },
        /**
     * 根据规则校验字段的限定范围
     * @param {*} list
     */
        checkFieldsRange (list, rules) {
            const msgList = []
            for (const ruleKey in rules) {
                const rule = rules[ruleKey]
                const fieldName = ruleKey
                list.forEach((item, index) => {
                    const fieldValue = item[rule.field]
                    if (fieldValue && !rule.range.includes(fieldValue)) {
                        msgList.push({ row: index + 2, field: fieldName, value: fieldValue })
                    }
                })
            }
            return msgList
        },
        /**
     * 校验日期字段填写的格式
     * @param {*} list
     * @returns
     */
        checkDateFields (list) {
            const dateRegex = /^(\d{4})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])$/
            for (let i = 0; i < list.length; i++) {
                const row = list[i]
                for (const field in this.dateFieldsMap) {
                    if (row[field] && !dateRegex.test(row[field])) {
                        console.error('error field：', row[field])
                        return [{ row: i + 2, field: this.dateFieldsMap[field] }]
                    }
                }
            }
            return []
        },
        checkDuplicateOriginalDeviceNo (arr) {
            const occurrences = {}
            arr.forEach((item, index) => {
                const key = item.yuanSheBeiBian
                if (occurrences[key]) {
                    occurrences[key].push(index + 2)
                } else {
                    occurrences[key] = [index + 2]
                }
            })
            // 检查是否有重复项（数组长度大于1）
            for (const [key, indices] of Object.entries(occurrences)) {
                if (indices.length > 1) {
                    return [{ field: `发现重复的原设备编号：${key} 在第 ${indices.join(', ')} 行` }]
                }
            }
            return []
        },
        /**
     * 负责导入设备数据的第一部分校验，全部成功则返回true
     * @param {*} data
     * @returns
     */
        deviceInvalidPartOne (data) {
        // 校验必填信息
            const invalidResult = this.checkDeviceRequiredFieldsIfEmpty(data, this.requiredFieldMap)
            if (invalidResult.length > 0) {
                this.sendWarningMessages(invalidResult, 'required')
                return false
            }
            // 根据规则校验字段的限定范围
            const allResult = this.checkFieldsRange(data, this.validationRules)
            if (allResult.length > 0) {
                this.sendWarningMessages(allResult, 'range')
                return false
            }
            // 校验日期字段是否符合要求
            const dateResult = this.checkDateFields(data)
            if (dateResult.length > 0) {
                this.sendWarningMessages(dateResult, 'dateFormat')
                return false
            }
            // 校验是否存在重复的原设备编号
            const duplicateOriginalDeviceResult = this.checkDuplicateOriginalDeviceNo(data)
            if (duplicateOriginalDeviceResult.length > 0) {
                this.sendWarningMessages(duplicateOriginalDeviceResult, 'duplicateOriginalDevice')
                return false
            }
            return true
        },
        /**
     * 将日期字段信息格式化为 yyyy-MM-dd
     * @param {*} list
     * @returns
     */
        formatDateFieldsToReal (list) {
            list.forEach(item => {
                this.dateFieldRange.forEach(field => {
                    item[field] = item[field]?.replace(/\//g, '-')
                })
            })
            return list
        },
        getNextAlias () {
            return new Promise((resolve, reject) => {
                this.$common.getNextIdByAlias({
                    'alias': 'sbbh'
                }).then(response => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        /**
     * 过滤出来excel 的原设备编号存在当前数据库中的数据
     * @param {*} list 导入的数据
     */
        async filterOriginalDeviceNo (list, currentPosition) {
            const uniqueArr = Array.from(new Set(list.map(i => i.yuanSheBeiBian.trim())))
            const sql = `select id_,yuan_she_bei_bian from t_sbdj where find_in_set(yuan_she_bei_bian,'${uniqueArr.join(',')}')and di_dian_ = '${currentPosition}'`
            const res = await this.$common.request('sql', sql)
            const { data = [] } = res.variables || {}
            const originalDeviceNoList = data.map(i => i.yuan_she_bei_bian.trim())
            // 给要更新的数据加上id (接口需要!!!)
            data.forEach(item => {
                const temp = list.find(i => i.yuanSheBeiBian === item.yuan_she_bei_bian)
                temp.id = item.id_
            })
            return originalDeviceNoList || ''
        },
        /**
     *
     * @param {*} list excel数据
     * @param {*} currentTime 当前时间
     * @param {*} currentApartment 当前部门ID
     * @param {*} currentUser 当前用户ID
     * @param {*} currentPosition 当前地点ID
     */
        async handleBasicData (list, currentTime, currentApartment, currentUser, currentPosition, deptList) {
            // 使用map生成一个异步操作的数组
            const promises = list.map(async (element) => {
                element.bianZhiShiJian = currentTime
                element.bianZhiRen = currentUser
                element.diDian = currentPosition
                element.shiFouGuoShen = '已完成'
                const o = deptList?.find(i => i.positionName === element.bianZhiBuMen.trim())
                const { positionId = currentApartment } = o || {}
                element.bianZhiBuMen = positionId
                if (!element.id) {
                    // 获取下一个编号
                    element.sheBeiShiBieH = await this.getNextAlias()
                }
            })
            // 使用Promise.all并发执行所有异步操作
            await Promise.all(promises)
        },

        /**
     *
     * @param {*} list excel数据
     * @param {*} positionList 现有房间信息
     * @param {*} supplierList 现有供应商信息
     * @param {*} employeeList 现有人员信息
     * @returns
     */
        handleExcelData (list, positionList, supplierList, employeeList, deviceGroupList) {
            if (list.length < 1) {
                return
            }
            this.handleSupplierInfo(list, supplierList)
            this.handlePositionInfo(list, positionList)
            this.handlePersonInfo(list, employeeList)
            this.handleDeviceGroupInfo(list, deviceGroupList)
        },
        /**
     *
     * @param {*} list excel数据
     * @param {*} supplierList 现有供应商信息
     */
        handleSupplierInfo (list, supplierList) {
            list.forEach(element => {
                if (element.gongYingShang.trim()) {
                    const supplier = supplierList.find(i => i.gong_ying_shang_m === element.gongYingShang.trim())
                    if (supplier) {
                        element.shiFouQiJianH = supplier.id_
                    } else {
                        element.shiFouQiJianH = ''
                        element.gongYingShang = ''
                    }
                } else {
                    element.shiFouQiJianH = ''
                }

                if (element.shiYongKeShi.trim()) {
                    const supplier = supplierList.find(i => i.gong_ying_shang_m === element.shiYongKeShi.trim())
                    if (supplier) {
                        element.shiYongKeShi = supplier.id_
                    } else {
                        element.shiYongKeShi = ''
                    }
                } else {
                    element.shiYongKeShi = ''
                }
            })
        },
        /**
     *
     * @param {*} list excel数据
     * @param {*} positionList 现有房间信息
     */
        handlePositionInfo (list, positionList) {
            list.forEach(element => {
                if (element.cunFangDiDian !== '') {
                    const postion = positionList.find(i => (i.fang_jian_ming_ha.trim() || '') === element.cunFangDiDian.trim())
                    if (postion) {
                        const positionId = postion.id_
                        element.cunFangWeiZhi = positionId
                    } else {
                        element.cunFangWeiZhi = ''
                        element.cunFangDiDian = ''
                    }
                } else {
                    element.cunFangWeiZhi = ''
                }
            })
        },
        handlePersonInfo (list, employeeList) {
            list.forEach(element => {
            // 处理保管人
                if (element.guanLiRen !== '') {
                    const person = employeeList.find(i => i.userName === element.guanLiRen.trim())
                    if (person) {
                        const personId = person.userId
                        element.guanLiRen = personId
                    } else {
                        element.guanLiRen = ''
                    }
                } else {
                    element.guanLiRen = ''
                }
                // 处理核查人
                // if (element.biXuDeHuanJin !== '') {
                //     const checkPerson = employeeList.find(i => i.userName === element.biXuDeHuanJin.trim())
                //     if (checkPerson) {
                //         const checkPersonId = checkPerson.userId
                //         element.biXuDeHuanJin = checkPersonId
                //     } else {
                //         element.biXuDeHuanJin = ''
                //     }
                // } else {
                //     element.biXuDeHuanJin = ''
                // }
            })
        },
        handleDeviceGroupInfo (list, deviceGroupList) {
            list.forEach(element => {
                const result = []
                const { weiHuFangShi } = element
                const valList = weiHuFangShi.trim()?.split(',')
                valList.forEach(item => result.push((deviceGroupList?.find(i => i.wei_hu_gang_wei_ === item)?.id_) || ''))
                element.weiHuFangShi = result.join(',')
            })
        },
        async handleUploadChange1 (file) {
            const dataBinary = await this.readFile(file.target.files[0])
            file.target.value = null // 注意上传后要将input的值设为空
            const workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
            const workSheet = workBook.Sheets[workBook.SheetNames[0]]
            const data = xlsx.utils.sheet_to_json(workSheet)
            let importData = this.switchDeviceObj(data, { ...this.deviceColumns, t: '设备分组' }) // 这个t用于兼容老版本的模板
            importData.forEach(i => {
                delete i.sheBeiShiBieH // 设备编号需自动生成
                // i.sheBeiZhuangTa = '合格'
                const keyFound = Object.entries(this.stateList).find(([key, value]) => value === i.sheBeiZhuangTa)
                if (keyFound) {
                    i.sheBeiZhuangTa = keyFound[0]
                }
                const keyFound2 = Object.entries(this.typeList).find(([key, value]) => value === i.sheBeiLeiXing)
                if (keyFound2) {
                    i.sheBeiLeiXing = keyFound2[0]
                }
            })
            const isNewVersion = importData.some(i => i.weiHuFangShi) // 判断是否是最新模板
            if (isNewVersion) { // 使用岗位/分组
                importData.forEach(i => {
                    delete i.t
                })
            } else { // 使用设备分组
                importData.forEach(i => {
                    i.weiHuFangShi = i.t
                    delete i.t
                })
            }
            const currentPosition = this.level
            const { userList = [], deptList = [] } = this.$store.getters || {}
            const positionSql = `select id_,fang_jian_ming_ha from t_jjqfjb where di_dian_ = ${currentPosition}` // 房间信息
            const supplierSql = `select id_,gong_ying_shang_m from t_gysxxb where di_dian_ = ${currentPosition}` // 供应商信息
            const deviceGroupSql = `select id_,suo_shu_bu_men_,wei_hu_gang_wei_ from t_sbwhgwpzb where di_dian_ =  ${currentPosition}` // 岗位/分组信息
            const currentTime = dayjs().format('YYYY-MM-DD HH:mm')
            const currentApartment = this.$store.getters.userInfo.employee.positions.split(',').at(-1) || ''
            const currentUser = this.userId

            const partOneInvalidResult = this.deviceInvalidPartOne(importData)
            if (!partOneInvalidResult) return

            importData = this.formatDateFieldsToReal(importData)
            console.log('%c partOne doCheck is completed! %c the result is %c', 'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;', 'background:#FF5733; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;', 'background:transparent', importData)
            this.loading = true
            Promise.all([this.$common.request('sql', positionSql), this.$common.request('sql', supplierSql), this.$common.request('sql', deviceGroupSql)]).then(async ([res1, res2, res3]) => {
                const { data: positionList = [] } = res1.variables || {}
                const { data: supplierList = [] } = res2.variables || {}
                const { data: deviceGroupList = [] } = res3.variables || {}
                // 根据原设备编号去重，检验原设备编号是否在数据库中存在
                const originalDeviceNoList = await this.filterOriginalDeviceNo(importData, currentPosition)
                await this.handleBasicData(importData, currentTime, currentApartment, currentUser, currentPosition, deptList)
                this.handleExcelData(importData, positionList, supplierList, userList, deviceGroupList)
                // 分离出 已存在的设备，和新设备
                const newDeviceList = importData.filter(i => !originalDeviceNoList.includes(i.yuanSheBeiBian.trim()))
                const existDeviceList = importData.filter(i => originalDeviceNoList.includes(i.yuanSheBeiBian.trim()))
                console.log('%c new device %c', 'background:#FF5733; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;', 'background:transparent', newDeviceList)
                console.log('%c already exist device %c', 'background:#43f80c; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;', 'background:transparent', existDeviceList)
                this.loading = false
                this.$confirm(`<span style="color:#f56c6c; font-size: 18px; font-weight: 600;">
                                        经系统判定</span><br>1.预期新导入设备的数量为 ${newDeviceList.length} 台！<br>
                                        2.预期更新已存在的设备数量为 ${existDeviceList.length} 台！<br>
                                        <span style="color:#f56c6c;">Tips：请确认数据无误再点击确定进行导入</span><br><span style="color:#f56c6c; font-size: 18px; font-weight: 600;">请谨慎操作！</span>`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(async () => {
                    await this.doImportDevice(importData)
                    this.loading = true
                    setTimeout(() => {
                        this.loading = false
                        this.$message.success('设备数据导入成功!')
                        this.getDatas()
                    }, 1000)
                }).catch(() => { })
            }).catch(() => {
                this.loading = false
            })
        },
        async doImportDevice (existDeviceList, currentPosition) {
            this.loading = true
            const allRequests = []
            for (let index = 0; index < existDeviceList.length; index++) {
                const item = existDeviceList[index]
                let params = {}
                if (item.id) {
                    // 获取设备数据
                    const { data: itemData } = await getequipmentCard({ id: item.id })
                    params = { ...itemData, ...item } // 合并数据
                } else {
                    params = item // 直接使用当前 item
                }
                console.log(params)
                // 将每个 saveEquipmentCard 请求加入到 allRequests 数组中
                allRequests.push(saveEquipmentCard(params))
            }
            // 等待所有异步请求完成
            await Promise.all(allRequests)
            this.loading = false
        },
        generateDayRule () {
            const days = ['每周1', '每周2', '每周3', '每周4', '每周5', '每周6', '每周7']
            let combinations = []
            for (let length = 1; length <= days.length; length++) {
                this.generateCombinations([], days, combinations)
            }
            combinations = combinations.map(comb => '每周' + comb.map(item => item.slice(2)).join(','))
            combinations.push('每天')
            return combinations
        },
        generateRule (num, prefix, suffix) {
            return Array.from({ length: num }, (_, i) => prefix + `${i + 1}` + suffix)
        },
        generateCombinations (current, remaining, results) {
            if (remaining.length === 0) {
                results.push(current)
                return
            }
            const first = remaining[0]
            const rest = remaining.slice(1)
            // 包括当前数字和不包括当前数字两种情况
            this.generateCombinations(current.concat([first]), rest, results)
            this.generateCombinations(current, rest, results)
        },
        /**
     * 负责导入设备维护项目数据的第一部分校验，全部成功则返回true
     * @param {*} data
     * @returns
     */
        maintenanceInvalidPartOne (data) {
        // 1、对数据进行清洗校验（设备编号不能为空，维护周期、维护项目亦不可为空）
            const invalidResult = this.checkDeviceRequiredFieldsIfEmpty(data, this.maintenanceRequiredFieldMap)
            if (invalidResult.length > 0) {
                this.sendWarningMessages(invalidResult, 'required')
                return false
            }
            // 根据规则校验字段的限定范围
            const allResult = this.checkFieldsRange(data, this.maintenanceValidationRules)
            if (allResult.length > 0) {
                this.sendWarningMessages(allResult, 'range')
                return false
            }
            // 根据规则校验维护周期对应的维护日期的限定范围
            const result = this.checkMaintenanceDateRange(data, this.maintenanceDateValidationRules)
            if (result.length > 0) {
                this.sendWarningMessages(result, 'range')
                return false
            }
            return true
        },
        /**
     * 根据规则校验维护周期对应的维护日期的限定范围
     */
        checkMaintenanceDateRange (list, rules) {
            const msgList = []
            list.forEach(({ weiHuLeiXing: type, weiHuRiQi: exactDate }, index) => {
                if (type === '按需保养') {
                    console.log('按需pass2')
                } else {
                    if (!rules[type].includes(exactDate)) {
                        msgList.push({ row: index + 2, field: '维护日期', value: exactDate })
                    }
                }
            })
            return msgList
        },
        async handleUploadChange2 (file) {
            const dataBinary = await this.readFile(file.target.files[0])
            file.target.value = null // 注意上传后要将input的值设为空
            const workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
            const workSheet = workBook.Sheets[workBook.SheetNames[0]]
            const data = xlsx.utils.sheet_to_json(workSheet)
            const importData = this.switchDeviceObj(data, this.projectColums)
            console.log(importData)
            importData.forEach(item => {
                if (item.weiHuLeiXing === '按需保养') {
                    item.weiHuRiQi = '/'
                }
            })
            const currentPosition = this.level
            const { userList = [], deptList = [] } = this.$store.getters || {}
            const positionSql = `select id_,fang_jian_ming_ha from t_jjqfjb where di_dian_ = ${currentPosition}` // 房间信息
            const supplierSql = `select id_,gong_ying_shang_m from t_gysxxb where di_dian_ = ${currentPosition}` // 供应商信息
            const deviceGroupSql = `select id_,suo_shu_bu_men_,wei_hu_gang_wei_ from t_sbwhgwpzb where di_dian_ =  ${currentPosition}` // 岗位/分组信息
            const currentTime = dayjs().format('YYYY-MM-DD HH:mm')
            const currentApartment = this.$store.getters.userInfo.employee.positions
            const currentUser = this.userId

            const partOneInvalidResult = this.maintenanceInvalidPartOne(importData)
            if (!partOneInvalidResult) return

            // 2、根据原设备编号去重，检验原设备编号是否在数据库中存在，如有不存在的数据，不进行导入，并提示用户
            const uniqueArr = Array.from(new Set(importData.map(i => i.yuanSheBeiBian.trim())))
            /* 3、根据去重的设备编号去查对应的设备ID，然后拼接data数据，赋值设备ID*/
            const sql = `select id_,yuan_she_bei_bian from t_sbdj where find_in_set(yuan_she_bei_bian,'${uniqueArr.join(',')}')and di_dian_ = ${currentPosition}`
            this.$common.request('sql', sql).then(async res => {
                const deviceNoWithIdlist = res.variables.data
                console.log(deviceNoWithIdlist, ' <=> ', uniqueArr)
                const deviceNoSet = new Set(deviceNoWithIdlist.map(i => i.yuan_she_bei_bian))
                const missStr = uniqueArr.filter(i => !deviceNoSet.has(i)).join(',') || ''
                if (missStr !== '') {
                    this.$message.error(`设备维护项目数据中包含不存在于设备档案的原设备编号！具体原设备编号为：${missStr}`)
                    return
                }
                importData.forEach(item => {
                    item.id = deviceNoWithIdlist.find(i => i.yuan_she_bei_bian === item.yuanSheBeiBian).id_
                })

                const resultList = []
                importData.forEach(item => {
                    const flag = item.weiHuLeiXing === '日保养'
                    const match = item.weiHuRiQi?.match(/\d+/g)
                    const o = {
                        id: item.id,
                        weiHuLeiXing: item.weiHuLeiXing.trim(),
                        weiHuRiQi: item.weiHuRiQi?.trim() || '',
                        weiHuXiangMuC: item.weiHuXiangMuC.trim(),
                        riQiShuZi: match ? (flag ? match.join(',') : match[0]) : ''
                    }
                    if (o.weiHuLeiXing === '日保养' && o.weiHuRiQi === '每天') o.riQiShuZi = '1,2,3,4,5,6,7'
                    resultList.push(o)
                })
                // 4、根据用户选择 进行全量替换|增量添加
                await this.doProjectImport(deviceNoWithIdlist, resultList, this.ImportDeviceType)
                this.$message.success('维护项目数据' + this.ImportDeviceType + '成功!')
            })
        },
        async doProjectImport (deviceNoWithIdlist, resultList, type) {
            this.loading = true
            const allRequests = []
            deviceNoWithIdlist.forEach(async item => {
                const { data: itemData } = await getequipmentCard({ id: item.id_ })
                const temp = resultList.filter(i => i.id === item.id_).map(ii => {
                    delete ii.id
                    return ii
                })
                let params = {}
                if (type === '增量添加') { // 增量
                    params = {
                        ...itemData,
                        maintenanceItemPoList: [...itemData.maintenanceItemPoList, ...temp]
                    }
                } else if (type === '全量替换') { // 全量
                    params = {
                        ...itemData,
                        maintenanceItemPoList: temp
                    }
                }
                console.log('params', params)
                allRequests.push(saveEquipmentCard(params))
            })
            await Promise.all(allRequests)
            this.loading = false
        }
    }
}

</script>

<style lang="scss" scoped>
    .icon-image{
        width: 36px;
    }
    .device-image{
        width: 152px;
        height: 110px;
    }
    .title{
        font-size: 12px;
        font-weight: 900;
        color: #333;
        margin: 0 0 14px 20px;

    }
    .ctx{
        margin: 0 0 0 20px;
        .item{
            .cusitem{
                margin: -8px 0;
                display: flex;
                align-items: center;
            }
            .span{
                min-width:60px
            }
            margin: 6px 0;
            color: #999;
        }

    }
  ::v-deep {
        .el-form-item__label{
            text-align: left;
            font-size: 12px !important;
        }
        .el-form-item__ctx{
            font-size: 12px !important;
        }
    }
</style>
