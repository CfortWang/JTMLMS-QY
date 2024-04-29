<template>
    <div class="fasc-card-container">
        <el-card
            v-for="card in cardInfos"
            :key="card.type"
            :header="card.type"
            class="fasc-card"
            :class="card.isComplete ? 'completed' : 'incomplete'"
            @click.native="goToDetailPage(card)"
        >
            <div
                v-for="item in card.detail"
                :key="item.name"
                class="card-item"
            >
                <el-tag size="medium" effect="dark" :type="item.status">{{ item.name }}</el-tag>
                今日已监测：{{ item.done }}，剩余：{{ item.todo }}
                <!-- 【{{ item.name }}】今日已监测：{{ item.done }}，剩余：{{ item.todo }} -->
            </div>
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
            const data = res.data || []
            data.forEach(item => {
                const index = this.cardInfos.findIndex(i => item.facs_type.includes(i.type))
                if (index !== -1) {
                    this.cardInfos[index].detail.push({
                        name: item.name_,
                        done: item.done,
                        todo: item.todo,
                        status: item.todo === 0 ? 'success' : 'warning'
                    })
                } else {
                    this.cardInfos.push({
                        type: item.facs_type.split('-')[1],
                        detail: [{
                            name: item.name_,
                            done: item.done,
                            todo: item.todo,
                            status: item.todo === 0 ? 'success' : 'warning'
                        }],
                        isComplete: !data.some(i => i.facs_type === item.facs_type && i.todo !== 0),
                        pagePath: item.pagePath
                    })
                }
            })
        })
    },
    methods: {
        goToDetailPage (card) {
            if (!card.pagePath) {
                this.$message.warning('该卡片暂未配置页面路径')
                return
            }
            this.$router.push(card.pagePath)
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
