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
                                        <div class="midSty">
                                            <div
                                                v-for="(e,t) in midData.columns"
                                                :key="'zi'+t"
                                                :class="{
                                                    'single-row': t== midData.columns.length-1||t== midData.columns.length-2||t== midData.columns.length-5||t== midData.columns.length-6,
                                                    'double-row': !(t== midData.columns.length-1||t== midData.columns.length-2||t== midData.columns.length-5||t== midData.columns.length-6)
                                                }"
                                                class="lh"
                                            >
                                                <div class="qianZhi">{{ e.label }}：</div>
                                                <div class="qianZhi">{{ item[e.field] }}</div>
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
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

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
                original: '编号',
                model: '型号规格',
                verifier: '核查人',
                verificationDate: '核查日期',
                changJia: '厂家',
                changJiaLianXiRen: '厂家联系人及电话',
                jiShenXuHao: '出厂编号',
                cunFangDiDian: '放置地点',
                fuZeRen: '仪器负责人及电话',
                jiaoZhunRiQi: '检定/校准日期',
                chuChangBianHao: '下一次检定/校准日期',
                jianDingDanWei: '鉴定/校准单位',
                jieGuo: '鉴定/校准结果',
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
        async getLook (id) {
            const sql = `select
                    dj.she_bei_ming_cheng_,
                    dj.she_bei_shi_bie_h,
                    dj.gui_ge_xing_hao_,
                    dj.she_bei_zhuang_ta,
                    dj.bi_xu_de_huan_jin,
                    dj.bi_xu_she_shi_,
                    dj.cai_gou_he_tong_,
                    dj.zi_chan_bian_hao_,
                    dj.yuan_she_bei_bian,
                    dj.chang_shang_,
                    ifnull(dj.chang_jia_lian_xi, '') as chang_jia_lian_xi,
                    dj.ji_shen_xu_hao_,
                    dj.cun_fang_di_dian_,
                    dj.guan_li_ren_,
                    ifnull(dj.fu_ze_ren_dian_hu, '') as fu_ze_ren_dian_hu,
                    dj.yi_xiao_ri_qi_
                FROM
                    t_sbdj dj
                WHERE
                    find_in_set( dj.id_, '${id}' )`
            // console.log(sql)
            const personSql = `select id_,NAME_ from ibps_party_employee`
            const res1 = await curdPost('sql', sql)
            const res2 = await curdPost('sql', personSql)
            const { data } = res1.variables || []
            const personData = res2.variables.data || []
            let sbjdData = []
            // 获取原设备编号后再去查他对应的检定校准记录
            if (data?.length) {
                const yuanSheBei = data.map(item => item.yuan_she_bei_bian).join(',')
                const sbjdsql = `select * FROM t_mjsbjdxzjhzb WHERE  marks_ = 'record' AND jing_ban_ren_ IS NOT NULL AND jing_ban_ren_ <> '' AND FIND_IN_SET(yuan_she_bei_bian,'${yuanSheBei}') ORDER BY ji_hua_ri_qi_ desc,bian_zhi_shi_jian desc`
                const res3 = await curdPost('sql', sbjdsql)
                sbjdData = res3.variables.data || []
                console.log(sbjdData, '2222')
                const list = []
                data.forEach(item => {
                    const verificationDateStr = item.bi_xu_she_shi_ ? item.bi_xu_she_shi_ : ''
                    const o = {
                        prove: this.switchProve(item.she_bei_zhuang_ta),
                        slogan: this.switchSlogan(item.she_bei_zhuang_ta),
                        deviceStatus: item.she_bei_zhuang_ta,
                        range: this.judgementVal(item.cai_gou_he_tong_) ? item.cai_gou_he_tong_ : '',
                        assetNum: item?.zi_chan_bian_hao_,
                        changJia: item?.chang_shang_,
                        changJiaLianXiRen: item?.chang_jia_lian_xi,
                        jiShenXuHao: item?.ji_shen_xu_hao_,
                        cunFangDiDian: item?.cun_fang_di_dian_,
                        fuZeRen: this.findPersonName(item.guan_li_ren_, personData) + item.fu_ze_ren_dian_hu,
                        jiaoZhunRiQi: this.findData('shi_shi_ri_qi_', item.yuan_she_bei_bian, sbjdData),
                        chuChangBianHao: this.findData('chu_chang_bian_ha', item.yuan_she_bei_bian, sbjdData),
                        jianDingDanWei: this.findData('jian_ding_dan_wei', item.yuan_she_bei_bian, sbjdData),
                        jieGuo: this.findData('jie_guo_', item.yuan_she_bei_bian, sbjdData),
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
            }
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
        },
        findData (prop, value, sbjdData) {
            const result = sbjdData.find(el => el.yuan_she_bei_bian == value)
            if (result) {
                if (prop === 'jie_guo_') {
                    return '合格'
                } else {
                    return result[prop]
                }
            } else {
                return ''
            }
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
    width: 360px; // 300  240 231
    position: relative;
    border: 1px solid #000000;
    border-top: 0px;
    display: inline-block;
    background-color: #fff;
    line-height: 1.5;
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
    white-space: nowrap;
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
    // width: 50%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px; //16
    border-bottom: 1px solid #000000;
}
.lh:nth-last-child(-n+1) {
    border-bottom: none;
}
.single-row{
    width: 100%;
}
.double-row {
    width: 50%
}
.container {
    width: 360px;
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
    border-right: 180px solid transparent;
    border-left: 180px solid transparent;
    border-bottom: 180px solid transparent;
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
