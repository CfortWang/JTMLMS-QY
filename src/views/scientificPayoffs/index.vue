<template>
    <div class="contentBox">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div class="header">
                <dv-decoration-8 class="left" />
                <dv-decoration-5 class="center" />
                <dv-decoration-8 class="right" :reverse="true" />
                <div class="title">{{ titleName }}</div>
                <div class="time">
                    <dv-border-box-8 style="width: 40%;margin-right: 25px">
                        <ibpsTreeSelect v-model="selectData" :data="treeData" :props="props" :node-key="nodeKey" :clearable="clearable" style="width: 150px;margin-right: 30px;" />
                    </dv-border-box-8>
                    <!-- <span>年度：</span> -->
                    <dv-border-box-8 style="width: 25%;">
                        <el-date-picker v-model="month" type="year" value-format="yyyy" format="yyyy" placeholder="日期选择" style="width: 120px" :readonly="false" :editable="true" :clearable="false" @change="updateAll" />
                    </dv-border-box-8>
                </div>
                <div class="back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
                <div class="previousPage" @click.prevent="previou()">
                    <dv-border-box-8>上一页</dv-border-box-8>
                </div>
                <div class="nextPage" @click.prevent="next()">
                    <dv-border-box-8>下一页</dv-border-box-8>
                </div>
            </div>
            <dv-border-box-1 class="contentBorder">
                <!-- :style="indexData == 1 && kyxmListShow && kyxmDataShow ? 'display: block' : 'display: none'" -->
                <scientificBoxVue v-if="indexData == 1 && kyxmListShow && kyxmDataShow" class="contentBorderBox" :list-show="kyxmListShow" :data-show="kyxmDataShow" :data-item="kyxmData" />
                <scientificBoxVue v-if="indexData == 1 && SCIwztjbDataShow && SCIwztjbListShow" class="contentBorderBox" :bottom-border="false" :list-show="SCIwztjbListShow" :data-show="SCIwztjbDataShow" :data-item="SCIwztjbData" />
                <scientificBoxVue v-if="indexData == 2 && zwlwListShow && zwlwDataShow" class="contentBorderBox" :list-show="zwlwListShow" :data-show="zwlwDataShow" :data-item="zwlwData" />
                <scientificBoxVue v-if="indexData == 2 && zhuZuoListShow && zhuZuoDataShow" class="contentBorderBox" :bottom-border="false" :list-show="zhuZuoListShow" :data-show="zhuZuoDataShow" :data-item="zhuZuoData" />
                <scientificBoxVue v-if="indexData == 3 && zhuanLiListShow && zhuanLiDataShow" class="contentBorderBox" :list-show="zhuanLiListShow" :data-show="zhuanLiDataShow" :data-item="zhuanLiData" />
                <scientificBoxVue v-if="indexData == 3 && jxjyxmxshdListShow && jxjyxmxshdDataShow" class="contentBorderBox" :bottom-border="false" :list-show="jxjyxmxshdListShow" :data-show="jxjyxmxshdDataShow" :data-item="jxjyxmxshdData" />
                <scientificBoxVue v-if="indexData == 4 && kjhjcgDataShow && kjhjcgListShow" class="contentBorderBox" :bottom-border="false" :list-show="kjhjcgListShow" :data-show="kjhjcgDataShow" :data-item="kjhjcgData" />
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>

