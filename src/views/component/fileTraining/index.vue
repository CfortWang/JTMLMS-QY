<!--
 * @Descripttion: POCT文件培训
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2024-03-01 13:47:32
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-04-26 16:04:02
-->
<template>
    <!-- <el-dialog
        :visible.sync="dialogVisible"
        fullscreen
        :title="title"
        append-to-body
        custom-class="ibps-file-preview-dialog"
    >
        <div>
            <fView v-if="refresh" ref="fvView" :option-file="optionFile" :operation_status="operation_status" @hadLoadedFile="hadLoadedFile" />
        </div>
    </el-dialog> -->

    <!--个人修改  -->
    <el-dialog
        :visible.sync="dialogVisible"
        fullscreen
        append-to-body
        custom-class="ibps-file-preview-dialog"
        :show-close="false"
    >
        <template #title>
            <el-row>
                <el-col :span="11" class="titleHander">{{ title }}</el-col>
                <el-col
                    :span="3"
                    class="read"
                    style="text-align: right"
                >阅读量:{{ lookNum }}</el-col>
                <el-col :span="10" style="text-align: right">
                    <el-popover
                        v-model="deleteVisible"
                        placement="top"
                        width="160"
                    >
                        <p>文件删除之后将不能查看，确定要删除该文件吗？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button
                                size="mini"
                                type="text"
                                @click="deleteVisible = false"
                            >取消</el-button>
                            <el-button
                                type="primary"
                                size="mini"
                                @click="deleteFile"
                            >确定</el-button>
                        </div>
                        <el-button
                            v-if="deleteShow"
                            slot="reference"
                            type="danger"
                            icon="el-icon-delete"
                            class="deleteBtn"
                            @click="deleteVisible = true"
                        >删除</el-button>
                    </el-popover>
                    <el-button
                        type="primary"
                        icon="el-icon-view"
                        @click="lookFile"
                    >查看文件信息</el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-s-fold"
                        @click="hideLeft"
                    >{{ leftContent }}</el-button>
                    <el-button
                        v-if="updateShow"
                        type="primary"
                        icon="el-icon-download"
                        @click="updateFile"
                    >下载文件</el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-close"
                        @click="closeDialog"
                    >关闭</el-button>
                </el-col>
            </el-row>
        </template>
        <div>
            <el-row>
                <el-col v-if="leftShow" :span="4" class="left-content">
                    <div class="left-title">文件修订历史</div>
                    <el-timeline :reverse="reverse">
                        <el-timeline-item
                            v-for="(activity, index) in leftData"
                            :key="index"
                            :timestamp="'发布日期：' + activity.fa_bu_shi_jian_"
                            :type="index === activeIndex ? type : ''"
                            @click.stop.native="toggleActive(activity, index)"
                        >
                            <div class="timeline-content">
                                <el-tooltip
                                    class="itemStyle"
                                    effect="dark"
                                    placement="right-end"
                                    :content="showContent(activity, index)"
                                >
                                    <div>
                                        <!-- <div>版本号:{{ activity.ban_ben_ }}/修订人：{{ getUserName(activity.bian_zhi_ren_) }}</div> -->
                                        <el-collapse
                                            v-model="activeName"
                                            accordion
                                        >
                                            <el-collapse-item :name="index + 1">
                                                <template slot="title">
                                                    <div>
                                                        版本号：{{
                                                            activity.ban_ben_
                                                        }}&nbsp;&nbsp;&nbsp;&nbsp;修订人：{{
                                                            getUserName(
                                                                activity.bian_zhi_ren_
                                                            )
                                                        }}
                                                    </div>
                                                </template>
                                                <!-- 附件 -->
                                                <div
                                                    v-if="
                                                        activity.zhen_fu_jian_
                                                    "
                                                >
                                                    <ibps-attachment
                                                        v-model="
                                                            activity.zhen_fu_jian_
                                                        "
                                                        allow-download
                                                        download
                                                        multiple
                                                        accept="*"
                                                        store="id"
                                                        readonly
                                                    />
                                                </div>
                                                <div v-else>
                                                    <i
                                                        class="el-icon-warning-outline"
                                                        type="warning"
                                                    >
                                                        暂无附件</i>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </el-tooltip>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-col>
                <el-col
                    :span="computedSpan"
                ><fView
                    v-if="refresh"
                    ref="fvView"
                    :option-file="optionFile"
                    :operation_status="operation_status"
                    :copy="updateShow"
                    @hadLoadedFile="hadLoadedFile"
                /></el-col>
            </el-row>
        </div>
        <!-- 查看文件信息弹窗 @close="closeDialog"-->
        <FileDialog
            v-if="innerVisible"
            :show-list="showList"
            :dig-data="digData"
            :inner-visible="innerVisible"
            :file-index="fileIndex"
            @pause="pauseTimer"
            @start="startTimer"
            @update-inner-visible="updateInnerVisible"
        />
    </el-dialog>
