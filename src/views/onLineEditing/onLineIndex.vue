<template>
    <div>
        <el-dialog
            :title="grooveData.title || '提示'"
            :visible.sync="show"
            append-to-body
            fullscreen
            width="100%"
            custom-class="customClass"
            z-index="1000"
        >
            <on-line-editing :groove-data="grooveData" :groove-list="grooveList" :dialog-show="true" style="width: 100%;height: 100;" />
        </el-dialog>
        <!-- <div class="elDea">
            <on-line-editing :groove-data="grooveData" :groove-list="grooveList" :dialog-show="true" style="width: 100%;height: 100;" />
        </div> -->
    </div>
</template>
<script>

import onLineEditing from '@/views/onLineEditing/index'
export default {
    components: {
        onLineEditing
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        grooveData: {
            type: Object,
            default: function () {
                return {
                    title: '提示',
                    saveShow: true,
                    exportExcelShow: true,
                    clickHandleShow: true,
                    xlsxTitleShow: true,
                    readOnly: true,
                    showtoolbarConfig: null,
                    cellRightClickConfig: null,
                    showstatisticBarConfig: null
                }
            }
        },
        grooveList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            show: this.dialogVisible
        }
    },
    methods: {

    }
}
</script>
<style  scoped>

/deep/ .customClass .el-dialog__body{
    z-index: 10;
}

.elDea{
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
}
</style>

