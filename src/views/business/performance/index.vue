<template>
    <div class="performance-config">
        <div class="page-title">性能验证</div>
        <!-- <div class="page-toolbar">
            <el-button type="primary">配置 <i class="ibps-icon-cogs" /></el-button>
        </div> -->
        <div class="page-container">
            <el-card
                v-for="(item, index) in performanceList"
                :key="index"
                :header="item.title"
                class="performance-card"
            >
                <template slot="header">
                    <div class="card-title">
                        <span>{{ item.title }}</span>
                        <el-button
                            size="mini"
                            icon="ibps-icon-cogs"
                            circle
                            @click="handleConfig(item)"
                        />
                    </div>
                </template>
                <div
                    v-for="t in item.methods"
                    :key="t.sn"
                    class="card-item"
                >
                    <div
                        :class="t.disabled ? 'method-btn disabled' : 'method-btn'"
                        @click="handleEdit(item, t)"
                    >{{ t.name }}</div>
                </div>
            </el-card>
        </div>
        <config
            v-if="showConfig"
            :visible.sync="showConfig"
            :page-data="configData"
            @close="() => showConfig = false"
        />
        <experimental
            v-if="showExperimental"
            :visible.sync="showExperimental"
            :page-data="configData"
            @close="() => showExperimental = false"
        />
    </div>
</template>

<script>
import { performanceList } from './constants/index'
export default {
    components: {
        Config: () => import('./config'),
        Experimental: () => import('./experimental')
    },
    data () {
        return {
            showConfig: false,
            showExperimental: false,
            configData: {
                target: '',
                method: ''
            },
            performanceList
        }
    },
    mounted () {
        // getFacsDaily().then(res => {
        //     const data = res.data || []
        //     data.forEach(item => {
        //         const index = this.performanceList.findIndex(i => item.facs_type.includes(i.type))
        //         if (index !== -1) {
        //             this.performanceList[index].detail.push({
        //                 name: item.name_,
        //                 done: item.done,
        //                 todo: item.todo,
        //                 status: item.todo === 0 ? 'success' : 'warning'
        //             })
        //         } else {
        //             this.performanceList.push({
        //                 type: item.facs_type.split('-')[1],
        //                 detail: [{
        //                     name: item.name_,
        //                     done: item.done,
        //                     todo: item.todo,
        //                     status: item.todo === 0 ? 'success' : 'warning'
        //                 }],
        //                 isComplete: !data.some(i => i.facs_type === item.facs_type && i.todo !== 0),
        //                 pagePath: item.pagePath
        //             })
        //         }
        //     })
        // })
    },
    methods: {
        handleConfig (item) {
            this.configData = {
                id: item.id,
                type: item.type,
                target: item.title
            }
            this.showConfig = true
        },
        handleEdit (item, t) {
            if (t.disabled) {
                return
            }
            this.configData = {
                target: item.title,
                method: t.name
            }
            this.showExperimental = true
        }
    }
}
</script>
<style lang="scss" scoped>
    .performance-config {
        .page-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
        }
        .page-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            .toolbar-left {
                display: flex;
                align-items: center;
                .toolbar-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-right: 10px;
                }
            }
            .toolbar-right {
                display: flex;
            }
        }
        .page-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            max-height: calc(100vh - 90px);
            overflow: auto;
            .performance-card {
                width: 350px;
                margin: 20px;
                transition: all 0.3s ease;
                &:hover {
                    // transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                }
                ::v-deep {
                    .el-card__header {
                        padding: 16px 20px;
                        font-weight: bold;
                        .card-title {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                    }
                    .el-card__body {
                        padding: 16px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                        .card-item {
                            margin-bottom: 16px;
                            margin-right: 20px;
                            &:nth-child(even) {
                                margin-right: 0;
                            }
                            &:nth-last-child(-n+2) {
                                margin-bottom: 0;
                            }
                            .method-btn {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 32px;
                                width: 120px;
                                padding: 10px 14px;
                                font-size: 14px;
                                background-color: #409eff;
                                color: #fff;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                background-image: linear-gradient(to right, #409eff 0%, #409eff 50%, #4CAF50 50%, #4CAF50 100%);
                                background-size: 200% 100%;
                                transition: background-position 0.5s ease;
                                &:hover {
                                    background-position: 100% 0;
                                }
                            }
                            .disabled {
                                cursor: not-allowed;
                                background-image: linear-gradient(to right, #909399 0%, #909399 50%, #C0C4CC 50%, #C0C4CC 100%);
                                &:hover {
                                    background-position: 0 0
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
