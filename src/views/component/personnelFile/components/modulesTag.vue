<template>
    <div class="modulesTag20241107">
        <el-tabs ref="tabref" v-model="activeNameTab" class="tabsAll" @tab-click="handleClick">
            <div class="bgC" />
            <el-tab-pane label="基本情况" name="ryjbqk" class="tabPane">
                <jbqk-tag class="paneAll" :plane-data="judgeBase('ryjbqk','obj')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" @tipsShowTab="tipsShowTab" />
            </el-tab-pane>
            <el-tab-pane label="教育经历" name="jyjl" class="tabPane">
                <jyjl-tag class="paneAll" :plane-data="judgeBase('jyjl')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" @tipsShowTab="tipsShowTab" />
            </el-tab-pane>
            <el-tab-pane label="工作经历" name="gzjl" class="tabPane">
                <gzjl-tag class="paneAll" :plane-data="judgeBase('gzjl')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" @tipsShowTab="tipsShowTab" />
            </el-tab-pane>
            <el-tab-pane label="资格职称证书" name="zsb" class="tabPane">
                <zsb-tag class="paneAll" :plane-data="judgeBase('zsb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" @tipsShowTab="tipsShowTab" />
            </el-tab-pane>
            <!-- <el-tab-pane v-if="judgeTag('kyxmglb')" label="科研项目" name="kyxmglb" class="tabPane">
                <kyxmglb-tag ref="kyxmglb" class="paneAll" :plane-data="judgeData('kyxmglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('kjhjcgglb')" label="获奖成果" name="kjhjcgglb" class="tabPane">
                <kjhjcgglb-tag ref="kjhjcgglb" class="paneAll" :plane-data="judgeData('kjhjcgglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('SCIwzglb')" label="SCI文章" name="SCIwzglb" class="tabPane">
                <SCIwzglb-tag ref="SCIwzglb" class="paneAll" :plane-data="judgeData('SCIwzglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('zwlwglb')" label="中文论文" name="zwlwglb" class="tabPane">
                <zwlwglb-tag ref="zwlwglb" class="paneAll" :plane-data="judgeData('zwlwglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('kyzzglb')" label="专著" name="kyzzglb" class="tabPane">
                <kyzzglb-tag ref="kyzzglb" class="paneAll" :plane-data="judgeData('kyzzglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('kyzlglb')" label="专利" name="kyzlglb" class="tabPane">
                <kyzlglb-tag ref="kyzlglb" class="paneAll" :plane-data="judgeData('kyzlglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('jxjyxmxshdglb')" label="继续教育学术活动" name="jxjyxmxshdglb" class="tabPane">
                <jxjyxmxshdglb-tag ref="jxjyxmxshdglb" class="paneAll" :plane-data="judgeData('jxjyxmxshdglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('kphdglb')" label="科普活动" name="kphdglb" class="tabPane">
                <kphdglb-tag ref="kphdglb" class="paneAll" :plane-data="judgeData('kphdglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane> -->
            <el-tab-pane v-if="judgeTag('bmsm')" label="公正性、保密性" name="bmsm" class="tabPane">
                <bmsm-tag ref="bmsm" class="paneAll" :plane-data="judgeData('bmsm')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('kyxmglb')" v-model="activeNameTabInner" label="科研管理" name="kyxmglb" class="tabPane">
                <div class="paneAll innerTabs">
                    <el-tabs v-model="activeNameTabInner" tab-position="left" style="height:100%" @tab-click="handleClick">
                        <el-tab-pane v-if="judgeTag('kyxmglb')" label="科研项目" name="kyxmglb" class="tabPane shadowNone paddingInner">
                            <kyxmglb-tag ref="kyxmglb" class="paneAll" :plane-data="judgeData('kyxmglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('kjhjcgglb')" label="获奖成果" name="kjhjcgglb" class="tabPane shadowNone paddingInner">
                            <kjhjcgglb-tag ref="kjhjcgglb" class="paneAll" :plane-data="judgeData('kjhjcgglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('SCIwzglb')" label="SCI文章" name="SCIwzglb" class="tabPane shadowNone paddingInner">
                            <SCIwzglb-tag ref="SCIwzglb" class="paneAll" :plane-data="judgeData('SCIwzglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('zwlwglb')" label="中文论文" name="zwlwglb" class="tabPane shadowNone paddingInner">
                            <zwlwglb-tag ref="zwlwglb" class="paneAll" :plane-data="judgeData('zwlwglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('kyzzglb')" label="专著" name="kyzzglb" class="tabPane shadowNone paddingInner">
                            <kyzzglb-tag ref="kyzzglb" class="paneAll" :plane-data="judgeData('kyzzglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('kyzlglb')" label="专利" name="kyzlglb" class="tabPane shadowNone paddingInner">
                            <kyzlglb-tag ref="kyzlglb" class="paneAll" :plane-data="judgeData('kyzlglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('jxjyxmxshdglb')" label="继续教育学术活动" name="jxjyxmxshdglb" class="tabPane shadowNone paddingInner">
                            <jxjyxmxshdglb-tag ref="jxjyxmxshdglb" class="paneAll" :plane-data="judgeData('jxjyxmxshdglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('kphdglb')" label="科普活动" name="kphdglb" class="tabPane shadowNone paddingInner">
                            <kphdglb-tag ref="kphdglb" class="paneAll" :plane-data="judgeData('kphdglb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-tab-pane>
            <el-tab-pane v-if="judgeTagStair(['jyrykhjlb','lhrynlqr'])" label="人员考核与授权" name="rykhysq" class="tabPane">
                <div class="paneAll innerTabs">
                    <el-tabs v-model="activeNameTabInnerRY" tab-position="left" style="height:100%" @tab-click="handleClickRY">
                        <el-tab-pane v-if="judgeTag('jyrykhjlb')" label="考核记录" name="jyrykhjlb" class="tabPane shadowNone paddingInner">
                            <public-list ref="jyrykhjlb" class="paneAll" :plane-data="judgeDataAll('jyrykhjlb')" :tab-name="'jyrykhjlb'" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('lhrynlqr')" label="人员岗位授权" name="lhrynlqr" class="tabPane shadowNone paddingInner">
                            <public-list ref="lhrynlqr" class="paneAll" :plane-data="judgeDataAll('lhrynlqr')" :tab-name="'lhrynlqr'" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-tab-pane>
            <el-tab-pane v-if="judgeTagStair(['lhrypxjlb','lhpxsqb'])" label="培训" name="pxgl" class="tabPane">
                <div class="paneAll innerTabs">
                    <el-tabs v-model="activeNameTabPXInnerRY" tab-position="left" style="height:100%" @tab-click="handleClickRY">
                        <el-tab-pane v-if="judgeTag('lhrypxjlb')" label="内部培训" name="lhrypxjlb" class="tabPane shadowNone paddingInner">
                            <public-list ref="lhrypxjlb" class="paneAll" :plane-data="judgeDataAll('lhrypxjlb')" :tab-name="'lhrypxjlb'" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                        <el-tab-pane v-if="judgeTag('lhpxsqb')" label="外部培训" name="lhpxsqb" class="tabPane shadowNone paddingInner">
                            <public-list ref="lhpxsqb" class="paneAll" :plane-data="judgeDataAll('lhpxsqb')" :tab-name="'lhpxsqb'" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('kaoshijilu')" label="考试记录" name="kaoshijilu" class="tabPane">
                <public-list ref="kaoshijilu" class="paneAll" :plane-data="judgeDataAll('kaoshijilu')" :tab-name="'kaoshijilu'" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import jbqkTag from './jbqkTag.vue'
