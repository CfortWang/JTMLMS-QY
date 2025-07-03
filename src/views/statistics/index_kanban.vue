<template>
    <!-- <dv-full-screen-container> -->
    <div ref="scrollDiv" class="screen">
        <!-- :style="{height:height}" -->
        <div class="statistics">
            <div class="editDate" style="background-color: rgba(0,0,0,0);display: block;width: 100%;height: 10%;">
                <!-- 标题装饰组件 -->
                <!-- <header-decoration />
                <div class="stitle">实验室管理看板</div>
                <div class="block" style="display:none">
                    <span class="demonstration">开始:</span>
                    <el-date-picker
                        v-model="BeginDate"
                        type="year"
                        size="mini"
                        value-format="yyyy"
                        format="yyyy年"
                        style="width: 96px;"
                        :clearable="false"
                        placeholder="选择日期"
                        @change="checkYear(BeginDate,'begin')"
                    />
                </div>

                <div class="block">
                    <span class="demonstration">查询年度:</span>
                    <el-date-picker
                        v-model="endDate"
                        type="year"
                        size="mini"
                        value-format="yyyy"
                        format="yyyy年"
                        :clearable="false"
                        style="width: 96px;"
                        placeholder="选择日期"
                        @change="checkYear(endDate,'end')"
                    >
                        <el-date-picker
                            v-model="endDate"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年"
                            @change="checkYear(endDate,'end')"
                        />
                    </el-date-picker>
                </div> -->
                <div
                    style="width: 100%;
                    height:45%;
                    line-height: 45%;
                    text-align:center;
                    float: left;
                    margin: 2% 0 1% 1%;
                    font-size: 100%;
                    color: #fff !important;
                    align-items: center;
                    display:flex"
                >
                    <div style="color:#000;">
                        月份：
                    </div>
                    <el-date-picker
                        v-model="endDate"
                        type="monthrange"
                        align="right"
                        unlink-panels
                        style="background-color: rgba(0,0,0,0);"
                        format="yyyy 年 MM 月"
                        value-format="yyyy-MM"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="checkYear(endDate,'end')"
                    />

                </div>
            </div>
            <div v-if="relOf">
                <s4renYuanPeiXun
                    v-if="showAll || showComponents[1]"
                    height="200%"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS4renYuanPeiXun()"
                />
                <s4renYuanPeiXunCol
                    v-if="zaigangrenyuanfb.length && (showAll || showComponents[2])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS4renYuanPeiXunFB()"
                />
                <div
                    v-if="!zaigangrenyuanfb.length && (showAll || showComponents[2])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s5renYuanJianDu
                    v-if="showAll || showComponents[3]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS5renYuanJianDu()"
                />
                <s5renYuanJianDuCol
                    v-if="gangqianpeixunfb.length && (showAll || showComponents[4])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS5renYuanJianDuFB()"
                />
                <div
                    v-if="!gangqianpeixunfb.length && (showAll || showComponents[4])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s7sheBeiJiaoZhun
                    v-if="showAll || showComponents[5]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getJiaoYanObjNum()"
                />
                <s7sheBeiJiaoZhunCol
                    v-if="jiaoyanMGObj.length && (showAll || showComponents[6])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getJiaoYanObjNumFB()"
                />
                <div
                    v-if="!jiaoyanMGObj.length && (showAll || showComponents[6])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s8sheBeiHeCha
                    v-if="showAll || showComponents[7]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="gethechaObjNum()"
                />
                <s8sheBeiHeChaCol
                    v-if="hechaMGObj.length && (showAll || showComponents[8])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="gethechaObjNumFB()"
                />
                <div
                    v-if="!hechaMGObj.length && (showAll || showComponents[8])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s9neiBuZhiLiang
                    v-if="showAll || showComponents[9]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS9neiBuZhiLiang()"
                />
                <s9neiBuZhiLiangCol
                    v-if="neibuObjfb.length && (showAll || showComponents[10])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS9neiBuZhiLiangFB()"
                />
                <div
                    v-if="!neibuObjfb.length && (showAll || showComponents[10])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s10waiBuNengLi
                    v-if="showAll || showComponents[11]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getnengtliObjNum()"
                />
                <s10waiBuNengLiCol
                    v-if="waibuObjfb.length && (showAll || showComponents[12])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getnengtliObjNumFB()"
                />
                <div
                    v-if="!waibuObjfb.length && (showAll || showComponents[12])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s15tousu
                    v-if="showAll || showComponents[13]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS3tousu()"
                />
                <s15tousuCol
                    v-if="yingjifbObj.length && (showAll || showComponents[14])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS3tousuFB()"
                />
                <div
                    v-if="!yingjifbObj.length && (showAll || showComponents[14])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s12fengXian
                    v-if="showAll || showComponents[15]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS12fengXian()"
                />
                <s12fengXianCol
                    v-if="fengxianfbObj.length && (showAll || showComponents[16])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS12fengXianFB()"
                />
                <div
                    v-if="!fengxianfbObj.length && (showAll || showComponents[16])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>

                <s2manYiDu
                    v-if="showAll || showComponents[17]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS2manYiDu()"
                />
                <s2manYiDuCol
                    v-if="neishenfbObj.length && (showAll || showComponents[18])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS2manYiDuFB()"
                />
                <div
                    v-if="!neishenfbObj.length && (showAll || showComponents[18])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>
                <s14bufuhexiang
                    v-if="bufuheObj.length && (showAll || showComponents[19])"
                    height="500%"
                    width="100%"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS14bufuhexiang()"
                />
                <div
                    v-if="!bufuheObj.length && (showAll || showComponents[19])"
                    class="nullDate1"
                    style="height:50%;width:100%;"
                >暂无数据</div>

                <s1zhiLiangMuBiao
                    v-if="showAll || showComponents[21]"
                    height="200%"
                    :width="displayType === 'row' ? '25%' : '100%'"
                    :colorw="colorw"
                    style="box-shadow:none;width:100%;"
                    :data="getS1renwu()"
                />
                <s1zhiLiangMuBiaoCol
                    v-if="guanshenfbObj.length && (showAll || showComponents[22])"
                    height="500%"
                    :width="displayType === 'row' ? '75%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getS1renwuFB()"
                />
                <div
                    v-if="!guanshenfbObj.length && (showAll || showComponents[22])"
                    class="nullDate1"
                    style="height:50%;width:75%;"
                >暂无数据</div>
                <s16bzJunZhu
                    v-if="gaijinxiangObj.length && (showAll || showComponents[23])"
                    height="500%"
                    width="100%"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getbzJunZhujNum()"
                />
                <div
                    v-if="!gaijinxiangObj.length && (showAll || showComponents[23])"
                    class="nullDate1"
                    style="height:50%;width:100%;"
                >暂无数据</div>
                <s11biaoZhunWu
                    v-if="buhegelvObj.length && (showAll || showComponents[24])"
                    height="500%"
                    :width="displayType === 'row' ? '100%' : '100%'"
                    :colorw="colorw"
                    :direction="direction"
                    style="box-shadow:none;width:100%;"
                    :data="getyangPinCaiJiObjNum()"
                />
                <div
                    v-if="!buhegelvObj.length && ( showAll || showComponents[24])"
                    class="nullDate"
                >暂无数据</div>
                <div class="clear" />
            </div>
        </div>
    </div>
