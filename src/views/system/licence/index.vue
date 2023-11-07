<template>
    <ibps-container
        type="full"
        header-background-color
        class="licence"
    >
        <div class="licence-container">
            <div class="title">
                <span>许可证信息</span>
                <span>{{ `（${licence.isTrialVersion ? '试用版' : '正式版'}）` }}</span>
                <el-button
                    type="success"
                    size="mini"
                    @click="licenceFormVisible = true"
                ><i class="el-icon-refresh el-icon--left" />更新</el-button>
            </div>
            <div class="card">
                <div class="item">
                    <div class="label">单位名称</div>
                    <div class="value">{{ licence.customerInfo }}</div>
                </div>
                <div class="item">
                    <div class="label">发布时间</div>
                    <div class="value">{{ transformDate(licence.issuedTime) }}</div>
                </div>
                <div class="item">
                    <div class="label">生效时间</div>
                    <div class="value">{{ transformDate(licence.notBefore) }}</div>
                </div>
                <template v-if="licence.isTrialVersion">
                    <div class="item">
                        <div class="label">失效时间</div>
                        <div class="value">{{ transformDate(licence.notAfter) }}</div>
                    </div>
                    <div class="item">
                        <div class="label">到期提醒天数</div>
                        <div class="value">{{ licence.reminderDays }}</div>
                    </div>
                </template>
                <div class="item">
                    <div class="label">状态</div>
                    <div class="value">
                        <el-tag :type="state"> {{ status[state] }} </el-tag>
                    </div>
                </div>
            </div>
        </div>
        <update-licence
            :visible="licenceFormVisible"
            :username="username"
            @close="visible => licenceFormVisible = visible"
        />
    </ibps-container>
</template>
<script>

export default {
    components: {
        updateLicence: () => import('@/views/system/licence/update')
    },
    data () {
        const { username = '', licence = {}} = this.$store.getters
        return {
            licenceFormVisible: false,
            username,
            licence,
            status: {
                success: '正常',
                warning: '即将到期',
                danger: '过期'
            }
        }
    },
    computed: {
        state () {
            const { isTrialVersion, needRemind, overtime } = this.licence || {}
            if (!isTrialVersion) {
                return 'success'
            }
            if (overtime) {
                return 'danger'
            }
            if (needRemind) {
                return 'warning'
            }
            return 'success'
        }
    },
    mounted () {
        console.log(this.licence)
    },
    methods: {
        handUpdate () {
            this.licenceFormVisible = true
        },
        transformDate (v) {
            return new Date(v).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        }
    }
}
</script>
<style lang="scss" scoped>
.licence-container {
    margin: 20px;
    height: calc(100% - 100px);
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
    .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
    .card {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
            width: calc(60% - 10px);
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
            transition: transform 0.2s;
            &:hover {
                transform: scale(1.03);
            }
            .label {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .value {
                font-size: 16px;
                color: #666;
            }
        }
    }
}
</style>
