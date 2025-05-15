<template>
    <div class="personView">
        <dv-full-screen-container>
            <div class="topView" style="width: 100%; height: 11%">
                <div class="jbd-title">
                    <dv-decoration-8
                        style="
                            width: 20%;
                            height: 50px;
                            position: absolute;
                            left: 0px;
                            top: 0px;
                        "
                    />
                    <div style="width: 100%">
                        <div
                            style="
                                height: 40%;
                                font-size: 22px;
                                margin-top: 10px;
                            "
                        >
                            室间质控看板
                        </div>
                        <dv-decoration-5
                            style="width: 30%; height: 50%; margin: 0 auto"
                        />
                    </div>
                    <dv-decoration-8
                        :reverse="true"
                        style="
                            width: 20%;
                            height: 50px;
                            position: absolute;
                            right: 0px;
                            top: 0px;
                        "
                    />
                </div>
                <div class="contain">
                    <div style="display: flex; text-align: center; height:38px; line-height: 38px;width: 25%;position: absolute; left: 3%;top:6%;">
                        <div style="margin-right:10px;">选择年份</div>
                        <yearrange st :year-values="yearValues" :size="size" :value-format="valueFormat" />
                    </div>
                    <div style="display: flex; text-align: center; height:38px; line-height: 38px;width: 25%;position: absolute; left: 33%;top:15%;z-index:1">
                        <div style="margin-right:10px;font-size: 14px;">活动名称</div>
                        <el-select v-model="activityValue" size="small" clearable filterable placeholder="请选择">
                            <el-option
                                v-for="item in activityList"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                    <div

                        style="width:12%; height:2.825rem; line-height:2.825rem; text-align:center;position: absolute; right: 3%; top:6%;color:white;"
                        @click.prevent="goBack()"
                    >
                        <dv-border-box-8>返回</dv-border-box-8>
                    </div>
                </div>
            </div>
            <dv-border-box-1
                style="
                    width: 100%;
                    height: 89%;
                    box-sizing: border-box;
                    overflow: hidden;
                "
            >
                <div style="height: 3%" />
                <div class="botView">
                    <div class="viewTop">
                        <div class="topleft">
                            <topLeftChart :info="topLeftData" />
                        </div>
                        <dv-decoration-2
                            :reverse="true"
                            style="width: 2%; height: 100%"
                        />
                        <div class="topright">
                            <topRightChart :info="topRightData" />
                        </div>
                    </div>
                    <dv-decoration-10
                        style="height: 2%; width: 100%; margin: 0 auto"
                    />

                    <div class="viewBot">
                        <div class="botleft">
                            <botChart :info="botLeftData" />
                        </div>
                        <dv-decoration-2
                            :reverse="true"
                            style="width: 2%; height: 100%"
                        />
                        <div class="botmidd">
                            <botChart :info="botMiddData" />
                        </div>
                        <dv-decoration-2
                            :reverse="true"
                            style="width: 2%; height: 100%"
                        />
                        <div class="botright">
                            <botChart :info="botRightData" />
                        </div>

                    </div>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>