</template>

<script>
// 全屏展示
import screenfull from 'screenfull'
// 大屏标题组件
import headerDecoration from './headerDecoration'

import s1zhiLiangMuBiao from './item/s1zhiLiangMuBiao.vue'
import s1zhiLiangMuBiaoCol from './item/s1zhiLiangMuBiaoCol.vue'
import s1zhiLiang1 from './item/s1zhiLiang1.vue'
import s1zhiLiang2 from './item/s1zhiLiang2.vue'
import s1zhiLiang3 from './item/s1zhiLiang3.vue'

import s1jianCe from './item/s1jianCe.vue'
import s2manYiDu from './item/s2manYiDu.vue'
import s2manYiDuCol from './item/s2manYiDuPro.vue'
import s3tousu from './item/s3tousu.vue'
import s4renYuanPeiXun from './item/s4renYuanPeiXun.vue'
import s4renYuanPeiXunCol from './item/s4renYuanPeiXunCol.vue'
import s5renYuanJianDu from './item/s5renYuanJianDu.vue'
import s5renYuanJianDuCol from './item/s5renYuanJianDuCol.vue'
import s6sheBeiWeiHu from './item/s6sheBeiWeiHu.vue'
import s7sheBeiJiaoZhun from './item/s7sheBeiJiaoZhun.vue'
import s7sheBeiJiaoZhunCol from './item/s7sheBeiJiaoZhunCol.vue'
import s8sheBeiHeCha from './item/s8sheBeiHeCha.vue'
import s8sheBeiHeChaCol from './item/s8sheBeiHeChaCol.vue'
import s9neiBuZhiLiang from './item/s9neiBuZhiLiang.vue'
import s9neiBuZhiLiangCol from './item/s9neiBuZhiLiangCol.vue'
import s10waiBuNengLi from './item/s10waiBuNengLi.vue'
import s10waiBuNengLiCol from './item/s10waiBuNengLiCol.vue'
import s11biaoZhunWu from './item/s11biaoZhunWuCol2.vue'
import s11biaoZhunWucol from './item/s11biaoZhunWuCol.vue'

