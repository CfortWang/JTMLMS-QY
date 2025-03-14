<template>
    <div class="personFile20241107" :style="$attrs.params&&$attrs.params.attrs.flow!=''?'height:100vh':'height:100%'">
        <el-dialog
            v-if="type=='dialog'"
            title=""
            class="personFileDialog20241107"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            :fullscreen="true"
            :show-close="false"
            center
        >
            <div class="dialogSty">
                <div v-if="stauts!=='已完成'||stauts!==''" style="position: absolute;top:2%;" v-html="stauts==='已退回'?seal.sealNo:stauts==='待审核'?seal.sealPing:seal.sealSuc" />
                <personnel-info class="perInfo" :button-type="$attrs.params?$attrs.params.attrs.flow*1:buttonType" :type="type" :btn-show="btnShow" :btn-type="btnType" :person-info-data="personInfoData" @showTF="showTF" @changeBtn="changeBtn" @changeBtnShow="changeBtnShow" />
                <modules-tag
                    class="moudleTab"
                    :tag-data="tagData"
                    :base-data="baseData"
                    :type="type"
                    :btn-show="btnShow"
                    :btn-type="btnType"
                    :button-type="$attrs.params?$attrs.params.attrs.flow*1:buttonType"
                    :person-i-d="personID"
                    @getChangeBaseData="getChangeBaseData"
                    @tipsShow="tipsShow"
                    @changeTabs="changeTabs"
                    @changeBtnShow="changeBtnShow"
                />
            </div>
        </el-dialog>
        <div v-else class="personFilePlane20241107">
            <div class="planeSty">
                <div v-if="stauts!=''" style="position: absolute;top:2%;" v-html="stauts==='已退回'?seal.sealNo:stauts==='待审核'?seal.sealPing:seal.sealSuc" />
                <personnel-info class="perInfo" :button-type="$attrs.params?$attrs.params.attrs.flow*1:buttonType" :btn-show="btnShow" :btn-type="btnType" :person-info-data="personInfoData" @showTF="showTF" @changeBtn="changeBtn" @changeBtnShow="changeBtnShow" />
                <modules-tag
                    class="moudleTab"
                    :tag-data="tagData"
                    :base-data="baseData"
                    :type="type"
                    :btn-show="btnShow"
                    :btn-type="btnType"
                    :button-type="$attrs.params?$attrs.params.attrs.flow*1:buttonType"
                    :person-i-d="personID"
                    @getChangeBaseData="getChangeBaseData"
                    @tipsShow="tipsShow"
                    @changeTabs="changeTabs"
                    @changeBtnShow="changeBtnShow"
                />
            </div>
        </div>

    </div>
</template>
<script>
import personnelInfo from './components/personnelInfo.vue'
import modulesTag from './components/modulesTag.vue'
import simulated from './constants/simulated'
import seal from './utils/seal.js'

import { getInfo, setInfo } from '@/api/platform/personFile/base'
import { get } from '@/api/platform/personFile/unidirectionalCorrelation'
import { startFlow } from '@/api/platform/bpmn/bpmInst'
import { agree, reject } from '@/api/platform/bpmn/bpmTask'

