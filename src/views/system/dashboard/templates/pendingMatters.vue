<template>
    <el-card class="box-card changeShadow">
        <div slot="header" class="clearfix">
            <ibps-icon name="pending" />
            <span style="font-size: 16px;">{{ title }}</span>
            <!-- <span class="totalityClass">{{totality.totalCount>999?'999+':totality.totalCount}}</span> -->
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <div ref="body" :style="{height: showHeight, width: '100%'}">
            <el-scrollbar
                style="height: 100%; width: 100%;"
                wrap-class="ibps-scrollbar-wrapper"
            >
                <!-- <ibps-list-group v-if="data && data.length >0">
                    <ibps-list v-for="(item,i) in data" :key="i" @click.native="handleFlowClick({taskId:item.taskId})">
                        <div slot="label">{{ item.createTime|dateFormat }}</div>
                        <el-link type="primary" :underline="false">{{ item.subject|removeHtmlTag }}</el-link>
                        <el-avatar slot="icon" :src="getPhoto(item.instCreatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ item.creator }}</el-avatar>
                        <span slot="extra">
                            <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                            {{ item.status | filterStatus('pending') }}
                        </span>
                    </ibps-list>
                </ibps-list-group> -->
                <ibps-list v-if="data && data.length" class="ibps-pr-10">
                    <ibps-list-item
                        v-for="(item, index) in data"
                        :key="index"
                        style="padding: 6px 0;"
                        @click.native="handleFlowClick({ taskId: item.taskId })"
                    >
                        <ibps-list-item-meta>
                            <template slot="avatar">
                                <template v-if="item.remindTimes === 0">
                                    <el-avatar
                                        :src="getPhoto(item.photo)"
                                        icon="el-icon-user-solid"
                                        @error="errorAvatarHandler"
                                    >{{ item.creator }}</el-avatar>
                                </template>
                                <template v-else>
                                    <el-badge :value="item.remindTimes" :max="99" class="item">
                                        <el-avatar
                                            :src="getPhoto(item.instCreatorPhoto)"
                                            icon="el-icon-user-solid"
                                            @error="errorAvatarHandler"
                                        >{{ item.creator }}</el-avatar>
                                    </el-badge>
                                </template>
                            </template>
                            <el-link slot="title" type="primary" :underline="false" style="display: inline-block; width: 100%;">
                                <div style="display: flex; justify-content: space-between; width: 100%;">
                                    <span style="font-size: 14px; width: 70%;">{{ item.procDefName }}</span>
                                    <div style="font-size:14px">
                                        <el-tag size="mini" type="success" disable-transitions>{{ item.name.length > 3 ? `待${item.name.slice(0, 3)}...` : `待${item.name}` }}</el-tag>
                                        <el-tag v-if="item.expired === '即将超时'" size="mini" type="warning">{{ item.expired }}</el-tag>
                                        <el-tag v-else-if="item.expired === '已超时'" size="mini" type="danger">{{ item.expired }}</el-tag>
                                    </div>
                                    <!-- <el-tag v-else-if="item.state=='danger'" type=''>{{ '已超时' }}</el-tag> -->
                                </div>
                            </el-link>
                            <template slot="description">
                                <div style="font-size: 12px;">
                                    {{ getTaskDesc(item.subject) }}
                                </div>
                            </template>
                            <template slot="description">
                                <div style="display: flex; justify-content: space-between;">
                                    <el-tag
                                        v-if="getTaskInfo(item.subject, 'deptName')"
                                        size="mini"
                                        style="font-size: 12px;"
                                        type="info"
                                        disable-transitions
                                    >{{ getTaskInfo(item.subject, 'deptName') }}</el-tag>
                                    <div v-else style="color:#fff;">无</div>
                                    <span style="font-size: 12px;">
                                        {{ item.createTime | dateFormat }}
                                    </span>
                                </div>
                            </template>
                        </ibps-list-item-meta>
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
