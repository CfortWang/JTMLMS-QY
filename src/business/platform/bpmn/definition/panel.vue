<template>
    <ibps-crud
        ref="crud"
        :height="tableHeight"
        :data="listData"
        :inde-row="false"
        :toolbars="listConfig.toolbars"
        :search-form="listConfig.searchForm"
        :pk-key="pkKey"
        :columns="listConfig.columns"
        :pagination="pagination"
        :loading="loading"
        :selection-type="multiple ? 'checkbox' : 'radio'"
        @selection-change="handleSelectionChange"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
    />
</template>
<script>
    import { queryPageList, queryByFormKey } from '@/api/platform/bpmn/bpmDefinition'
    import ActionUtils from '@/utils/action'
    import SelectionMixin from '@/components/ibps-selector/mixins/selection'

    export default {
        mixins: [SelectionMixin],
        props: {
            value: [Object, Array],
            // 是否查询所有
            isSuper: {
                type: Boolean,
                default: false
            },
            button: {
                type: Boolean,
                default: false
            },
            isDataTemplateUse: {
                type: Boolean,
                default: false
            },
            formKey: String,
            multiple: Boolean,
            height: {
                type: String,
                default: '400px'
            }
        },
        data() {
            return {
                width: 200,
                // 弹窗
                dialogFormVisible: false,
                editId: '',

                // 主键  如果主键不是pk需要传主键
                pkKey: 'id',
                loading: false,
                listData: [],
                listConfig: {
                    // 工具栏
                    toolbars: [{ key: 'search' }],
                    // 查询条件
                    searchForm: {
                        labelWidth: 50,
                        forms: [
                            {
                                prop: 'Q^name_^SL',
                                label: '名称',
                                itemWidth: '200'
                            },
                            {
                                prop: [
                                    'Q^CREATE_TIME_^DL',
                                    'Q^CREATE_TIME_^DG'
                                ],
                                label: '创建时间',
                                fieldType: 'daterange',
                                labelWidth: 80,
                                itemWidth: 220
                            }
                            // { prop: 'Q^desc_^SL', label: '描述', itemWidth: '200' }
                        ]
                    },
                    // 表格字段配置
                    columns: [
                        { prop: 'name', label: '流程名称' },
                        { prop: 'defKey', label: '流程业务主键' },
                        { prop: 'createTime', label: '创建时间' }
                    ]
                },
                pagination: {},
                sorts: {},
                moreSearchParams: {}
            }
        },
        computed: {
            tableHeight() {
                const h = this.height.substr(0, this.height.length - 2)
                return parseInt(h)
            }
        },
        created() {
            this.loadListData()
        },
        methods: {
            /**
             * 加载数据
             */
            loadListData() {
                this.loading = true
                if (this.isDataTemplateUse && this.$utils.isEmpty(this.formKey)) {
                    this.$message.error('错误原因：模板未绑定表单!')
                    this.loading = false
                    return
                }

                const requestMethod = this.isDataTemplateUse ? queryByFormKey : queryPageList
                requestMethod(this.getFormatParams()).then((response) => {
                    this.loading = false
                    ActionUtils.handleListData(this, response.data)
                    this.setSelectRow()
                }).catch(() => {
                    this.loading = false
                })
            },
            /**
             * 获取格式化参数
             */
            getFormatParams() {
                const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
                if (this.isDataTemplateUse) {
                    params['Q^status_^S'] = 'deploy'
                    params['formKey'] = this.formKey
                } else {
                    params['Q^status_^S'] = 'deploy'
                }
                if (this.isSuper) {
                    params['isSuper'] = this.isSuper
                }
                return ActionUtils.formatParams(
                    params,
                    this.pagination,
                    this.sorts
                )
            },
            /**
             * 处理分页事件
             */
            handlePaginationChange(page) {
                this.changePageCoreRecordData()
                ActionUtils.setPagination(this.pagination, page)
                this.loadListData()
            },
            /**
             * 处理排序
             */
            handleSortChange(sort) {
                ActionUtils.setSorts(this.sorts, sort)
                this.loadListData()
            },
            /**
             * 查询
             */
            search() {
                this.loadListData()
            },
            /**
             * 重置查询条件
             */
            reset() {
                this.$refs['crud'].handleReset()
            },
            /**
             * 处理按钮事件
             */
            handleAction(command, position, selection, data) {
                switch (command) {
                    case 'search': // 查询
                        ActionUtils.setFirstPagination(this.pagination)
                        this.search()
                        break
                    default:
                        break
                }
            }
        }
    }
</script>
