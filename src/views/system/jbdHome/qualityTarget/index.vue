<template>
    <div :class="$style.content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div :class="$style.header">
                <dv-decoration-8 :class="$style.left" />
                <dv-decoration-5 :class="$style.center" :dur="5" />
                <dv-decoration-8 :class="$style.right" :reverse="true" />
                <div :class="$style.title">{{ title }}</div>
                <dv-decoration-7 :class="$style.dept" :style="`font-size: ${fontSize}px;`">
                    <span>{{ dept }}</span>
                </dv-decoration-7>
                <div :class="$style.back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
            </div>
            <!-- 图表区域 -->
            <dv-border-box-1>
                <container v-if="renderData.length" :info="renderData" :font-size="fontSize" />
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
    components: {
        container: () => import('./components/container.vue')
    },
    data () {
        const d = new Date()
        const special = ['综合', '样品', '科研', '医疗', '教学', '急诊']
        const { deptList = [] } = this.$store.getters || {}
        const deptFilter = deptList.filter(item => { return !special.some(i => item.positionName.includes(i)) && item.depth === 4 }).sort(i => i.sn)
        console.log(deptFilter)
        const { first = '', second = '' } = this.$store.getters.level || {}
        return {
            // 过滤专业组
            deptList: deptFilter,
            dept: deptFilter[0].positionName,
            // 记录部门下标，用于循环渲染
            deptIndex: 0,
            level: second || first,
            title: '质量指标统计',
            year: d.toJSON().slice(0, 4),
            month: d.toJSON().slice(0, 7),
            today: d.toJSON().slice(0, 10),
            initData: {},
            renderData: [],
            showIndex: 0,
            fontSize: 18,
            timer: null,
            changeTimer: null
        }
    },
    // beforeRouteEnter(to, from, next){
    //     Promise.all([  ]).done(([ res ]) => {
    //         console.log(res)
    //     }).then(err => {
    //         window.observer.trigger('error', err)
    //         next()
    //     })
    // },
    created () {
        const w = window.innerWidth
        this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16

        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            this.allView()
        }

        this.updateAll()
        this.setTimer()
    },
    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
        clearInterval(this.timer)
        clearInterval(this.changeTimer)
    },
    methods: {
        allView () {
            // 默认显示全屏
            screenfull.request()
        },
        goBack () {
            this.$router.back(-1)
        },
        updateAll () {
            this.getData()
        },
        setTimer () {
            // 每3分钟获取一次数据
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
                this.updateAll()
            }, 30 * 1000)

            // 每5秒切换一次显示数据
            if (this.changeTimer) {
                clearInterval(this.changeTimer)
            }
            this.changeTimer = setInterval(() => {
                this.renderData = this.getRenderData(+!this.showIndex)
            }, 2 * 1000)
        },
        getData () {
            const sql = `select a.id_ as aid, a.di_dian_ as place, a.bian_zhi_bu_men_ as dept, a.tong_ji_yue_fen_ as months, a.create_time_ as createTime, b.id_ as bid, b.zhi_liang_mu_biao as goal, b.zhi_liang_zhi_bia as target, b.zhi_biao_xian_zhi as limitValue, b.shi_ji_shu_zhi_ as result, b.yuan_shi_shu_ju_ as originalData from t_zlzbpjb a inner join (select bian_zhi_bu_men_, tong_ji_yue_fen_, max(create_time_) as max from t_zlzbpjb group by bian_zhi_bu_men_, tong_ji_yue_fen_) a_latest on a.bian_zhi_bu_men_ = a_latest.bian_zhi_bu_men_ and a.tong_ji_yue_fen_ = a_latest.tong_ji_yue_fen_ and a.create_time_ = a_latest.max left join t_zlzbpjzb b on a.id_ = b.parent_id_ where a.shi_fou_guo_shen_ = '已完成' and a.di_dian_ = '${this.level}' and a.create_time_ like '${this.year}%'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                data.forEach(item => {
                    const { dept, months, target } = item
                    item.deptName = this.tranformData(dept)
                    item.month = parseInt(months.split('-')[1])
                    // 截取指标限值
                    item.limit = parseFloat(item.limitValue.match(/(\d+(\.\d+)?)/))
                    // 创建组装后的数据结构
                    if (!this.initData[item.deptName]) {
                        this.initData[item.deptName] = []
                    }
                    const index = this.initData[item.deptName].findIndex(i => i.title === target)
                    // if (!this.initData[item.deptName][target]) {
                    //     this.initData[item.deptName][target] = new Array(12).fill({})
                    // }
                    if (index === -1) {
                        const t = {
                            title: target,
                            data: new Array(12).fill({})
                        }
                        t.data[item.month - 1] = item
                        this.initData[item.deptName].push(t)
                    } else {
                        this.initData[item.deptName][index].data[item.month - 1] = item
                    }
                })
                // console.log(this.initData)
                this.renderData = this.getRenderData(0, false)
                console.log(this.renderData)
            })
        },
        tranformData (v) {
            if (!v) {
                return v
            }
            const t = this.deptList.find(i => i.positionId === v)
            return t ? t.positionName : v
        },
        // 获取图表渲染数据
        getRenderData (index, flag = true) {
            this.showIndex = index
            // 每两次切换渲染数据时切换一次部门（重新请求接口获取数据时不做切换）
            if (!this.showIndex && flag) {
                this.loopDept()
            }
            const t = this.initData[this.dept] && this.initData[this.dept].length
            if (t) {
                return this.initData[this.dept].slice(index * 12, (index + 1) * 12)
            }
            return []
        },
        loopDept () {
            if (this.deptIndex < this.deptList.length - 1 && this.deptIndex > 0) {
                this.deptIndex++
                this.dept = this.deptList[this.deptIndex].positionName
            } else {
                this.deptIndex = 0
                this.dept = this.deptList[this.deptIndex].positionName
                this.deptIndex++
            }
        }
    }
}
</script>
<style lang="scss" module>
    .content {
        width: 100%;
        height: 100%;
        background-color: #030409;
        position: absolute;
        color: #fff;
        z-index: 999;
        :global {
            #dv-full-screen-container {
                background-image: url('~@/assets/images/screen/bg.png');
                background-size: 100% 100%;
                box-shadow: 0 0 3px blue;
                display: flex;
                flex-direction: column;
            }
            .dv-border-box-1 .border-box-content{
                height: calc(100vh - 100px);
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
        }
        .header {
            position: relative;
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: space-between;
            flex-shrink: 0;
            .left, .right {
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
            .dept, .back {
                width: 8%;
                min-width: 120px;
                cursor: pointer;
                height: 2.825rem;
                line-height: 2.825rem;
                text-align: center;
                margin-top: 2.5%;
                flex: 1;
                position: absolute;
                color: #ffffff;
            }
            .dept {
                display: flex;
                justify-content: flex-end;
                // width: 125px;
                right: 75%;
                padding: 0 10px;
                color: #fff;
                font-size: 22px;
                font-weight: 400;
                span {
                    width: 120px;
                    text-align: center;
                }
            }
            .back {
                left: 75%;
            }
        }
    }
</style>
