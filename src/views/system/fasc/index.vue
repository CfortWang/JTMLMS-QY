<template>
    <div class="fasc-card-container">
        <el-card
            v-for="card in cardInfos"
            :key="card.title"
            :header="card.title"
            :body-style="{ padding: '20px'}"
            :class="card.finish ? 'finshedCard':'noFinshedCard'"
            @click.native="goToDetailPage(card)"
        >
            <div
                v-for="depObj in card.dep"
                :key="depObj.name_"
            >
                <p>【{{ depObj.name_ }}】今日已监测：{{ depObj.done }}，剩余：{{ depObj.todo }}</p>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getFacsDaily } from '@/api/platform/system/jbdHome'
export default {
    data () {
        return {
            // cards: [
            //     { id: 1, title: '室内温湿度监控', description: '今日已监测：0，剩余：0' },
            //     { id: 2, title: '冰箱温度监控', description: '今日已监测：0，剩余：0' },
            //     { id: 3, title: '温浴箱温度监控', description: '今日已监测：0，剩余：0' },
            //     { id: 4, title: '阴凉柜温度监控', description: '今日已监测：0，剩余：0' },
            //     { id: 5, title: '纯水机水质监测', description: '今日已监测：0，剩余：0' },
            //     { id: 6, title: '每日安全检查', description: '今日已监测：0，剩余：0' },
            //     { id: 7, title: '每月安全检查', description: '今日已监测：0，剩余：0' },
            //     { id: 8, title: '含氯有效性监测', description: '今日已监测：0，剩余：0' },
            //     { id: 9, title: '紫外灯辐照测定', description: '今日已监测：0，剩余：0' },
            //     { id: 10, title: '洗眼器检查', description: '今日已监测：0，剩余：0' },
            //     { id: 11, title: '紧急淋浴器检查', description: '今日已监测：0，剩余：0' },
            //     { id: 12, title: '紫外灯消毒', description: '今日已监测：0，剩余：0' }
            // ],
            hoverId: null,
            cardInfos: []
        }
    },
    mounted () {
        getFacsDaily().then(res => {
            const data = res.data || []
            for (const i of data) {
                const hadData = this.cardInfos.some(so => so.title === i.facs_type)
                if (!hadData) {
                    const cardInfo = {
                        title: i.facs_type,
                        dep: data.filter(fi => { return fi.facs_type === i.facs_type }),
                        finish: data.some(so => so.facs_type === i.facs_type && so.todo === 0),
                        pagePath: i.pagePath
                    }
                    this.cardInfos.push(cardInfo)
                }
            }
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
        .noFinshedCard {
            width: 300px;
            margin: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            background: #E6A23C;
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        }
        .finshedCard {
            width: 300px;
            margin: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            background:#67C23A;
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        }
    }
  </style>
