<template>
    <el-card
        :style="{height:getDashboardHeight(),width:'100%'}"
        class="ibps-desktop-dashboard"
    >
        <el-row ref="row" :gutter="12">
            <template v-if="data && data.length >0">
                <el-col
                    v-for="item in data"
                    :key="item.id"
                    :span="24"
                    :sm="12"
                    :md="8"
                    :lg="8"
                    :xl="8"
                >
                    <div :class="'bg-'+item.color" class="item" @click="openPlate(item.url)">
                        <div class="item-header">
                            <p>{{ item.dataContent | fiveStr }}</p>
                        </div>
                        <div class="item-body">
                            <h2><count-to :end-val="parseInt(item.dataText,10)" :duration="2000" /></h2>
                        </div>
                        <template v-if="item.dataContent === '我的培训'|| item.dataContent === '我的考试'">
                            <div class="item-bottom">
                                <span>已参加:{{ item.dataText | filterDataMethod('join') }}</span>
                                <span>未参加:{{ item.dataText | filterDataMethod('unjoin') }}</span>
                            </div>
                            <!-- <div class="item-bottom">
                                <span>未参加:{{ item.dataText | filterDataMethod('unjoin') }}</span>
                                <span>占: {{ item.dataText | filterDataMethod('unjoinRate') }}</span>
                            </div> -->
                        </template>

                        <p class="item-tip">{{ item.dataContent | firstStr }}</p>
                    </div>
                </el-col>
            </template>
            <template v-else>
                <el-col
                    v-for="(item,i) in 6"
                    :key="i"
                    :span="24"
                    :sm="12"
                    :md="8"
                    :lg="8"
                    :xl="8"
                >
                    <div class="item bg-grey-steel">
                        <div class="item-header">&nbsp;</div>
                        <div class="item-body">
                            <h2>&nbsp;</h2>
                        </div>
                        <p class="item-tip">&nbsp;</p>
                    </div>
                </el-col>
            </template>
        </el-row>
    </el-card>
</template>
