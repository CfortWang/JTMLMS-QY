<!--
 * @Descripttion: 培训管理-培训信息里扫码枪签到使用，扫码获取条码信息并通过表单脚本传过来的方法，重新返回给表单脚本
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2024-04-11 14:43:46
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-04-11 17:56:07
-->
<template>
    <div class="sample-scan">
        <!-- 扫码接收的输入框-->
        <el-input
            ref="redarInput"
            v-model="scanDetail"
            style="z-index: -999;"
            @change="change(scanDetail)"
        />
        <!-- 扫码操作组件-->
        <div v-if="visible" class="popContainer" @click="TipsClick">
            <dv-decoration-12 style="width:150px;height:150px;margin:0 auto;top: 35%;">
                <span style=" color: #66D9EF;">开始扫描</span>
            </dv-decoration-12>
        </div>

    </div>
</template>

<script>
export default {
    components: {

    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        func: {
            type: Function,
            required: false
        }
    },
    data () {
        return {
            redar: false,
            scanDetail: ''
        }
    },
    watch: {
        visible: {
            handler (val, oldName) {
                if (val) {
                    this.$nextTick(() => {
                        this.$refs.redarInput.focus() // 聚焦input
                    })
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        change (page) {
            if (page) {
                this.func(page)
                this.scanDetail = ''
            }
        },
        TipsClick () {
            this.$refs.redarInput.focus() // 聚焦input
        }
    }
}
</script>

<style lang="less" scoped>
.sample-scan .popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
    background: rgba(0, 0, 0, 0.7);
}
</style>
