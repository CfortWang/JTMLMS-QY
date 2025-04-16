<template>
    <el-dialog
        v-loading="loading"
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
            <div class="left" :style="{width:initWidth}">
                <div class="header">
                    <div class="header-name">
                        调查名称：{{ diao_cha_ming_che }}
                    </div>
                    <div class="header-left">
                        <span>调查对象：</span>
                        <div>
                            <el-select
                                v-model="diao_cha_dui_xian"
                                filterable
                                width="100%"
                                size="mini"
                            >
                                <el-option
                                    v-for="(v,k) in statisData"
                                    :key="k"
                                    :label="k"
                                    :value="k"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="header-right">
                        <span>统计时间：</span>
                        <div>
                            {{ $common.getDateNow(19) }}
                        </div>
                    </div>
                </div>
                <div class="title" style="margin-left:8px">统计总览</div>
                <div class="all" style="margin-bottom:20px">
                    <All :statis-item-data="showData" />
                </div>
                <div class="title" style="margin-left:8px">统计详情</div>
                <div v-for="(v,k,ind) in showData" :key="k" class="every">
                    <div class="table-title">
                        <div class="desc">
                            {{ ind+1 }}.{{ v[0].ti_gan_ }}
                        </div>
                        <div class="shown">
                            有效数量/总数量：{{ v.filter(i=>i.da_an_).length }}/{{ v.length }}
                        </div>
                    </div>
                    <div class="item-table">
                        <ItemTable :statis-item-data="v" />
                    </div>
                    <div v-if="v[0].ti_xing_==='单选题' || v[0].ti_xing_==='多选题'" class="item-echart">
                        <ItemEchart :statis-item-data="v" />
                    </div>
                </div>

            </div>
        </div>
    </el-dialog>
</template>

<script>
import _ from 'lodash'
import ibpsUserSelector from '@/business/platform/org/selector'
import All from './all.vue'
import ItemTable from './itemTable.vue'
import ItemEchart from './itemEchart.vue'

export default {
    components: {
        ibpsUserSelector, All, ItemTable, ItemEchart
    },
    props: {
        id_: {
            type: String,
            default: ''
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        diao_cha_ming_che: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userId, position, level } = this.$store.getters
        return {
            statisData: {},
            diao_cha_dui_xian: '',
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
            userId: userId,
            position: position,
            level: level.second || level.first,
            loading: false,
            title: '满意度调查统计',
            toolbars: [
                // { key: 'save', label: '保存' },
                { key: 'cancel', label: '退出', type: 'danger' }
            ],
            initWidth: '60%',
            isEdit: false,
            isFinished: false,
            readonly: false,
            preParams: {},
            Ids: [],
            form: {
            },
            rules: {

            }
        }
    },
    computed: {
        showData () {
            return this.statisData?.[this.diao_cha_dui_xian] || {}
        }
    },
    watch: {

    },
    mounted () {
        this.init()
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog(true)
                    break
                // case 'save':
                //     this.goSave('close')
                //     break
                default:
                    break
            }
        },

        // 获取人员部门
        getPersonPosition (id) {
            const userList = this.$store.getters.userList
            const bianzhiUserid = userList.find(i => i.userId === id)
            if (bianzhiUserid) {
                return bianzhiUserid.positionId
            }
        },
        checkRequired (flag) {
        },
        // 刷新
        async goRefresh () {
        },
        // 关闭当前窗口
        closeDialog (needRefresh) {
            this.$emit('update:dialogVisible', false, needRefresh)
        },
        async init () {
            this.initWidth = window.innerWidth > 1600 ? '60%' : '80%'
            console.log('id_', this.id_)
            const sql = `select a.*,b.diao_cha_dui_xian,b.diao_cha_ming_che FROM t_myddcjlxq a LEFT JOIN t_myddcjl b on a.parent_id_=b.id_ where b.diao_cha_id_='${this.id_}' and b.shi_fou_guo_shen_='已完成' ORDER BY b.create_time_ desc`
            const { variables: { data = [] } = {}} = await this.$common.request('sql', sql)
            const res = _.groupBy(data, 'diao_cha_dui_xian')
            for (const key in res) {
                const val = res[key]
                res[key] = _.groupBy(val, 'ti_mu_id_')
            }
            this.statisData = res
            this.diao_cha_dui_xian = Object.keys(res)?.[0] || ''
            console.log('res', res)
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
        z-index: 99999999;
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
        .left{
            height: calc(100vh - 100px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            overflow-y: auto;
            .item{
                width: 100%;
            }
            .title{
                margin: 16px 0 6px -16px;
            }
            .header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .header-left{
                    display: flex;
                    align-items: center;
                }
                .header-right{
                    display: flex;
                    align-items: center;
                }
                margin-bottom: 20px;
            }
            .every{
                margin-bottom: 20px;
            }
            .table-title{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
}
    ::v-deep {
        .el-form-item__label{
            text-align: left;
            font-size: 12px !important;
        }
        .el-form-item__content{
            font-size: 12px !important;
            display: flex;
        }
    }
</style>