import s12fengXian from './item/s12fengXian.vue'
import s12fengXianCol from './item/s12fengXianCol.vue'
import s13shengWu from './item/s13shengWu.vue'
import s14bufuhexiang from './item/s14bufuhexiangCol.vue'
import s15tousu from './item/s15tousu.vue'
import s15tousuCol from './item/s15tousuCol.vue'
import s16bzJunZhu from './item/s16bzJunZhuCol2.vue'
import s17bzXiBao from './item/s17bzXiBao.vue'

import none from './item/none.vue'
import * as echarts from 'echarts'
import { DBData, getConfig, getJiaoYanObj, gethechaObj, getgangqianpeixunFBObj, getguanshenObjFB, getzhiliangmubiaotitleObj, getneishenObjFB, getfengxianObjFB, getyingjiObjFB, getwaibuObjFB, getneibuObjFB, getJiaoYanObjFB, gethechaObjFB, getnengliObj, getkangningyangpinObj, getzaigangrenyuanFBObj, getgaijinxiangObj, getbufuheObj, getguanshenObj, getneishenObj, getfengxianObj, getyingjiObj, getneibuObj, getwaibuObj, gethechaMGObj, getJiaoYanMGObj, getgangqianpeixunObj, getzaigangrenyuanObj, getfenzuZLZBObj, getzongZLMBObj, getzhiliangzhibiaotitleObj, getyangPinCaiJiObj, getbiaozhunTObj, getbzJunZhuObj, getbzJunZhuTObj, getbzXiBaoObj, getbzXiBaoTObj } from './js/selectDB.js'
import sendDatas from './sendDatas.js'
import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    components: {
        headerDecoration,
        none,
        s1zhiLiang1,
        s1zhiLiang2,
        s1zhiLiang3,
        s1zhiLiangMuBiao,
        s1zhiLiangMuBiaoCol,
        s1jianCe,
        s2manYiDu,
        s2manYiDuCol,
        s3tousu,
        s4renYuanPeiXun,
        s4renYuanPeiXunCol,
        s5renYuanJianDu,
        s5renYuanJianDuCol,
        s6sheBeiWeiHu,
        s7sheBeiJiaoZhun,
        s7sheBeiJiaoZhunCol,
        s8sheBeiHeCha,
        s8sheBeiHeChaCol,
        s9neiBuZhiLiang,
        s9neiBuZhiLiangCol,
        s10waiBuNengLi,
        s10waiBuNengLiCol,
        s11biaoZhunWu,
        s12fengXian,
        s12fengXianCol,
        s13shengWu,
        s14bufuhexiang,
        s15tousu,
        s15tousuCol,
        s16bzJunZhu,
        s17bzXiBao,
        s11biaoZhunWucol
    },
    mixins: [sendDatas],
    props: {
        shows: { // 传入的内容显示序号
            type: Array,
            default: () => []
        },
        displayType: { // 显示类型，默认为横向   ,作为表单统计图的外部引用为 line
            type: String,
            default: 'row'
        }
    },
    data () {
        return {
            direction: 'x',
            height: (window.screen.height - 200) + 'px',
            BeginDate: '',
            endDate: '',
            jiaoyanObj: [],
            jiaoyanMGObj: [],
            hechaObj: [],
            hechaMGObj: [],
            waibuObj: [],
            waibuObjfb: [],
            neibuObj: [],
            neibuObjfb: [],
            yingjiObj: [],
            yingjifbObj: [],
            fengxianObj: [],
            fengxianfbObj: [],
            neishenObj: [],
            neishenfbObj: [],
            guanshenObj: [],
            guanshenfbObj: [],
            bufuheObj: [],
            gaijinxiangObj: [],
            nengliObj: [],
            buhegelvObj: [],
            zhiliangzhibiaotitle: [],
            biaozhunTObj: [],
            bzJunZhuObj: [],
            bzJunZhuTObj: [],
            bzXiBaoObj: [],
            bzXiBaoTObj: [],
            fenzuzlmb: [],
            zaigangrenyuan: [],
            zaigangrenyuanfb: [],
            gangqianpeixun: [],
            gangqianpeixunfb: [],
            relData: {},
            relOf: false,
            selectEnd: '',
            selectBeg: '',
            showAll: true,
            timer: '',
            timer1: '',
            showComponents: {}, // 显示全部统计子组件 , 若有新增，往后累计。 供动态表单进行查阅使用。
            dataScope: [],
            colorw: '#000',
            pageOT: 1,
            rollup: true,
            idsStr: '',
            quality: [],
            quality1: [],
            allEcharts: [],
            bumen: '',
            zhiliangmuTitle: [],
            zhiliangmuNeirong: [],
            zhiliangxianzhi: [],
            tableNum: [],
            pageAll: 0,
            fadeinout: true,
            allBuMen: [],
            bfBuMen: [],
            tableData: {
                header: ['<span style="font-size:16px;height:53px">质量指标</span>', '<span style="font-size:16px;height:53px">百分比/数量</span>'],
                rowNum: 10,
                columnWidth: [600, 400],
                align: ['left', 'right'],
                data: [
                    // ['行1列1', '行1列2', '行1列3'],
                ]
            },
            tableData1: {
                header: ['<span style="font-size:16px;height:53px">质量指标</span>', '<span style="font-size:16px;height:53px">计算公式</span>', '<span style="font-size:16px;height:53px">指标限值</span>'],
                rowNum: 5,
                columnWidth: [300, 900, 200],
                align: ['left', 'left', 'right'],
                data: [
                    // ['行1列1', '行1列2', '行1列3'],
                ]
            }
        }
    },
    watch: {
        zhiliangmuNeirong: {
            handler () {
                // this.drawLine()
                this.pageAll = this.zhiliangmuNeirong.length
            },
            deep: true
        }
    },
    created () {
        // this.currentTime()
        // this.getqualityData()
        // if (screenfull.isEnabled && !screenfull.isFullscreen) {
        //     this.allView()
        // }
    },
    provide () {
        return { rollcontinue: this.rollcontinue, rollstop: this.rollstop }
    },
    mounted () {
        /* 以shows是否有参数来判断， 是否需要仅显示部分子组件*/
        if (this.shows.length > 0) {
            this.showAll = false
            this.isShowComponents()
        }
        /* 开始及结束时间的默认设置*/
        if (!this.BeginDate && !this.endDate) {
            this.BeginDate = this.getDate(1) + ''
            this.endDate = this.getDate(0)
            // console.log(this.endDate)
            this.dataScope.push(this.BeginDate)
            this.dataScope.push(this.endDate)
        }
        this.getqualityData()
        // 获取统计的配置

        // if (this.buhegelvObj.length > 0) {
        //     this.timer1 = setInterval(() => {
        //         if (this.pageOT >= this.pageAll) {
        //             this.pageOT = 1
        //         } else {
        //             this.pageOT = this.pageOT + 1
        //         }
        //         // console.log(this.pageOT)
        //     }, 8000)
        // }
        // this.drawLine()
    },
    updated () {
        // this.drawLine();
        this.allEcharts.forEach((i) => {
            i.resize()
        })
    },
    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
        clearInterval(this.timer)
    },
    methods: {
        /* 判断是否统计子组件中传递过来的，是否需要隐藏。若需要则进行隐藏的遍历  */
        isShowComponents () {
        /* 将参数进行显示 */
            for (let i = 0; i < this.shows.length; i++) {
                this.showComponents[this.shows[i]] = true
            }
        },
        getqualityData () {
            const { deptList } = this.$store.getters || {}
            const filterLetter = ['综合', '质量', '科研', '教学', '医疗', '样品', '助理', '急诊']
            const AllDeptList = deptList.filter(d => d.depth === 4)
            const deptEntity = deptList.filter(d => d.depth === 4 && !filterLetter.some(i => d.positionName.includes(i)))

            this.idsStr = deptEntity.map(i => i.positionId).join(',')
            this.bumen = AllDeptList.map(i => i.positionId).join(',')
            this.allBuMen = AllDeptList.map(i => ({ 'NAME_': i.positionName, 'numA': 0, 'num': 0, 'wnum': 0, 'chu': 0 }))
            this.bfBuMen = deptEntity.map(i => ({ 'NAME_': i.positionName, 'numA': 0, 'num': 0, 'wnum': 0, 'chu': 0 }))
            console.log('aaaa', this.bfBuMen)

            this.getConfigData(this.endDate, this.bumen, this.idsStr)
        },
        getNextMonth (date) {
            const arr = date.split('-')
            const year = arr[0] // 获取当前日期的年份
            const month = arr[1] // 获取当前日期的月份
            let year2 = year
            let month2 = parseInt(month) + 1
            if (month2 == 13) {
                year2 = parseInt(year2) + 1
                month2 = 1
            }
            month2 = month2 > 9 ? month2 : '0' + month2
            const t2 = year2 + '-' + month2
            return t2
        },
        /* 查询统计配置中的完成率*/
        getConfigData (end, allDept, filterDept) {
            console.log(end, allDept, filterDept)
            const that = this
            end[2] = end[1]
            end[1] = this.getNextMonth(end[1])
            Promise.all([
                repostCurd('query', getConfig()),
                repostCurd('query', getyangPinCaiJiObj(end, filterDept)),
                repostCurd('query', getzhiliangzhibiaotitleObj(end, filterDept)),
                repostCurd('query', getzongZLMBObj(end, filterDept)),
                repostCurd('query', getfenzuZLZBObj(end, filterDept)),
                repostCurd('query', getzaigangrenyuanObj(end, allDept)),
                repostCurd('query', getgangqianpeixunObj(end, allDept)),
                repostCurd('query', getJiaoYanObj(end, allDept)),
                repostCurd('query', getJiaoYanObjFB(end, allDept)),
                repostCurd('query', gethechaObj(end, allDept)),
                repostCurd('query', gethechaObjFB(end, allDept)),
                repostCurd('query', getwaibuObj(end, allDept)),
                repostCurd('query', getneibuObj(end, allDept)),
                repostCurd('query', getyingjiObj(end, allDept)),
                repostCurd('query', getfengxianObj(end, allDept)),
                repostCurd('query', getneishenObj(end, allDept)),
                repostCurd('query', getguanshenObj(end, allDept)),
                repostCurd('query', getbufuheObj(end, allDept)),
                repostCurd('query', getgaijinxiangObj(end, allDept)),
                repostCurd('query', getzaigangrenyuanFBObj(end, allDept)),
                repostCurd('query', getgangqianpeixunFBObj(end, allDept)),
                repostCurd('query', getneibuObjFB(end, allDept)),
                repostCurd('query', getwaibuObjFB(end, allDept)),
                repostCurd('query', getyingjiObjFB(end, allDept)),
                repostCurd('query', getfengxianObjFB(end, allDept)),
                repostCurd('query', getneishenObjFB(end, allDept)),
                repostCurd('query', getguanshenObjFB(end, allDept)),
                repostCurd('query', getzhiliangmubiaotitleObj(end, filterDept))
            ]).then(([response, response1, response2, response3, response4, response5, response6, response7, response8, response9, response10, response11, response12, response13, response14, response15, response16, response17, response18, fb, fb1, fb2, fb3, fb4, fb5, fb6, fb7, fb8]) => {
                that.config = response.variables.data
                that.buhegelvObj = response1.variables.data
                that.zhiliangzhibiaotitle = response2.variables.data
                that.tableNum = response3.variables.data
                const arr = this.tableNum
                const aa = []
                for (let j = 0; j < arr.length; j++) {
                    const changeArr = ['<span style="font-size:14px;height:45px;line-height:45px;display:inline-block">' + arr[j].zhi_liang_zhi_bia + '</span>', '<span style="font-size:14px;height:45px;line-height:45px;display:inline-block">' + arr[j].location.toFixed(2) + '</span>']
                    // aa.push(changeArr)
                    const changeArr1 = ['<span style="font-size:14px;height:45px;display:inline-block;">' + arr[j].zhi_liang_zhi_bia + '</span>', '<span style="font-size:14px;height:45px;display:inline-block;">' + arr[j].ji_suan_gong_shi_ + '</span>', '<span style="font-size:14px;height:45px;display:inline-block;">' + arr[j].zhi_biao_xian_zhi + '</span>']
                    that.tableData.data.push(changeArr)
                    that.tableData1.data.push(changeArr1)
                }
                const qqaa = response4.variables.data
                that.fenzuzlmb = this.sortArr(qqaa, 'bzbm')
                // console.log(that.fenzuzlmb,'qqaaqqaaqqaa')
                that.zaigangrenyuan = response5.variables.data
                that.gangqianpeixun = response6.variables.data
                that.jiaoyanObj = response7.variables.data
                that.jiaoyanMGObj = response8.variables.data
                that.hechaObj = response9.variables.data
                that.hechaMGObj = response10.variables.data
                that.waibuObj = response11.variables.data
                that.neibuObj = response12.variables.data
                that.yingjiObj = response13.variables.data
                that.fengxianObj = response14.variables.data
                that.neishenObj = response15.variables.data
                that.guanshenObj = response16.variables.data
                that.bufuheObj = response17.variables.data
                that.gaijinxiangObj = response18.variables.data
                that.getzzzbNum()
                that.zaigangrenyuanfb = fb.variables.data
                that.gangqianpeixunfb = fb1.variables.data
                that.neibuObjfb = fb2.variables.data
                that.waibuObjfb = fb3.variables.data
                that.yingjifbObj = fb4.variables.data
                that.fengxianfbObj = fb5.variables.data
                that.neishenfbObj = fb6.variables.data
                that.guanshenfbObj = fb7.variables.data
                that.zhiliangmubiaotitle = fb8.variables.data
                that.relOf = true
            })
        },
        /* 查询全部*/
        selectAll () {
        /* 上次查询时间不等于当次查询时间，    开始时间不能等于结束时间， 则开始查询。*/
        // if (this.selectEnd != this.endDate) {
        // this.getConfigData(this.endDate,this.idsStr)
            this.getqualityData()

            this.relOf = true
            this.timer = setTimeout(() => {
                this.relOf = false
                clearTimeout(this.timer)
            }, 10)

        // }
        },
        checkYear (year, data) {
            this.selectAll()
        },
        /* 获取当前年份*/
        getDate (year) {
            year = year || 0
            const nowDate = new Date()
            const date = new Date(new Date().setDate(1) + 31 * 24 * 60 * 60 * 1000)
            let month = date.getMonth() + 1
            const m1 = nowDate.getMonth() + 1
            const month1 = m1 < 10 ? '0' + m1 : nowDate.getMonth() + 1
            month = month < 10 ? '0' + month : '' + month
            // console.log([nowDate.getFullYear() - year + "-" + month1,date.getFullYear() + "-" + month])
            // return [nowDate.getFullYear() - year + "-" + month1,date.getFullYear() + "-" + month];
            return [nowDate.getFullYear() - year + '-01', nowDate.getFullYear() - year + '-' + month1]
        },
        sortArr (arr, str) {
            if (!arr?.length) return [] // 空数组直接返回

            // 1. 按属性排序
            const sorted = [...arr].sort((a, b) => a[str].localeCompare(b[str]))

            // 2. 使用 Map 进行分组（更高效）
            const grouped = sorted.reduce((map, item) => {
                const key = item[str]
                map.has(key) ? map.get(key).push(item) : map.set(key, [item])
                return map
            }, new Map())

            // 3. 转换为目标格式 [{ id_: key, data: [...] }]
            return [...grouped].map(([id_, data]) => ({ id_, data }))
        },
        getzzzbNum () {
            // 1. 生成月份数组
            const [startDate, endDate] = [this.endDate[0], this.endDate[2]]
            const [startYear, startMonth] = startDate.split('-').map(Number)
            const [endYear, endMonth] = endDate.split('-').map(Number)

            const monthCount = endYear > startYear
                ? (endYear - startYear) * 12 + endMonth - startMonth + 1
                : endMonth - startMonth + 1

            const dateArray = Array.from({ length: monthCount }, (_, i) => {
                const month = startMonth + i
                const year = startYear + Math.floor((month - 1) / 12)
                const paddedMonth = String(month % 12 || 12).padStart(2, '0')
                return `${year}-${paddedMonth}`
            })

            // 2. 合并 quality 和 fenzuzlmb 数据
            const qualityMap = new Map(this.quality.map(item => [item.id_, item]))
            this.fenzuzlmb.forEach(item => {
                if (qualityMap.has(item.id_)) {
                    qualityMap.get(item.id_).data = item.data || ''
                }
            })

            // 3. 按日期重组数据
            const zongfz = [...qualityMap.values()].map(({ id_, name_, data = [] }) => {
                const zlzbfz = dateArray.map(name_ => ({ name_ }))

                data.forEach(({ bzsj, zhi_liang_zhi_bia, location }) => {
                    const target = zlzbfz.find(item => item.name_ === bzsj)
                    if (target) target[zhi_liang_zhi_bia] = location
                })

                return { id: id_, name: name_, data: zlzbfz }
            }).filter(item => item.data.some(entry => Object.keys(entry).length > 1))

            // 4. 提取标题和指标值
            const title = ['name_', ...this.zhiliangzhibiaotitle.map(item => item.zhi_liang_zhi_bia)]
            const zbval = this.zhiliangzhibiaotitle.map(item =>
                parseFloat(item.zhi_biao_xian_zhi.match(/(\d+(\.\d+)?)/)[0])
            )

            // 5. 更新组件数据
            Object.assign(this, {
                zhiliangmuTitle: title,
                zhiliangmuNeirong: zongfz,
                zhiliangxianzhi: zbval,
                pageAll: zongfz.length
            })

            clearInterval(this.timer1)
        },
        goBack () {
            this.$router.back(-1)
            this.fadeinout = true
            clearInterval(this.timer1)
        },
        rollcontinue () {
            this.fadeinout = false
            this.timer1 = setInterval(() => {
                if (this.pageOT >= Math.ceil(this.pageAll / 2) + 7) {
                    this.pageOT = 1
                } else {
                    this.pageOT = this.pageOT + 1
                }
            }, 4000)
            this.rollup = true
        },
        rollstop () {
            this.fadeinout = true
            clearInterval(this.timer1)
            // console.log('dfhjsdifjsojfjiofjoijdiffffjidffffff')
            this.rollup = false
        }
    }
}
</script>

