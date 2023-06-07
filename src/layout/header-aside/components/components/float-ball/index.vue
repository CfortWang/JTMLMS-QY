<template>
    <div class="slide-button-box bdshare-slide-style-r0">
        <!-- <h3 style="float: right;width: 120px;">您有新的任务</h3> -->
        <a href="#"
            class="slide-button"
            :class="{ r1: shrinkPacket == true }"
            @mouseout="outUp()"
            @mouseenter="stop()"
        ></a>
        <div class="slide-list-box" @mouseenter="stop()">
            <div class="slide-list" id="box">
                <ul class="slide-ul-tab">
                    <li class="slide-li-tab" :class='{ cur: tab === 1 }' @click="tab = 1">
                        <i class="circle"></i>
                        <span>实时待办任务</span>
                    </li>
                    <!-- <li class="slide-li-tab" :class='{cur:tab===2}' @click="tab=2">
                        <i class="circle"></i>
                        <span>定时任务</span>
                    </li> -->
                </ul>
                <div v-show="tab === 1">
                    <ul class="slide-list-ul" style="width: 226px;">
                        <li
                            v-for='(item, index) in userTypeData'
                            :key='index'
                            class="slide-list-li"
                            @click="outToProcess(item)"
                        >
                            {{ item.name }}
                        </li>
                        <li v-if="userTypeData.length == 0" class="slide-list-li">暂无任务...</li>
                    </ul>
                    <div class="slide-bottom" style="width: 226px;">
                        <router-link :to="{ path: '/officeDesk/pendingItems' }" style="color:#AA7700 ;">更多...</router-link>
                    </div>
                </div>

                <!-- <div v-show ="tab===2">
                    <ul class="slide-list-ul" style="width: 226px;">
                        <li
                            v-for='(item, index) in userTypeData0'
                            :key='index'
                            class="slide-list-li"
                            @click="openMessage(item)"
                        >
                            <span style="float: left;"> {{item.ren_wu_biao_ti_ }}</span>
                            <span style="float: right;margin-right: 17px;">日期: {{item.ren_wu_shi_jian_.substring(5, 10)}}</span>
                        </li>
                        <li  class="slide-list-li" v-if="userTypeData0.length==0" >暂无任务...</li>
                    </ul>
                </div> -->
            </div>
        </div>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :task-id="taskId"
            :title="title"
            :def-id="defId"
            :instance-id="instanceId"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
    </div>
</template>

<script>
    import { StatisticsData, StatisticsSign } from '@/api/platform/system/jbdHome'
    import { pending, handled } from '@/api/platform/office/bpmReceived'
    import ActionUtils from '@/utils/action'
    import axios from 'axios'
    import { getToken } from '@/utils/auth'
    import { BASE_API, BUSINESS_BASE_URL } from '@/api/baseUrl'

    export default {
        props: { id: String },
        data () {
            return {
                dialogFormVisible: false, // 弹窗
                taskId: '', // 编辑dialog需要使用
                timer: '',
                getDataTimer: '',
                shrinkPacket: false,
                tab: 1,
                userTypeData: [],
                userTypeData0: [],
                pagination: { pageNo: 1, limit: 5 },
                sorts: {},
                messageCount: 0,
                infoMessage: '',
                defId: '',
                instanceId: '',
                overNumber: 0,
                title: ''
            }
        },
        mounted () {
            axios.interceptors.request.use(res => {
                res.headers.common['X-Authorization-access_token'] = getToken()
                return res
            })
        },
        created () {
            if (this.getDataTimer) {
                clearInterval(this.getDataTimer)
            }
            //this.getDataTimer = setInterval(this.loadData,1000*60*10) //每10分钟获取开始任务
            this.getDataTimer = setInterval(this.loadData, 10000) //获取开始任务
        },
        // 清除定时事件
        beforeDestroy () {
            clearInterval(this.getDataTimer)
            clearInterval(this.timer)
            if (this.infoMessage) {
                this.infoMessage.close()
            }
            this.messageCount = 0
        },
        methods: {
            outUp () {
                this.tab = 1
                this.loadData()
            },
            outToProcess (item) {
                this.title = item.name
                this.taskId = item.taskId || ''
                this.dialogFormVisible = true
            },
            getProcDefId (data) {
                this.procDefIdSelect = data
            },
            overData (id) {
                handled(this.getFormatParams(id)).then(response => {}).catch(() => {})
            },
            loadData (id) {
                axios.post(BASE_API()+BUSINESS_BASE_URL() + '/bpm/received/query/pending', this.getFormatParams(id)).then(response => {
                    // 返回错误码则销毁轮训任务
                    if (response.status !== 200) {
                        clearInterval(this.getDataTimer)
                        clearInterval(this.timer)
                        return
                    }
                    // 如果记录数量小于当前数量
                    if (this.messageCount < response.data.data.pageResult.totalCount) {
                        if (this.timer === '' && this.messageCount > 0) {
                            this.$notify({
                                title: '任务提示',
                                message: '您有新的待办任务产生，请及时办理！',
                                type: 'warning',
                                offset: 100,
                                duration: 9000
                            })
                            this.timer = setInterval(this.startRotate, 500)
                        } else if (this.messageCount > 0) {
                            this.$notify({
                                title: '任务提示',
                                message: '您有新的待办任务产生，请及时办理！',
                                type: 'warning',
                                offset: 100,
                                duration: 9000
                            })
                        }
                    }

                    this.messageCount = response.data.data.pageResult.totalCount
                    ActionUtils.handleListData(this, response.data.data)
                    this.userTypeData = response.data.data.dataResult
                }).catch(() => {
                    clearInterval(this.getDataTimer)
                    clearInterval(this.timer)
                    if (this.infoMessage) {
                        this.infoMessage.close()
                    }
                    this.messageCount = 0
                })
            },
            search () {
                this.loadData()
            },
            getFormatParams (id) {
                const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
                if (this.$utils.isNotEmpty(this.procDefIdSelect)) {
                    params['Q^temp.proc_def_key_^S'] = this.procDefIdSelect
                }
                if (this.$utils.isNotEmpty(id)) {
                    params['Q^temp.TYPE_ID_^S'] = id
                }
                return ActionUtils.formatParams(params, this.pagination, this.sorts)
            },
            createData (val) {
                StatisticsData().then(data => { //将参数替换成对应参数
                    this.userTypeData0 = data.variables.data
                })
            },
            startRotate () {
                this.shrinkPacket = true
                setTimeout(() => {
                    this.shrinkPacket = false
                }, 150)
            },
            stop () {
                clearInterval(this.timer)
                this.timer = ''
            },
            openMessage (cont) {
                if (this.infoMessage) {
                    this.infoMessage.close()
                }
                let h = this.$createElement,
                    _this = this
                window.setTimeout(() => {
                    this.infoMessage = this.$notify.info({
                        title: '定时通知:' + cont.ren_wu_biao_ti_,
                        message: h('p', null, [
                            h('span', null, '任务时间: ' + cont.ren_wu_shi_jian_),
                            h('br'),
                            h('span', null, '受理对象: ' + cont.shou_li_dui_xiang),
                            h('br'),
                            h('span', null, '任务内容: '),
                            h('span', { style: 'color: #FF8C00;font-size:12px;' }, cont.ding_shi_ren_wu_n),
                            h('br'),
                            h('el-button', {
                                attrs: {
                                    size: 'mini',
                                    type: cont.dui_ying_liu_chen ? 'success' : 'primary',
                                    plain: true,
                                },
                                on: {
                                    click: () => {
                                        _this.cancelInfo()
                                    }// 路由加载之后，调用关闭消息弹窗的方法
                                }
                            }, '取消提醒'),
                            h('el-button', {
                                attrs: {
                                    size: 'mini',
                                    plain: true,
                                },
                                on: {
                                    click: () => {
                                        this.infoMessage.close()
                                    }// 路由加载之后，调用关闭消息弹窗的方法
                                }
                            }, '忽略关闭')

                        ]),
                        duration: 0,
                    })
                }, 0)
            },
            cancelInfo (cronId, title, processData, task) {
                // 调用流程
                this.infoMessage.close()
            },


        }
    }
