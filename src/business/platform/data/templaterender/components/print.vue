<template>
    <el-dialog
        :visible.sync="show"
        :width="width"
        custom-class="print-dialog"
        append-to-body
        :close-on-click-modal="false"
        :title="type + title"
        top="5vh"
        @close="$emit('update:show', false)"
    >
        <vue-easy-print tableShow ref="easyPrint" :onePageRow="1">
            <div :class="$style.content">
                <div
                    v-for="(item, index) in list"
                    :key="index"
                    :class="$style.box"
                >
                    <template v-for="(o, i) in modelList">
                        <div v-if="item[o.value]" :class="$style.item" :style="`width: ${o.width};`">
                            <span :class="$style.name">{{ o.label }}：</span>
                            <span :class="$style.value">{{ item[o.value] }}</span>
                        </div>
                    </template>
                    <vue-barcode
                        :value="item.bianHao"
                        :width="3"
                        :height="20"
                        :fontSize="0"
                        :margin="0"
                        :class="$style.barcode"
                    ></vue-barcode>
                </div>
            </div>
        </vue-easy-print>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="goPrint">打印</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '500px'
            },
            title: {
                type: String,
                default: '标签打印'
            },
            list: {
                type: Array,
                default: () => []
            },
            type: {
                type: String,
                default: '物料'
            }
        },
        components: {
            vueEasyPrint: () => import('vue-easy-print'),
            VueBarcode: () => import('vue-barcode')
        },
        data () {
            return {
                modelList: [
                    {
                        label: `${this.type}名称`,
                        value: 'mingCheng',
                        width: '100%'
                    },
                    {
                        label: `${this.type}编码`,
                        value: 'bianHao'
                    },
                    {
                        label: '代数',
                        value: 'daiShu'
                    },
                    {
                        label: '货号',
                        value: 'huoHao'
                    },
                    {
                        label: '批号',
                        value: 'piHao'
                    },
                    {
                        label: '规格',
                        value: 'guiGe'
                    },
                    {
                        label: '到库日期',
                        value: 'daoKuRiQi'
                    },
                    {
                        label: '有效期',
                        value: 'youXiaoQi'
                    },
                    {
                        label: '保存条件',
                        value: 'baoCunTiaoJian'
                    },
                    {
                        label: '生厂商',
                        value: 'shengChanShang',
                        width: '100%'
                    }
                ]
            }
        },
        methods: {
            goPrint() {
                this.$refs.easyPrint.print()
            }
        }
    }
</script>
<style lang="scss" module>
    :global {
        .print-dialog {
            width: 500px;
            min-width: 500px;
            height: 630px;
        }
    }
    .content {
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: center;
        padding: 10px;
        min-height: 490px;
        overflow: auto;
        .box {
            position: relative;
            width: 244px;
            height: 140px;
            padding: 4px 2px 0;
            margin: 0 auto 20px;
            border: 1px solid #000;
            border-radius: 4px;
            .item {
                font-size: 12px;
                font-weight: 100;
                // line-height: 12px;
                margin-bottom: 2px;
                display: inline-block;
                min-width: 50%;
                .name {
                    white-space: nowrap;
                }
            }
            .barcode {
                position: absolute;
                text-align: center;
                bottom: 4px;
                left: 0;
                right: 0;
            }
            &:last-child {
                margin-bottom: 0;
            }
        }
        .next-page {
            page-break-after: always;
        }
    }
</style>