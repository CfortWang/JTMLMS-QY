<template>
    <div class="bg">
        <el-dialog
            width="11cm"
            height="10cm"
            :modal-append-to-body="true"
            :append-to-body="true"
            title="设备标签"
            :visible.sync="dialogVisible"
            @close="close"
        >
            <!-- 表单是否显示 -->
            <div style="height:500px">
                <div id="box" ref="qrcode">
                    <vue-easy-print ref="easyPrint" table-show :one-page-row="onePageRow">
                        <div v-for="(item, index) in list" :key="index">
                            <div class="All">
                                <div class="mid">
                                    <div class="titleFont">
                                        {{ tagData.title }}
                                    </div>
                                    <div class="borderLine" :style="{width: tagData.width+'px',margin: '7px auto'}" />
                                    <div class="tagBox" :style="{width: tagData.width+'px'}">
                                        <div class="midSty">
                                            <div v-for="(e,t) in tagData.columns" :key="'zi'+t" class="lh" style="margin: 5px 2px;">
                                                <div :style="{width: ((tagData.width-15)/4).toFixed(2)+'px',textAlign: 'left'}">{{ e.label }}：</div>
                                                <div v-if="e.field === 'deviceStatus'" :style="{width: ((tagData.width-15)/4).toFixed(2)+'px',textAlign: 'left'}" class="borderSty">
                                                    <!-- <span :style="{'border':'1px solid '+ (item[e.field] === '合格' ? '#008000' : item[e.field] === '停用' ? '#ff0000' : item[e.field] === '限用' ? '#ffff00': '#909399'),'color': item[e.field] === '合格' ? '#008000 !important' : item[e.field] === '停用' ? '#ff0000 !important' : item[e.field] === '限用' ? '#ffff00 !important': '#909399 !important','padding': '0px 3px','border-radius': '2px'}">{{ item[e.field] }}</span> -->
                                                    <span :style="{'background': (item[e.field] === '合格' ? '#008000' : item[e.field] === '停用' ? '#ff0000' : item[e.field] === '限用' ? '#ffff00': '#909399') + '!important','color': '#fff !important','padding': '0px 3px','border-radius': '2px','-webkit-print-color-adjust': 'exact'}">{{ item[e.field] }}</span>
                                                </div>
                                                <div v-else :style="{width: ((tagData.width-15)/4).toFixed(2)+'px',textAlign: 'left'}" class="borderSty">{{ item[e.field] || '/' }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </vue-easy-print>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="printDemo">打印标签</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import VueBarcode from 'vue-barcode'
import vueEasyPrint from 'vue-easy-print'

export default {
    components: {
        VueBarcode,
        vueEasyPrint
    },
    props: {
        obj: {
            default: () => [],
            type: Array
        },
        onePageRow: {
            type: Number,
            default: 3
        },
        blankLines: {
            type: Boolean,
            default: true
        },
        scanVisible: {
            type: Boolean,
            default: false
        },
        stateList: {
            type: Object,
            default: function () {
                return { '停用': '停用', '报废': '报废', '合格': '合格' }
            }
        },
        tagData: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        const { userList = [] } = this.$store.getters || {}
        return {
            userList: userList,
            dialogVisible: false,
            value: '',
            id: '',
            list: [{
                name: '设备名称',
                serial: '设备编号',
                model: '型号规格',
                verifier: '核查人',
                verificationDate: '核查日期',
                // status: 1
                prove: '测试证', // 证名
                slogan: '标语', // 标语
                deviceStatus: '设备状态',
                range: '限用范围', // 限用范围
                assetNum: '固定资产号',
                deviceGrouping: '设备分组',
                placeOfPlacement: '放置地点',
                calibrationDate: '校准日期',
                nextCalibrationDate: '下次校准日期',
                commissioningDate: '启用日期',
                personInCharge: '责任人'
            }],
            visible: true
        }
    },
    watch: {
        obj () {
            this.getInit()
        },
        scanVisible: {
            handler (val) {
                this.dialogVisible = val
            },
            immediate: true
        }
    },
    created () {
        this.getInit()
    },
    methods: {
        close () {
            this.dialogVisible = false
            this.$emit('scanOff')
        },
        printDemo () {
            this.$refs.easyPrint.print()
        },
        getInit () {
            var idStr = ''
            this.obj.forEach(item => {
                idStr += item.split(' ')[0] + ','
            })
            idStr = idStr.substring(0, idStr.length - 1)
            this.getLook(idStr)
        },
        getLook (id) {
            // const sql = `select * FROM t_sbdj WHERE find_in_set(id_, '${id}' )`
            // const posSql = `select * from t_sbwhgwpzb`
            // const roomSql = `select * from t_jjqfjb`
            const { first, second } = this.$store.getters.level || {}
            Promise.all([
                this.$common.request('query', {
                    key: 'rygwsqbb',
                    params: [id]
                }),
                this.$common.request('query', {
                    key: 'getPositionList',
                    params: [second || first]
                }),
                this.$common.request('query', {
                    key: 'getRoomData',
                    params: [second || first]
                })
            ]).then(([res1, res2, res3]) => {
                const { data } = res1.variables || []
                const posData = res2.variables.data || []
                const roomData = res3.variables.data || []
                const list = []
                data.forEach(item => {
                    const midPos = item.wei_hu_fang_shi_ ? posData.find(t => t.positionId === item.wei_hu_fang_shi_).positionName : ''
                    const midRoom = item.cun_fang_wei_zhi_ ? roomData.find(t => t.id_ === item.cun_fang_wei_zhi_).fang_jian_ming_ha : ''
                    const midPer = item.guan_li_ren_ ? this.userList.find(t => t.userId === item.guan_li_ren_).userName : ''

                    const verificationDateStr = item.bi_xu_she_shi_ ? item.bi_xu_she_shi_ : ''
                    const o = {
                        prove: this.switchProve(item.she_bei_zhuang_ta),
                        slogan: this.switchSlogan(item.she_bei_zhuang_ta),
                        deviceStatus: item.she_bei_zhuang_ta,
                        range: this.judgementVal(item.cai_gou_he_tong_) ? item.cai_gou_he_tong_ : '',
                        assetNum: item.zi_chan_bian_hao_,

                        name: item.she_bei_ming_cheng_,
                        serial: item.she_bei_shi_bie_h,
                        model: item.gui_ge_xing_hao_,
                        verifier: this.findPersonName(item.bi_xu_de_huan_jin),
                        verificationDate: verificationDateStr.substring(0, 10),
                        deviceGrouping: midPos,
                        placeOfPlacement: midRoom,
                        calibrationDate: item.yi_xiao_ri_qi_,
                        nextCalibrationDate: item.xiao_zhun_you_xia,
                        commissioningDate: item.qi_yong_ri_qi_,
                        personInCharge: midPer
                    }
                    list.push(o)
                    console.log(o)
                })
                this.list = list
            })
        },
        judgementVal (value) {
            return value != null && value != undefined
        },
        switchProve (status) {
            return `${this.stateList[status] || '测试'}证`
        },
        switchSlogan (status) {
            switch (status) {
                case '合格':
                    return 'PASS'
                case '停用':
                    return 'STOP'
                case '限用':
                    return 'RESTRICT'
                case '报废':
                    return 'SCRAP'
                default:
                    return 'TEST'
            }
        },
        findPersonName (id) {
            if (!id || !this.userList) { return '' }
            return this.userList.find(i => i.userId === id).userName
        }
    }
}
</script>

<style lang="scss" scoped>
.All {
    text-align: center;
    margin: 10px 0px;
}
// .mid{
//     display: flex;
//     justify-content: center;
//     flex-wrap: wrap;
// }
.bg {
    // height: auto;
}

.tagBox {
    width: 330px; // 300  240 231
    position: relative;
    // border: 1px solid #000000;
    border-top: 0px;
    display: inline-block;
    background-color: #fff;
}
.midSty{
    display: flex;
    justify-items: center;
    align-items: center;
    flex-wrap: wrap;
}
.ewm {
    margin-left: 10px;
}
.qianZhi {
    white-space: nowrap
}

.la {
    font-size: 12px; //16
    display: flex;
    align-items: center;
    padding: 1px;
    width: 50%;
}

.zuoJuZhong {
    text-align: left;
}
.titleFont{
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
}
.borderLine{
    height: 1px;
    border-top: 2px solid #000;
    border-bottom: 1px solid #000;
}
.lh {
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px; //16
    display: flex;
    align-items: center;
    margin: 0 2px;
    // border-bottom: 1px solid #000000;
    .borderSty{
        border-bottom: 1px solid #000;
        text-align: left;
    }
    div{
        width: 60px;
    }
}
.marginLeft{
    margin-left: 5px;
}

.container {
    width: 330px;
    height: 50px;
    position: relative;
    border: 1px solid #000000;
}

.triangle,
.triangleYellow,
.triangleRed,
.triangleGray {
    width: 0;
    height: 0;
    position: relative;
    border-right: 125px solid transparent;
    border-left: 125px solid transparent;
    border-bottom: 125px solid transparent;
    text-align: center;
}

.triangle {
    border-top: 50px solid #008000;
}

.triangleYellow {
    border-top: 50px solid #ffff00;
}

.triangleRed {
    border-top: 50px solid #ff0000;
}
.triangleGray {
    border-top: 50px solid #909399;
}
.triangle>.label,
.triangleYellow>.label,
.triangleRed>.label,
.triangleGray>.label {
    width: 100px;
    position: relative;
    top: -45px;
    left: -50px;
    font-size: 20px;
    font-weight: bold;
    color: #000000;
}

.top-triangle {
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    top: 0;
    left: 0;
}

.left-triangle {
    /* border-top: 100px solid transparent; */
    border-right: 100px solid black;
    border-bottom: 50px solid rgb(217, 217, 233);
    top: 0;
    left: 0;
}

.right-triangle {
    border-left: 100px solid black;//red
    border-bottom: 50px solid rgb(217, 217, 233);
    top: 0;
    left: 100px;
}

.one {
    justify-content: center;
    align-items: center;
    display: flex;
}
</style>