</script>
<style lang="less"  scoped>
    .cur .circle {
        background-color: #fff;
    }
    .slide-ul-tab {
        list-style: none;
        width: 226px;
        height: 25px;
        line-height: 25px;
        margin: 0 0 10px 0;
        padding: 0;
        background-color: #fff;
        color: #e6a23c;
    }
    .slide-li-tab {
        float: left;
        padding: 0px 12px 0px 9px;
        background-color: #e6a23c;
        color: #fff;
        display: inline;
        cursor: pointer;
    }
    .circle {
        width: 8px;
        margin: 0px 10px;
        height: 8px;
        background-color: #e6a23c;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        display: inline-block;
    }
    .slide-button-box {
        bottom: 60px;
        width: 0px;
        z-index: 2005;
        right: 0px;
        height: 250px;
        position: fixed;
        overflow: visible;
    }
    .slide-button-box .slide-button {
        width: 24px;
        height: 105px;
        display: block;
        position: absolute;
        bottom: 60px;
        left: -24px;
        background-color: #e6a23c;
        color: #fff;
        background: url(../../../../../assets/images/pendingItems/15425.gif) no-repeat 0 0;
    }
    .slide-button-box:hover {
        width: 226px;
    }
    .slide-button-box:hover .slide-list-box {
        width: 226px;
        display: block;
    }
    .slide-list-box {
        width: 0px;
        display: none;
        border: solid 1px #e9e9e9;
        text-align: left;
        overflow: hidden;
        background: #f6f6f6;
        height: 250px;
        transition: all .5s;
        // display: block;
        // width:226px;
    }
    .slide-top {
        height: 28px;
        color: #626262;
        overflow: hidden;
        font-weight: bold;
        font-size: 14px;
        line-height: 28px;
        padding: 0 5px;
    }
    .slide-list-ul {
        width: 226px;
        padding: 0;
        margin: 0;
        border: 0;
        list-style: none;
        height: 190px;
        overflow: hidden;
    }
    .slide-list-li {
        float: left;
        padding: 5px;
        margin-left: 6px;
        _margin-left: 3px;
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        cursor: pointer;
        list-style: none;
        min-width: 228px;
        color: #e6a23c;
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 20px;
    }
    .slide-list-li:hover {
        background-color: #fdf6ec;
    }
    .slide-list-li a {
        // background-color: #fdf6ec;
        color: #e6a23c;
        font-size: 13px;
    }
    .slide-list-li a:hover {
        background-color: #fdf6ec;
    }
    .slide-list-li .slide-icon {
        margin-right: 6px;
    }
    .slide-list {
        background: #fff;
        overflow: auto;
        overflow-x: hidden;
        // padding: 5px 0;
        margin: 0;
    }
    .slide-bottom {
        width: 226px;
        line-height: 25px;
        font-size: 12px;
        text-align: right;
        clear: both;
        height: 30px;
    }
    .slide-bottom .slide-more {
        border: none;
        margin-right: 10px;
        color: #e6a23c;
    }
    .r1 {
        transform: rotate(-10deg);
    }
    .r2 {
        transform: rotate(3deg);
    }
</style>