<style lang="scss" scoped>
  .statistics {
    height: 100%;
    color: #fff;
    .editDate{
      display: contents;
      overflow: hidden;
      background-color:rgb(249, 255, 255);
      position: relative;

    }
    .block{
      float: left;
      font-size: 14px;
     }
  }
  #dv-full-screen-container {
    // background-image: url('./img/stars.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
    // background-color: #f9ffff;
    display: flex;
    flex-direction:column;
    align-items: stretch;

  //  .headerContent{
  //   flex: 1;

  //  }
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .goBackButton{
    width: 2%;
    position: absolute;
    right: 0;
  }
  .shiyankanbanfanhui{
    border: none;
    .border-box-content{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .stitle{
    text-align: center;
    font-size: 150%;
    // font-family: PingFangSC-Semibold, sans-serif;
    font-weight: 600;
    margin: 0;
  }
  .ttitle{
    font-size: 120%;
    font-weight: 600;
    height: 2%;
    margin: 1% 0;
  }
  .screen{
    height: 100%;

    margin: 0 0.5%;
  }
  .clear{ clear: both; }
  .congxiebox7{
    background-color: rgba(6, 30, 93, 0.5);
    box-shadow: rgb(128 128 128 / 30%) 0px 0px 40px inset;
    border: 1px solid rgba(128, 128, 128, 0.3);
    margin: 1% 0 0 0 ;
    font-size: 12px;
  }
  .gongshiAll{
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 20%;
    .touwidth{
      width: 30%;
      text-align:right;
    }
    .gongshiXian{
      border-bottom: #fff solid 2px;
      padding-bottom: 6%;
      text-align:center;
      font-size: 12px;
    }
  }
  .mubiaozhi{
    text-align: center;
    margin-top: 3%;
  }
  .nullDate{
    height: 100%;
    text-align: center;
    line-height: 100%;
    font-size: 6vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .componentsData{
    height: 92%;
  }
  .nullDate1{
    height: 50%;
    width: 25%;
    display: inline-block;
    text-align: center;
    line-height: 50%;
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<style lang="scss">
.el-year-table .today .cell {
  color: #606266 !important;
  font-weight: 100 !important;
}

</style>
<style lang="scss" scoped>

::v-deep .el-input__inner {
  background-color: rgba(0,0,0,0);
  color: #fff;
}
::v-deep .el-dialog__body{
  height:80%;
  width:80%;
}
.fade-in {
  animation: fadeIn 1s linear forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-out {
  animation: fadeOut 1s linear forwards;
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
