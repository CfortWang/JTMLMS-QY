<template>
    <div>
        <el-table :data="tableData" :border="true" style="with: 100%">
            <el-table-column v-for="(item,index) in jiHuaList" :key="index" :prop="item.value" :label="item.name" :width="item.width" align="center" />
        </el-table>
    </div>
</template>
<script>
import approveJS from '../approveJS'
import approveJSON from '../approveJSON.json'
export default {
    mixins: [approveJS],
    props: {
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        },
        activeIndex: {
            type: Number,
            default: 1
        },
        clickIndex: {
            type: Number,
            default: 2
        }
    },
    data () {
        return {
            jiHuaList: approveJSON.list2
        }
    },
    watch: {
        clickIndex: {
            handler (newVal, oldVal) {
                this.switchWatch(this.clickIndex)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        switchWatch (index) {
            console.log(index)
            switch (index) {
                case 1:
                    this.jiHuaList = approveJSON.list1
                    break
                case 2:
                    this.jiHuaList = approveJSON.list2
                    break
                case 3:
                    this.jiHuaList = approveJSON.list3
                    break
                case 4:
                case 5:
                case 6:
                    this.jiHuaList = approveJSON.list4
                    break
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>
