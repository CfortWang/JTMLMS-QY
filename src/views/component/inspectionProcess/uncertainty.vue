<!-- lax -->
<template>
    <div class="uncertainty">
        <div class="header">
            <div class="title">
                <span>评定项目</span>
            </div>
            <div v-if="!isReadonly" class="button">
                <el-button type="primary" size="mini" icon="ibps-icon-add" @click="handleAdd"> 添加</el-button>
                <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
            </div>
        </div>
        <div class="table">
            <el-table :data="showData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="55" label="序号" />
                <el-table-column label="检查项目" prop="canShuId" width="260">
                    <template slot-scope="{row}">
                        <ibps-custom-dialog
                            v-model="row.canShuId"
                            size="mini"
                            template-key="xznlfwdd"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                            icon="el-icon-search"
                            style="width:100%"
                            :disabled="isReadonly"
                            @change-link-data="(key,data)=>canShuIdChange(key,data,row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="质控数据评定的实验室内测量复现性引入的测量不确定度">
                    <el-table-column label="n" prop="zhiKongCiShuN">
                        <template slot-scope="{row}">
                            <el-input v-if="!isReadonly" v-model="row.zhiKongCiShuN" size="mini" />
                            <span v-else>{{ row.zhiKongCiShuN || '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="x̄" prop="junZhi">
                        <template slot-scope="{row}">
                            <el-input v-if="!isReadonly" v-model="row.junZhi" size="mini" />
                            <span v-else>{{ row.junZhi || '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="CV%" prop="bianYi">
                        <template slot-scope="{row}">
                            <el-input v-if="!isReadonly" v-model="row.bianYi" size="mini" />
                            <span v-else>{{ row.bianYi || '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="u(Rw)" prop="buQueDingDu">
                        <template slot-scope="{row}">
                            <el-input v-if="!isReadonly" v-model="row.buQueDingDu" size="mini" />
                            <span v-else>{{ row.buQueDingDu || '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="uᵣₑₗ(Rᴡ)" prop="xiangDui">
                        <template slot-scope="{row}">
                            <el-input v-if="!isReadonly" v-model="row.xiangDui" size="mini" />
                            <span v-else>{{ row.xiangDui || '' }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="校准品不确定度uᵣₑₗ(CRM)" prop="chongFuCeLiang">
                    <template slot-scope="{row}">
                        <el-input v-if="!isReadonly" v-model="row.chongFuCeLiang" size="mini" />
                        <span v-else>{{ row.chongFuCeLiang || '' }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="ucᵣₑₗ" prop="xiangDuiKuoZhan">
                    <template slot-scope="{row}">
                        <el-input v-if="!isReadonly" v-model="row.xiangDuiKuoZhan" size="mini" />
                        <span v-else>{{ row.xiangDuiKuoZhan || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Uᵣₑₗ (k=2)" prop="muBiao">
                    <template slot-scope="{row}">
                        <el-input v-if="!isReadonly" v-model="row.muBiao" size="mini" />
                        <span v-else>{{ row.muBiao || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="目标不确定度(TEa)" prop="heCheng">
                    <template slot-scope="{row}">
                        <el-input v-if="!isReadonly" v-model="row.heCheng" size="mini" />
                        <span v-else>{{ row.heCheng || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结果判定" prop="panDing">
                    <template slot-scope="{row}">
                        <el-select v-if="!isReadonly" v-model="row.panDing" placeholder="请选择" size="mini" style="width:100%">
                            <el-option
                                v-for="item in ['符合','不符合']"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                        <span v-else>{{ row.panDing || '' }}</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <el-pagination
            style="margin-top: 5px; padding-bottom: 10px"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20,30, 50]"
            :page-size="pagination.pageSize"
            layout="prev,pager,next,jumper,sizes,->,total"
            :total="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        formData: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableData: [],
            multipleSelection: [],
            pagination: {
                pageSize: 10,
                currentPage: 1
            }
        }
    },
    computed: {
        showData () {
            const start = (this.pagination.currentPage - 1) * this.pagination.pageSize
            const end = start + this.pagination.pageSize
            return this.tableData.slice(start, end)
        },
        isReadonly () {
            return this.readonly
        }
    },
    watch: {
        tableData: {
            handler (val) {
                this.$emit('change-data', 'clbqddpdbgzb', val)
            },
            deep: true
        },
        'formData.clbqddpdbgzb': {
            handler (val) {
                this.tableData = val
                // console.log('val', val)
            },
            immediate: true
        }
    },
    methods: {
        // 当前页码改变
        handleCurrentChange (val) {
            this.pagination.currentPage = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.pagination.pageSize = val
            this.pagination.currentPage = 1
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.pagination.currentPage - 1) * this.pagination.pageSize
        },
        canShuIdChange (key, data, row) {
            row.pingDingCanShu = data['jian_yan_xiang_mu'] || ''
        },
        handleAdd () {
            this.tableData.push({
                'id': '',
                'diDian': '',
                'parentId': '',
                'canShuId': '',
                'pingDingCanShu': '',
                'zhiKongCiShuN': '',
                'junZhi': '',
                'bianYi': '',
                'buQueDingDu': '',
                'xiangDui': '',
                'chongFuCeLiang': '',
                'fangFa': '',
                'duoCi': '',
                'pianYi': '',
                'xiangDuiKuoZhan': '',
                'muBiao': '',
                'heCheng': '',
                'panDing': '符合'
            })
        },
        handleDelete () {
            this.tableData = this.tableData.filter(item => !this.multipleSelection.includes(item))
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss">
.uncertainty{
    .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #F0FFFF;
        .title{
            font-weight: bold;
            font-size: 12px;
            color: #999999;
            margin-bottom: 0;
            margin-left: 6px;
        }
    }
    .button{
        display: flex;
        justify-content: flex-end;
        .el-button+.el-button{
            margin-left: 0;
            margin-right: 0;
        }
    }
}

</style>

