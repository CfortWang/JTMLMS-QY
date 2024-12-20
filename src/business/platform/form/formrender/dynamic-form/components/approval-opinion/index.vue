<template>
    <div>
        <template v-if="opinionData && opinionData.length">
            <!--审批历史记录 横向-->
            <el-table
                v-if="layout === 'horizontal'"
                size="mini"
                :header-cell-style="{ 'font-size': '10px', height: '20px', padding: '0px' }"
                :data="opinionData"
                border
                stripe
            >
                <!-- 审批人 -->
                <el-table-column :label="options[0].label" width="135">
                    <template slot-scope="{row, $index}">
                        {{ row[options[0].value] }}
                    </template>
                </el-table-column>
                <!-- 审批状态 -->
                <el-table-column :label="options[2].label" width="135">
                    <template slot-scope="{row, $index}">
                        <template v-if="options[2].value === 'statusName'">
                            <el-tag
                                style="border: 0;background-color:unset;"
                                :style="{ 'color': row.nodeColor }"
                                effect="plain"
                            >
                                <span v-if="row[options[2].value] === '同意'">
                                    提交/通过
                                </span>
                                <span v-else-if="row[options[2].value] == '驳回'">
                                    退回修改
                                </span>
                                <span v-else-if="row[options[2].value] == '驳回到发起人'">
                                    <span style="color: red;">退回、重新编辑</span>
                                </span>
                                <span v-else-if="row[options[2].value] !== '反对'">
                                    {{ row[options[2].value] }}
                                </span>
                            </el-tag>
                        </template>
                        <template v-else-if="options[2].value === 'opinion'">
                            <ibps-text-ellipsis
                                :text="row[options[2].value] | filterData(options[2], row)"
                                :height="80"
                                :is-limit-height="limitHeight[$index]"
                            >
                                <small slot="more">
                                    <span>...</span>
                                    <span class="el-dropdown-link" @click="onShowMore($index, false)">查看更多</span>
                                </small>
                                <small
                                    v-if="!limitHeight[$index]"
                                    slot="after"
                                    class="el-dropdown-link"
                                    @click="onShowMore($index, true)"
                                >收起</small>
                            </ibps-text-ellipsis>
                        </template>
                        <template v-else>
                            <div style="height: 20px;">{{ row[options[2].value]| filterData(options[2], row) }}</div>
                        </template>
                    </template>
                </el-table-column>
                <!-- 审批时间 -->
                <el-table-column v-if="!timeModification" :label="options[1].label" width="135">
                    <template slot-scope="{row, $index}">
                        {{ row[options[1].value] }}
                    </template>
                </el-table-column>
                <el-table-column v-if="timeModification" :label="options[1].label" width="200">
                    <template slot-scope="{row, $index}">
                        <el-date-picker v-model="row[options[1].value]" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="row[options[1].value]" />
                    </template>
                </el-table-column>
                <!-- 审批意见 -->
                <el-table-column :label="options[3].label">
                    <template slot-scope="{row,$index }">
                        <ibps-text-ellipsis
                            :text="row[options[3].value] | filterData(options[3], row)"
                            :height="80"
                            :is-limit-height="limitHeight[$index]"
                        >
                            <small slot="more">
                                <span>...</span>
                                <span class="el-dropdown-link" @click="onShowMore($index, false)">查看更多</span>
                            </small>
                            <small
                                v-if="!limitHeight[$index]"
                                slot="after"
                                class="el-dropdown-link"
                                @click="onShowMore($index, true)"
                            >收起</small>
                        </ibps-text-ellipsis>
                    </template>
                </el-table-column>
            </el-table>

            <!--审批历史记录 纵向-->
            <template v-else>
                <el-card
                    v-for="(row, i) in opinionData"
                    :key="i"
                    shadow="hover"
                    class="ibps-mb-10"
                >
                    <el-row
                        v-for="(item, j) in options"
                        :key="i + j"
                        :gutter="20"
                    >
                        <template v-if="item.checked">
                            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="ibps-tr">
                                {{ item.label }}:
                            </el-col>
                            <el-col :xs="16" :sm="18" :md="20" :lg="21" :xl="23">
                                <el-tag
                                    v-if="item.value === 'statusName'"
                                    style="border: 0;background-color:unset;"
                                    :style="{ 'color': row.nodeColor }"
                                    effect="plain"
                                >
                                    {{ row[item.value]| filterData(item, row) }}
                                </el-tag>
                                <template v-else-if="item.value === 'opinion'">
                                    <ibps-text-ellipsis
                                        :text="row[item.value] | filterData(item, row)"
                                        :height="80"
                                        :is-limit-height="limitHeight[i]"
                                    >
                                        <small slot="more">
                                            <span>...</span>
                                            <span class="el-dropdown-link" @click="onShowMore(i, false)">查看更多</span>
                                        </small>
                                        <small
                                            v-if="!limitHeight[i]"
                                            slot="after"
                                            class="el-dropdown-link"
                                            @click="onShowMore(i, true)"
                                        >收起</small>
                                    </ibps-text-ellipsis>
                                </template>
                                <template v-else>
                                    {{ row[item.value]| filterData(item, row) }}
                                </template>
                            </el-col>
                        </template>
                    </el-row>
                </el-card>
            </template>
        </template>
        <ibps-approval-opinion
            v-if="!readonly"
            v-model="data"
            :un-complete-opinion.sync="unComplate"
            :enable-common="commonCtatment"
            :placeholder="placeholder"
        />
    </div>
