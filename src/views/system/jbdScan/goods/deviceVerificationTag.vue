<template>
    <div class="bg">
        <el-dialog
            width="11cm"
            height="10cm"
            :modal-append-to-body="true"
            :append-to-body="true"
            title="设备检定校准标签"
            :visible.sync="scanVisible"
        >
            <!-- 表单是否显示 -->
            <div style="height:500px">
                <div id="box" ref="qrcode">
                    <vue-easy-print ref="easyPrint" table-show :one-page-row="onePageRow">
                        <div v-for="(item, index1) in list" :key="index1">
                            <!-- style="page-break-after:always" -->
                            <div class="All">
                                <div>
                                    <div class="one">
                                        <div class="container">
                                            <div
                                                :class="item.deviceStatus === '合格' ? 'triangle' : item.deviceStatus === '停用' ? 'triangleRed' : 'triangleYellow'"
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
                                        <div class="lh">
                                            <div class="qianZhi">设备名称：</div>
                                            <div>{{ item.name }}</div>
                                        </div>
                                        <div v-if="modelTF" class="lh">
                                            <div>设备型号：</div>
                                            <div>{{ item.model }}</div>
                                        </div>
                                        <div class="lh">
                                            <div>设备编号：</div>
                                            <div>{{ orgTF?item.original:item.serial }}</div>
                                        </div>

                                        <div class="lh">
                                            <div class="la">
                                                <div>校准日期：</div>
                                                <div>{{ item.jiaoZhunTime }}</div>
                                            </div>
                                            <div class="la" style="border-left: 1px solid #000000;">
                                                <div>有效期至：</div>
                                                <div>{{ item.validTo }}</div>
                                            </div>
                                        </div>
                                        <div
                                            class="lh"
                                            :style="item.range !== '' ? 'border-bottom: 1px solid #000000;' : 'border-bottom: 0px;'"
                                        >
                                            <div class="qianZhi">校准单位：</div>
                                            <div class="zuoJuZhong">{{ item.unit }}</div>
                                        </div>
                                        <!-- <div class="lh" style="border-bottom: 0px;" v-if="item.range !== ''">
                                            <div class="qianZhi">限用范围：</div>
                                            <div class="zuoJuZhong">{{ item.range }}</div>
                                        </div> -->
                                    </div>
                                </div>

                            </div>
                        </div>
                    </vue-easy-print>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="scanVisible = false">取 消</el-button>
                <el-button type="primary" @click="printDemo">打印标签</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import VueBarcode from 'vue-barcode'
import vueEasyPrint from 'vue-easy-print'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import { getSetting } from '@/utils/query'

export default {
    components: {
        VueBarcode,
        vueEasyPrint
    },
    props: {
        obj: {
            default: [],
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
        }
    },
    data () {
        return {
            value: '',
            id: '',
            list: [{
                name: 1,
                serial: 1,
                original: 1,
                validTo: 1,
                model: 1,
                unit: 1,
                jiaoZhunTime: 1,
                // status: 1
                prove: 1, // 证名
                slogan: 1, // 标语
                deviceStatus: 1,
                range: 1 // 限用范围
            }],
            visible: true,
            orgTF: false,
            modelTF: true

        }
    },
    watch: {
        obj () {
            this.getInit()
            // console.log(this.obj)
        }
    },
    created () {
        this.getInit()
    },
    methods: {
        printDemo () {
            this.$refs.easyPrint.print()
        },
        async getInit () {
            var idStr = ''
            this.obj.forEach(item => {
                idStr += item.split(' ')[0] + ','
            })
            idStr = idStr.substring(0, idStr.length - 1)
            this.getLook(idStr)
            const { tagData } = await getSetting('verificationTag') || {}
            this.orgTF = tagData && tagData.hasOwnProperty('originalDevice') ? tagData.originalDevice : false
            this.modelTF = tagData && tagData.hasOwnProperty('originalDevice') ? tagData.modelNumber : true
        },
        getLook (id) {
            const sql = `select
                    dj.she_bei_ming_cheng_,
                    dj.she_bei_shi_bie_h,
                    dj.gui_ge_xing_hao_,
                    dj.she_bei_zhuang_ta,
                    dj.cai_gou_he_tong_, 
                    dj.yuan_she_bei_bian,
                    zx.shi_shi_ri_qi_,
                    zx.chu_chang_bian_ha,
                    zx.jian_ding_dan_wei
                FROM
                    t_sbdj dj
                    RIGHT JOIN t_mjsbjdxzjhzb zx ON zx.bian_hao_zhong_we = dj.she_bei_shi_bie_h 
                WHERE
                    find_in_set( zx.id_, '${id}' )`
            // console.log(sql)
            curdPost('sql', sql).then(res => {
                const { data } = res.variables || []
                // console.log(data)
                const list = []
                data.forEach(item => {
                    const o = {
                        prove: this.switchProve(item.she_bei_zhuang_ta),
                        slogan: this.switchSlogan(item.she_bei_zhuang_ta),
                        deviceStatus: item.she_bei_zhuang_ta,
                        range: this.judgementVal(item.cai_gou_he_tong_) ? item.cai_gou_he_tong_ : '',

                        name: item.she_bei_ming_cheng_,
                        serial: item.she_bei_shi_bie_h,
                        original: item.yuan_she_bei_bian,
                        validTo: item.chu_chang_bian_ha,
                        model: item.gui_ge_xing_hao_,
                        unit: item.jian_ding_dan_wei,
                        jiaoZhunTime: item.shi_shi_ri_qi_
                    }
                    list.push(o)
                })

                this.list = list
            })
        },
        judgementVal (value) {
            return value != null && value != undefined
        },
        switchProve (status) {
            switch (status) {
                case '合格':
                    return '合格证'
                case '停用':
                    return '停用证'
                case '限用':
                    return '限用证'
                default:
                    return '测试证'
            }
        },
        switchSlogan (status) {
            switch (status) {
                case '合格':
                    return 'PASS'
                case '停用':
                    return 'STOP'
                case '限用':
                    return 'RESTRICT'
                default:
                    return 'TEST'
            }
        },
        getTime (second) {
            const date = new Date(second)
            const year = date.getFullYear()
            let month = ''
            let day = ''
            if ((date.getMonth() + 1) <= 9) {
                month = '0' + (date.getMonth() + 1)
            } else {
                month = date.getMonth() + 1
            }
            if (date.getDate() <= 9) {
                day = '0' + date.getDate()
            } else {
                day = date.getDate()
            }
            return year + '-' + month + '-' + day
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
    // height: 283px;  // 180  150  94
    position: relative;
    border: 1px solid #000000;
    border-top: 0px;
    //   padding: 2px;
    display: inline-block;
    // justify-content: space-around;
    // flex-direction: column;
    //   margin: 10px 5px;
    //   border-radius: 4px;
    background-color: #fff;
}

.ewm {
    margin-left: 10px;
}

/*
.tagBox {
  width: 177.5px;   // 300  240
  height: 106.5px;  // 180  150
  position: relative;
  border: 1px solid #000000;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  margin: 20px auto;
  border-radius: 15px;
  background-color: #fff;
}
*/
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
    //   line-height: auto;
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
.triangleRed {
    width: 0;
    height: 0;
    position: relative;
    border-right: 125px solid transparent;
    border-left: 125px solid transparent;
    border-bottom: 125px solid transparent;
    text-align: center;
    //   float: left;
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

.triangle>.label,
.triangleYellow>.label,
.triangleRed>.label {
    width: 100px;
    position: relative;
    top: -45px;
    left: -50px;
    font-size: 24px;
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
