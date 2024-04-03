<template>
    <!-- 选项卡版 -->
    <!-- <el-card :style="{height: cardHeight}" class="home-card changeShadow">
        <div slot="header" class="clearfix">
            <ibps-icon name="commenting" />
            <div style="width: 50%; display: inline-flex; align-items: center;">
                <span>{{ title }}</span>
                <span class="totalityClass">{{ totality ? totality.totalCount > 999 ? '999+' : totality.totalCount : '0' }}</span>
            </div>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <!== <div class="tabs-title">
            <ibps-icon name="commenting" />
            <span style="font-size: 15px; margin: 0 1%;">{{ title }}</span>
            <span class="totalityClass">{{ totality ? totality.totalCount > 999 ? '999+' : totality.totalCount : '0' }}</span>
        </div>
        <div class="tabs-toolbar">
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div> ==>
        <div>
            <div ref="body">
                <el-tabs
                    ref="unreadMessageTabs"
                    v-model="activeName"
                    @tab-click="()=>handleClick({
                        'innerMessage':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{PLATFORM_BASE_URL}}/msg/innerMessage/msgList?status=0' },
                        'system':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{PLATFORM_BASE_URL}}/msg/innerMessage/msgList?status=1' }
                    })"
                >
                    <el-tab-pane label="未读" name="innerMessage" style="margin:0;">
                        <div ref="tabsContent" :style="{height: getHeight(20), width: '100%'}" class="tabs-content">
                            <el-scrollbar
                                style="height: 100%;width:100%;"
                                wrap-class="ibps-scrollbar-wrapper"
                            >
                                <ibps-list v-if="data && data.length >0" class="ibps-pr-10">
                                    <ibps-list-item
                                        v-for="(item, index) in data"
                                        :key="index"
                                        @click.native="handleUnreadMessage(item.id)"
                                    >
                                        <ibps-list-item-meta>
                                            <ibps-icon slot="avatar" name="bolt" style="color: #5cb85c; margin: 5px 0 0 5px;" />
                                            <el-link slot="title" type="primary" :underline="false">{{ item.subject }}</el-link>
                                            <template slot="description">{{ item.createTime | dateFormat }}</template>
                                        </ibps-list-item-meta>
                                        <div slot="extra">
                                            <!== <ibps-icon name="dot-circle-o" style="color:#36c6d3" /> ==>
                                            <el-tag size="mini" type="warning">{{ item.messageType | filterStatus('unreadMessage') }}</el-tag>
                                        </div>
                                    </ibps-list-item>
                                </ibps-list>
                                <el-alert
                                    v-else
                                    :closable="false"
                                    title="当前没有记录。"
                                    type="warning"
                                />
                            </el-scrollbar>
                        </div>
                    </el-tab-pane>
                    <!== <el-tab-pane label="已读" name="system">
                        <div ref="tabsContent" :style="{height: showHeight, width: '100%'}" class="tabs-content">
                            <el-scrollbar
                                style="height: 100%;width:100%;"
                                wrap-class="ibps-scrollbar-wrapper"
                            >
                                <ibps-list v-if="data && data.length" class="ibps-pr-10">
                                    <ibps-list-item
                                        v-for="(item,index) in data"
                                        :key="index"
                                        @click.native="handleUnreadMessage(item.id)"
                                    >
                                        <ibps-list-item-meta>
                                            <ibps-icon slot="avatar" name="bolt" style="color: #5cb85c; margin: 5px 0 0 5px;" />
                                            <el-link slot="title" type="primary" :underline="false">{{ item.subject }}</el-link>
                                            <template slot="description">{{ item.createTime | dateFormat }}</template>
                                        </ibps-list-item-meta>
                                        <div slot="extra">
                                            <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                                            {{ item.messageType | filterStatus('unreadMessage') }}
                                        </div>
                                    </ibps-list-item>
                                </ibps-list>
                                <el-alert
                                    v-else
                                    :closable="false"
                                    title="当前没有记录。"
                                    type="warning"
                                />
                            </el-scrollbar>
                        </div>
                    </el-tab-pane> ==>
                </el-tabs>
            </div>
        </div>
    </el-card> -->

    <!-- 无选项卡版本 -->
    <el-card :style="{height: cardHeight}" class="home-card changeShadow">
        <div slot="header" class="clearfix">
            <i class="el-icon-message" />
            <el-badge :value="totalCount" :max="99" class="badge">
                <span class="title">{{ title }}</span>
            </el-badge>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <div>
            <div ref="body" :style="{height: getHeight(), width:'100%'}">
                <el-scrollbar
                    style="height: 100%;width:100%;"
                    wrap-class="ibps-scrollbar-wrapper"
                >
                    <ibps-list v-if="data && data.length" class="ibps-pr-10">
                        <ibps-list-item
                            v-for="(item, index) in data"
                            :key="index"
                            @click.native="handleUnreadMessage(item.id)"
                        >
                            <ibps-list-item-meta>
                                <ibps-icon slot="avatar" name="bolt" style="color: #5cb85c; margin: 5px 0 0 5px;" />
                                <el-link slot="title" type="primary" :underline="false">{{ item.subject }}</el-link>
                                <template slot="description">{{ item.createTime | dateFormat }}</template>
                            </ibps-list-item-meta>
                            <div slot="extra">
                                <!-- <ibps-icon name="dot-circle-o" style="color:#36c6d3" /> -->
                                <el-tag size="mini" type="warning">{{ item.messageType | filterStatus('unreadMessage') }}</el-tag>
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
        </div>
    </el-card>
</template>