</template>
<script>
import Utils from '@/utils/util'
import { format, dateDealFmt } from '@/utils/fecha'
import IbpsApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
import IbpsTextEllipsis from '@/components/ibps-text-ellipsis'
export default {
    components: {
        IbpsApprovalOpinion,
        IbpsTextEllipsis
    },
    filters: {
        filterData (val, config, data) {
            // 审批人
            if (config.value === 'auditorName') {
                if (Utils.isEmpty(data.auditor) && Utils.isNotEmpty(data.qualifiedExecutor)) {
                    // 会签  审批人处理
                    const name = []
                    for (var i = 0; i < data.qualifiedExecutor.length; i++) {
                        name.push(data.qualifiedExecutor[i].executor)
                    }
                    val = name.join(' ')
                }
            } else if (config.value === 'completeTime') {
                // 审批时间
                if (Utils.isNotEmpty(val)) {
                    let dateObj = val
                    const dateFormat = 'yyyy-MM-dd HH:mm:ss'
                    try {
                        if (typeof dateObj === 'number') {
                            dateObj = new Date(dateObj)
                        }
                        if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
                            // 需要把字符串转换日期格式
                            dateObj = dateDealFmt.dealFmt(dateObj, dateFormat)
                        }
                        val = format(dateObj, dateFormat)
                    } catch (error) {
                        console.error('转换日期格式错误：', error)
                        val = ''
                    }
                }
            }
            return val
        }
    },
    inject: {
        elForm: {
            default: ''
        }
    },
    props: {
        value: String,
        // 字段
        field: Object,
        // 只读
        readonly: {
            type: Boolean,
            default: false
        },
        // 只读样式
        readonlyStyle: String,
        // 审批意见
        opinionData: {
            type: Array
        },
        // 未提交的审批意见
        unComplate: {
            type: String
        },
        params: Object,
        // 修改流程时间
        timeModification: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            data: '',
            isLimitHeight: {}
        }
    },
    computed: {
        commonCtatment () {
            return this.field ? this.field.field_options.common_statment : true
        },
        layout () {
            return this.field ? this.field.field_options.arrangement : 'horizontal'
        },
        options () {
            return this.field ? this.field.field_options.options : []
        },
        optionsCheckedLength () {
            let k = 0
            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i]
                if (option.checked) {
                    k = i
                }
            }
            return k
        },
        placeholder () {
            return this.field ? this.field.field_options.placeholder : ''
        },
        limitHeight () {
            return this.isLimitHeight
        }
    },
    watch: {
        value (val) {
            this.data = val
        },
        data: {
            handler (val) {
                this.$emit('update:value', val || this.unComplate)
            },
            deep: true,
            immediate: true
        },
        opinionData: {
            handler (val) {
                if (this.$utils.isNotEmpty(val)) {
                    for (let i = 0; i < this.opinionData.length; i++) {
                        this.isLimitHeight[i] = true
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        onShowMore (i, isLimitHeight) {
            const limitHeight = JSON.parse(JSON.stringify(this.isLimitHeight))
            limitHeight[i] = isLimitHeight
            this.isLimitHeight = {}
            this.isLimitHeight = limitHeight
        }
    }
}
</script>
