import ActionUtils from '@/utils/action'
export default {
    components: {
        'bpmn-formrender': () => import('@/business/platform/bpmn/form/dialog'),
        'ibps-type-tree': () => import('@/business/platform/cat/type/tree'),
        'ibps-card-list': () => import('@/components/ibps-card-list/list'),
        'form-rights': () => import('@/business/platform/form/form-rights'),
        'form-builder': () => import('@/business/platform/form/formbuilder/dialog'),
        'formrender-preview': () => import('@/business/platform/form/formrender/preview/index')
    },
    data () {
        const { userList = [], deptList = [] } = this.$store.getters
        return {
            userList,
            deptList,
            width: 220,
            height: document.clientHeight,
            createText: '创建表单',
            query: '',
            typeId: '',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: false,
            dialogFormVisible: false,
            copyDialogFormVisible: false,
            rightsDialogFormVisible: false,
            formbuilderDialogVisible: false,
            formrenderDialogVisible: false,
            importFormVisible: false,
            formPrintDialogVisible: false,
            defId: '',
            editId: '',
            proInstId: '',
            instanceId: '',
            flowName: '',
            formKey: '',
            searchField: '',
            searchName: '',
            listData: [],
            pagination: {},
            sorts: {}
        }
    },
    methods: {
        /**
         * 获取格式化参数
         */
        getFormatParams () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (this.$utils.isNotEmpty(this.typeId)) {
                params['Q^TYPE_ID_^S'] = this.typeId
            }
            return ActionUtils.formatParams(params, this.pagination, this.sorts)
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
        search () {
            this.loadData()
        },
        /**
         * 重置查询条件
         */
        reset () {
            this.$refs['crud'].handleReset()
        },
        handleNodeClick (typeId) {
            this.typeId = typeId
            this.loadData()
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 230 : 30
        },
        getTaskDesc (v) {
            if (!v.includes('#')) {
                return ''
            }
            return v.split('#')[1] || ''
        },
        getTaskInfo (val, arg = 'dept') {
            const arr = val.split('#')
            if (!arr[2]) {
                return ''
            }
            const result = JSON.parse(`{${arr[2]}}`)
            if (!result.dept) {
                return ''
            }
            const depts = result.dept.split(',')
            const deptNames = []
            depts.forEach(item => {
                const t = this.deptList.find(i => i.positionId === item)
                deptNames.push(t ? t.positionName : result.dept)
            })
            result.deptName = deptNames.join(',')
            return result[arg]
        },
        /**
         * 点击表格
         */
        handleLinkClick (data) {
            this.instanceId = data.id || ''
            this.dialogFormVisible = true
        },
        /**
         * 数据转换，用户、部门
         */
        getTransformData (val, dataset, from, to) {
            if (!val) {
                return ''
            }
            const temp = this[dataset].find(u => u[from] === val)
            return temp ? temp[to] : ''
        }
    }
}
