<template>
    <el-card class="home-card changeShadow">
        <div slot="header" class="clearfix">
            <ibps-icon name="star" />
            <span>{{ title }}</span>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <div ref="body" :style="{height: getHeight(0), width: '100%'}">
            <el-scrollbar
                style="height: 100%;width:100%;"
                wrap-class="ibps-scrollbar-wrapper"
            >
                <ibps-list v-if="data && data.length" class="ibps-pr-10">
                    <ibps-list-item
                        v-for="(item, index) in data[0].data"
                        :key="index"
                        @click.native="handleFlowClick({ defId: item.id })"
                    >
                        <ibps-list-item-meta>
                            <el-link slot="title" type="primary" :underline="false">{{ item.name }}</el-link>
                        </ibps-list-item-meta>
                        <div slot="extra">
                            <!-- <ibps-icon name="dot-circle-o" style="color:#36c6d3" /> -->
                            <el-tag size="mini" type="warning">{{ item.status | filterStatus('favorites') }}</el-tag>
                        </div>
                    </ibps-list-item>
                </ibps-list>
                <el-alert
                    v-else
                    :title="$t('common.noData')"
                    :closable="false"
                    type="warning"
                />
            </el-scrollbar>
        </div>
    </el-card>
</template>
