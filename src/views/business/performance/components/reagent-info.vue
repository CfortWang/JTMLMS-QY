<template>
    <div class="info-container">
        <div class="info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验试剂信息</span>
            </div>
            <div class="table-container">
                
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            pageInfo: this.info,
            endPickerOptions: {
                disabledDate (time) {
                    // 禁用当前日期之后和开始日期之前的日期
                    return time.getTime() < this.info.startTime.getTime() || time.getTime() > Date.now() - 8.64e7
                }
            }
        }
    },
    computed: {

    },
    created () {
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .info-item {
            .table-container {
                padding: 10px;
                background: #f5f5f5;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                overflow: hidden;
                
            }
        }
    }
</style>
