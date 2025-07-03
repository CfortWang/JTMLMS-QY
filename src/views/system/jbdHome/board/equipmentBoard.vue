<template>
    <div class="content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div class="header">
                <dv-decoration-8 class="left" />
                <dv-decoration-5 class="center" />
                <dv-decoration-8 class="right" :reverse="true" />
                <div class="title">{{ titleName }}</div>
                <div v-show="false" class="time">
                    <dv-border-box-8>
                        <span>年度:</span>
                        <el-date-picker v-model="month" type="year" value-format="yyyy" format="yyyy" placeholder="日期选择" style="width: 100px;" :readonly="false" :editable="true" :clearable="false" @change="updateAll" />
                    </dv-border-box-8>
                </div>
                <div class="back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
            </div>
            <dv-border-box-1 style="height:90%;overflow: hidden;">
                <!-- 顶部数据 -->
                <div class="topCard">
                    <!-- <top-bar v-if="topBarData.length" :info="topBarData" /> -->
                    <div style="width:100%;height: 100%;box-sizing: border-box;overflow: hidden;">
                        <div class="middleCardLeft" style="width:24%;height:100%">
                            <middleCard v-if="allSheBeiData.data.length" :info="allSheBeiData" />
                        </div>
                        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
                        <div class="middleCardLeft" style="width:38%;height:100%">
                            <moreBar v-if="moreBarData.data.source.length > 0 " :info="moreBarData" />
                        </div>
                        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
                        <div class="middleCardLeft" style="width:34%;height:100%">
                            <zhuzhuangtu v-if="zichangBarData.data.length" :info="zichangBarData" />
                        </div>
                    </div>
                </div>
                <dv-decoration-10 style="height:2%;display:flex;" />
                <div class="middleCard">
                    <div style="width:100%;height: 100%;box-sizing: border-box;overflow: hidden;">
                        <div class="middleCardLeft" style="width:24%">
                            <middleCard v-if="allWeihuSheBeiData.data.length" :info="allWeihuSheBeiData" />
                        </div>
                        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
                        <div class="middleCardLeft" style="width:38%">
                            <moreBar v-if="weihuBarData.data.source.length > 0 " :info="weihuBarData" />
                        </div>
                        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
                        <div class="middleCardRight1" style="width:34%">
                            <CarouselTabl v-if="BaofeiBarData.data.length" :info="BaofeiBarData" title="检验科设备停用/报废列表" />
                        </div>
                        <!-- <div class="middleCardRight" style="width:35%">
              <CarouselTabl v-if="config.data.length" :info="config" title="设备报废列表" />
            </div> -->
                    </div>
                </div>
                <dv-decoration-10 style="height:2%;display:flex;" />
                <div class="bottomCard">
                    <div style="width:33%;display:flex;">
                        <div class="bottomCardright">
                            <middleCard v-if="enTypeData.data.length" :info="enTypeData" />
                        </div>
                    </div>
                    <dv-decoration-2 :reverse="true" style="width:2%;height:100%;overflow: hidden;box-sizing: border-box;" />
                    <div style="width:33%">
                        <middleCard v-if="allJiaozhunSheBeiData.data.length" :info="allJiaozhunSheBeiData" />
                    </div>
                    <dv-decoration-2 :reverse="true" style="width:2%;height:100%;overflow: hidden;box-sizing: border-box;" />
                    <div style="width:58%;height: 100%;overflow: hidden;box-sizing: border-box;display:flex;">
                        <div class="bottomCardLeft0">
                            <moreBar v-if="jiaozhunBarData.data.source.length > 0 " :info="jiaozhunBarData" />
                        </div>
                    </div>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    name: 'check-board',
    components: {
        topBar: () => import('./component/equipmentBoardTopcard'),
        middleCard: () => import('./component/getPieView'),
        zhuzhuangtu: () => import('./component/zhuzhuangtu'),
        CarouselTabl: () => import('./component/CarouselTabl'),
        // 最新
        moreBar: () => import('./component/moreBar')
    },
    data () {
        const d = new Date()
        const { first, second } = this.$store.getters.level || {}
        const { deptList } = this.$store.getters || {}
        return {
            level: second || first,
            deptList,
            titleName: '设备管理看板',
            year: d.toJSON().slice(0, 4),
            month: d.toJSON().slice(0, 7),
            today: d.toJSON().slice(0, 10),
            topBarData: [],
            timer: null,
            MiddleLeftPieViewList: {},
            eBgRateData: {},
            sheBeiHeChaData: {},
            jianDingjiaoZhunSheBeiData: {},
            weiHuSheBeiData: {},
            shiyonglvConfig: { header: ['编号', '名称', '存放位置', '状态', '保管人'], data: [], columnWidth: ['110', '230', '180', '110', '110'], rowNum: 7 },
            bottomData: {},
            zhuantaiEData: {},
            sheBeiData: { xData: [], data: [], config: { idSelector: '' }},
            sheBeiDataShow: false,
            sheBeiweiHuData: {},
            BaofeiBarData: {
                header: ['部门', '设备名称', '设备编号', '状态'], data: [],
                columnWidth: ['120', '250', '180', '110'],
                rowNum: 5
            },
            zichan: 0,
            enTypeData: { data: [], config: {}},
            // 新
            moreBarData: {
                data: { dimensions: [], source: [] },
                config: { idSelector: 'eqFinish', title: '各部门设备完好情况', colors: ['#3870e0', '#12bc79', '#C1FFC1', '#ff0066', '#FFFF00'] }
            },
            zichangBarData: {
                data: [],
                xData: [],
                config: { idSelector: 'eqZichan', title: '各部门设备资产金额情况(万元)' }
            },
            weihuBarData: {
                data: { dimensions: [], source: [] },
                config: { idSelector: 'eqWeihu', title: '各部门设备维护完成情况', colors: ['#3870e0', '#12bc79'] }
            },
            jiaozhunBarData: {
                data: { dimensions: [], source: [] },
                config: { idSelector: 'eqJiaozhun', title: '各部门设备检定/校准完成情况', colors: ['#3870e0', '#12bc79'] }
            },
            // allSheBeiData: {
            //     data: [{ name: '设备总数', value: 0 }, { name: '良好数', value: 0 }, { name: '停用数', value: 0 }],
            //     config: { title: '检验科设备完好情况', idSelector: 'allShebei' },
            //     color: ['#339933', '#3870e0', '#FF0033']
            // },
            allSheBeiData: {
                data: [{ name: '良好数', value: 0 }, { name: '限用数', value: 0 }, { name: '停用数', value: 0 }, { name: '报废数', value: 0 }],
                config: { title: '检验科设备完好情况', idSelector: 'allShebei' },
                color: ['#12bc79', '#C1FFC1', '#FF0033', '#FFFF00']
            },
            allWeihuSheBeiData: {
                data: [{ name: '待处理', value: 0 }, { name: '已完成', value: 0 }],
                config: { title: '检验科设备维护完成情况', idSelector: 'allWeihuShebei' },
                color: ['#3870e0', '#339933']
            },
            allJiaozhunSheBeiData: {
                data: [{ name: '计划数', value: 0 }, { name: '完成数', value: 0 }],
                config: { title: '检验科设备检定/校准完成情况', idSelector: 'allJiaozhunShebei' },
                color: ['#3870e0', '#339933']
            }
        }
    },
    watch: {
        month (newValue, oldValue) {
            this.updateAll()
        }
    },
    created () {
        this.updateAll()
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            this.allView()
        }
    },
    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
    },
    methods: {
        allView () { // 默认显示全屏
            screenfull.request()
        },
        goBack () {
            this.$router.back(-1)
        },
        updateAll () {
            // this.getCarouselShiYonglvTable();
            // this.getTopBarData();
            this.getBaofeiBarData()
            // 新
            this.getEnTypeData()
            this.getMoreBarData()
            this.getJiaozhunBarData()
            this.getWeihuBarData()
            this.getZichanBarData()
        },
        async getTopBarData () {
            const didian = this.level
            this.MiddleLeftPieViewList = { data: [], config: { idSelector: 'main' }, rowNum: 7, color: [] }
            this.sheBeiDataShow = false
            this.eBgRateData = { data: [], config: {}}
            this.sheBeiHeChaData = { data: [], config: {}}
            this.jianDingjiaoZhunSheBeiData = { data: [], config: {}}
            this.sheBeiData = { xData: [], data: [], config: { idSelector: '' }}
            this.weiHuSheBeiData = { data: [], config: {}}
            this.bottomData = { xData: [], data: [], config: { idSelector: '' }}
            this.zhuantaiEData = { xData: [], data: [], config: { idSelector: '' }}
            this.sheBeiweiHuData = { xData: [], data: [], config: { idSelector: '' }}
            const year = this.month.slice(0, 4)
            /* const sql =
      `select a.Equipments,a1.mony,b.addEquipments,c.testEquipments,c1.testNoEquipments,e.goodEquipments,f.scrapEquipments,g.limitedEquipments,h.weiHuNoEquipments,h1.weiHuEquipments  FROM
      (select COUNT(*) AS Equipments FROM t_sbdj where di_dian_ = '${didian}') AS a,
      (select zi_chan_yuan_zhi_ AS mony FROM t_sbdj where  di_dian_ = '${didian}') AS a1,
      (select COUNT(*) AS addEquipments  FROM t_yqsbysb WHERE bian_zhi_shi_jian LIKE concat('%', '${this.month}','%') AND shi_fou_guo_shen_ ='已完成' and  di_dian_ = '${didian}') AS b,
      (select COUNT(*) AS testNoEquipments FROM t_jyxtxzjgyzhqrjlb WHERE bian_zhi_shi_jian LIKE concat('%', '${year}','%') or create_time_ LIKE concat('%', '${year}','%') and  di_dian_ = '${didian}') AS c1,
      (select COUNT(*) AS testEquipments FROM t_jyxtxzjgyzhqrjlb WHERE bian_zhi_shi_jian LIKE concat('%', '${year}','%') and  shi_fou_guo_shen_ ='已完成' and  di_dian_ = '${didian}') AS c,
      (select COUNT(*) AS goodEquipments  FROM t_sbdj WHERE she_bei_zhuang_ta ='合格' and  di_dian_ = '${didian}') AS e,
      (select COUNT(*) AS scrapEquipments  FROM t_sbdj WHERE she_bei_zhuang_ta ='停用' OR she_bei_zhuang_ta ='暂停使用' and  di_dian_ = '${didian}') AS f,
      (select COUNT(*) AS limitedEquipments  FROM t_sbdj WHERE she_bei_zhuang_ta ='报废' and  di_dian_ = '${didian}') AS g,
      (select  COUNT(*) AS weiHuNoEquipments FROM t_mjsbwhbyjlby WHERE bian_zhi_shi_jian LIKE concat('%', '${this.month}','%') or create_time_ LIKE concat('%', '${this.month}','%') and  di_dian_ = '${didian}') AS h,
      (select COUNT(*) AS weiHuEquipments  FROM t_mjsbwhbyjlby WHERE bian_zhi_shi_jian LIKE concat('%', '${this.month}','%') AND shi_fou_guo_shen_ ='已完成' and  di_dian_ = '${didian}') AS h1` */
            await curdPost('query', {
                key: 'devMgtBoard1',
                params: [didian, this.month, year]
            }).then((res) => {
                const data = res.variables.data

                let zichan = this.getAllMonyInt(data)
                zichan = zichan + ''
                if (zichan.length > 4) {
                    zichan = zichan.substring(0, zichan.length - 4)
                }

                const eIntactnessRate = Number(((data[0].goodEquipments / data[0].Equipments).toFixed(2) * 100 + '').slice(0, 5))
                const eBadRate = Number(((100 - eIntactnessRate).toFixed(4) + '').slice(0, 4))
                let obj = {}
                obj.value = Number(((data[0].goodEquipments / data[0].Equipments).toFixed(4) * 100 + '').slice(0, 5))
                obj.name = '正常设备数'
                this.MiddleLeftPieViewList.data.push(obj)
                obj = {}
                obj.value = Number(((data[0].scrapEquipments / data[0].Equipments).toFixed(4) * 100 + '').slice(0, 5))
                obj.name = '停用/报废'
                this.MiddleLeftPieViewList.data.push(obj)
                this.MiddleLeftPieViewList.color = ['#339933', '#FFFF66', '#FF0033']
                this.MiddleLeftPieViewList.config.title = '设备各工作状态数量统计'
                this.MiddleLeftPieViewList.config.idSelector = 'main2'
                obj = {}
                const result = [
                    {
                        title: '',
                        children: [
                            {
                                label: '设备总数',
                                value: data[0].Equipments,
                                danwei: ''
                            },
                            {
                                label: '新增数',
                                value: data[0].addEquipments,
                                danwei: ''
                            },
                            {
                                label: '正常数',
                                value: data[0].goodEquipments,
                                danwei: ''
                            },
                            {
                                label: '报废/停用数',
                                value: data[0].scrapEquipments,
                                danwei: ''
                            }
                        ]
                    },
                    {
                        title: '',
                        children: [
                            {
                                label: '计划维护数',
                                value: data[0].weiHuNoEquipments,
                                danwei: ''
                            },
                            {
                                label: '已维护数',
                                value: data[0].weiHuEquipments,
                                danwei: ''
                            }
                        ]
                    },
                    {
                        title: '',
                        children: [
                            {
                                label: '计划检定/校准数',
                                value: data[0].testNoEquipments,
                                danwei: ''
                            },
                            {
                                label: '已检定/校准数',
                                value: data[0].testEquipments,
                                danwei: ''
                            }
                        ]
                    },
                    {
                        title: '',
                        children: [
                            {
                                label: '完好率',
                                value: eIntactnessRate,
                                danwei: '%'
                            },
                            {
                                label: '故障率',
                                value: eBadRate,
                                danwei: '%'
                            },
                            {
                                label: zichan.length > 4 ? '总值(万元)' : '总值(元)',
                                value: zichan,
                                danwei: ''
                            }
                        ]
                    }
                ]
                // 设备数量统计
                // this.sheBeiData.xData = ["设备总数","新增数","良好数","报废停用数",];
                this.sheBeiData.xData = ['设备总数', '良好数']
                this.sheBeiData.data.push(data[0].Equipments)
                // this.sheBeiData.data.push(data[0].addEquipments);
                this.sheBeiData.data.push(data[0].goodEquipments)
                // this.sheBeiData.data.push(data[0].limitedEquipments);
                // this.sheBeiData.data.push(data[0].scrapEquipments);
                this.sheBeiData.config.title = '设备完好情况'
                this.sheBeiData.config.idSelector = 'main8'
                this.sheBeiDataShow = true
                this.zhuantaiEData.xData = ['计划检定/校准数', '已完成检定/校准数']
                this.zhuantaiEData.data.push(data[0].testNoEquipments)
                this.zhuantaiEData.data.push(data[0].testEquipments)
                this.zhuantaiEData.config.title = '检定/校准设备完成图'
                this.zhuantaiEData.config.idSelector = 'main3'
                // 维护设备数柱状图
                this.sheBeiweiHuData.xData = ['计划维护数', '已完成数']
                this.sheBeiweiHuData.data.push(data[0].weiHuNoEquipments)
                this.sheBeiweiHuData.data.push(data[0].weiHuEquipments)
                this.sheBeiweiHuData.config.title = '设备维护柱状图'
                this.sheBeiweiHuData.config.idSelector = 'mainWeiHuZ'
                let objRate = {}
                objRate.name = '完好率'
                objRate.value = eIntactnessRate
                this.eBgRateData.data.push(objRate)
                objRate = {}
                objRate.value = eBadRate
                objRate.name = '故障率'
                this.eBgRateData.data.push(objRate)
                this.eBgRateData.color = ['#339933', '#FF0033']
                this.eBgRateData.config.title = '设备工作状态完成率'
                this.eBgRateData.config.idSelector = 'main1'
                // 设备数维护
                let objweihu = {}
                objweihu.name = '计划维护数'
                objweihu.value = data[0].weiHuNoEquipments
                this.weiHuSheBeiData.data.push(objweihu)
                objweihu = {}
                objweihu.value = data[0].weiHuEquipments
                objweihu.name = '已维护数'
                this.weiHuSheBeiData.data.push(objweihu)
                this.weiHuSheBeiData.color = ['#5470c6', '#38a838']
                this.weiHuSheBeiData.config.title = '设备维护完成情况'
                this.weiHuSheBeiData.config.idSelector = 'mainWeiHu'
                // 设备数检定校准
                let objJianding = {}
                objJianding.name = '计划检定/校准数'
                objJianding.value = data[0].testNoEquipments
                this.jianDingjiaoZhunSheBeiData.data.push(objJianding)
                objJianding = {}
                objJianding.value = data[0].testEquipments
                objJianding.name = '已完成数'
                this.jianDingjiaoZhunSheBeiData.data.push(objJianding)
                this.jianDingjiaoZhunSheBeiData.color = ['#5470c6', '#38a838']
                this.jianDingjiaoZhunSheBeiData.config.title = '设备检定/校准完成情况'
                this.jianDingjiaoZhunSheBeiData.config.idSelector = 'mainJianDing'
                objRate = {}
                this.topBarData = result
            }).catch((err) => {
                console.log(err)
            })
        },
        async getCarouselShiYonglvTable () { // 设备建档信息
            // const sql = `select a.she_bei_shi_bie_h,a.she_bei_ming_cheng_,a.cun_fang_di_dian_,a.she_bei_zhuang_ta,b.name_ FROM t_sbdj AS a JOIN ibps_party_employee AS b ON a.guan_li_ren_ = b.ID_ where a.di_dian_ = '${this.level}'`
            let data1 = []
            this.shiyonglvConfig.data = []
            await curdPost('query', {
                key: 'devMgtBoard2',
                params: [this.level]
            }).then((res) => {
                const result = res.variables.data
                result.forEach((item) => {
                    data1 = []
                    data1.push(item.she_bei_shi_bie_h)
                    data1.push(item.she_bei_ming_cheng_)
                    data1.push(item.cun_fang_di_dian_)
                    data1.push(item.she_bei_zhuang_ta)
                    data1.push(item.name_)
                    this.shiyonglvConfig.data.push(data1)
                })
            }).catch((err) => {
                console.log(err)
            })
            this.isup = true
        },
        timestampToTime (timestamp) {
            var date = new Date(timestamp * 1000)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
            var h = date.getHours() + ':'
            var m = date.getMinutes() + ':'
            var s = date.getSeconds()
            return Y + M + D
        },
        async getMoreBarData () {
            this.moreBarData.data.source = []
            this.moreBarData.data.dimensions = ['product', '设备总数', '良好数', '限用数', '停用数', '报废数']
            // const sql1 = `select DISTINCT(a.bian_zhi_bu_men_), name_,COUNT(*) AS total FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ where b.name_ not like '%检验科%' and b.name_ not like '%综合%' and  a.di_dian_ = '${this.level}' GROUP BY a.bian_zhi_bu_men_`
            // const sql2 = `select DISTINCT(a.bian_zhi_bu_men_), name_,COUNT(*) AS total FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE b.name_ not like '%检验科%' and b.name_ not like '%综合%' and  a.di_dian_ = '${this.level}' and a.she_bei_zhuang_ta ='合格' GROUP BY a.bian_zhi_bu_men_`
            // const sql3 = `select DISTINCT(a.bian_zhi_bu_men_), name_,COUNT(*) AS total FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE b.name_ not like '%检验科%' and b.name_ not like '%综合%' and  a.di_dian_ = '${this.level}' and a.she_bei_zhuang_ta ='限用' GROUP BY a.bian_zhi_bu_men_`
            // const sql4 = `select DISTINCT(a.bian_zhi_bu_men_), name_,COUNT(*) AS total FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE b.name_ not like '%检验科%' and b.name_ not like '%综合%' and  a.di_dian_ = '${this.level}' and a.she_bei_zhuang_ta ='停用' GROUP BY a.bian_zhi_bu_men_`
            // const sql5 = `select DISTINCT(a.bian_zhi_bu_men_), name_,COUNT(*) AS total FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE b.name_ not like '%检验科%' and b.name_ not like '%综合%' and  a.di_dian_ = '${this.level}' and a.she_bei_zhuang_ta ='报废' GROUP BY a.bian_zhi_bu_men_`
            let data1, data2, data3, data4, data5
            await Promise.all([
                curdPost('query', {
                    key: 'devMgtBoard3',
                    params: [this.level]
                }),
                curdPost('query', {
                    key: 'devMgtBoard4',
                    params: [this.level]
                }),
                curdPost('query', {
                    key: 'devMgtBoard5',
                    params: [this.level]
                }),
                curdPost('query', {
                    key: 'devMgtBoard6',
                    params: [this.level]
                }),
                curdPost('query', {
                    key: 'devMgtBoard7',
                    params: [this.level]
                })
            ]).then(([res1, res2, res3, res4, res5]) => {
                if (res1.state === 200) {
                    data1 = res1.variables.data
                }
                if (res2.state === 200) {
                    data2 = res2.variables.data
                }
                if (res3.state === 200) {
                    data3 = res3.variables.data
                }
                if (res4.state === 200) {
                    data4 = res4.variables.data
                }
                if (res5.state === 200) {
                    data5 = res5.variables.data
                }
            })
            const source = []
            data1.forEach((item, index) => {
                source.push({
                    product: item.name_,
                    '设备总数': item.total,
                    '良好数': 0,
                    '限用数': 0,
                    '停用数': 0,
                    '报废数': 0
                })
            })
            data2.forEach(item => {
                source.forEach((el, index) => {
                    if (item.name_ === el.product) {
                        source[index]['良好数'] = item.total
                    }
                })
            })

            data3.forEach(item => {
                source.forEach((el, index) => {
                    if (item.name_ === el.product) {
                        source[index]['限用数'] = item.total
                    }
                })
            })
            data4.forEach(item => {
                source.forEach((el, index) => {
                    if (item.name_ === el.product) {
                        source[index]['停用数'] = item.total
                    }
                })
            })
            data5.forEach(item => {
                source.forEach((el, index) => {
                    if (item.name_ === el.product) {
                        source[index]['报废数'] = item.total
                    }
                })
            })

            if (source.length === 0) {
                this.moreBarData.data.source = [999]
            } else {
                this.moreBarData.data.source = source
            }

            // let allTotal = 0; let goods = 0; let deactivates = 0
            let goods = 0; let restricts = 0; let deactivates = 0; let scraps = 0
            source.forEach(item => {
                // allTotal += item['设备总数']
                goods += item['良好数']
                restricts += item['限用数']
                deactivates += item['停用数']
                scraps += item['报废数']
            })
            // this.allSheBeiData.data[0].value = allTotal
            // this.allSheBeiData.data[1].value = goods
            // this.allSheBeiData.data[2].value = deactivates

            // this.allSheBeiData.data[0].value = allTotal
            this.allSheBeiData.data[0].value = goods
            this.allSheBeiData.data[1].value = restricts
            this.allSheBeiData.data[2].value = deactivates
            this.allSheBeiData.data[3].value = scraps
        },
        async getWeihuBarData () {
            this.weihuBarData.data.source = []
            // // 计划数，查询设备维护计划表完成数
            // const sql1 = `select DISTINCT(a.bian_zhi_bu_men_) ,name_,COUNT(*) AS total FROM t_mjsbwhbyjlby AS a JOIN ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.ji_hua_shi_jian_ LIKE concat('%', '${this.today}', '%') and b.name_ not like '%综合%' and b.name_ not like '%综合%' AND a.shi_fou_guo_shen_ != '已完成' AND a.di_dian_ = '${this.level}' GROUP BY a.bian_zhi_bu_men_`
            // //   维护记录数
            // const sql2 = `select DISTINCT(a.bian_zhi_bu_men_) ,name_,COUNT(*) AS total FROM t_mjsbwhbyjlby AS a JOIN ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.ji_hua_shi_jian_ LIKE concat('%', '${this.today}', '%') and b.name_ not like '%综合%' and b.name_ not like '%综合%' AND a.shi_fou_guo_shen_ = '已完成' AND a.di_dian_ = '${this.level}' GROUP BY a.bian_zhi_bu_men_`
            this.weihuBarData.data.dimensions = ['product', '待处理', '已完成']
            let data1, data2
            await Promise.all([
                curdPost('query', {
                    key: 'devMgtBoard8',
                    params: [this.today, this.level]
                }),
                curdPost('query', {
                    key: 'devMgtBoard9',
                    params: [this.today, this.level]
                })
            ]).then(([res1, res2]) => {
                if (res1.state === 200) {
                    data1 = res1.variables.data
                }
                if (res2.state === 200) {
                    data2 = res2.variables.data
                }
            })
            const source = []
            data1.forEach((item, index) => {
                source.push({
                    product: item.name_,
                    '待处理': item.total || 0,
                    '已完成': 0
                })
            })
            data2.forEach(item => {
                let lock = true
                if (source.length > 0) {
                    source.forEach((el, index) => {
                        if (item.name_ === el.product) {
                            source[index]['完成数'] = item.total
                            lock = false
                        } else if (lock && index === source.length - 1) {
                            source.push({
                                product: item.name_,
                                '待处理': 0,
                                '已完成': item.total || 0
                            })
                        }
                    })
                } else {
                    source.push({
                        product: item.name_,
                        '待处理': 0,
                        '已完成': item.total || 0
                    })
                }
            })
            let allPlan = 0; let finishs = 0
            source.forEach(item => {
                allPlan += item['待处理']
                finishs += item['已完成']
            })
            console.log(source, 'source2')
            this.allWeihuSheBeiData.data[0].value = allPlan
            this.allWeihuSheBeiData.data[1].value = finishs
            this.moreBarData.data.source.forEach(item => {
                let lock = true
                source.forEach((el, index) => {
                    if (item.product === el.product) {
                        lock = false
                    }
                    if (item.product !== el.product && index === source.length - 1 && lock) {
                        source.push({
                            product: item.product,
                            '待处理': 0,
                            '已完成': 0
                        })
                    }
                })
            })
            if (source.length === 0) {
                this.weihuBarData.data.source = [999]
            } else {
                this.weihuBarData.data.source = source
            }
        },
        async getZichanBarData () {
            // const sql1 = `select a.bian_zhi_bu_men_,name_,a.zi_chan_yuan_zhi_ FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE b.name_ not like '%检验科%'  and b.name_ not like '%综合%' and a.di_dian_ = '${this.level}' ORDER BY a.bian_zhi_bu_men_ ASC`
            const source = []
            let data1
            await Promise.all([
                curdPost('query', {
                    key: 'devMgtBoard10',
                    params: [this.level]
                })
            ]).then(([res1, res2]) => {
                if (res1.state === 200) {
                    data1 = res1.variables.data
                }
            })

            let partyMony = []
            let i = 0
            data1.forEach((item, index) => {
                let zichan = item.zi_chan_yuan_zhi_
                if (zichan === '' || zichan === null || zichan === undefined) {
                    zichan = 0
                } else {
                    if (zichan.includes('.')) {
                        zichan = zichan.split('.')[0]
                    }
                    zichan = Number(zichan.replace(/\D/g, ''))// 非数字去掉
                }
                if (partyMony.length === 0) {
                    partyMony = [{ party: item.name_, mony: zichan }]
                } else {
                    if (item.name_ === data1[index - 1].name_) {
                        partyMony[i].mony += zichan
                    } else {
                        partyMony.push({ party: item.name_, mony: zichan })
                        i++
                    }
                }
            })
            let allmony = 0
            for (const el of partyMony) {
                allmony += el.mony
                el.mony = this.formatNumber(el.mony)
                this.zichangBarData.data.push(el.mony)
                this.zichangBarData.xData.push(el.party)
            }

            this.zichangBarData.data.unshift(this.formatNumber(allmony))
            this.zichangBarData.xData.unshift('检验科')
        },
        formatNumber (num) {
            num = Number(num)
            if (num === 0) {
                return num + ''
            } else {
                if ((num / 10000).toFixed(2) === 0) {
                    // 小于100的保留2位
                    return (num / 100).toFixed(4)
                } else {
                    // parseFloat() 去掉后面不用的0，如50.00
                    // 大于100的保留2位
                    return parseFloat((num / 10000).toFixed(2))
                }
            }
        },
        async getJiaozhunBarData () {
            this.jiaozhunBarData.data.source = []
            const year = this.month.slice(0, 4)
            // const sql1 = `select DISTINCT(a.bian_zhi_bu_men_),name_,COUNT(*) AS total FROM t_mjsbjdxzjhzb AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.parent_id_ IN ( SELECT id_ FROM t_mjsbjdxzjh WHERE (bian_zhi_shi_jian LIKE concat('%', '${year}', '%') OR create_time_ LIKE concat('%', '${year}', '%')) AND (shi_fou_guo_shen_ = '已审批' or shi_fou_guo_shen_ = '已完成')) AND a.di_dian_ = '${this.level}'  and b.name_ not like '%综合%' GROUP BY a.bian_zhi_bu_men_`
            // const sql2 = `select DISTINCT(a.bian_zhi_bu_men_),name_,COUNT(*) AS total FROM t_mjsbjdxzjhzb AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.parent_id_ IN ( SELECT id_ FROM t_mjsbjdxzjh WHERE (bian_zhi_shi_jian LIKE concat('%', '${year}', '%') OR create_time_ LIKE concat('%', '${year}', '%')) AND shi_fou_guo_shen_ = '已完成') AND a.di_dian_ = '${this.level}' and b.name_ not like '%综合%' GROUP BY a.bian_zhi_bu_men_`
            this.jiaozhunBarData.data.dimensions = ['product', '计划数', '完成数']
            let data1, data2
            await Promise.all([
                curdPost('query', {
                    key: 'devMgtBoard11',
                    params: [year, this.level]
                }),
                curdPost('query', {
                    key: 'devMgtBoard12',
                    params: [year, this.level]
                })
            ]).then(([res1, res2]) => {
                if (res1.state === 200) {
                    data1 = res1.variables.data
                }
                if (res2.state === 200) {
                    data2 = res2.variables.data
                }
            })
            const source = []
            data1.forEach((item, index) => {
                source.push({
                    product: item.name_,
                    '计划数': item.total,
                    '完成数': 0
                })
            })
            data2.forEach(item => {
                let lock = true
                source.forEach((el, index) => {
                    if (item.name_ === el.product) {
                        source[index]['完成数'] = item.total
                        lock = false
                    }
                    if (lock && index === source.length - 1) {
                        source.push({
                            product: item.name_,
                            '计划数': 0,
                            '完成数': item.total
                        })
                    }
                })
            })
            let allPlan = 0; let finishs = 0
            source.forEach(item => {
                allPlan += item['计划数']
                finishs += item['完成数']
            })
            this.allJiaozhunSheBeiData.data[0].value = allPlan
            this.allJiaozhunSheBeiData.data[1].value = finishs
            this.moreBarData.data.source.forEach(item => {
                let lock = true
                source.forEach((el, index) => {
                    if (item.product === el.product) {
                        lock = false
                    }
                    if (item.product !== el.product && index === source.length - 1 && lock) {
                        source.push({
                            product: item.product,
                            '计划数': 0,
                            '完成数': 0
                        })
                    }
                })
            })
            if (source.length === 0) {
                this.jiaozhunBarData.data.source = [999]
            } else {
                this.jiaozhunBarData.data.source = source
            }
        },
        async getBaofeiBarData () {
            this.config = {
                header: ['设备名称', '编号', '状态'],
                columnWidth: ['220', '110', '70'],
                rowNum: 6,
                data: []
            }
            // const sql = `select a.she_bei_ming_cheng_, a.she_bei_shi_bie_h,a.she_bei_zhuang_ta,b.name_ FROM t_sbdj AS a  JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE she_bei_zhuang_ta ='停用' or she_bei_zhuang_ta ='报废' and b.name_ not like '%综合%' AND a.di_dian_ = '${this.level}' ORDER BY a.bian_zhi_bu_men_ DESC`
            let data1 = []
            await curdPost('query', {
                key: 'devMgtBoard13',
                params: [this.level]
            }).then((res) => {
                this.BaofeiBarData.data = []
                const result = res.variables.data
                if (result.length === 0) {
                    this.BaofeiBarData.data = [999]
                }
                result.forEach((item) => {
                    data1 = []
                    data1.push(item.name_)
                    data1.push(item.she_bei_ming_cheng_)
                    data1.push(item.she_bei_shi_bie_h)
                    data1.push(item.she_bei_zhuang_ta)
                    this.BaofeiBarData.data.push(data1)
                })
            })
                .catch((err) => {
                    console.log(err)
                })
        },
        getAllMonyInt (monyArr) {
            let mony = 0
            let filterMony

            monyArr.forEach((item) => {
                if (item.mony && item.mony.includes('元')) {
                    filterMony = item.mony.slice(0, item.mony.length - 1) * 1
                    mony += filterMony
                }
            })

            return mony
        },
        async getEnTypeData () {
            // const sql = `select DISTINCT(she_bei_lei_xing_),COUNT(*) AS total  FROM t_sbdj where di_dian_ = '${this.level}' GROUP BY she_bei_lei_xing_`
            let data = await curdPost('query', {
                key: 'devMgtBoard14',
                params: [this.level]
            })
            data = data.variables.data

            const dataTypes = [
                { she_bei_lei_xing_: '检验系统', total: '0' },
                { she_bei_lei_xing_: '通用设备', total: '0' },
                { she_bei_lei_xing_: '软件', total: '0' },
                { she_bei_lei_xing_: '信息系统', total: '0' }
            ]
            dataTypes.forEach(item => {
                data.forEach(el => {
                    if (item.she_bei_lei_xing_ === el.she_bei_lei_xing_) {
                        item.total = el.total
                    }
                })
            })

            let objJianding = {}
            this.enTypeData.data = []
            // dataTypes.forEach(item=>{
            for (const item of dataTypes) {
                objJianding = {}
                objJianding.name = item.she_bei_lei_xing_
                objJianding.value = item.total
                this.enTypeData.data.push(objJianding)
            }
            this.enTypeData.color = ['#339933', '#3366CC', '#FF9933', '#FFFF00']
            this.enTypeData.config.title = '检验科各型设备分布情况'
            this.enTypeData.config.idSelector = 'enTypeId'
        }
    }
}
</script>
<style lang="scss" scoped>
   ::v-deep.el-input--small .el-input__inner {
        background-color: rgb(7 16 43 / 50%);
        color: white;
        border: none;
      }
