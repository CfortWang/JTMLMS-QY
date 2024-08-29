<template>
    <div class="main" :inert="isInert">
        <div class="hand-btn">
            <el-button type="primary" icon="el-icon-plus" @click="addData">添加</el-button>
            <el-button type="danger" icon="el-icon-close" @click="goRemove">删除</el-button>
        </div>
        <el-table
            ref="reviewTable"
            :key="tableKey"
            :data="statData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            class="review-table blue-header"
            :max-height="maxHeight"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            />
            <el-table-column
                type="index"
                label="序号"
                width="55"
            />
            <el-table-column
                label="负责部门"
                width="200"
            >
                <template v-slot="{ row }">
                    <el-select v-model="row.dept" placeholder="请选择" @change="selectChange(row)">
                        <el-option
                        v-for="item in deptArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                label="负责人"
                width="200"
            >
                <template v-slot="{ row }">
                    <el-select v-model="row.person" placeholder="请选择">
                        <el-option
                        v-for="item in perArr[row.dept]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                prop="sheBeiMingCheng"
                label="改进意见"
            >
                <template v-slot="{ row }">
                    <el-input type="textarea" v-model="row.opinion"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        params: {
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
            deptArr:[],
            perArr:{},
            isInert: false,
            isFirst: true,
            statData: [],
            maxHeight: '600px',
            tableKey: 0,
            multipleSelection: [],
        }
    },
    watch: {
        statData: {
            handler (val) {
                this.$emit('change-data', 'fuJian', JSON.stringify(val))
            },
            deep: true
        }
    },
    created () {
        this.$store.getters.deptList.forEach((item, i) => {
            if(item.depth > 2){
                this.deptArr.push({value:item.positionId, label:item.positionName})
                this.perArr[item.positionId] = []
                this.$store.getters.userList.forEach((t, e) => {
                    if(t.positionId.includes(item.positionId)){
                        this.perArr[item.positionId].push({value:t.userId, label:t.userName})
                    }
                })
            }
        })
    },
    methods: {
        addData () {
            // this.$common.getNextIdByAlias({
            //     'alias': 'gsgzyzbh'
            // }).then(response => {
            //     let mid = { number:response.data, dept:'', person: '', opinion: ''  }
            //     this.statData.push(mid)
            //     console.log(this.statData)
            // }).catch((error) => {
            // })
            if(this.statData.length>9){
                this.$message.warning("单次批量只接受10条数据");
            }else{
                let mid = { dept:'', person: '', opinion: ''  }
                this.statData.push(mid)
            }
            
        },
        selectChange(val){
            val.person = ''
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        goRemove () {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                })
                return
            }
            this.statData = this.statData.filter(item => !this.multipleSelection.includes(item))
        },
    }
}
</script>

<style lang="scss" scoped>
.main{
    .hand-btn{
        width: 100%;
        text-align: right;
    }
    ::v-deep .blue-header .el-table__header th {
    background-color: #84d5cf !important; /* 背景颜色 */
    color: #080808; /* 标题文字颜色 */
    }
    .dialog{
        padding: 10px;
    }
    .spanto{
        color: #1E90FF;
    }
    .spanto:hover{
        cursor: pointer;
    }
    .spant{
        display: inline-block;
        color: #dfdddd;
        margin: 0 7px;
    }
    .dialog-footer{
        text-align: center;
    }
    .el-form{
        padding: 10px;
    }
    .setBorder{
        border: 1px solid #dcdfe6;
        padding:10px;
        border-radius: 8px;
    }

}

</style>
