<template>
    <el-card class="home-card changeShadow">
        <div slot="header" class="clearfix">
            <i class="el-icon-news" />
            <span>{{ title }}</span>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <div ref="body" :style="{height: getHeight(-20), width: '100%'}">
            <el-scrollbar
                style="height: 100%;width:100%;"
                wrap-class="ibps-scrollbar-wrapper"
            >
                <ibps-marquee
                    v-if="data && data.length"
                    :auto="false"
                    :speed="0"
                >
                    <ibps-list class="ibps-pr-10">
                        <ibps-list-item
                            v-for="(n, index) in data"
                            :key="index"
                            @click.native="handleApprove(n.id)"
                        >
                            <ibps-list-item-meta>
                                <!-- <div slot="avatar"><ibps-icon name="bolt" style="color:#5cb85c;margin: 5px 0 0 5px;" /></div> -->
                                <el-link slot="title" type="primary" :underline="false">{{ n.title }}
                                    <img
                                        v-if="showNewIcon(n.publicDate, 7)"
                                        :src="newPng"
                                        style="vertical-align: middle; height: 20px;"
                                    >
                                </el-link>
                            </ibps-list-item-meta>
                            <div slot="extra">
                                <!-- <ibps-icon name="dot-circle-o" style="color:#36c6d3" /> -->
                                {{ n.publicDate.slice(0, 10) }}
                            </div>
                        </ibps-list-item>
                    </ibps-list>
                </ibps-marquee>
                <el-alert
                    v-else
                    :closable="false"
                    :title="$t('common.noData')"
                    type="warning"
                />
            </el-scrollbar>
        </div>
    </el-card>
</template>
