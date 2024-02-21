<template>
    <el-card :style="{height:cardHeight}" class="box-card">
        <div>
            <div class="tabs-title">
                <ibps-icon name="commenting" />
                <span>{{ title }}</span>
            </div>
            <div class="tabs-toolbar">
                <ibps-desktop-toolbar
                    ref="toolbar"
                    :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]"
                    @action-event="handleActionEvent"
                />
            </div>
            <div ref="body">
                <el-tabs
                    ref="unreadMessageTabs"
                    v-model="activeName"
                    @tab-click="()=>handleClick({
                        'innerMessage':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{PLATFORM_BASE_URL}}/desktop/facade/unread/inner/message' },
                        'system':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{PLATFORM_BASE_URL}}/desktop/facade/unread/system/message' }
                    })"
                >
                    <el-tab-pane label="内部" name="innerMessage">
                        <div ref="tabsContent" :style="{height:showHeight,width:'100%'}" class="tabs-content">
                            <el-scrollbar
                                style="height: 100%;width:100%;"
                                wrap-class="ibps-scrollbar-wrapper"
                            >
                                <ibps-list v-if="data && data.length >0" class="ibps-pr-10">
                                    <ibps-list-item
                                        v-for="(d,index) in data"
                                        :key="index"
                                        @click.native="handleUnreadMessage(d.id)"
                                    >
                                        <ibps-list-item-meta>
                                            <ibps-icon slot="avatar" name="bolt" style="color:#5cb85c;margin:5px 0 0 5px;" />

                                            <el-link slot="title" type="primary" :underline="false">{{ d.subject }}</el-link>
                                            <template slot="description">{{ d.createTime|dateFormat }}</template>
                                        </ibps-list-item-meta>
                                        <div slot="extra">
                                            <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                                            {{ d.messageType | filterStatus('unreadMessage') }}
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
                    <el-tab-pane label="系统" name="system">
                        <div ref="tabsContent" :style="{height:showHeight,width:'100%'}" class="tabs-content">
                            <el-scrollbar
                                style="height: 100%;width:100%;"
                                wrap-class="ibps-scrollbar-wrapper"
                            >
                                <ibps-list v-if="data && data.length >0" class="ibps-pr-10">
                                    <ibps-list-item
                                        v-for="(d,index) in data"
                                        :key="index"
                                        @click.native="handleUnreadMessage(d.id)"
                                    >
                                        <ibps-list-item-meta>
                                            <ibps-icon slot="avatar" name="bolt" style="color:#5cb85c;margin:5px 0 0 5px;" />
                                            <el-link slot="title" type="primary" :underline="false">{{ d.subject }}</el-link>
                                            <template slot="description">{{ d.createTime|dateFormat }}</template>
                                        </ibps-list-item-meta>
                                        <div slot="extra">
                                            <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                                            {{ d.messageType | filterStatus('unreadMessage') }}
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
                </el-tabs>
            </div>
        </div>
    </el-card>
</template>
