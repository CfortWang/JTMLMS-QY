<template>
    <div class="bg">
        <el-dialog
            width="11cm"
            height="10cm"
            :modal-append-to-body="true"
            :append-to-body="true"
            title="设备故障标签"
            :visible.sync="scanVisible"
        >
            <!-- 表单是否显示 -->
            <div style="height:500px">
                <div id="box" ref="qrcode">
                    <vue-easy-print
                        ref="easyPrint"
                        table-show
                        :one-page-row="onePageRow"
                    >
                        <div v-for="(item1, index1) in list" :key="index1">
                            <div
                                v-for="(item2, index2) in parseInt(item1.num)"
                                :key="index2"
                            ><!-- style="page-break-after:always" -->
                                <div class="All">
                                    <div class="tagBox">
                                        <div class="lh">
                                            <div class="qianZhi zuoJuZhong">设备名称：</div>
                                            <div class="zuoJuZhong">{{ item1.name }}</div>
                                        </div>
                                        <div class="la">
                                            <div class="lh">
                                                <div>设备编号：</div>
                                                <div>{{ item1.serial }}</div>
                                            </div>
                                        </div>
                                        <div class="lh">
                                            <div class="qianZhi zuoJuZhong">存放地点：</div>
                                            <div class="zuoJuZhong">{{ item1.local }}</div>
                                        </div>
                                        <div class="lh">
                                            <div>启用日期：</div>
                                            <div>{{ item1.time }}</div>
                                        </div>

                                        <div class="lh">
                                            <div>资产原值：</div>
                                            <div>{{ item1.money }}</div>
                                        </div>
                                        <div class="lh">
                                            <div>使用科室：</div>
                                            <div>细胞质量检测实验室</div>
                                            <!-- <div>{{ item1.condition }}</div> -->
                                        </div>

                                        <div class="lh">
                                            <div class="qianZhi zuoJuZhong">固定资产编号：</div>
                                            <div class="zuoJuZhong">{{ item1.assets }}</div>
                                        </div>
                                        <div class="lh">
                                            <div>设备状态：</div>
                                            <div>{{ item1.status }}</div>
                                        </div>

                                        <div class="ewm">
                                            <vue-barcode :value="item1.serial" :width="1.5" :height="15" :font-size="15" :margin="0" :display-value="false" />
                                        </div>

                                        <!-- <div
                    style="page-break-after: always; display: block !important;height: 40px"
                  ></div> -->

                                    </div>
                                </div>
                            </div>
                        </div>
                    </vue-easy-print>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
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
        }
    },
    data () {
        return {
            value: '',
            id: '',
            list: [{
                name: 1,
                serial: 1,
                assets: 1,
                num: 1,
                local: 1,
                condition: 1,
                money: 1,
                time: 1,
                yinZi: 1,
                status: 1
            }],
            visible: true
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
        getInit () {
            var idStr = ''
            this.obj.forEach(item => {
                idStr += item.split(' ')[0] + ','
            })
            idStr = idStr.substring(0, idStr.length - 1)
            this.getLook(idStr)
        },
        getLook (id) {
            // const sql = `select * from t_sbdj where she_bei_shi_bie_h = any(SELECT she_bei_bian_h_id FROM t_sbwxsq where FIND_IN_SET(id_,'${id}'))`
            // console.log(sql)
            this.$common.request('query', {
                key: 'deviceFailureTag',
                params: [id]
            }).then(res => {
                const data = res.variables.data
                // console.log(data)
                const list = []
                data.forEach(item => {
                    const num = 1
                    const o = {
                        name: item.she_bei_ming_cheng_,
                        serial: item.she_bei_shi_bie_h,
                        assets: item.zi_chan_bian_hao_,
                        num: num,
                        local: item.cun_fang_di_dian_,
                        condition: item.shi_yong_ke_shi_,
                        money: item.zi_chan_yuan_zhi_,
                        time: item.qi_yong_ri_qi_ != null ? this.getTime(item.qi_yong_ri_qi_) : '',
                        status: item.she_bei_zhuang_ta
                    }
                    list.push(o)
                })

                this.list = list
            })
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
.bg {
  // height: auto;
}

// .tagBox {
//   width: 283px;   // 300  240
//   height: 283px;  // 180  150  94
//   position: relative;
//   border: 2px solid #0a0a0a;
//   padding: 5px;
//   display: inline-block;
//   // justify-content: space-around;
//   // flex-direction: column;
//   margin: 10px 5px;
//   border-radius: 4px;
//   background-color: #fff;
// }
.tagBox{
  width: 231px; //300
//   height: 240px;
  font-size: 14px;
  padding: 2px;
  margin: 10px auto 10px;
  position: relative;
  border: 1px solid #000;
  border-radius: 4px;
}
.ewm{

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

.la {
  display: flex;
  align-items: center;
}
.qianZhi{
    white-space: nowrap
}

.zuoJuZhong{
    text-align: left;
}

.lh {
  // line-height: auto;
  font-size: 12px;  //16
  color: #0a0a0a;
  display: flex;
  align-items: center;
  padding: 1px;
}
.All{
  text-align: center
}
</style>