import jyjlTag from './jyjlTag.vue'
import gzjlTag from './gzjlTag.vue'
import zsbTag from './zsbTag.vue'
import kyxmglbTag from './kyxmglbTag.vue'
import kjhjcgglbTag from './kjhjcgglbTag.vue'
import SCIwzglbTag from './SCIwzglbTag.vue'
import zwlwglbTag from './zwlwglbTag.vue'
import kyzzglbTag from './kyzzglbTag.vue'
import kyzlglbTag from './kyzlglbTag.vue'
import jxjyxmxshdglbTag from './jxjyxmxshdglbTag.vue'
import kphdglbTag from './kphdglbTag.vue'
import bmsmTag from './bmsmTag.vue'
import publicList from './publicList.vue'
import { correlationSql, correlationConfig } from '../constants/simulated'

export default {
    components: {
        jbqkTag,
        jyjlTag,
        gzjlTag,
        zsbTag,
        kyxmglbTag,
        kjhjcgglbTag,
        SCIwzglbTag,
        zwlwglbTag,
        kyzzglbTag,
        kyzlglbTag,
        jxjyxmxshdglbTag,
        kphdglbTag,
        bmsmTag,
        publicList
    },
    props: {
        buttonType: {
            type: Number,
            default: 0
        },
        tagData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        baseData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        btnShow: {
            type: Boolean,
            default: true
        },
        btnType: {
            type: String,
            default: ''
        },
        activeName: {
            type: String,
            default: 'ryjbqk'
        }
    },
    data () {
        const { userId, userList = [], deptList = [], menus, userInfo } = this.$store.getters
        return {
            userId,
            activeNameTab: this.activeName,
            activeNameTabInner: 'kyxmglb',
            activeNameTabInnerRY: 'jyrykhjlb',
            activeNameTabPXInnerRY: 'lhrypxjlb',
            jurisdictionKYGL: {
                kyxmglb: 'reviewTableKYXM',
                kjhjcgglb: 'reviewTableHJCG',
                SCIwzglb: 'reviewTableSCI',
                zwlwglb: 'reviewTableZWLW',
                kyzzglb: 'reviewTableKYZZ',
                kyzlglb: 'reviewTableKYZL',
                jxjyxmxshdglb: 'reviewTableJXJY',
                kphdglb: 'reviewTableKPHD',
                bmsm: 'reviewTableBMSM'
            }
        }
    },
    watch: {
        tagData: {
            handler: function (val, oldVal) {
                if (Object.keys(val).length > 0) {
                    this.$forceUpdate()
                }
            },
            deep: true,
            immediate: true
        },
        baseData: {
            handler: function (val, oldVal) {
                if (Object.keys(val).length > 0) {
                    this.$forceUpdate()
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleClick (val) {
            if (this.jurisdictionKYGL.hasOwnProperty(val.name)) {
                this.$emit('changeTabs', val.name)
            }
            for (const key in this.jurisdictionKYGL) {
                if (typeof this.$refs[key] !== 'undefined' && typeof this.$refs[key].$refs[this.jurisdictionKYGL[key]] !== 'undefined') {
                    setTimeout(() => {
                        this.$refs[key].$refs[this.jurisdictionKYGL[key]].doLayout()
                    }, 200)
                }
            }
            switch (val.name) {
                case 'rykhysq':
                    this.handleClickRY({ name: 'jyrykhjlb' })
                    break
                case 'pxgl':
                    this.handleClickRY({ name: 'lhrypxjlb' })
                    break
                case 'kaoshijilu':
                    this.handleClickRY({ name: 'kaoshijilu' })
                    break
                default:
                    break
            }
        },
        handleClickRY (val) {
            const arr = ['jyrykhjlb', 'lhrynlqr', 'lhrypxjlb', 'lhpxsqb', 'kaoshijilu']
            arr.forEach(item => {
                if (typeof this.$refs[item] !== 'undefined' && typeof this.$refs[item].$refs['reviewTable' + item] !== 'undefined') {
                    setTimeout(() => {
                        this.$refs[item].$refs['reviewTable' + item].doLayout()
                    }, 200)
                }
            })
            this.$common.request('sql', correlationSql(val.name, this.userId)).then((result) => {
                this.$set(this.tagData[val.name], 'data', result.variables.data || [])
                this.$set(this.tagData[val.name], 'config', correlationConfig[val.name])
            }).catch((err) => {
                console.error(err)
            })
        },
        judgeTag (val) {
            return !!(Object.keys(this.tagData).length > 0 && this.tagData.hasOwnProperty(val) && this.tagData[val].display === 'Y' && this.btnShow === true && this.buttonType !== 1 && this.buttonType !== 3 && this.buttonType !== 4)
        },
        judgeTagStair (val) {
            let disTF = false
            val.forEach(element => {
                if (this.tagData.hasOwnProperty(element) && this.tagData[element].display === 'Y') {
                    disTF = true
                }
            })
            return !!(Object.keys(this.tagData).length > 0 && disTF && this.btnShow === true && this.buttonType !== 1 && this.buttonType !== 3 && this.buttonType !== 4)
        },
        judgeData (val) {
            return Object.keys(this.tagData).length > 0 ? this.tagData[val].data : []
        },
        judgeDataAll (val) {
            return Object.keys(this.tagData).length > 0 ? this.tagData[val] : {}
        },
        judgeBase (val, type = 'arr') {
            return Object.keys(this.baseData).length > 0 ? this.baseData[val].data : type === 'obj' ? {} : []
        },
        changeBaseData (val, name) {
            this.$emit('getChangeBaseData', val, name)
        },
        changeButtonShow (val, name) {
            this.$emit('changeBtnShow', val)
        },
        tipsShowTab (val, name) {
            this.$emit('tipsShow', val)
        }
    }
}
</script>
<style lang="scss" scoped>
.modulesTag20241107{
    // background-color: #fff;
    width: calc(100% - 40px);
    height: 77%;
    padding: 0 0 1%;
    ::v-deep .el-tabs__nav-wrap::after{
        height: 0;
    }
    ::v-deep .el-tabs__content{
        height: 92%;
        background-color: #fff;
        overflow: inherit;
    }
    ::v-deep .el-tabs__header.is-top{
        // background-color: #fff;
        width: calc(100% - 40px);
        // height: 5%;
        padding: 0 20px 15px;
        background-color: #fff;
        // padding-bottom: 1%;

        box-shadow:
            0px 6px 8px -6px rgba(255,0255,255,1),
            -6px 6px 8px -6px rgba(0,0,0,.1),
            6px 6px 8px -6px rgba(0,0,0,.1);
        border-radius: 0 0 4px 4px;
    }
    ::v-deep .el-tabs__item.is-active{
        color: #49bdb2;
    }
    ::v-deep .el-tabs__item:hover{
        color: #49bdb2;
    }
    ::v-deep .el-tabs__active-bar{
        background-color: #49bdb2;
    }
    // ::v-deep .el-tabs__active-bar.is-top{
    //     color: #49bdb2;
    // }
    .bgC{
        background-color: #f9ffff;
        width: 100%;
        height: 2%;
    }
    .innerTabs{
        ::v-deep .el-tabs__active-bar{
            background-color: #fff;
        }
        ::v-deep .el-tabs--left .el-tabs__item.is-left{
            // text-align: left;
        }
    }
    .tabsAll{
        height: 100%;
        .tabPane{
            width: calc(100% - 40px);
            height: calc(100% - 30px);
            padding: 20px 20px 0;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            border-radius: 4px;
            // overflow: hidden;
            display: flex;
            .paneAll{
                width: 100%;
                height: 100%;
                display: table;
            }
        }
        .shadowNone{
            box-shadow: none;
        }
        .paddingInner{
            padding: 12px 0 0 0;
            height: 100%;
        }
    }

}
</style>