</template>
<script>
/**
 * 文件预览
 * 1、'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'  类型支持
 * 2、图片支持缩放
 * 3、音频，语音支持
 * ==================
 * 下一版本支持
 * 1、pdf支持缩放
 * 2、音频，语音多格式支持
 * 3、压缩包支持
 */
import fView from '@/business/platform/file/attachment/editFile/fView.vue'
import { SYSTEM_URL, BASE_API } from '@/api/baseUrl'
import ViewFile from '@/views/viewFile/index.vue'
import Template from '@/business/platform/form/form-print/template.vue'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import FileDialog from './fileDialog.vue'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
// import * as selectbox from 'bpmn-js-properties-panel/lib/factory/SelectEntryFactory'
// import func from 'vue-editor-bridge'
export default {
    name: 'file-training',
    components: {
        fView,
        ViewFile,
        Template,
        FileDialog,
        'ibps-attachment': IbpsAttachment
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        // fileInfos: {
        //     type: Object,
        //     default: () => {}
        // },
        fileInfos: {
            type: Array,
            default: () => {}
        }
        // template: {
        //     type: Object,
        //     default: () => {}
        // }
    },
    data () {
        const { userList, userId, role, isSuper } = this.$store.getters
        // const userId = this.$store.getters.userInfo.employee.id// 本人修改

        return {
            activeName: 1,
            updateShow: false,
            type: 'success',
            curFileName: '',
            curZid: '',
            timeId: '',
            dialogVisible: false,
            operation_status: 'fileTraining',
            title: '',
            browseTime: 0, // 浏览时长初始值为 0
            clearTimeSet: null,
            optionFile: {},
            tmpId: '',
            upFunc: () => {},
            height: 0,
            out: false, // 记录鼠标是否离开过被监听的位置，未离开过则startTimer不启用
            hadLoad: false,
            refresh: false,
            // 本人修改
            leftShow: true,
            scrollTimeout: null,
            reverse: false,
            fileInfo: '',
            fileJie: '',
            leftData: [],
            activeIndex: 0,
            userList: userList,
            userId: userId,
            innerVisible: false,
            currentPage: 1,
            pageSize: 10,
            lookNum: null,
            showList: [],
            digData: null,
            paused: false,
            role: role,
            isSuper: isSuper,
            deleteVisible: false,
            deleteShow: false,
            leftContent: '隐藏修订历史'
        }
    },
    // 本人修改
    computed: {
        computedSpan () {
            return this.leftShow ? 20 : 24
        },
        fileIndex () {
            if (this.leftData.length <= 0) {
                return 0
            }
            return this.leftData.findIndex((i) => i === this.digData)
        }
    },
    watch: {
        visible: {
            immediate: true,
            handler (val) {
                this.digData = this.leftData[0]
            }
        },
        leftShow: {
            immediate: true, // 强制执行一次
            handler (val) {
                if (val) {
                    this.leftContent = '隐藏修订历史'
                    return
                }
                this.leftContent = '显示修订历史'
            }
        },
        // 本人修改
        fileInfos: {
            handler (newVal) {
                this.leftData = newVal
                const temp = JSON.parse(JSON.stringify(newVal))
                temp.sort((a, b) => {
                    return (
                        new Date(b.fa_fang_shi_jian_).getTime() -
                        new Date(a.fa_fang_shi_jian_).getTime()
                    )
                })
                if (newVal !== temp) {
                    this.leftData = temp
                }
                temp.forEach((val) => {
                    this.fileShow(temp[0])
                })
                // newVal.forEach(val => {
                //     this.fileShow(val)
                // })
            },
            deep: true, // 深度监听，确保对象属性变化也能触发(本人修改)
            immediate: true
        },

        browseTime: {
            handler: function (val, oldVal) {
                if (this.curFileName) {
                    this.title = `文件：《 ${this.curFileName} 》,查阅时长：${val}秒`
                } else {
                    this.title = `文件：《 ${this.leftData[0]?.FILE_NAME_} 》,查阅时长：${val}秒`
                }
                if (!this.lookNum) {
                    if (this.leftData[0]?.id) {
                        this.checkNum(this.leftData[0])
                    }
                }
            },
            immediate: true
        },
        dialogVisible: {
            handler: function (val, oldVal) {
                if (!val) {
                    this.closeDialog()
                }
            }
        }
    },
    beforeDestroy () {
        this.fileType = ''
        this.option = {}
        // 本人修改
        this.removeMouseMoveListener()
    },
    mounted () {
        this.height = this.getDialogHeightHeight()
        // 页面切换时改变计时状态
        document.addEventListener('visibilitychange', this.handlePageChange)
        this.checkDialogBody()
        const roleKey = ['xtgljs']
        const curRole = this.role.map((i) => i.alias)
        const isPower = curRole.some((item) => roleKey.includes(item))
        this.deleteShow = !!(isPower || this.isPower)
        const hasRole = localStorage.getItem('hasHighRole') === '1'
        if (this.isSuper || hasRole) {
            this.updateShow = true
        }
    },
    methods: {
        getUserName (data) {
            const user = this.userList.find((item) => item.userId === data)
            return user ? user.userName : '未知用户'
        },
        showContent (activity, index) {
            if (activity.cao_zuo_lei_xing_ === '新增') {
                return '第一版本'
            }
            return activity.xiu_ding_nei_rong
                ? activity.xiu_ding_nei_rong
                : '无修订原因'
        },

        handlePageChange () {
            if (document.visibilityState === 'hidden') {
                this.pauseTimer()
            } else {
                this.startTimer()
            }
        },

        closeDialog () {
            // 关闭时存入查阅时间
            if (this.browseTime && this.browseTime > 0 && this.timeId) {
                this.handleUpdate()
            }
            this.$emit('colseVisible', false)
            const fvView = this.$refs.fvView
            // 销毁子组件方法
            fvView.destoryZiComponent()
            if (this.browseTime >= 30) {
                this.upFunc(this.tmpId, this.browseTime)
            }

            // 针对关闭窗口或者浏览器的
            if (this.clearTimeSet != null) {
                clearInterval(this.clearTimeSet)
                this.clearTimeSet = null
            }
            this.leftShow = true
            this.out = false
            this.browseTime = 0
            // this.curFileName = ''// 本人添加
            // this.lookNum = null
            // this.showList = []
            // this.leftData = []
            // this.digData = null
        },
        hadLoadedFile (v) {
            // 计时开始，添加查看记录
            if (!this.curZid) {
                this.handleAdd(this.leftData[0]?.zId, 0)
            }
            this.setBrowseTime()
            this.hadLoad = true
        },
        setBrowseTime () {
            // 设置定时器
            this.clearTimeSet = setInterval(() => {
                this.browseTime++
            }, 1000)
        },
        getDialogHeightHeight () {
            return (
                (document.documentElement.clientHeight ||
                    document.body.clientHeight) -
                60 +
                'px'
            )
        },
        startTimer () {
            if (
                this.dialogVisible &&
                this.hadLoad &&
                this.out &&
                this.clearTimeSet == null
            ) {
                this.clearTimeSet = setInterval(() => {
                    this.browseTime++
                }, 1000)
            }
        },
        pauseTimer () {
            if (this.dialogVisible) {
                this.out = true
                clearInterval(this.clearTimeSet)
                this.clearTimeSet = null
            }
        },
        // 本人修改
        // id转换
        async idChange (id) {
            const sql = `select id_ FROM t_wjxxb WHERE shu_ju_lai_yuan_ = '${id}'`
            return new Promise((resolve, reject) => {
                this.$common
                    .request('sql', sql)
                    .then((res) => {
                        const { data = [] } = res.variables || {}
                        const firstId = data[0]?.id_
                        resolve(firstId) // 解析 Promise 时返回 firstId
                    })
                    .catch((error) => {
                        reject(error) // 捕获错误并拒绝 Promise
                    })
            })
        },

        toggleActive (activity, index) {
            if (this.activeIndex === index) {
                return
            }
            // 切换文件修订历史时，保存上一个文件查看记录，新增当前文件查看记录
            if (this.browseTime && this.browseTime > 0 && this.timeId) {
                this.handleUpdate()
                this.handleAdd(this.curZid || this.leftData[0]?.zId, 0)
            }
            this.activeIndex = index
            this.digData = activity
            this.curZid = activity.zid
            this.fileShow(activity)
            if (this.browseTime >= 30) {
                this.upFunc(this.tmpId, this.browseTime)
            }

            clearInterval(this.clearTimeSet)
            this.browseTime = 0
            this.curFileName = activity.FILE_NAME_
            this.checkNum(activity) // 阅读量
            // this.$forceUpdate()// 触发监听器
        },
        // 阅读量函数
        async checkNum (activity) {
            const sql = `select t_wjcyjl.* from t_wjcyjl
                INNER JOIN t_wjxxb ON t_wjcyjl.parent_id_ = t_wjxxb.id_
                WHERE t_wjxxb.shu_ju_lai_yuan_ = '${activity.id}' order by create_time_ desc`
            // const sql1 = `select * from t_wjcyjl where parent_id_= '${activity.id}' order by create_time_ desc`
            await this.$common.request('sql', sql).then((res) => {
                const { data = [] } = res.variables || {}
                this.lookNum = data.length
                this.showList = data
            })
        },
        handleAdd (fileId, time) {
            const addParams = {
                tableName: 't_wjcyjl',
                paramWhere: [
                    {
                        bian_zhi_ren_: this.userId,
                        bian_zhi_shi_jian: this.$common.getDateNow(19),
                        parent_id_: fileId,
                        shi_chang_: time
                    }
                ]
            }
            curdPost('add', addParams).then((res) => {
                // this.refreshData()
                const { cont = [] } = res.variables || {}
                this.timeId = cont[0]?.id_ || ''
            })
        },
        handleUpdate () {
            const updateParams = {
                tableName: 't_wjcyjl',
                updList: [
                    {
                        where: {
                            id_: this.timeId
                        },
                        param: {
                            // shi_chang_: this.browseTime
                            shi_chang_: 20
                        }
                    }
                ]
            }
            curdPost('update', updateParams).then((res) => {})
        },
        hideLeft () {
            this.leftShow = !this.leftShow
        },

        async lookFile () {
            // console.log(document.querySelector('iframe').contentWindow.document)
            // console.log(document.querySelector('iframe').contentWindow.document.body.innerHTML);
            if (this.digData) {
                await this.checkNum(this.digData)
            } else {
                this.digData = this.leftData[0]
                await this.checkNum(this.digData)
            }
            this.innerVisible = true
        },
        a () {
            fetch(this.optionFile.url)
                .then((response) => {
                    if (response.ok) {
                        // 如果响应状态码为 200-299，则创建下载链接
                        const a = document.createElement('a')
                        a.href = this.optionFile.url
                        a.download = this.optionFile.data.fileName
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                    } else {
                        // 如果响应状态码不是 200-299，则显示错误消息
                        this.$message({
                            message: '文件未找到，请联系管理员',
                            type: 'warning'
                        })
                        console.error(
                            '文件未找到:',
                            response.status,
                            response.statusText
                        )
                    }
                })
                .catch((error) => {
                    // 捕获网络请求错误
                    this.$message({
                        message: '网络请求失败，请联系管理员',
                        type: 'warning'
                    })
                    console.error('网络请求失败:', error)
                })
        },
        deleteFile () {
            this.deleteVisible = false
            // const roleKey = ['xtgljs', 'syszr', 'wjgly', 'wjglzzc']
            const roleKey = ['xtgljs']
            const curRole = this.role.map((i) => i.alias)
            const isPower = curRole.some((item) => roleKey.includes(item))
            if (this.isSuper || isPower) {
                const deleteParams = {
                    tableName: 't_wjxxb',
                    paramWhere: { id_: this.leftData[0].zId }
                }
                curdPost('delete', deleteParams).then(() => {
                    this.$message({
                        message: '删除成功！',
                        type: 'warning'
                    })
                    this.dialogVisible = false
                })
                return
            }
            this.$message({
                message: '您还没有权限，请联系管理员',
                type: 'warning'
            })
        },
        // closeDialog1 (val) {
        //     this.innerVisible = val
        // },
        updateFile () {
            const hasRole = localStorage.getItem('hasHighRole') === '1'
            // const roleKey = ['xtgljs', 'wjglzzc', 'wjgly', 'zhsfzr']
            // const curRole = this.role.map(i => i.alias)
            // const isPower = curRole.some(i => roleKey.includes(i))
            if (this.isSuper || hasRole) {
                const a = document.createElement('a')
                a.href = this.optionFile.url
                a.download = this.optionFile.data.fileName
                document.body.appendChild(a)
                a.click()
                a.remove()
                return
            }
            this.$message({
                message: '您还没有权限，请联系管理员',
                type: 'warning'
            })
        },
        fileShow (val) {
            return new Promise((resolve, reject) => {
                try {
                    this.dialogVisible = true
                    this.title = `文件：《${val.FILE_NAME_}》`
                    this.idChange(val.id).then((res) => {
                        this.tmpId = res
                        if (val.func) {
                            this.upFunc = val.func
                        }
                        const data = {
                            ext: val.fileInfos.EXT_,
                            fileName: val.fileInfos.FILE_NAME_,
                            id: val.fileInfos.ID_,
                            index: 0,
                            totalBytes: val.fileInfos.TOTAL_BYTES_
                        }

                        this.optionFile.url = `${this.$onlyofficeApi}/file/download?attachmentId=${data.id}`
                        this.optionFile.editUrl = `${this.$onlyofficeApi}/file/editCallback?fileName=${data.fileName}&fileType=${data.ext}&type=fileTraining&id=${data.id}`
                        this.optionFile.title = data.fileName // 文件名称
                        this.optionFile.fileType = data.ext // 类型
                        this.optionFile.data = data // 记录编制的位置，需要替换。
                        this.optionFile.data.index = data.index

                        // 使用 v-if 实现组件刷新功能
                        this.refresh = false
                        this.$nextTick(() => {
                            this.refresh = true
                            resolve() // 异步操作完成后 resolve
                        })
                    })
                } catch (error) {
                    reject(error)
                }
            })
        },
        // 排序函数
        sortByFabushijianDesc (data) {
            return data.sort((a, b) => {
                const dateA = new Date(a.fa_fang_shi_jian_)
                const dateB = new Date(b.fa_fang_shi_jian_)
                return dateB - dateA // 降序排序
            })
        },
        formattedTimestamp (timestamp) {
            const date = new Date(timestamp)
            // 获取年月日时分秒
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')

            // 格式化日期
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },

        checkDialogBody () {
            const intervalId = setInterval(() => {
                if (document.querySelector('iframe')) {
                    this.dialogBody = document.querySelector('iframe')
                    this.addMouseMoveListener()
                    clearInterval(intervalId)
                }
            }, 200)
        },
        addMouseMoveListener () {
            if (this.dialogBody && !this.mouseMoveHandler) {
                this.mouseMoveHandler = () => {
                    console.log('鼠标移动事件！！！！')
                }
                this.dialogBody.addEventListener(
                    'mousemove',
                    this.mouseMoveHandler,
                    true
                )
            }
        },
        removeMouseMoveListener () {
            if (this.dialogBody && this.mouseMoveHandler) {
                this.dialogBody.removeEventListener(
                    'mousemove',
                    this.mouseMoveHandler,
                    true
                )
                this.mouseMoveHandler = null
            }
        },
        updateInnerVisible (newVal) {
            this.innerVisible = newVal
        }
    }
}
</script>
<style lang="scss">
.ibps-file-preview-dialog {
    width: 80%;
    z-index: 99999;
    .el-dialog__body {
        padding: 0;
    }
    .file-type-txt {
        height: calc(88vh) !important;
    }
    .itemStyle:hover {
        cursor: pointer;
    }
    .titleHander,
    .read {
        line-height: 32px;
    }
    .deleteBtn {
        margin: 0 10px 0 0;
    }
}
.left-content {
    .left-title {
        text-align: left;
        padding: 15px;
        font-size: 18px;
        font-weight: 600;
    }
    .el-timeline {
        padding: 0 15px;
    }
    /* 清除分割线 */
    .el-collapse-item__wrap,
    .el-collapse-item__header {
        border-bottom: none !important;
    }
    .el-collapse {
        border: none !important;
    }
    .el-collapse-item__header {
        height: 30px;
        line-height: 30px;
    }
    .el-collapse-item__content {
        padding: 0px;
    }
    .el-timeline-item {
        padding-bottom: 10px;
    }
}
// .file-read-num{
//     display: inline-block;
//     margin-left: 60px;
// }

</style>

