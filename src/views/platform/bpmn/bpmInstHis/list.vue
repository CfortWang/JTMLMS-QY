<template>
    <div class="main-container">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                :location="location"
                category-key="FLOW_TYPE"
                :has-permission="hasPermission"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <template-list v-if="templateShow" :template-data="templateData" />
        <ibps-crud
            v-else
            ref="crud"
            :style="{ marginLeft: width + 'px' }"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :display-field="tableTitle"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            :index-row="false"
            :selection-row="selection"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @column-link-click="handleLinkClick"
            @pagination-change="handlePaginationChange"
        >
            <template slot="creator" slot-scope="scope">{{ scope.row.createBy | getUserName(userList) }}</template>
            <template slot="selectCont" slot-scope="scope">
                <el-popover
                    :ref="'popover2-' + scope.row.id"
                    placement="bottom"
                    width="250"
                    popper-class="popverClass"
                    trigger="click"
                    @show="getReportAndFile(scope.row)"
                >
                    <div slot="reference" class="div_operation el-icon-s-order">查阅记录</div>
                    <div v-loading="fileLoading" class="div_content">
                        <!-- 获取所有输出报告-->
                        <!-- <template v-if="record.report.length && record.report[0]">
                            <div v-for="(item, index) in record.report" :key="index" class="content_item">
                                <span style="cursor: pointer;" @click="openReport(item, record.bizKey)">
                                    <i class="el-icon-tickets" style="font-size: 18px;" />
                                    {{ item | getReportName }}
                                </span>
                                <br>
                            </div>
                        </template> -->
                        <!-- 二级菜单，内审管审特有 -->
                        <template v-if="specialType.hasOwnProperty(typeId)">
                            <el-popover
                                :ref="'popover3-' + scope.row.id"
                                placement="left"
                                width="350"
                                popper-class="popverClass"
                                trigger="click"
                            >
                                <div slot="reference" class="sub_operation el-icon-s-order">{{ specialBtn[typeId].label }}</div>
                                <div v-if="record.special && record.special.length" class="div_content">
                                    <div v-for="(item, index) in record.special" :key="index" class="content_item">
                                        <div class="sub_content">
                                            <div class="title">{{ specialBtn[typeId].desc }}项{{ item.flag }}</div>
                                            <div class="sub_item">
                                                <div class="desc">{{ specialBtn[typeId].desc }}前</div>
                                                <ibps-attachment
                                                    v-model="item.beforeImprove"
                                                    placeholder="请选择"
                                                    :download="true"
                                                    :readonly="true"
                                                    accept="*"
                                                    :multiple="true"
                                                    upload-type="attachment"
                                                    store="id"
                                                    media-type=""
                                                    media=""
                                                    style="width: 100%;"
                                                />
                                            </div>
                                            <div class="sub_item">
                                                <div class="desc">{{ specialBtn[typeId].desc }}后</div>
                                                <ibps-attachment
                                                    v-model="item.afterImprove"
                                                    placeholder="请选择"
                                                    :download="true"
                                                    :readonly="true"
                                                    accept="*"
                                                    :multiple="true"
                                                    upload-type="attachment"
                                                    store="id"
                                                    media-type=""
                                                    media=""
                                                    style="width: 100%;"
                                                />
                                            </div>
                                            <div class="content_item">
                                                <span style="cursor: pointer;" @click="openReport(specialBtn[typeId].path, item.id_)">
                                                    <i class="el-icon-tickets" style="font-size: 14px;" />
                                                    {{ specialBtn[typeId].path | getReportName }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>无对应数据</div>
                            </el-popover>
                        </template>
                        <div v-if="record.file.length && snapshotId" class="content_item">
                            <!-- <div class="sub_operation">快照</div> -->
                            <ibps-attachment
                                v-model="snapshotId"
                                download
                                readonly
                                multiple
                                upload-type="attachment"
                                store="id"
                                style="width: 100%;"
                            />
                        </div>
                        <div v-if="record.file.length && fileId" class="content_item">
                            <div class="sub_operation">附件</div>
                            <ibps-attachment
                                v-model="fileId"
                                download
                                readonly
                                multiple
                                upload-type="attachment"
                                store="id"
                                style="width: 100%;"
                            />
                        </div>
                        <div v-if="!record.file.length || (!fileId && !snapshotId)">无快照及附件数据</div>
                    </div>
                </el-popover>
            </template>
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :instance-id="instanceId"
            @close="visible => dialogFormVisible = visible"
        />
        <el-dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :top="'3vh'"
            :width="'90%'"
            class="js-custom-dialog"
            append-to-body
            :fullscreen="false"
            :visible.sync="visible"
        >
            <iframe
                :src="srcUrl"
                :height="'100%'"
                :width="'100%'"
                frameborder="0"
                scrolling="no"
            />
        </el-dialog>
    </div>
</template>

<script>
import { queryPageList, queryClassify } from '@/api/platform/bpmn/bpmInstHis'
import ActionUtils from '@/utils/action'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import FixHeight from '@/mixins/height'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import { specialType, specialBtn, specialParams, specialTable, specialField } from './corresponding/index'
import TemplateList from './templateList'

export default {
    components: {
        IbpsTypeTree,
        BpmnFormrender,
        IbpsAttachment,
        TemplateList
    },
    filters: {
        // 截取报表名称
        getReportName (value) {
            // 通过/与.截取，eg: 43罗湖/L13-LHXBJY-QP-6.4-04 标准菌株管理程序/LHXBJY-QP-6.4-04-FQ-03 标准菌株鉴定验收记录表.rpx
            return value.slice(-value.split('').reverse().join('').indexOf('/'), -value.split('').reverse().join('').indexOf('.') - 1)
        },
        getUserName (v, list) {
            const user = list.find(i => i.userId === v)
            return user ? user.userName : ''
        }
    },
    mixins: [FixHeight],
    props: {
        location: {
            type: String,
            default: 'initial'
        }
    },
    data () {
        const { first = '' } = this.$store.getters.level || {}
        const { userList = [], deptList = [] } = this.$store.getters || {}
        return {
            first,
            userList,
            deptList,
            width: 210,
            selection: false,
            dialogFormVisible: false,
            // 编辑dialog需要使用
            instanceId: '',
            // 主键 如果主键不是pk需要传主键
            pkKey: 'id',
            tableTitle: '',
            typeId: '',
            srcUrl: '',
            fileId: '',
            snapshotId: '',
            // 判断多次点击
            isDisable: false,
            visible: false,
            record: {
                report: [],
                file: [],
                table: [],
                field: [],
                special: [],
                bizKey: ''
            },
            title: '',
            loading: true,
            fileLoading: false,
            height: document.clientHeight,
            reportAll: {
                process: [],
                template: []
            },
            templateShow: false,
            templateData: {},
            listData: [],
            pagination: {},
            sorts: { END_TIME_: 'DESC' },
            // 默认过滤部分分类
            hasPermission: true,
            specialType,
            specialBtn,
            listConfig: {
                toolbars: [
                    { key: 'search' }
                ],
                searchForm: {
                    forms: [
                        // { prop: 'Q^subject_^SL', label: '关键字', itemWidth: 330, placeholder: '可输入年份/部门/表单名称/事务说明/编制人模糊查询' },
                        { prop: 'dept', label: '部门', itemWidth: 150, placeholder: '请输入', labelWidth: 50 },
                        { prop: 'tableName', label: '表单名称', itemWidth: 150, placeholder: '请输入', labelWidth: 70 },
                        { prop: 'desc', label: '事务说明', itemWidth: 150, placeholder: '请输入', labelWidth: 70 },
                        { prop: 'createBy', label: '编制人', itemWidth: 150, placeholder: '请输入', labelWidth: 60 },
                        { prop: ['Q^end_time_^DL', 'Q^end_time_^DG'], label: '完成时间', fieldType: 'daterange', labelWidth: 70, itemWidth: 220 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'deptName', label: '部门', width: 85 },
                    { prop: 'procDefName', label: '表单名称', formatter: this.replaceFormName, width: 220 },
                    { prop: 'desc', label: '事务说明', 'min-width': 280 },
                    { prop: 'endTime', label: '完成时间', sortable: 'custom', width: 135 },
                    { prop: 'createBy', label: '编制人', width: 70, slotName: 'creator' }
                ],
                rowHandle: {
                    actions: [
                        // {
                        //     key: 'detail',
                        //     label: '详情',
                        //     type: 'info'
                        // }
                    ],
                    effect: 'display',
                    width: '100'
                }
            }
        }
    },
    created () {
        this.loadData()
        this.getConfig()
        const roleList = this.$store.getters.userInfo.role
        // 系统管理角色添加删除按钮
        const hasRole = roleList.some(item => item.name === '系统管理角色')
        this.listConfig.toolbars.push({
            key: 'detail',
            label: '详情',
            type: 'info'
        })
        if (hasRole) {
            // 系统管理角色不做分类过滤
            // this.hasPermission = false
            const btn = [
                {
                    key: 'remove',
                    label: '删除',
                    type: 'danger'
                }
            ]
            this.listConfig.toolbars.push(...btn)
            this.selection = true
        }
    },
    methods: {
        replaceFormName (row, column, cellValue, index) {
            const t = cellValue === '管理评审计划'
            if (t) {
                return '管理评审'
            }
            return cellValue
        },
        // 截取事务说明字段内容
        getDesc (str) {
            const hasDesc = str.includes('#')
            if (!hasDesc) {
                return ''
            }
            return str.split('#')[1]
        },
        getInfo (val) {
            const arr = val.split('#')
            if (!arr[2]) {
                return ''
            }
            const result = JSON.parse(`{${arr[2]}}`)
            const depts = result.dept.split(',')
            const deptNames = []
            depts.forEach(item => {
                const t = this.deptList.find(i => i.positionId === item)
                deptNames.push(t ? t.positionName : result.dept)
            })
            result.deptName = deptNames.join(',')
            return result
        },
        // 加载数据
        loadData () {
            this.loading = true
            queryClassify(this.getSearcFormData()).then((response) => {
                const { dataResult = [] } = response.data || {}
                dataResult.forEach(item => {
                    const temp = this.getInfo(item.subject)
                    item.deptName = temp ? temp.deptName : ''
                    item.desc = this.getDesc(item.subject)
                })
                response.data.dataResult = dataResult
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        // 获取所有流程的报表配置数据
        getConfig () {
            const sql = `select * from t_lcidglbdbb`
            this.$common.request('sql', sql).then((res) => {
                const { data = [] } = res.variables || {}
                data.forEach(i => {
                    if (!i.gui_dang_lei_xing) {
                        this.reportAll.process.push(i)
                    } else {
                        this.reportAll[i.gui_dang_lei_xing].push(i)
                    }
                })
            }).catch(err => {
                this.$message.error('获取流程配置报表数据失败！')
                console.log(err)
            })
        },
        // 获取报表数据及附件数据
        getReportAndFile ({ procDefKey, bizKey, subject }) {
            // 每次获取前先清除原先数据
            this.record = {
                report: [],
                file: [],
                table: [],
                field: [],
                special: [],
                bizKey: ''
            }
            if (this.isDisable) {
                this.$message.error('请勿快速点击！')
                return
            }
            this.numbersClick()
            const temp = this.reportAll.process.find(item => item.liu_cheng_xuan_ze === procDefKey)
            if (!temp) {
                return
            }
            this.record = {
                report: temp.liu_cheng_xuan_ze ? temp.bao_biao_lu_jing_.split(',') : [],
                file: temp.fu_jian_nei_rong_ ? temp.fu_jian_nei_rong_.split('.') : [],
                table: temp.shi_fou_zi_biao_ ? temp.shi_fou_zi_biao_.split('.') : [],
                field: temp.guan_lian_zi_duan ? temp.guan_lian_zi_duan.split('.') : [],
                special: [],
                bizKey
            }
            let typeIndex = ''
            // 特殊类型处理
            if (this.specialType.hasOwnProperty(this.typeId)) {
                this.specialType[this.typeId].forEach((item, index) => {
                    // 判断当前流程在哪一步，以此决定报表展示
                    if (subject.includes(item)) {
                        // 数组下标+2为当前报表文件排序
                        typeIndex = index + 2
                    }
                })
                this.getSpecicalFile(bizKey)
            }
            // console.log(typeIndex)
            if (typeIndex !== '') {
                this.record.report = this.record.report.slice(0, typeIndex)
            }
            // console.log(this.record)
            if (this.record.file.length && this.record.table.length) {
                this.getAllFile(this.record)
                return
            }
        },
        // 获取所有附件
        getAllFile ({ file, table, field, bizKey }) {
            this.fileId = ''
            this.snapshotId = ''
            this.fileLoading = true
            const resultList = []
            table.forEach((item, index) => {
                const sql = `select ${file[index]} from ${item} where ${field.length && field[index] ? field[index] : 'id_'} = '${bizKey}'`
                resultList.push(this.getFile(sql, file[index]))
            })
            Promise.all(resultList).then(res => {
                // console.log('所有附件ID：', res)
                this.fileLoading = false
                this.fileId = [...new Set(res.reduce((acc, cur) => acc.concat(cur.file), []))].join(',')
                this.snapshotId = [...new Set(res.reduce((acc, cur) => acc.concat(cur.snapshot), []))].join(',')
            }).catch(err => {
                this.fileLoading = false
                console.log('error', err)
            })
        },
        // 获取单个请求中的文件
        getFile (sql, fileField) {
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const result = {
                        file: [],
                        snapshot: []
                    }
                    const fileList = fileField.split(',')
                    let { data = [] } = res.variables || {}
                    data = data.filter(i => i)
                    data.forEach(item => {
                        // 能获取到值说明文件字段只有一个
                        // 将快照文件单独拿出来
                        if (item[fileField]) {
                            if (fileField === 'kuai_zhao_') {
                                result.snapshot.push(this.getFileId(item[fileField]))
                            } else {
                                result.file.push(this.getFileId(item[fileField]))
                            }
                        } else if (fileList.length > 1) {
                            // 否则文件字段为多个，需嵌套循环
                            fileList.forEach(i => {
                                if (item[i]) {
                                    if (i === 'kuai_zhao_') {
                                        result.snapshot.push(this.getFileId(item[i]))
                                    } else {
                                        result.file.push(this.getFileId(item[i]))
                                    }
                                }
                            })
                        }
                    })
                    // console.log(result)
                    resolve(result)
                })
            })
        },
        // 获取文件ID
        getFileId (value) {
            // 判断是否为图片类型，文件类型只存储文件ID，图片会以对象形式保存
            if (value.includes('id')) {
                const result = []
                const temp = JSON.parse(value)
                temp.forEach(item => result.push(item.id))
                return result.join(',')
            }
            return value
        },
        // 获取内审管审文件
        getSpecicalFile (id) {
            const sql = `select ${specialParams[this.typeId]} from ${specialTable[this.typeId]} where ${specialField[this.typeId]} = '${id}'`
            // console.log(sql)
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length) {
                    this.record.special = data.filter(i => i.beforeImprove || i.afterImprove)
                }
            })
        },
        // 打开报表
        openReport (path, id) {
            this.srcUrl = `${this.$reportPath.replace('show', 'pdf')}${path}&id_=${id}&org_=${this.first}`
            this.visible = true
        },
        // 获取格式化参数
        getSearcFormData () {
            const temp = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            const parameters = this.getParams(temp) || []
            // console.log(parameters)
            const creator = parameters.filter(i => i.key.includes('create_by_'))
            const others = parameters.filter(i => !i.key.includes('create_by_'))
            const params = {
                parameters: [
                    {
                        relation: 'AND',
                        parameters: [
                            {
                                relation: 'AND',
                                parameters: [
                                    {
                                        key: 'Q^status_^S',
                                        value: 'end'
                                    },
                                    ...others
                                ]
                            },
                            {
                                relation: 'OR',
                                parameters: creator
                            }
                        ]
                    }
                ],
                requestPage: {
                    pageNo: this.pagination.page || 1,
                    limit: this.pagination.limit || 100
                },
                ...ActionUtils.formatParams(null, null, this.sorts)
            }
            if (this.$utils.isNotEmpty(this.typeId)) {
                params.parameters[0].parameters[0].parameters.push({ key: 'Q^TYPE_ID_^S', value: this.typeId })
            }
            if (!creator.length) {
                params.parameters[0].parameters[1].parameters = this.userList.map(i => ({ key: 'Q^create_by_^S', value: i.userId, param: this.$utils.guid() }))
            }
            return params
        },
        getParams (data) {
            const result = []
            const special = ['dept', 'tableName', 'desc', 'createBy']
            Object.keys(data).forEach(key => {
                if (special.includes(key)) {
                    if (key === 'createBy') {
                        // 转换用户ID
                        const t = this.userList.filter(i => i.userName.includes(data[key]))
                        if (!t.length) {
                            result.push({ key: 'Q^create_by_^SL', value: data[key] })
                        }
                        const res = t.map(i => i.userId)
                        res.forEach(i => {
                            result.push({ key: 'Q^create_by_^SL', value: i })
                        })
                    } else if (key === 'dept') {
                        // 转换部门ID
                        const t = this.deptList.filter(i => i.positionName.includes(data[key]))
                        if (!t.length) {
                            result.push({ key: 'Q^subject_^SL', value: data[key] })
                        }
                        const res = t.map(i => i.positionId)
                        res.forEach(i => {
                            result.push({ key: 'Q^subject_^SL', value: i })
                        })
                    } else {
                        result.push({ key: 'Q^subject_^SL', value: data[key] })
                    }
                } else {
                    result.push({ key, value: data[key] })
                }
            })
            return result.map(i => ({ ...i, param: this.$utils.guid() }))
        },
        // 处理分页事件
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        // 处理排序
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        handleLinkClick (data, columns) {
            this.handleEdit(data.id)
        },
        // 查询
        search () {
            if (this.isDisable) {
                this.$message.error('请勿快速点击！')
                return
            }
            this.loadData()
            this.numbersClick()
        },
        // 防止多次快速查询
        numbersClick () {
            this.isDisable = true
            setTimeout(() => {
                this.isDisable = false
            }, 1000)
        },
        // 处理按钮事件
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search': // 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'remove':
                    if (!data || !data.length) {
                        this.$message.warning('请选择数据！')
                        return
                    }
                    if (data.length > 20) {
                        this.$message.warning('单次最多只能删除二十条！')
                        return
                    }
                    this.handleDelete(data, selection)
                    break
                case 'detail': // 明细
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id)
                        this.title = '信息'
                    }).catch(() => {})
                    break
                default:
                    break
            }
        },
        handleDelete (data, selection) {
            this.$confirm('将删除选中运行记录与对应数据表数据，删除之后无法恢复， 是否确定？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                const formKeyArr = []
                const delList = {}
                data.forEach(item => {
                    const { bizKey, formKey } = item
                    if (!delList[formKey]) {
                        delList[formKey] = []
                    }
                    delList[formKey].push(bizKey)
                    if (!formKeyArr.includes(formKey)) {
                        formKeyArr.push(formKey)
                    }
                })
                // console.log(delList, formKeyArr)
                const sql = `select a.bo_code_, b.key_ from ibps_form_bo a, ibps_form_def b where a.form_id_ = b.id_ and find_in_set(b.key_, '${formKeyArr.join(',')}')`
                // 获取选中记录对应的数据表code
                this.$common.request('sql', sql).then(res => {
                    const result = res.variables && res.variables.data
                    const codeList = {}
                    result.forEach(m => {
                        codeList[m.key_] = m.bo_code_
                    })
                    const deleteParams1 = {
                        tableName: 'ibps_bpm_inst_his',
                        paramWhere: { id_: selection.join(',') }
                    }
                    // 删除选中记录
                    this.$common.request('delete', deleteParams1).then(() => {
                        // 循环删除对应数据表数据
                        Object.keys(codeList).forEach(k => {
                            const deleteParams2 = {
                                tableName: `t_${codeList[k]}`,
                                paramWhere: { id_: delList[k].join(',') }
                            }
                            this.$common.request('delete', deleteParams2)
                        })
                        this.$message.success('删除成功！')
                        this.search()
                    })
                }).catch(() => {
                    this.$message.error('获取数据表key值出错，请联系开发人员！')
                })
            })
        },
        handleNodeClick (typeId, typeName) {
            this.tableTitle = typeName.name
            this.typeId = typeId
            this.templateData = this.reportAll.template.find(i => i.fen_lei_id_ === typeId) || {}
            if (!this.templateData.templateid_) {
                this.templateShow = false
                this.loadData()
            } else {
                this.templateShow = true
                this.templateData.typeId = typeId
                this.templateData.typeName = typeName.name
            }
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 230 : 30
        },
        // 处理编辑
        handleEdit (id = '') {
            this.instanceId = id
            this.dialogFormVisible = true
        }
    }
}
</script>
<style lang="scss">
    .js-custom-dialog {
        .el-dialog__body {
            height: calc(100vh) !important;
            margin: -9px !important;
            padding: 0px !important;
            overflow: hidden;
        }
        .el-dialog__header {
            padding: 0px;
        }
        .el-dialog__headerbtn i {
            font-size: 28px;
            font-weight: bold;
            background-color: #ffffff;
            border-radius: 8px;
            margin-top: -8px;
        }
    }
    .div_operation {
        cursor: pointer;
    }
    .sub_operation {
        width: 100%;
        height: 20px;
        line-height: 20px;
        color: #08c0b7;
        // color: #85ce61;
        cursor: pointer;
        &:before {
            font-size: 18px;
            margin-right: 5px;
        }
    }
    .sub_content {
        .title {
            margin: 0;
            margin-top: 6px;
            font-weight: bold;
        }
        .sub_item {
            display: flex;
            align-items: baseline;
            .desc {
                margin-top: 6px;
            }
            > div:last-child {
                width: calc(100% - 45px) !important;
            }
        }
    }
    .content_item {
        &:first-child{
            .sub_content .title {
                margin-top: 0px;
            }
        }
    }
    .main-container .el-popover.popverClass {
        .div_content {
            .content_checkbox {
                .el-checkbox-group {
                    display: flex;
                    flex-direction: column;
                    z-index: 999;
                }
                z-index: 999;
            }
            .content_item {
                z-index: 999;
                margin-top: 20px;
                display: flex;
                justify-content: flex-end;
                .el-button {
                    padding: 7px 14px;
                }
            }
        }
    }
</style>
