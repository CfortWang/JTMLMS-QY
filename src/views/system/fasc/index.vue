<template>
    <div class="fasc-card-container">
        <el-card
            v-for="card in cardInfos"
            :key="card.facs_type"
            :class="isComplete(card.children)?'completed' : 'incomplete'"
            class="fasc-card"
        >
            <div slot="header" class="clearfix fasc-card-hearder" @click="goToDetailPage(card)">
                <span>{{ card.facs_type.split('-')[1] }}</span>
            </div>

            <el-collapse v-model="card.activeName" accordion>
                <el-collapse-item v-for="time in card.children" :key="time.jian_ce_zhou_qi_" :name="time.jian_ce_zhou_qi_">
                    <template slot="title">
                        <el-tag size="medium" effect="dark" style="margin-right:10px" :type="isFinish(time.children)?'success':'warning'">{{ time.jian_ce_zhou_qi_ }}</el-tag>
                        <span style="font-size:16px">{{ todoTitle(time.children) }}</span>
                    </template>
                    <div
                        v-for="item in time.children"
                        :key="item.name_"
                        class="card-item"
                        style="margin-left:20px;"
                    >
                        <el-tag size="mini" effect="dark" :type="item.todo===0?'success':'warning'">{{ item.name_ }}</el-tag>
                        已监测：{{ item.done }}，待监测：{{ item.todo }}
                    </div>
                </el-collapse-item>
            </el-collapse>

        </el-card>

    </div>
</template>

<script>
import { getFacsDaily } from '@/api/platform/system/jbdHome'
export default {
    data () {
        return {
            cardInfos: []
        }
    },
    mounted () {
        getFacsDaily().then(res => {
            const list = { '每日': 1, '每周': 2, '每月': 3, '每季度': 4, '每半年': 5, '每年': 6 }
            const data = res.data || []
            // 先按照 日 周 月 季度 半年 年 排序
            data.sort((a, b) => {
                if (list[a.jian_ce_zhou_qi_] && list[b.jian_ce_zhou_qi_]) {
                    if (a.jian_ce_zhou_qi_ === b.jian_ce_zhou_qi_) {
                        // 对部门进行排序
                        return a.name_.localeCompare(b.name_, 'zh') // 'zh' 指定中文排序
                    } else {
                        return list[a.jian_ce_zhou_qi_] - list[b.jian_ce_zhou_qi_]
                    }
                }
            })
            console.log('接口数据', data)
            const result = []
            data.forEach(item => {
                const { facs_type, jian_ce_zhou_qi_, name_, pagePath } = item
                if (facs_type && jian_ce_zhou_qi_ && name_) {
                    // 查找现有的分类项
                    let facsTypeObj = result.find(obj => obj.facs_type === facs_type)
                    if (!facsTypeObj) {
                        facsTypeObj = { facs_type, children: [], pagePath }
                        result.push(facsTypeObj)
                    }
                    let jianCeObj = facsTypeObj.children.find(obj => obj.jian_ce_zhou_qi_ === jian_ce_zhou_qi_)
                    if (!jianCeObj) {
                        jianCeObj = { jian_ce_zhou_qi_, children: [] }
                        facsTypeObj.children.push(jianCeObj)
                    }
                    const name_Obj = jianCeObj.children.find(obj => obj.name_ === item.name_)
                    if (!name_Obj) {
                        jianCeObj.children.push({ ...item })
                    } else {
                        name_Obj.done += item.done
                        name_Obj.todo += item.todo
                    }
                }
            })
            // 对类型进行排序
            result.sort((a, b) => {
                return a.facs_type.localeCompare(b.facs_type, 'zh')
            })
            console.log('格式化数据', result)
            this.cardInfos = result
        })
    },
    methods: {
        goToDetailPage (card) {
            if (!card.pagePath) {
                this.$message.warning('该卡片暂未配置页面路径')
                return
            }
            this.$router.push(card.pagePath)
        },
        // 计算已监测总数 和 待监测总数
        todoTitle (data) {
            let done = 0
            let todo = 0
            data.forEach(item => {
                done += item.done
                todo += item.todo
            })
            return `已监测：${done}，待监测：${todo}`
        },
        // 是否已完成
        isFinish (data) {
            let todo = 0
            data.forEach(item => {
                todo += item.todo
            })
            return todo === 0
        },

        // 所有年份已完成
        isComplete (data) {
            let todo = 0
            data.forEach(item => {
                item.children.forEach(i => {
                    todo += i.todo
                })
            })
            return todo === 0
        }
    }
}
</script>
<style lang="scss" scoped>
    .fasc-card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        max-height: calc(100vh - 90px);
        overflow: auto;
        .fasc-card-hearder{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-button{
                padding: 2px 10px;
            }
        }
        .fasc-card {
            width: 300px;
            margin: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            ::v-deep {
                .el-card__header {
                    padding: 16px 20px;
                    font-weight: bold;
                }
                .el-card__body {
                    padding: 16px;
                }
            }
            .card-item {
                margin-bottom: 8px;
            }
        }
        .incomplete {
            // box-shadow: 0 2px 12px 0 rgba(230, 162, 60, .1);
            ::v-deep {
                .el-card__header {
                    background: #E6A23C;
                }
            }
        }
        .completed {
            // box-shadow: 0 2px 12px 0 rgba(103, 194, 58, .1);
            ::v-deep {
                .el-card__header {
                    background: #67C23A;
                }
            }
        }
    }
  </style>