export default {
    components: {
        personnelInfo,
        modulesTag
    },
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: ''
        },
        buttonType: {
            type: Number,
            default: 0
        },
        personID: {
            type: String,
            default: ''
        },
        flowNode: {
            type: String,
            default: ''
        },
        flow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userId, userList = [], userInfo } = this.$store.getters
        return {
            userId,
            userList,
            userInfo,
            dialogVisible: this.visible,
            personInfoData: {},
            tagData: {},
            baseData: {},
            btnShow: true,
            btnType: '',
            activeName: 'ryjbqk',
            infoNumArr: [],
            seal,
            stauts: '',
            tipsControls: false
        }
    },
    watch: {
        dialogVisible: {
            handler: function (val, oldVal) {
                // if(val == true){
                // }
            },
            deep: true,
            immediate: true
        },
        activeName: {
            handler: function (val, oldVal) {
                if (this.type === 'dialog') {
                    this.tabChangeSetData(this.personID, val, 1)
                } else {
                    this.tabChangeSetData(this.userId, val, 1)
                }
            },
            deep: true,
            immediate: true
        }
    },
    created () {
        console.log(this)
        this.$parent.$parent.showClose = false
        if (this.$attrs.params) {
            const sql1 = `select a.CREATE_BY_ from ibps_bpm_inst a join ibps_bpm_task_pendding b on b.proc_inst_id_=a.id_ where b.PROC_DEF_KEY_ = 'Process_08xwabfNEW' and b.task_id_ ='${this.$attrs.params.taskId}'`
            // const sql1 = `select CREATE_BY_ FROM ibps_bpm_oper_log WHERE PROC_INST_ID_ = (SELECT PROC_INST_ID_ FROM ibps_bpm_bus_rel WHERE BUSINESSKEY_ = "${this.$attrs.params.attrs.id}" LIMIT 1 )AND OPER_TYPE_ IN('start')`
            const sql2 = `select CREATE_BY_ FROM ibps_bpm_oper_log WHERE PROC_INST_ID_ = '${this.$attrs.params.instanceId}' AND OPER_TYPE_ IN('start') ORDER BY CREATE_TIME_ asc limit 1`
            this.$common.request('sql', this.$attrs.params.hasOwnProperty('taskId') ? sql1 : this.$attrs.params.hasOwnProperty('instanceId') ? sql2 : '').then((r) => {
                const datas = r.variables.data.length > 0 ? r.variables.data[0].CREATE_BY_ : ''
                this.userId = datas
                this.init(this.userId)
            })
        } else {
            if (this.type === 'dialog') {
                this.init(this.personID)
            } else {
                this.init(this.userId)
            }
        }
    },
    methods: {
        init (val) {
            getInfo({ id: val }).then(res => {
                this.personInfoData = res.data
                this.stauts = this.personInfoData.ryjbqkInfoPoList[0].shiFouGuoShen
                // 保存基本数据
                simulated.baseDataObj.ryjbqk.data = res.data.ryjbqkInfoPoList[0]
                this.$set(this.baseData, 'ryjbqk', simulated.baseDataObj.ryjbqk)
                simulated.baseDataObj.jyjl.data = res.data.educationInfoPoList
                this.$set(this.baseData, 'jyjl', simulated.baseDataObj.jyjl)
                simulated.baseDataObj.gzjl.data = res.data.workInfoPoList
                this.$set(this.baseData, 'gzjl', simulated.baseDataObj.gzjl)
                simulated.baseDataObj.zsb.data = res.data.certificateInfoPoList
                this.$set(this.baseData, 'zsb', simulated.baseDataObj.zsb)
            })
            const sql1 = `select * from t_rydatablpzb where xian_shi_yin_cang = 'Y'`
            this.$common.request('sql', sql1).then((r) => {
                const { data = [] } = r.variables || []
                data.forEach(e => {
                    this.$set(this.tagData, e.dui_ying_biao_min, { display: e.xian_shi_yin_cang, title: e.tab_zhong_wen_min })
                })
            })
        },
        showTF (val) {
            if ((this.$attrs.params && this.$attrs.params.attrs.flow) || (this.$attrs.params && this.$attrs.params.instanceId)) {
                this.$emit('close', false)
            }
            this.dialogVisible = val
        },
        changeTabs (val) {
            this.activeName = val
        },
        tabChangeSetData (id, val, page) {
            if (this.tagData.hasOwnProperty(val)) {
                get({ 'customs': {
                    'id': id, // 人员id
                    'type': simulated.tabName[val] // 科研类型
                }
                // 'requestPage': { // 分页信息，可为空
                //     'pageNo': page,
                //     'limit': 10
                // }
                }).then(res => {
                    const data = res.data.dataResult || []
                    this.$set(this.tagData, val, { ...this.tagData[val], ...{ data: data }})
                })
            }
        },
        tabSetData (page) {
            if (this.type === 'dialog') {
                this.tabChangeSetData(this.personID, this.activeName, page)
            } else {
                this.tabChangeSetData(this.userId, this.activeName, page)
            }
        },
        changeBtnShow (val) {
            this.btnShow = val
        },
        getChangeBaseData (val, name) {
            // console.log(this.infoNumArr, this.btnType, this.tipsControls, (this.btnType === 'save' || this.btnType === 'agree' || this.btnType === 'submit' || this.btnType === 'sendBack') && this.tipsControls === false, "(this.btnType === 'save' || this.btnType === 'agree' || this.btnType === 'submit' || this.btnType === 'sendBack') && this.tipsControls === false")
            if ((this.btnType === 'save' || this.btnType === 'agree' || this.btnType === 'submit' || this.btnType === 'sendBack') && this.tipsControls === false && this.checkData(this.personInfoData)) {
                switch (name) {
                    case 'ryjbqk':
                        // eslint-disable-next-line no-undef
                        this.personInfoData.ryjbqkInfoPoList[0] = structuredClone(val)
                        this.personInfoData.ryjbqkInfoPoList[0].shiFouGuoShen = this.btnType === 'submit' || (this.btnType === 'agree' && this.$attrs.params.attrs.flow * 1 === 4) ? '待审核' : this.btnType === 'sendBack' ? '已退回' : '已完成'
                        this.infoNumArr.push(1)
                        break
                    case 'zsb':
                        // eslint-disable-next-line no-undef
                        this.personInfoData.certificateInfoPoList = structuredClone(val)
                        this.infoNumArr.push(1)
                        break
                    case 'gzjl':
                        // eslint-disable-next-line no-undef
                        this.personInfoData.workInfoPoList = structuredClone(val)
                        this.infoNumArr.push(1)
                        break
                    case 'jyjl':
                        // eslint-disable-next-line no-undef
                        this.personInfoData.educationInfoPoList = structuredClone(val)
                        this.infoNumArr.push(1)
                        break
                    default:
                        break
                }
                if (this.infoNumArr.length === 4) {
                    if (this.btnType === 'submit') {
                        startFlow(
                            {
                                'defId': '1315609540510613504',
                                'version': '0',
                                'data': simulated.data
                            }
                        ).then(res => {
                            this.$alert(`启动成功！`, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$children[0].buttonShow = true
                                    this.infoNumArr = []
                                    this.saveData(this.personInfoData, 'Refresh')
                                }
                            })
                        })
                    } else if (this.btnType === 'agree') {
                        this.personInfoData.shouQuanQianZ = this.userId
                        this.personInfoData.updateTime = this.$common.getDateNow(19)
                        agree(
                            {
                                'opinion': '同意',
                                'taskId': this.$attrs.params.taskId,
                                'data': simulated.data
                            }
                        ).then(res => {
                            this.$alert(`任务办理成功！`, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.showTF(false)
                                    this.infoNumArr = []
                                    this.saveData(this.personInfoData)
                                }
                            })
                        })
                    } else if (this.btnType === 'sendBack') {
                        console.log(this.$attrs.params.taskId)
                        reject(
                            {
                                'backHandMode': 'normal',
                                'destination': '',
                                'opinion': '退回修改',
                                'rejectMode': 'reject',
                                'taskId': this.$attrs.params.taskId,
                                'data': simulated.data
                            }
                        ).then(res => {
                            this.$alert(`已退回！`, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.showTF(false)
                                    this.infoNumArr = []
                                    this.saveData(this.personInfoData)
                                }
                            })
                        })
                    } else if (this.btnType === '') {
                        console.log('重置')
                    } else if (this.btnType === 'save') {
                        this.personInfoData.shouQuanQianZ = this.userId
                        this.personInfoData.updateTime = this.$common.getDateNow(19)
                        this.saveOperate()
                        // const sql = `select b.id_,b.name_ from ibps_bpm_inst a join ibps_bpm_tasks b on b.PROC_DEF_KEY_=a.PROC_DEF_KEY_ where b.PROC_DEF_KEY_ = 'Process_08xwabfNEW' and a.CREATE_BY_ ='${this.personID}'`
                        // this.$common.request('sql', sql).then(res => {
                        //     const datas = res.variables.data.length > 0 ? res.variables.data[0] : ''
                        //     if (datas.id_ !== '') {
                        //         agree(
                        //             {
                        //                 'opinion': '同意',
                        //                 'taskId': datas.id_,
                        //                 'data': simulated.data
                        //             }
                        //         ).then(res1 => {
                        //             if (datas.name_ === '编制') {
                        //                 agree(
                        //                     {
                        //                         'opinion': '同意',
                        //                         'taskId': datas.id_,
                        //                         'data': simulated.data
                        //                     }
                        //                 ).then(res2 => {
                        //                     this.$alert(`办理成功！`, '提示', {
                        //                         confirmButtonText: '确定',
                        //                         callback: action => {
                        //                             this.showTF(false)
                        //                             this.infoNumArr = []
                        //                             this.saveData(this.personInfoData)
                        //                         }
                        //                     })
                        //                 })
                        //             } else {
                        //                 this.$alert(`办理成功！`, '提示', {
                        //                     confirmButtonText: '确定',
                        //                     callback: action => {
                        //                         this.showTF(false)
                        //                         this.infoNumArr = []
                        //                         this.saveData(this.personInfoData)
                        //                     }
                        //                 })
                        //             }
                        //         })
                        //     } else {
                        //         this.infoNumArr = []
                        //         this.saveData(this.personInfoData)
                        //     }
                        // })
                    } else {
                        this.infoNumArr = []
                        this.saveData(this.personInfoData)
                    }
                }
            }
        },
        saveData (val, r) {
            setInfo(val).then(res => {
                this.showTF(false)
                if (r === 'Refresh') {
                    location.reload()
                }
            })
        },
        changeBtn (val, data) {
            this.btnType = val
            if (Object.keys(data).length > 0) {
                this.personInfoData = data
            }
            if ((this.btnType === 'save' || this.btnType === 'agree' || this.btnType === 'submit' || this.btnType === 'sendBack') && this.tipsControls === false && !this.checkData(this.personInfoData)) {
                this.tipsMess('请检查表单数据是否填写正确')
            }
        },
        tipsShow (val, name) {
            if (val && this.tipsControls === false) {
                this.infoNumArr = []

                this.tipsControls = true
                this.tipsMess('请检查表单数据是否填写正确')
            }
        },
        checkData (val) {
            const nameArr = ['name', 'jianDingZiGeZ', 'gender']
            let identification = 0
            if (this.buttonType === 1) {
                nameArr.forEach((item, i) => {
                    if (val[item] === '' || val[item] === null) {
                        identification = 1
                    }
                })
            }
            return identification === 0
        },
        tipsMess (val) {
            const that = this
            this.$message({
                message: val,
                type: 'warning',
                onClose: () => {
                    that.tipsControls = false
                }
            })
        },
        saveOperate () {
            const sql = `select b.id_,b.name_ from ibps_bpm_inst a join ibps_bpm_tasks b on b.PROC_DEF_KEY_=a.PROC_DEF_KEY_ where b.PROC_DEF_KEY_ = 'Process_08xwabfNEW' and a.CREATE_BY_ ='${this.personID}'`
            this.$common.request('sql', sql).then(res => {
                const datas = res.variables.data.length > 0 ? res.variables.data[0] : ''
                if (res.variables.data.length > 0 && datas.id_ !== '') {
                    agree(
                        {
                            'opinion': '同意',
                            'taskId': datas.id_,
                            'data': simulated.data
                        }
                    ).then(res1 => {
                        if (datas.name_ === '编制') {
                            this.saveOperate()
                        } else {
                            this.$alert(`办理成功！`, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.showTF(false)
                                    this.infoNumArr = []
                                    this.saveData(this.personInfoData)
                                }
                            })
                        }
                    })
                } else {
                    this.infoNumArr = []
                    this.saveData(this.personInfoData)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.personFile20241107{
    background-color: #f9ffff;
    width: 100%;
    height: 100%;
}
.personFileDialog20241107{
    ::v-deep .el-dialog__header{
        display: none;
    }
    ::v-deep .el-dialog{
        background-color: #f9ffff;
    }
    .dialogSty{
        width: 100%;
        height: calc(100vh - 40px);
        padding-top: 20px;
        display: flex;
        // justify-content: center;
        flex-direction: column;
        align-items: center;
        // padding-top: 1%;
        .perInfo{
            // margin-top: 2%;
            box-shadow:
            0 -2px 12px 0 rgba(0,0,0,.04),
            2px 0px 12px 0 rgba(0,0,0,.04),
            -2px 0px 12px 0 rgba(0,0,0,.04);
        }
    }
}
.personFilePlane20241107{
    width: 100%;
    height: calc(100% - 40px);
    padding-top: 20px;
    .planeSty{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .perInfo{
            // margin-top: 2%;
            box-shadow:
            0 -2px 12px 0 rgba(0,0,0,.04),
            2px 0px 12px 0 rgba(0,0,0,.04),
            -2px 0px 12px 0 rgba(0,0,0,.04);
            border-radius: 4px 4px 0 0;
        }
    }
}
</style>
