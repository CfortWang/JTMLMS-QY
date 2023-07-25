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
                    <!-- <span>年度：</span> -->
                    <el-date-picker v-model="month" type="year" value-format="yyyy" format="yyyy" placeholder="日期选择" style="width: 120px" :readonly="false" :editable="true" :clearable="false" @change="updateAll" />
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
export default {
    name: 'index',
    components: { scientificBoxVue },
    data () {
        return {
            titleName: '科研成果看板',
            month: '',
            timer: '',
            timer2: '',
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
            }
        }
    },
    created () {
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            this.allView()
        }
        this.getInit()

        this.timer = setInterval(() => {
            this.getInit()
        }, 600000)
        this.getCreate()
    },
    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
        clearInterval(this.timer)
        clearInterval(this.timer2)
    },
    methods: {
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
            }, 30000) // 180000
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

        // 接口
        // 科研项目
        getKyxmDataAndList (month) {
            // let sql1 = `select tk.*,ie.NAME_,tk2.xiang_mu_bian_hao as xiangMuBianHao from t_kyxm tk  left join t_kyxm tk2 on tk.xiang_mu_bian_hao = tk2.id_ left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_kyxm where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_kyxm tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getKyxmList(datas)
                    this.kyxmData.config = JSON.parse(JSON.stringify(config))
                    this.kyxmListShow = true
                }
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
            // let sql1 = `select tk.*,ie.NAME_,tk2.jiang_li_xiang_mu as jiangLiXiangMu  from t_kjhjcg tk left join t_kjhjcg tk2 on  tk.dan_wei_ = tk2.id_ left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_kjhjcg where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_kjhjcg tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getkjhjcgList(datas)
                    this.kjhjcgData.config = config
                    this.kjhjcgListShow = true
                }
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
            // let sql1 = `select tk.*,ie.NAME_,tk2.lun_wen_ti_mu_ as lunWenTiMu from t_SCIwztjb tk  left join t_SCIwztjb tk2 on  tk.lun_wen_ti_mu_ = tk2.id_ left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_SCIwztjb where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_SCIwztjb tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getSCIwztjbList(datas)
                    this.SCIwztjbData.config = config
                    this.SCIwztjbListShow = true
                }
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
            // let sql1 = `select tk.*,ie.NAME_,tk2.lun_wen_ti_mu_ as lunWenTiMu from t_zwlw tk left join t_zwlw tk2 on  tk.lun_wen_ti_mu_ = tk2.id_ left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_zwlw where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_zwlw tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getZwlwList(datas)
                    this.zwlwData.config = config
                    this.zwlwListShow = true
                }
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
            // let sql1 = `select tk.*,ie.NAME_,tk2.zhuan_zhuo_ming_c as zhuanZhuoMingCheng from t_zz tk left join t_zz tk2 on  tk.zhuan_zhuo_ming_c = tk2.id_ left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_zz where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_zz tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getZhuZuoList(datas)
                    this.zhuZuoData.config = config
                    this.zhuZuoListShow = true
                }
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
            // let sql1 = `select tk.*,ie.NAME_,tk2.zhuan_li_ming_che as zhuanLiMingCheng from t_zl tk left join t_zl tk2 on  tk.zhuan_li_ming_che = tk2.id_ left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_zl where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_zl tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getZhuanLiList(datas)
                    this.zhuanLiData.config = config
                    this.zhuanLiListShow = true
                }
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
            // let sql1 = `select tk.*,ie.NAME_,tk2.xiang_mu_bian_hao as xiangmMuBianHao from t_jxjyxmxshd tk left join t_jxjyxmxshd tk2 on  tk.xiang_mu_bian_hao = tk2.id_  left join ibps_party_employee ie on ie.ID_ = tk.xing_ming_ and ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.ID_ not like '%1041786072788369408%' where tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' order by tk.create_time_ desc`
            const sql1 = `select * from t_jxjyxmxshd where lei_xing_ = '统计' and create_time_ like '%${month}%' order by create_time_ desc`
            const sql2 = `select ie.NAME_,count(tk.id_) as count from ibps_party_employee ie left join t_jxjyxmxshd tk on ie.ID_ = tk.xing_ming_ and tk.lei_xing_ = '个人' and tk.create_time_ like '%${month}%' where ie.STATUS_= 'actived' and ie.ID_ != '1' and ie.ID_ != '-1' and ie.ID_ != '702117247933480960' and ie.GROUP_ID_ not like '%1041786072788369408%' GROUP BY ie.id_`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state == 200) {
                    const datas = res1.variables.data
                    const config = indexFile.getJxjyxmxshdList(datas)
                    this.jxjyxmxshdData.config = config
                    this.jxjyxmxshdListShow = true
                }
                if (res2.state == 200) {
                    const datas = res2.variables.data
                    const config = indexFile.getKyxmData(datas)
                    this.jxjyxmxshdData.dataCount = JSON.parse(JSON.stringify(config))
                    this.jxjyxmxshdDataShow = true
                }
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
            left: 11%;
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