<script>
import screenfull from 'screenfull'
import scientificBoxVue from './compontent/scientificBox.vue'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import indexFile from './js/index.js'
import ibpsTreeSelect from '@/components/ibps-tree-select'
import TreeUtils from '@/utils/tree'
export default {
    name: 'index',
    components: { scientificBoxVue, ibpsTreeSelect },
    data () {
        return {
            titleName: '科研成果看板',
            treeData: [],
            clearable: true,
            nodeKey: 'ID_',
            selectData: '',
            props: {
                children: 'children',
                label: 'NAME_'
            },

            month: '',
            timer: '',
            timer2: '',
            timer3: '',
            indexData: 1,
            // 科研项目
            kyxmListShow: false,
            kyxmDataShow: false,
            kyxmData: {
                title: '科研项目',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },

            // 科技获奖成果
            kjhjcgListShow: false,
            kjhjcgDataShow: false,
            kjhjcgData: {
                title: '科研获奖成果',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },

            // SCI文章统计表
            SCIwztjbListShow: false,
            SCIwztjbDataShow: false,
            SCIwztjbData: {
                title: 'SCI文章统计表',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },

            // 中文论文
            zwlwListShow: false,
            zwlwDataShow: false,
            zwlwData: {
                title: '中文论文',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },

            // 著作
            zhuZuoListShow: false,
            zhuZuoDataShow: false,
            zhuZuoData: {
                title: '著作',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },

            // 专利
            zhuanLiListShow: false,
            zhuanLiDataShow: false,
            zhuanLiData: {
                title: '专利',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },

            // 继续教育项目/学术活动
            jxjyxmxshdListShow: false,
            jxjyxmxshdDataShow: false,
            jxjyxmxshdData: {
                title: '继续教育项目/学术活动',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            },
            // ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ != '1115242459127873536' and ie.ID_ != '1115242765924433920' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_
            likeParams: "ie.STATUS_= 'actived' GROUP BY ie.id_",

            likeTongJi: `lei_xing_ = '统计'`
        }
    },
    watch: {
        selectData () {
            if (this.selectData) {
                const sqlData = `ie.POSITIONS_ like '%${this.selectData}%'`
                const sqlData2 = `bian_zhi_bu_men_ like '%${this.selectData}%'`
                this.likeParams = `ie.STATUS_= 'actived' and (${sqlData}) GROUP BY ie.id_`
                this.likeTongJi = `lei_xing_ = '统计' and (${sqlData2})`
                this.getInit()
                this.getKeYanChengGuoList()
            } else {
                this.getPosition().then((res) => {
                    this.getInit()
                    this.getKeYanChengGuoList()
                })
            }
        }
    },
    created () {
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            this.allView()
        }

        this.getPositionList()
        this.getPosition().then((res) => {
            this.getInit()
            this.getKeYanChengGuoList()
        })

        this.timer = setInterval(() => {
            this.getInit()
        }, 600000)

        this.timer3 = setInterval(() => {
            this.getKeYanChengGuoList()
        }, 1000 * 60 * 60)
        this.getCreate()
    },

    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
        clearInterval(this.timer)
        clearInterval(this.timer2)
        clearInterval(this.timer3)
    },
    methods: {
        getPosition () {
            return new Promise((resolve, reject) => {
                let sqlData = ``
                let sqlData2 = ``
                // const sql = `select ID_ from ibps_party_entity where party_type_ = 'position' and PATH_ like '%1136828146851512320%'`
                // curdPost('sql', sql).then((res2) => {
                //     if (res2.state === 200) {
                //         const datas = res2.variables.data
                //         if (datas.length > 0) {
                //             datas.forEach((item, index) => {
                //                 if (index === 0) {
                //                     sqlData += `ie.POSITIONS_ like '%${item.ID_}%'`
                //                     sqlData2 += `bian_zhi_bu_men_ like '%${item.ID_}%'`
                //                 } else {
                //                     sqlData += ` or ie.POSITIONS_ like '%${item.ID_}%'`
                //                     sqlData2 += ` or bian_zhi_bu_men_ like '%${item.ID_}%'`
                //                 }
                //             })
                //             this.likeParams = `ie.STATUS_= 'actived' and (${sqlData}) GROUP BY ie.id_`
                //             this.likeTongJi = `lei_xing_ = '统计' and (${sqlData2})`
                //         }
                //         resolve()
                //     }
                // })
                console.log(this.$store.getters.userInfo.employee.positions)
                const positions = this.$store.getters.userInfo.employee.positions
                const positionsList = positions.split(',')
                if (positionsList.length > 0) {
                    positionsList.forEach((item, index) => {
                        if (index === 0) {
                            sqlData += `ie.POSITIONS_ like '%${item}%'`
                            sqlData2 += `bian_zhi_bu_men_ like '%${item}%'`
                        } else {
                            sqlData += ` or ie.POSITIONS_ like '%${item}%'`
                            sqlData2 += ` or bian_zhi_bu_men_ like '%${item}%'`
                        }
                    })
                    this.likeParams = `ie.STATUS_= 'actived' and (${sqlData}) GROUP BY ie.id_`
                    this.likeTongJi = `lei_xing_ = '统计' and (${sqlData2})`
                }
                resolve()
            })
        },
        // 初始化数据
        getInit () {
            const nowDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
            const month = nowDate.toJSON().split('T').join(' ').substr(0, 4)
            this.month = month
            this.updateAll(month)
        },
        getCreate () {
            this.timer2 = setInterval(() => {
                this.next()
            }, 1000 * 60) // 180000
        },
        allView () {
            // 默认显示全屏
            screenfull.request()
        },
        // 返回
        goBack () {
            this.$router.back(-1)
        },
        // 上一页
        previou () {
            if (this.indexData == 1) {
                this.indexData = 4
            } else {
                this.indexData--
            }
            this.updateAll(this.month)
        },
        // 下一页
        next () {
            if (this.indexData == 4) {
                this.indexData = 1
            } else {
                this.indexData++
            }
            this.updateAll(this.month)
        },
        // 时间
        updateAll (e) {
            if (this.indexData == 1) {
                this.getKyxmDataAndList(e)
                this.getSCIwztjbDataAndList(e)
            }
            if (this.indexData == 2) {
                this.getZwlwDataAndList(e)
                this.getZhuZuoDataAndList(e)
            }
            if (this.indexData == 3) {
                this.getZhuanLiDataAndList(e)
                this.getJxjyxmxshdDataAndList(e)
            }
            if (this.indexData == 4) {
                this.getKjhjcgDataAndList(e)
            }
        },
        getKeYanChengGuoList () {
            const sql1 = `select * from t_kyxm where ${this.likeTongJi} order by create_time_ desc`
            const sql2 = `select * from t_kjhjcg where ${this.likeTongJi} order by create_time_ desc`
            const sql3 = `select * from t_SCIwztjb where ${this.likeTongJi} order by create_time_ desc`
            const sql4 = `select * from t_zwlw where ${this.likeTongJi} order by create_time_ desc`
            const sql5 = `select * from t_kyzz where ${this.likeTongJi} order by create_time_ desc`
            const sql6 = `select * from t_kyzl where ${this.likeTongJi} order by create_time_ desc`
            const sql7 = `select * from t_jxjyxmxshd where ${this.likeTongJi} order by create_time_ desc`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2), curdPost('sql', sql3), curdPost('sql', sql4), curdPost('sql', sql5), curdPost('sql', sql6), curdPost('sql', sql7)]).then(([res1, res2, res3, res4, res5, res6, res7]) => {
                if (res1.state === 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getKyxmList(datas)
                    this.kyxmData.config = JSON.parse(JSON.stringify(config))
                    this.kyxmListShow = true
                }
                if (res2.state === 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getkjhjcgList(datas)
                    this.kjhjcgData.config = config
                    this.kjhjcgListShow = true
                }
                if (res3.state === 200) {
                    const datas = res3.variables.data
                    const config = indexFile.getSCIwztjbList(datas)
                    this.SCIwztjbData.config = config
                    this.SCIwztjbListShow = true
                }
                if (res4.state === 200) {
                    const datas = res4.variables.data
                    const config = indexFile.getZwlwList(datas)
                    this.zwlwData.config = config
                    this.zwlwListShow = true
                }
                if (res5.state === 200) {
                    const datas = res5.variables.data
                    const config = indexFile.getZhuZuoList(datas)
                    this.zhuZuoData.config = config
                    this.zhuZuoListShow = true
                }
                if (res6.state === 200) {
                    const datas = res6.variables.data
                    const config = indexFile.getZhuanLiList(datas)
                    this.zhuanLiData.config = config
                    this.zhuanLiListShow = true
                }
                if (res7.state === 200) {
                    const datas = res7.variables.data
                    const config = indexFile.getJxjyxmxshdList(datas)
                    this.jxjyxmxshdData.config = config
                    this.jxjyxmxshdListShow = true
                }
            })
        },

        // 接口
        // 科研项目
        getKyxmDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_kyxm tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.kyxmData.dataCount = JSON.parse(JSON.stringify(config))
                    this.kyxmDataShow = true
                }
            })
        },

        // 科技获奖成果
        getKjhjcgDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_kjhjcg tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.kjhjcgData.dataCount = JSON.parse(JSON.stringify(config))
                    this.kjhjcgDataShow = true
                }
            })
        },

        // SCI文章统计表
        getSCIwztjbDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_SCIwztjb tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.SCIwztjbData.dataCount = JSON.parse(JSON.stringify(config))
                    this.SCIwztjbDataShow = true
                }
            })
        },

        // 中文论文
        getZwlwDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_zwlw tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.zwlwData.dataCount = JSON.parse(JSON.stringify(config))
                    this.zwlwDataShow = true
                }
            })
        },

        // 著作
        getZhuZuoDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_kyzz tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.zhuZuoData.dataCount = JSON.parse(JSON.stringify(config))
                    this.zhuZuoDataShow = true
                }
            })
        },

        // 专利
        getZhuanLiDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_kyzl tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.zhuanLiData.dataCount = JSON.parse(JSON.stringify(config))
                    this.zhuanLiDataShow = true
                }
            })
        },

        // 继续教育项目/学术活动
        getJxjyxmxshdDataAndList (month) {
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_jxjyxmxshd tk on ie.ID_ = tk.parent_id_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ${this.likeParams}`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.jxjyxmxshdData.dataCount = JSON.parse(JSON.stringify(config))
                    this.jxjyxmxshdDataShow = true
                }
            })
        },

        getPositionList () {
            const first = this.$store.getters.level.first
            const sql2 = `select * from ibps_party_entity where party_type_ = 'position' and PATH_ like '%${first}%' and DEPTH_ > 2`
            curdPost('sql', sql2).then((res2) => {
                if (res2.state === 200) {
                    const datas = res2.variables.data
                    if (datas.length > 0) {
                        this.treeData = this.toTree(datas)
                    }
                }
            })
        },
        toTree (data) {
            return TreeUtils.transformToTreeFormat(data, {
                idKey: 'ID_',
                pIdKey: 'PARENT_ID_',
                childrenKey: 'children'
            })
        }
    }
}
</script>

<style lang="scss"  scoped>
.contentBox {
    width: 100%;
    height: 100%;
    background-color: #030409;
    position: absolute;
    color: #fff;
    z-index: 999;

    #dv-full-screen-container {
        background-image: url('~@/assets/images/screen/bg.png');
        background-size: 100% 100%;
        box-shadow: 0 0 3px blue;
        display: flex;
        flex-direction: column;
    }

    .header {
        position: relative;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
        .left,
        .right {
            width: 25%;
            height: 38px;
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
        .time,
        .back {
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

        .previousPage {
            width: 4%;
            cursor: pointer;
            height: 2.825rem;
            line-height: 2.825rem;
            text-align: center;
            margin-top: 2.5%;
            flex: 1;
            position: absolute;
            color: #ffffff;
            left: 3%;
        }
        .nextPage {
            width: 4%;
            cursor: pointer;
            height: 2.825rem;
            line-height: 2.825rem;
            text-align: center;
            margin-top: 2.5%;
            flex: 1;
            position: absolute;
            color: #ffffff;
            right: 11%;
        }
        .time {
            display: flex;
            justify-content: flex-end;
            width: 20%;
            right: 75%;
            ::v-deep .el-input--small .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        color: #fff;
                        font-size: 16px;
                    }
        }
        .back {
            left: 75%;
        }
    }
}

.contentBorder {
    .contentBorderBox {
        height: 50%;
    }
}
</style>