.content {
  width: 100%;
  height: 100%;
  background-color: #030409;
  position: absolute;
  color: #fff;
  z-index: 999;
  #dv-full-screen-container {
    background-image: url("~@/assets/images/screen/bg.png");
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .block-left-right-content {
    flex: 1;
    display: flex;
    margin-top: 0.8%;
  }
  .block-top-bottom-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 0.8%;
  }
  .block-top-content {
    height: 55%;
    display: flex;
    flex-grow: 0;
    box-sizing: border-box;
    padding-bottom: 0.8%;
  }
  .header {
    position: relative;
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    box-sizing: border-box;
    overflow: hidden;
    .left,
    .right {
      width: 25%;
      height: 60px;
    }
    .center {
      width: 40%;
      height: 60px;
      margin-top: 30px;
    }
    .title {
      position: absolute;
      font-size: 30px;
      font-weight: bold;
      left: 50%;
      top: 15px;
      transform: translateX(-50%);
    }
    .time,.back {
      width: 8%;
      cursor: pointer;
      height: 2.825rem;
      line-height: 2.825rem;
      text-align: center;
      margin-top: 2.5%;
      flex: 1;
      position: absolute;
      color: #ffffff;
    }
    .time {
      display: flex;
      justify-content: flex-end;
      width: 154px;
      right: 75%;

    }
    .back {
      left: 75%;
    }
  }

  .topCard {
    height: 30%;
    padding:14px 6px 0px 6px;
    // margin-top: 10px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .middleCard {
    height: 31%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .bottomCard {
    height: 31%;
    overflow: hidden;
    box-sizing: border-box;
    padding:0px 6px 0px 6px;
  }
  .topCard,
  .middleCard,
  .bottomCard {
    width: 98%;
    margin:0 auto ;
    div {
      display: inline-block;
    }
    .middleCardLeft {
      // width: 28%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .middleCardRight {
      // width: 25%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .middleCardRight1 {
      // width: 43%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
  .bottomCard {
    display: flex;
    div {
      display: inline-block;
    }
    .bottomCardLeft0,
    .bottomCardLeft {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
    .bottomCardLeft {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
    .bottomCardright {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
  }
}
.dv-decoration-10 {
  width: 96%;
  margin: 7px 2% 0px;
  height: 5px;
}
</style>
