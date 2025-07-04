<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        title="人员列表"
        class="user-list-dialog"
        @open="loadData"
        @close="closeDialog"
    >
        <ibps-crud
            ref="crud"
            v-loading="dialogLoading"
            :element-loading-text="$t('common.loading')"
            :pk-key="pkKey"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        />
        <!-- 人员选择器 -->
        <ibps-employee-selector-dialog
            :visible="selectorVisible"
            :value="[]"
            :show-tree="false"
            title="人员选择器"
            multiple
            @close="visible => selectorVisible = visible"
            @action-event="handleSelectorActionEvent"
        />
    </el-dialog>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import { queryByRoleId as queryPageList, addRoleUser, removeRoleUser } from '@/api/platform/org/employee'
import { statusOptions, genderOptions } from '../employee/constants'
import { sourceOptions } from './constants'
import ActionUtils from '@/utils/action'
import AtilUtils from '@/utils/util'
export default {
    components: {
        IbpsEmployeeSelectorDialog
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        id: String,
        positionList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        const { isSuper = false, deptList = [] } = this.$store.getters
        const { first = '', second = '' } = this.$store.getters.level
        const level = second || first
        return {
            isSuper,
            level,
            deptList,
            selectorVisible: false,
            dialogLoading: false,
            dialogVisible: false,
            loading: false,
            height: document.clientHeight,
            pkKey: 'id',
            pagination: {},
            sorts: {},
            listData: [],
            listConfig: {
                toolbars: [{
                    key: 'add',
                    label: '设置'
                }, {
                    key: 'remove',
                    label: '移除'
                }
                ],
                // 表格字段配置
                columns: [
                    { prop: 'name', label: '姓名', width: '100px' },
                    { prop: 'account', label: '用户名', width: '90px' },
                    { prop: 'positionsPath', label: '归属组织路径' },
                    { prop: 'gender', label: '性别', tags: genderOptions, width: '60px' },
                    { prop: 'createTime', label: '创建时间', width: '140px' },
                    { prop: 'status', label: '状态', tags: statusOptions, width: '75px' },
                    { prop: 'source', label: '用户来源', tags: sourceOptions, width: '85px' }
                ]
            }
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    mounted () {
        this.height = 455
    },
    methods: {
        getPositionsPath (valueList) {
            const postList = valueList.split(',')
            const list = []
            if (!postList.length) {
                return ''
            }
            postList.forEach((item) => {
                const temp = this.positionList.find(i => i.ID_ === item)
                const pathList = temp ? temp.PATH_.split('.') : []
                let p = ''
                pathList.filter(i => i).forEach(k => {
                    const t = this.positionList.find(i => i.ID_ === k)
                    p += `${t.NAME_}.`
                })
                list.push(p)
            })
            return list.join('\r\n')
        },
        // 加载数据
        loadData () {
            this.loading = true
            queryPageList(this.getSearcFormData()).then(response => {
                const { dataResult = [] } = response.data || {}
                dataResult.forEach(item => {
                    if (item.positions) {
                        // 转换岗位路径
                        const path = this.getPositionsPath(item.positions)
                        this.$set(item, 'positionsPath', path)
                    }
                })
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getSearcFormData () {
            const res = ActionUtils.formatParams({ roleId: this.id }, this.pagination, this.sorts)
            if (!this.isSuper) {
                res.customs = {
                    position: this.level
                }
            }
            return res
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        /**
         * 查询
         */
        search () {
            this.loadData()
        },
        closeDialog () {
            this.$emit('close', false)
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'add':// 添加
                    this.handleAdd()
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        // 处理 加入人员
        handleAdd () {
            this.selectorVisible = true
        },
        handleSelectorActionEvent (buttonKey, data) {
            switch (buttonKey) {
                case 'confirm':// 确定
                    this.handleConfirm(data)
                    break
            }
        },
        handleConfirm (data) {
            this.selectorVisible = false
            const userIdArr = data.map((d) => { return d.id })
            addRoleUser({
                roleId: this.id,
                userIds: userIdArr.join(',')
            }).then(response => {
                this.selectorVisible = false
                ActionUtils.success('加入人员成功!')
                this.search()
            })
            this.handleUpemployee('add', userIdArr.join(','))
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            if (!this.$utils.isEmpty(ids)) {
                for (let i = 0, arr = ids.split(','); i < arr.length; i++) {
                    for (let j = 0, listData = this.listData; j < listData.length; j++) {
                        if (listData[j].id === arr[i] && listData[j].source !== 'role') {
                            this.$message({
                                message: '【' + listData[j].name + '】是非自有角色用户，不允许删除，需要移除请到对应来源移除用户',
                                type: 'fail'
                            })
                            return
                        }
                    }
                }
            }
            removeRoleUser({ roleId: this.id, userIds: ids }).then(response => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
            this.handleUpemployee('remove', ids)
        },
        /**
         * 根据所选择的人员信息，修改对应人员的job_信息
         */
        handleUpemployee (type, ids) {
            const tableName = 'ibps_party_employee'
            // 更新ibps_party_employee里job_信息
            // const sql = `select ID_,JOB_ from ${tableName} where find_in_set(id_,'${ids}')`
            this.$common.request('query', {
                key: 'getPartyEmployeeByUids',
                params: [ids]
            }).then((res) => {
                const resDatas = res.variables.data
                const updListDatas = []
                for (const i of resDatas) {
                    const updListData = {
                        where: {
                            id_: i.ID_
                        },
                        param: {
                            JOB_: AtilUtils.addOrDelString(type, i.JOB_, this.id)
                        }
                    }

                    updListDatas.push(updListData)
                }
                const updateParams = {
                    tableName,
                    updList: updListDatas
                }
                this.$common.request('update', updateParams).then(() => {
                    console.log('更新数据成功')
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .user-list-dialog{
        .el-dialog__body{
            padding: 0;
        }
    }
</style>
