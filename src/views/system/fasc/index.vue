<template>
    <div class="fasc-card-container">
        <el-card
            v-for="card in cards"
            :key="card.id"
            :header="card.title"
            :body-style="{ padding: '20px' }"
            class="card"
            @click.native="goToDetailPage(card)"
        >
            <p>{{ card.description }}</p>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            cards: [
                { id: 1, title: '室内温湿度监控', description: '今日已监测：0，剩余：0' },
                { id: 2, title: '冰箱温度监控', description: '今日已监测：0，剩余：0' },
                { id: 3, title: '温浴箱温度监控', description: '今日已监测：0，剩余：0' },
                { id: 4, title: '阴凉柜温度监控', description: '今日已监测：0，剩余：0' },
                { id: 5, title: '纯水机水质监测', description: '今日已监测：0，剩余：0' },
                { id: 6, title: '每日安全检查', description: '今日已监测：0，剩余：0' },
                { id: 7, title: '每月安全检查', description: '今日已监测：0，剩余：0' },
                { id: 8, title: '含氯有效性监测', description: '今日已监测：0，剩余：0' },
                { id: 9, title: '紫外灯辐照测定', description: '今日已监测：0，剩余：0' },
                { id: 10, title: '洗眼器检查', description: '今日已监测：0，剩余：0' },
                { id: 11, title: '紧急淋浴器检查', description: '今日已监测：0，剩余：0' },
                { id: 12, title: '紫外灯消毒', description: '今日已监测：0，剩余：0' }
            ],
            hoverId: null
        }
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
        justify-content: center;
        .card {
            width: 300px;
            margin: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        }
    }
  </style>
