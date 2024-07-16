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
                        slot="userIdSlot"
                        slot-scope="{row}"
                    >
                        <ibps-user-selector
                            type="user"
                            :value="row.id_"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="true"
                        />

                    </template>
                    <template
                        slot="positionIdSlot"
                        slot-scope="{row}"
                    >
                        <ibps-user-selector
                            type="position"
                            :value="row.positions_"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="true"
                        />
                    </template>

                    <template
                        slot="customButton"
                        slot-scope="{row}"
                    >
                        <el-button type="text" icon="el-icon-view" @click="goLook(row)">查阅</el-button>

                    </template>

                    <template slot="user">
                        <ibps-user-selector
                            v-model="user"
                            type="user"
                            readonly-text="text"
                            :multiple="true"
                        />
                    </template>
                    <template slot="position">
                        <ibps-user-selector
                            v-model="pos"
                            type="position"
                            readonly-text="text"
                            :multiple="false"
                        />
                    </template>
                    <template slot="time">
                        <el-date-picker
                            v-model="selectItem"
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
                </ibps-crud>
            </template>
        </ibps-container>
        <TrainingStatic v-if="dialogVisible" :params="params" @close="close" />

    </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import ibpsUserSelector from '@/business/platform/org/selector'

import { getUserStatisticList } from '@/api/platform/org/employee'
import TrainingStatic from './trainingStatic.vue'

export default {
    components: {
        ibpsUserSelector, TrainingStatic
    },
    mixins: [FixHeight],
    data () {
        const { level, userList } = this.$store.getters
        return {
            level: level.second || level.first,
            userList: userList,
            dialogVisible: false,
            params: {},
            loading: false,
            selectItem: '',
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
            allData: [],

            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            pkValue: '',
            templateKey: '',
            visible: false,
            categoryKey: '',
            tableTitle: '内部培训统计',
            listData: [],
            selectListData: [],
            bianlistData: {
                dataResult: [],
                pageResult: {
                    limit: 0,
                    page: 0,
                    totalCount: 0,
                    totalPages: 0
                }
            },
            //   listTreeData: [],
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: '', label: '姓名', fieldType: 'slot', slotName: 'user' },
                        { prop: '', label: '部门', fieldType: 'slot', slotName: 'position' },
                        { prop: '', label: '统计时段', fieldType: 'slot', slotName: 'time' }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'id_', label: '姓名', width: 100, slotName: 'userIdSlot' },
                    { prop: 'positions_', label: '部门', width: 120, slotName: 'positionIdSlot' },
                    { prop: 'jian_ding_zi_ge_z', label: '工号', width: 140 },
                    { prop: 'planedjoin', label: '应参训次数', width: 120 },
                    { prop: 'truejoin', label: '实参训次数', width: 120 },
                    { prop: 'participationRate', label: '参训率', width: 120 },
                    { label: '操作', width: 120, slotName: 'customButton' }
                ]
            },
            pagination: {
                limit: 20, page: 1
            },
            sorts: {},
            sqlWhere: {},
            searchWhere: {},
            user: '',
            pos: ''
        }
    },
    mounted () {
        this.getDatas()
    },

    methods: {
        close () {
            this.dialogVisible = false
            this.getDatas()
        },
        goLook (row) {
            this.params.peixunrenyuan = row.id_
            if (this.selectItem && this.selectItem.length > 0) {
                this.params.time = [this.selectItem[0], this.selectItem[1]]
            } else {
                delete this.params.time
            }
            this.dialogVisible = true
        },
        async getDatas () {
            this.loading = true
            const params = {
                diDian: this.level
            }
            if (this.user) {
                params.userId = this.user
            }
            if (this.pos) {
                params.deptId = this.pos
            }
            if (this.selectItem && this.selectItem.length > 0) {
                const [start, end] = this.selectItem
                params.startTime = start
                params.endTime = end
            }
            console.log('params', params)
            try {
                const { data: tempList } = await getUserStatisticList(params)
                console.log('接口数据', tempList)
                tempList.forEach(item => { item.jian_ding_zi_ge_z = item.jian_ding_zi_ge_z ? item.jian_ding_zi_ge_z : '/' })

                // 默认参训率排序
                tempList.sort((a, b) => {
                    return b.participationRate.split('%')[0] - a.participationRate.split('%')[0]
                })

                this.selectListData = JSON.parse(JSON.stringify(tempList))

                this.bianlistData.pageResult.totalCount = tempList.length
                this.bianlistData.pageResult.totalPages = Math.ceil(tempList.length / this.pagination.limit)
                this.bianlistData.pageResult.limit = this.pagination.limit
                this.bianlistData.pageResult.page = 1
                let filterDatas = []
                if (this.pagination.limit > tempList.length) {
                    filterDatas = JSON.parse(JSON.stringify(tempList))
                } else {
                    for (let index = 0; index < this.bianlistData.pageResult.limit; index++) {
                        filterDatas.push(tempList[index])
                    }
                }
                this.bianlistData.dataResult = filterDatas
                ActionUtils.handleListData(this, this.bianlistData)
                this.loading = false
            } catch (error) {
                if (error.message === '服务器君开小差了，请稍后再试') {
                    this.$message.error('找不到接口，请切换服务环境')
                }
                this.loading = false
            }
        },
        refreshData () {
            this.listData = []
            this.getDatas()
        },
        /**
 * 处理按钮事件
 */
        handleAction (command, position, selection, data, index, button) {
            switch (command) {
                case 'search':// 查询
                    this.refreshData()
                    break
                default:
                    break
            }
        },
        /**
    * 处理排序
    */
        handleSortChange (sort) {
            this.getDatas()
        },
        // 处理分页事件
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.bianlistData.pageResult.limit = page.limit
            this.bianlistData.pageResult.page = page.page
            const filterDatas = []
            if (this.selectListData.length >= (page.limit * page.page)) {
                for (let index = (page.limit * page.page) - page.limit; index < (page.limit * page.page); index++) {
                    filterDatas.push(this.selectListData[index])
                }
                this.bianlistData.dataResult = JSON.parse(JSON.stringify(filterDatas))
            } else {
                for (let index = (page.limit * page.page) - page.limit; index < this.selectListData.length; index++) {
                    filterDatas.push(this.selectListData[index])
                }
                this.bianlistData.dataResult = JSON.parse(JSON.stringify(filterDatas))
            }
            ActionUtils.handleListData(this, this.bianlistData)
        }
    }
}
</script>

