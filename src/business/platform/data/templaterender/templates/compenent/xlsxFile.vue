<template>
    <div class="bg">
        <!-- <el-dialog title="收货地址" :visible.sync="dialogTableVisible" append-to-body  fullscreen @close="close" style="z-index:100">
            <div class="boxOn" v-if="dialogTableVisible" :style="{height: height}">
                <onLineEditing :id="xlsxId" @addClick="addClick"></onLineEditing>
            </div>
        </el-dialog> -->

        <div class="boxOn" v-if="dialogTableVisible" :style="{height: height}">
            <onLineEditing :id="xlsxId" @addClick="addClick"></onLineEditing>
            <i class="el-icon-circle-close iBox" @click="close"></i>
        </div>
    </div>
</template>

<script>
import LuckyExcel from 'luckyexcel'
import onLineEditing from '@/views/onLineEditing/index'
export default({
    components:{
        onLineEditing
    },
    props:{
        visible: {
            type: Boolean,
            default: false
        },
        xlsxId:{
            type: String,
            default: ''

        },
    },
    data(){
        return{
            dialogTableVisible: false,
            height: document.documentElement.clientHeight  + 'px'
            // document.documentElement.clientHeight - 60 + 'px'
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogTableVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
        addClick(id,option){
            this.$emit('addClick', id, option)
        },
        close(){
            this.dialogTableVisible = false
            this.$emit('xlsxFileClose');
        }
    }
})
</script>
<style lang="scss" scoped>
.bg{
    background:#FFFFFF;
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background:#FFFFFF;
    z-index: 100;
}

.iBox{
    position: fixed;
    right: 20px;
    top: 10px;
    font-size: 24px;
    color: #666666;
}
.boxOn{

    // z-index: 1009;
}
</style>
