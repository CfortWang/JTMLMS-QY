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
            <el-tab-pane v-if="judgeTag('kyxmglb')" label="科研项目" name="kyxmglb" class="tabPane">
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
            </el-tab-pane>
            <el-tab-pane v-if="judgeTag('bmsm')" label="公正性、保密性" name="bmsm" class="tabPane">
                <bmsm-tag ref="bmsm" class="paneAll" :plane-data="judgeData('bmsm')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" />
            </el-tab-pane>
            <el-tab-pane label="资格职称证书" name="zsb" class="tabPane">
                <zsb-tag class="paneAll" :plane-data="judgeBase('zsb')" :button-type="buttonType" :btn-show="btnShow" :btn-type="btnType" @changeButtonShow="changeButtonShow" @changeBaseData="changeBaseData" @tipsShowTab="tipsShowTab" />
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
        bmsmTag
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
        return {
            activeNameTab: this.activeName
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
            this.$emit('changeTabs', val.name)
            if (typeof this.$refs.kyxmglb !== 'undefined' && typeof this.$refs.kyxmglb.$refs.reviewTableKYXM !== 'undefined') {
                setTimeout(() => {
                    this.$refs.kyxmglb.$refs.reviewTableKYXM.doLayout()
                }, 200)
            }
            if (typeof this.$refs.kjhjcgglb !== 'undefined' && typeof this.$refs.kjhjcgglb.$refs.reviewTableHJCG !== 'undefined') {
                setTimeout(() => {
                    this.$refs.kjhjcgglb.$refs.reviewTableHJCG.doLayout()
                }, 200)
            }
            if (typeof this.$refs.SCIwzglb !== 'undefined' && typeof this.$refs.SCIwzglb.$refs.reviewTableSCI !== 'undefined') {
                setTimeout(() => {
                    this.$refs.SCIwzglb.$refs.reviewTableSCI.doLayout()
                }, 200)
            }
            if (typeof this.$refs.zwlwglb !== 'undefined' && typeof this.$refs.zwlwglb.$refs.reviewTableZWLW !== 'undefined') {
                setTimeout(() => {
                    this.$refs.zwlwglb.$refs.reviewTableZWLW.doLayout()
                }, 200)
            }
            if (typeof this.$refs.kyzzglb !== 'undefined' && typeof this.$refs.kyzzglb.$refs.reviewTableKYZZ !== 'undefined') {
                setTimeout(() => {
                    this.$refs.kyzzglb.$refs.reviewTableKYZZ.doLayout()
                }, 200)
            }
            if (typeof this.$refs.kyzlglb !== 'undefined' && typeof this.$refs.kyzlglb.$refs.reviewTableKYZL !== 'undefined') {
                setTimeout(() => {
                    this.$refs.kyzlglb.$refs.reviewTableKYZL.doLayout()
                }, 200)
            }
            if (typeof this.$refs.jxjyxmxshdglb !== 'undefined' && typeof this.$refs.jxjyxmxshdglb.$refs.reviewTableJXJY !== 'undefined') {
                setTimeout(() => {
                    this.$refs.jxjyxmxshdglb.$refs.reviewTableJXJY.doLayout()
                }, 200)
            }
            if (typeof this.$refs.kphdglb !== 'undefined' && typeof this.$refs.kphdglb.$refs.reviewTableKPHD !== 'undefined') {
                setTimeout(() => {
                    this.$refs.kphdglb.$refs.reviewTableKPHD.doLayout()
                }, 200)
            }
            if (typeof this.$refs.bmsm !== 'undefined' && typeof this.$refs.bmsm.$refs.reviewTableBMSM !== 'undefined') {
                setTimeout(() => {
                    this.$refs.bmsm.$refs.reviewTableBMSM.doLayout()
                }, 200)
            }
        },
        judgeTag (val) {
            return !!(Object.keys(this.tagData).length > 0 && this.tagData.hasOwnProperty(val) && this.tagData[val].display === 'Y' && this.btnShow === true && this.buttonType !== 1 && this.buttonType !== 3 && this.buttonType !== 4)
        },
        judgeData (val) {
            return Object.keys(this.tagData).length > 0 ? this.tagData[val].data : []
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
            0 4px 2px -5px rgba(0,0,0,.0),
            -2px 10px 15px -5px rgba(0,0,0,.1),
            2px 10px 15px -5px rgba(0,0,0,.1);
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
    }

}
</style>
