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
                                <div>
                                    <div class="one">
                                        <div class="container">
                                            <div
                                                :class="item.deviceStatus === '合格' ? 'triangle' : item.deviceStatus === '停用' ? 'triangleRed' : item.deviceStatus === '限用' ? 'triangleYellow': 'triangleGray'"
                                            >
                                                <div class="label" style="border: 0;">{{ item.prove }}</div>
                                            </div>
                                            <div style="position: absolute;top: 25px;width: 100%;">
                                                <div
                                                    style="display: flex;justify-content: space-between;font-size: 14px;font-weight: 800;margin: 0 8px;"
                                                >
                                                    <div>{{ item.slogan }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tagBox">
                                        <div v-for="(e,t) in midData.columns" v-if="(e.field=='range'&&item[e.field] !== '') || e.field!='range'" :key="'zi'+t" class="lh" :style=" e.field=='verificationDate' ? item['range'] !== '' ? 'border-bottom: 1px solid #000000;' : 'border-bottom: 0px;':''">
                                            <div :class="e.field=='name'?'qianZhi':''">{{ e.label }}：</div>
                                            <div>{{ item[e.field] }}</div>
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
        return {
            dialogVisible: false,
            value: '',
            id: '',
            list: [{
                name: '设备名称',
                serial: '设备编号',
                original: '原设备编号',
                model: '型号规格',
                verifier: '核查人',
                verificationDate: '核查日期',
                // status: 1
                prove: '测试证', // 证名
                slogan: '标语', // 标语
                deviceStatus: '设备状态',
                range: '限用范围', // 限用范围
                assetNum: '固定资产号'
            }],
            visible: true,
            midData: {}
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
        },
        tagData: {
            handler (val) {
                if (this.tagData && this.tagData.hasOwnProperty('columns')) {
                    this.midData = val
                } else {
                    this.midData = { 'columns': [{ 'label': '设备名称', 'field': 'name' }, { 'label': '设备型号', 'field': 'model' }, { 'label': '设备编号', 'field': 'serial' }, { 'label': '固定资产号', 'field': 'assetNum' }, { 'label': '核查人', 'field': 'verifier' }, { 'label': '核查日期', 'field': 'verificationDate' }, { 'label': '限用范围', 'field': 'range' }], 'width': 330 }
                }
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
            // const sql = `select she_bei_ming_cheng_, she_bei_shi_bie_h, gui_ge_xing_hao_, she_bei_zhuang_ta, bi_xu_de_huan_jin, bi_xu_she_shi_, cai_gou_he_tong_, zi_chan_bian_hao_, yuan_she_bei_bian FROM t_sbdj WHERE find_in_set(id_, ${id})`
            // const personSql = `select * from ibps_party_employee`
            Promise.all([
                this.$common.request('query', {
                    key: 'getDeviceInfoByIds',
                    params: [id]
                }),
                this.$common.request('query', {
                    key: 'getAllUser',
                    params: [null]
                })
            ]).then(([res1, res2]) => {
                const { data } = res1.variables || []
                const personData = res2.variables.data || []
                console.log(data)
                // console.log(personData)
                const list = []
                data.forEach(item => {
                    const verificationDateStr = item.bi_xu_she_shi_ ? item.bi_xu_she_shi_ : ''
                    const o = {
                        prove: this.switchProve(item.she_bei_zhuang_ta),
                        slogan: this.switchSlogan(item.she_bei_zhuang_ta),
                        deviceStatus: item.she_bei_zhuang_ta,
                        range: this.judgementVal(item.cai_gou_he_tong_) ? item.cai_gou_he_tong_ : '',
                        assetNum: item.zi_chan_bian_hao_,

                        name: item.she_bei_ming_cheng_,
                        serial: item.she_bei_shi_bie_h,
                        original: item.yuan_she_bei_bian,
                        model: item.gui_ge_xing_hao_,
                        verifier: this.findPersonName(item.bi_xu_de_huan_jin, personData),
                        verificationDate: verificationDateStr.substring(0, 10)
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
        findPersonName (id, personData) {
            if (!personData) { return '核查人列表为空' }
            if (!id) { return '' }
            return personData.find(i => i.id_ === id).NAME_
        }
    }
}
</script>

<style lang="scss" scoped>
.All {
    text-align: center;
    margin: 10px 0px;
}

.bg {
    // height: auto;
}

.tagBox {
    width: 250px; // 300  240 231
    position: relative;
    border: 1px solid #000000;
    border-top: 0px;
    display: inline-block;
    background-color: #fff;
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

.lh {
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px; //16
    display: flex;
    align-items: center;
    border-bottom: 1px solid #000000;
}

.container {
    width: 250px;
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
