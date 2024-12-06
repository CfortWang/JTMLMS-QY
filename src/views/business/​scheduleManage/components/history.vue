<template>
    <el-drawer
        :title="title"
        :visible.sync="drawerVisible"
        :direction="direction"
        show-close
        size="30%"
        :wrapper-closable="false"
        destroy-on-close
        append-to-body
        custom-class="schedule-history"
        :before-close="handleClose"
    >
        <span>排班历史</span>
    </el-drawer>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            drawerVisible: this.visible,
            title: '排班修改历史',
            direction: 'rtl',
            test: ''
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.drawerVisible = val
            }
        }
    },
    methods: {
        handleClose () {
            console.log(123123)
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .schedule-history {
        ::v-deep {

        }
    }
</style>
