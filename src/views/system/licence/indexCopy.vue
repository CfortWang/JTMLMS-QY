<template>
    <ibps-container
        type="full"
        header-background-color
        class="licence"
    >
        <ibps-crud
            ref="crud"
            display-field="系统许可证"
            :height="tableHeight"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :pagination="pagination"
            :row-handle="rowHandle"
            :loading="loading"
            style="width:100%;"
            @action-event="handleAction"
            @pagination-change="handlePaginationChange"
        />
        <update-licence
            :visible="licenceFormVisible"
            :username="account1"
            @close="visible => licenceFormVisible = visible"
        />
    </ibps-container>

</template>
<script>
import ActionUtils from '@/utils/action'
export default {
    components: {
        updateLicence: () => import('@/views/system/licence/update')
    },
    props: {
        height: {
            type: String,
            default: '400px'
        }
    },
    data () {
        const { account = '', licence = {}} = this.$store.getters
        return {
            licenceFormVisible: false,
            account1:'',
            licence,
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            status: {
                success: '正常',
                warning: '即将到期',
                danger: '过期'
            },
            loading: false,
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                // searchForm: {
                //     labelWidth: 100,
                //     forms: [
                //         { prop: 'Q^APP_KEY_^SL', label: '应用标识', fieldType: 'slot', slotName: 'appKey' },
                //         { prop: 'Q^API_KEY_^SL', label: '接口标识' },
                //         { prop: 'Q^API_NAME_^SL', label: '接口名称' },
                //         { prop: 'Q^API_URI_^SL', label: '接口地址' }
                //     ]
                // },
                // 表格字段配置
                columns: [
                    { prop: 'isTrialVersion', label: '许可证信息' },
                    { prop: 'customerInfo', label: '单位名称', minWidth: 200 },
                    { prop: 'issuedTime', label: '发布时间', width: 120 },
                    { prop: 'notBefore', label: '生效时间', width: 120 },
                    { prop: 'notAfter', label: '失效时间', width: 120 },
                    { prop: 'reminderDays', label: '到期提醒天数', width: 120 },
                    { prop: 'status', label: '状态' }
                ]
            },
            listData: [
                {
                    id: '1',
                    isTrialVersion: '许可证信息',
                    customerInfo: '单位名称',
                    issuedTime: '2024-01-01',
                    notBefore: '2024-01-01',
                    notAfter: '2024-01-01',
                    reminderDays: '到期提醒天数',
                    status: '状态'
                }
            ],
            pagination: {},
            rowHandle: {
                actions: [
                    {
                        $index: 1,
                        key: 'edit',
                        button_type: 'detail',
                        label: '更新',
                        icon: 'ibps-icon-edit',
                        type: 'primary',
                        deflow: null,
                        isEditOnHis: false,
                        initAddDataCont: null,
                        disabled: false,
                        hidden: false,
                        position: 'manage'
                    }
                ],
                effect: 'display'

            }
        }
    },
    computed: {
        state () {
            const { isTrialVersion, needRemind, overtime } = this.licence || {}
            if (!isTrialVersion) {
                return 'success'
            }
            if (overtime) {
                return 'danger'
            }
            if (needRemind) {
                return 'warning'
            }
            return 'success'
        },
        tableHeight () {
            const h = this.height.substr(0, this.height.length - 2)
            return parseInt(h) - 10
        }
    },
    mounted () {
        this.loadData()
    },
    methods: {
        loadData () {
            console.log('91 this.licence', this.licence)
        },
        handUpdate () {
            this.licenceFormVisible = true
        },
        transformDate (v) {
            return v ? new Date(v).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') : ''
        },
        /**
     * 处理按钮事件
     */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'edit':// 编辑许可证信息
                    this.editLicence()
                    break
                default:
                    break
            }
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        search () {

        },
        editLicence () {
            this.licenceFormVisible = true
        }
    }
}
</script>
<style lang="scss" scoped>
// .licence-container {
//     width: 1080px;
//     margin: 20px auto;
//     height: calc(100% - 100px);
//     padding: 20px;
//     border: 1px solid #ccc;
//     border-radius: 10px;
//     background-color: #f9f9f9;
//     box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//     transition: transform 0.2s;
//     .title {
//         font-size: 24px;
//         font-weight: bold;
//         margin-bottom: 20px;
//         display: flex;
//         align-items: center;
//     }
//     .card {
//         display: flex;
//         flex-wrap: wrap;
//         justify-content: space-between;
//         .item {
//             width: 100%;
//             margin-bottom: 20px;
//             padding: 15px;
//             border: 1px solid #ccc;
//             border-radius: 5px;
//             background-color: #fff;
//             transition: transform 0.2s;
//             &:hover {
//                 transform: scale(1.01);
//             }
//             .label {
//                 font-size: 16px;
//                 font-weight: bold;
//                 margin-bottom: 10px;
//             }
//             .value {
//                 font-size: 16px;
//                 color: #666;
//             }
//         }
//     }
// }
</style>
