<!--
 * @Author: cyy szjbdcyy@126.com
 * @Date: 2024-11-14 18:05:33
 * @LastEditors: cyy szjbdcyy@126.com
 * @LastEditTime: 2024-12-06 15:52:02
 * @FilePath: \zdqy_firm_former\src\views\component\personnelFile\components\dialogDeltail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-dialog
        class="dialogSty"
        title="详情"
        :visible.sync="dialogDetails"
        width="60%"
        center
        :show-close="false"
        append-to-body
    >
        <el-row v-for="(item,i) in dialogData" :key="i" :gutter="24">
            <el-col v-for="(e,t) in item" :key="'item'+t" :span="item.length<2?24:12">
                <div class="rowSty">
                    <div class="nameSty">{{ e.name }} </div>
                    <div v-if="e.type==='text'" class="contant">{{ e.contant }}</div>
                    <div v-else-if="e.type==='user' || e.type==='position'" class="contant">
                        <ibps-user-selector
                            v-model="e.contant"
                            :type="e.type"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="false"
                            size="mini"
                            style="width:100%"
                            :filter="filter"
                            filtrate
                        />
                    </div>
                    <div v-if="e.type==='dialog'" class="contant">
                        <ibps-custom-dialog
                            v-model="e.contant"
                            size="mini"
                            :template-key="e.dialogKey"
                            multiple
                            :disabled="true"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                            icon="el-icon-search"
                            style="width:100%"
                        />
                    </div>
                    <div v-else-if="e.type==='file'" class="contant">
                        <ibps-attachment
                            v-model="e.contant"
                            :download="true"
                            multiple
                            accept="*"
                            :readonly="true"
                            style="width:100%"
                            limlt="5"
                        />
                    </div>
                    <div v-else-if="e.type==='enumeration'" class="contant">
                        {{ enumeratedArray[e.assemble][e.contant] }}

                    </div>
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('changeDetails',false)">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import ibpsUserSelector from '@/business/platform/org/selector'

export default {
    components: {
        IbpsAttachment,
        ibpsUserSelector,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        dialogData: {
            type: Array,
            default: function () {
                return []
            }
        },
        dialogDetails: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            enumeratedArray: {
                numberBoolean: {
                    '0': '否',
                    '1': '是'
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.dialogSty{
    // height: 50vh;
    ::v-deep .el-dialog.el-dialog--center{
        height: 70%;
        .el-dialog__body{
            height: 83%;
            overflow-y: auto;
            padding-top: 15px !important;
            .el-row {
                margin: 0 0 20px !important;
                display: flex;
                align-items: baseline;
                // &:last-child {
                //     margin-bottom: 0;
                // }
                .rowSty{
                    display: flex;
                    justify-content: space-between;
                    margin: 1%;
                    align-items: center;
                    .nameSty{
                        width: 120px;
                    }
                    .contant{
                        width: calc(100% - 120px);
                        min-height: 1em;
                        border-bottom: 1px solid #e5e5e5;
                    }
                }
            }
        }
    }

}
</style>
