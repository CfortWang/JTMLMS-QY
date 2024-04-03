<template>
    <el-card
        :style="{width:'100%'}"
        class="ibps-desktop-dashboard changeShadow verticalCenterFlex"
    >
        <el-row ref="row" :gutter="12">
            <template v-if="data && data.length">
                <el-col v-for="item in data" :key="item.id" :span="24" :sm="6" :md="6" :lg="6" :xl="6">
                    <div :class="'bg-'+item.color" class="item pendingAssigneeClass" @click="openPlate(item.url)">
                        <div class="item-header">
                            <p>{{ item.dataContent }}</p>
                        </div>
                        <div class="item-body">
                            <count-to :end-val="parseInt(item.dataText, 10)" :duration="2000" />
                            <!-- <h2><count-to :end-val="parseInt(item.dataText, 10)" :duration="2000" /></h2> -->
                        </div>
                        <p class="item-tip">{{ item.dataContent | firstStr }}</p>
                    </div>
                </el-col>
            </template>
            <template v-else>
                <el-col v-for="(item,i) in 6" :key="i" :span="24" :sm="6" :md="6" :lg="6" :xl="6">
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
