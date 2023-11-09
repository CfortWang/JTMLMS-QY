<template>
    <div class="bg">
        <el-dialog width="60%" append-to-body title="评审前核查流程" :visible.sync="generalShow" @close="close">
            <!-- 表单是否显示 -->
            <div style="width: 100%;height: 100%;">
                <img src="../../../../assets/images/flowChart/orderTab.png" class="logoImg">
            </div>

        </el-dialog>

    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        generalList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            generalShow: this.show
        }
    },
    methods: {
        close () {
            this.$emit('generalClose', false)
        }
    }
}
</script>

<style lang="less" scoped>
.logoImg {
    width: 100%;
    height: 450px;
    position: relative;
    border-radius: 5px;
}

</style>