<script>
import screenfull from 'screenfull'
export default {

    components: {

        yearrange: () => import('../yearrange.vue'),
        topLeftChart: () => import('./topLeftChart.vue'),
        topRightChart: () => import('./topRightChart.vue'),
        botChart: () => import('./botChart.vue')

    },
    data () {
        return {
            yearArr: [],
            numArr: [],
            result: [],
            result1: [],
            result2: [],
            result3: [],
            list1: [],
            list2: [],
            list3: [],
            data1: [],
            data2: [],
            data3: [],
            yearValues: [new Date().getFullYear() - 4 + '', new Date().getFullYear() + ''],
            size: 'mini',
            valueFormat: 'yyyy',
            activityValue: '',
            activityList: [],
            topLeftData: {
                id: 'topLeftChart',
                title: '室间质评计划项目总数'
            },
            topRightData: {
                id: 'topRightChart',
                title: '项目验证类型统计'
            },
            botLeftData: {
                id: 'botLeftChart',
                title: '室间质评项目不合格率'
            },
            botMiddData: {
                id: 'botMiddChart',
                title: '室间质评项目覆盖率'
            },
            botRightData: {
                id: 'botRightChart',
                title: '实验室间比对率'
            }

        }
    },
    watch: {
        yearValues: {
            handler (newVal, oldVal) {
                this.getData()
            },
            deep: true
            // immediate: true
        },
        activityValue: {
            handler (newVal, oldVal) {
                this.topLeftData = {
                    id: 'topLeftChart',
                    title: '室间质评计划项目总数'
                }
                this.getList1()
                this.topLeftData.yearArr = this.yearArr
                this.topLeftData.numArr = this.numArr
            },
            deep: true
            // immediate: true
        }
    },
    created () {
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            screenfull.request()
        }
        this.getData()
        this.getactivityList()
    },
    mounted () {

    },
    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
    },

    methods: {
        // 返回
        goBack () {
            this.$router.back(-1)
        },
        getNumArr  (min, max) { return Array.from(Array(max - min + 1), (v, k) => k + min) },
        // 所有活动
        async getactivityList () {
            const sql = `select huo_dong_ming_che as value from	t_sjzphdjhylxqb GROUP BY huo_dong_ming_che`
            const { variables: { data }} = await this.$common.request('sql', sql)
            this.activityList = data
        },
        getData () {
            this.topLeftData = {
                id: 'topLeftChart',
                title: '室间质评计划项目总数'
            }
            this.topRightData = {
                id: 'topRightChart',
                title: '项目验证类型统计'
            }
            this.botLeftData = {
                id: 'botLeftChart',
                title: '室间质评项目不合格率'
            }
            this.botMiddData = {
                id: 'botMiddChart',
                title: '室间质评项目覆盖率'
            }
            this.botRightData = {
                id: 'botRightChart',
                title: '实验室间比对率'
            }
            this.yearArr = this.getNumArr(Number(this.yearValues[0]), Number(this.yearValues[1]))

            this.getList1()
            this.topLeftData.yearArr = this.yearArr
            this.topLeftData.numArr = this.numArr
            this.getList2()
            // this.topRightData.yearArr = this.yearArr
            this.topRightData.numArr = this.result
            this.getList3()
            this.botLeftData.yearArr = this.yearArr
            this.botLeftData.result1 = this.result1
            this.botLeftData.result2 = this.result2
            this.botLeftData.result3 = this.result3
            this.getList4()
            this.botMiddData.yearArr = this.yearArr
            this.botMiddData.list1 = this.list1
            this.botMiddData.list2 = this.list2
            this.botMiddData.list3 = this.list3

            this.getList5()
            this.botRightData.yearArr = this.yearArr
            this.botRightData.data1 = this.data1
            this.botRightData.data2 = this.data2
            this.botRightData.data3 = this.data3
        },

        async getList1 () {
            this.numArr = []
            const yearStr = `('${this.yearArr.join("', '")}')`
            const activityStr = this.activityValue ? `= '${this.activityValue}'` : `is not null`
            // const sql = `select left(zhu_biao_shi_jian, 4) as niandu, coalesce(count(*), 0) as count
            // from t_sjzphdjhylxqb
            // where left(zhu_biao_shi_jian, 4) in ${yearStr}
            // group by left(zhu_biao_shi_jian, 4)`
            const sql = `select e.ji_hua_nian_fen_ as niandu,COALESCE(COUNT(*), 0) AS count from (select a.huo_dong_ming_che,a.zu_zhi_dan_wei_,a.xu_hao_,a.shi_yan_shi_jian_,a.bi_dui_lei_xing_,b.ji_hua_nian_fen_ from t_sjzphdjhylxqb a join (select c.*, d.ji_hua_nian_fen_ from t_cjwbzlpjhdjhxqb c join  t_cjwbzlpjhdjhb d on c.parent_id_ =  d.id_ WHERE d.shi_fou_guo_shen_='已完成' and huo_dong_ming_che ${activityStr}) b on a.huo_dong_ming_che=b.huo_dong_ming_che and a.zu_zhi_dan_wei_ = b.zu_zhi_dan_wei_ and a.xu_hao_ = b.xu_hao_ and a.shi_yan_shi_jian_ = b.shi_yan_shi_jian_) e WHERE ji_hua_nian_fen_ in ${yearStr}  GROUP BY e.ji_hua_nian_fen_`
            await this.$common.request('sql', sql).then((res) => {
                const data = res.variables.data
                for (var item of this.yearArr) {
                    const m = data.find((v) => { return v.niandu === item + '' })

                    if (m) {
                        this.numArr.push(m.count)
                    } else {
                        this.numArr.push(0)
                    }
                }
            })
        },
        async getList2 () {
            this.result = []
            const yearStr = `('${this.yearArr.join("', '")}')`
            // const sql = `select LEFT(bi_dui_lei_xing_, 2) as leixing,LEFT(zhu_biao_shi_jian, 4) as niandu, COALESCE(COUNT(*), 0) as count FROM t_sjzphdjhylxqb where left(zhu_biao_shi_jian, 4) in ${yearStr} GROUP BY CONCAT(LEFT(zhu_biao_shi_jian, 4), ' ', LEFT(bi_dui_lei_xing_, 2))`
            // this.$common.request('sql', sql).then((res) => {
            //     const data = res.variables.data
            //     // console.log(data)

            //     this.result.push(['product', '能力验证', '室间质评'])

            //     for (var item of this.yearArr) {
            //         const arr = []

            //         arr[0] = item

            //         const m = data.find((v) => { return v.niandu === item + '' && v.leixing === '能力' })
            //         const n = data.find((v) => { return v.niandu === item + '' && v.leixing === '室间' })
            //         // console.log(m, n)

            //         if (m) {
            //             arr[1] = m.count
            //         } else {
            //             arr[1] = 0
            //         }
            //         if (n) {
            //             arr[2] = n.count
            //         } else {
            //             arr[2] = 0
            //         }

            //         this.result.push(arr)
            //     }
            // })
            let data1 = []
            let data2 = []
            const sql1 = `select 年度 as niandu,LEFT(能力验证类型, 2) as leixing,COUNT(*) AS count FROM v_sjzpjgpj WHERE 状态 ='已完成' and 年度 in ${yearStr} GROUP BY LEFT(能力验证类型, 2)`
            const sql2 = `select LEFT(bian_zhi_shi_jian, 4) as niandu,'实验室' as leixing, COALESCE(COUNT(*), 0) AS count from t_sysbdjlb bian_zhi_shi_jian where shi_fou_guo_shen_ = '已完成' and LEFT(bian_zhi_shi_jian, 4) IN ${yearStr}`

            await this.$common.request('sql', sql1).then((res) => {
                data1 = res.variables.data
            })
            await this.$common.request('sql', sql2).then((res) => {
                data2 = res.variables.data
            })
            this.result.push(['product', '能力验证', '室间质评', '实验室', '其它'])
            for (var item of this.yearArr) {
                const m = data1.find((v) => { return v.niandu === item + '' && v.leixing === '能力' })
                const n = data1.find((v) => { return v.niandu === item + '' && v.leixing === '室间' })
                const f = data2.find((v) => { return v.niandu === item + '' && v.leixing === '实验室' })
                const g = data1.find((v) => { return v.niandu === item + '' && v.leixing !== '能力' && v.leixing !== '室间' })

                const arr = []
                arr[0] = item
                arr[1] = m ? m.count : 0
                arr[2] = n ? n.count : 0
                arr[3] = f ? f.count : 0
                arr[4] = g ? g.count : 0
                this.result.push(arr)
                console.log(this.result)
            }
        },

        getList3 () {
            this.result1 = []
            this.result2 = []
            this.result3 = []
            const yearStr = `('${this.yearArr.join("', '")}')`
            const sql = `select 年度 as niandu,评价结果 as jieguo, COALESCE(COUNT(*), 0) AS count FROM v_sjzpjgpj WHERE 年度 IN ${yearStr} and 状态 = '已完成' GROUP BY CONCAT(年度, ' ',评价结果)`
            this.$common.request('sql', sql).then((res) => {
                const data = res.variables.data
                for (var item of this.yearArr) {
                    const m = data.find((v) => { return v.niandu === item + '' && v.jieguo === '通过' })
                    const n = data.find((v) => { return v.niandu === item + '' && v.jieguo === '不满意项目' })
                    const f = data.find((v) => { return v.niandu === item + '' && v.jieguo === '不通过' })
                    // 总数
                    this.result1.push((m ? m.count : 0) + (n ? n.count : 0) + (f ? f.count : 0))
                    // 不合格数
                    this.result2.push((f ? f.count : 0) + (n ? n.count : 0))
                    // 不合格率
                    this.result3.push((((m ? m.count : 0) + (n ? n.count : 0) + (f ? f.count : 0)) === 0 ? 0 : ((f ? f.count : 0) + (n ? n.count : 0)) / ((m ? m.count : 0) + (n ? n.count : 0) + (f ? f.count : 0)) * 100).toFixed(2))
                    // console.log(this.result1, this.result2, this.result3)
                }
            })
        },

        async getList4 () {
            this.list1 = []
            this.list2 = []
            this.list3 = []
            const yearStr = `('${this.yearArr.join("', '")}')`
            let data1 = []
            let data2 = []
            const sql1 = `select LEFT(zhu_biao_shi_jian, 4) as niandu, COUNT(*) AS count FROM t_sjzphdjhylxqb WHERE LEFT(zhu_biao_shi_jian, 4) IN ${yearStr} GROUP BY LEFT(zhu_biao_shi_jian, 4)`
            const sql2 = `select e.ji_hua_nian_fen_ as niandu,COALESCE(COUNT(*), 0) AS count from (select a.huo_dong_ming_che,a.zu_zhi_dan_wei_,a.xu_hao_,a.shi_yan_shi_jian_,a.bi_dui_lei_xing_,b.ji_hua_nian_fen_ from t_sjzphdjhylxqb a join (select c.*, d.ji_hua_nian_fen_ from t_cjwbzlpjhdjhxqb c join  t_cjwbzlpjhdjhb d on c.parent_id_ =  d.id_ WHERE d.shi_fou_guo_shen_='已完成') b on a.huo_dong_ming_che=b.huo_dong_ming_che and a.zu_zhi_dan_wei_ = b.zu_zhi_dan_wei_ and a.xu_hao_ = b.xu_hao_ and a.shi_yan_shi_jian_ = b.shi_yan_shi_jian_) e WHERE ji_hua_nian_fen_ in ${yearStr}  GROUP BY e.ji_hua_nian_fen_`
            await this.$common.request('sql', sql1).then((res) => {
                data1 = res.variables.data
            })
            await this.$common.request('sql', sql2).then((res) => {
                data2 = res.variables.data
            })

            for (var item of this.yearArr) {
                const m = data1.find((v) => { return v.niandu === item + '' })
                const n = data2.find((v) => { return v.niandu === item + '' })

                // 一览
                this.list1.push(m ? m.count : 0)
                // 计划
                this.list2.push(n ? n.count : 0)
                // 覆盖率率
                this.list3.push(((m ? m.count : 0) === 0 ? 0 : (n ? n.count : 0) / (m ? m.count : 0) * 100).toFixed(2))
            }
        },

        async getList5 () {
            this.data1 = []
            this.data2 = []
            this.data3 = []
            const yearStr = `('${this.yearArr.join("', '")}')`
            let data1 = []
            let data2 = []
            let data3 = []
            const sql1 = `select LEFT(zhu_biao_shi_jian, 4) as niandu, COUNT(*) AS count FROM t_sjzphdjhylxqb WHERE LEFT(zhu_biao_shi_jian, 4) IN ${yearStr} GROUP BY LEFT(zhu_biao_shi_jian, 4)`
            const sql2 = `select e.ji_hua_nian_fen_ as niandu,COALESCE(COUNT(*), 0) AS count from (select a.huo_dong_ming_che,a.zu_zhi_dan_wei_,a.xu_hao_,a.shi_yan_shi_jian_,a.bi_dui_lei_xing_,b.ji_hua_nian_fen_ from t_sjzphdjhylxqb a join (select c.*, d.ji_hua_nian_fen_ from t_cjwbzlpjhdjhxqb c join  t_cjwbzlpjhdjhb d on c.parent_id_ =  d.id_ WHERE d.shi_fou_guo_shen_='已完成') b on a.huo_dong_ming_che=b.huo_dong_ming_che and a.zu_zhi_dan_wei_ = b.zu_zhi_dan_wei_ and a.xu_hao_ = b.xu_hao_ and a.shi_yan_shi_jian_ = b.shi_yan_shi_jian_) e WHERE ji_hua_nian_fen_ in ${yearStr}  GROUP BY e.ji_hua_nian_fen_`
            const sql3 = `select LEFT(bian_zhi_shi_jian, 4) as niandu, COALESCE(COUNT(*), 0) AS count from t_sysbdjlb bian_zhi_shi_jian where shi_fou_guo_shen_ = '已完成' and LEFT(bian_zhi_shi_jian, 4) IN ${yearStr}`

            await this.$common.request('sql', sql1).then((res) => {
                data1 = res.variables.data
            })
            await this.$common.request('sql', sql2).then((res) => {
                data2 = res.variables.data
            })
            await this.$common.request('sql', sql3).then((res) => {
                data3 = res.variables.data
            })

            for (var item of this.yearArr) {
                const m = data1.find((v) => { return v.niandu === item + '' })
                const n = data2.find((v) => { return v.niandu === item + '' })
                const f = data3.find((v) => { return v.niandu === item + '' })

                // 无室间质评计划项目数
                this.data1.push((m ? m.count : 0) - (n ? n.count : 0))
                // 实验室比对项目数
                this.data2.push(f ? f.count : 0)
                // 比对率
                this.data3.push(((m ? m.count : 0) - (n ? n.count : 0) === 0 ? 0 : (f ? f.count : 0) / ((m ? m.count : 0) - (n ? n.count : 0)) * 100).toFixed(2))
            }
            // console.log(this.data1, this.data2, this.data3)
        }

    }
}
</script>
<style lang="less" scoped>
.personView {
  width: 100%;
  //   height: calc(100vh - 100px);
  height: 100%;
  //   background-image: url("~@/assets/images/screen/bg.png");
  z-index: 999;
  #dv-full-screen-container {
      background-image: url("~@/assets/images/screen/bg.png");
      background-size: 100% 100%;
      box-shadow: 0 0 3px blue;
      display: flex;
      flex-direction: column;
      color: white;
  }
}
.topView {
  overflow: hidden;
  box-sizing: border-box;
  .jbd-title {
      text-align: center;
      font-weight: bold;
      width: 100%;
      color: white;
      font-size: 18px;
      height: 50%;
  }

}

.botView {
    height: 98%;
    width: 98%;
    margin: 0 auto;
    overflow: hidden;
    box-sizing: border-box;

}

.viewTop{
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  height: 40%;
  width: 100%;

  .topleft{
    height: 100%;
    width: 50%;
    overflow: hidden;
    box-sizing: border-box;

  }
  .topright{
    height: 100%;
    width: 50%;
    overflow: hidden;
    box-sizing: border-box;
  }
}
.viewBot{
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  height: 52%;
  width: 100%;
  .botleft{
    height: 100%;
    width: 33%;
    overflow: hidden;
    box-sizing: border-box;

  }
  .botmidd{
    height: 100%;
    width: 33%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .botright{
    height: 100%;
    width: 33%;
    overflow: hidden;
    box-sizing: border-box;
  }
}

</style>
