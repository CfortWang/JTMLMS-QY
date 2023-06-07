<template>
  <el-card
    v-loading.fullscreen.lock="loading"
    class="box-card pending-business"
    :element-loading-text="$t('common.loading')"
    element-loading-background="transparent"
  >
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        style="height: 100%;width:100%;"
        wrap-class="ibps-scrollbar-wrapper"
      >
        <el-tabs
          v-model="pendingTabActiveName"
          class="pending-Tabs"
          @tab-click="()=>handleTabClick({
            'user-type':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/user2'},
            'org-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/org2' },
            'org-principal':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/org/manager2'},
            'role-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/role2'},
            'post-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/position2'},
            'group-belong':{ 'dataMode': 'column.dataMode', 'dataFrom': '{{BUSINESS_BASE_URL}}/bpm/received/query/pending/group2'}
          })"
        >
          <el-tab-pane
            v-for="item in [{
                              'label':'用户类型',
                              'name':'user-type'
                            },{
                              'label':'组织下所属人',
                              'name':'org-belong'
                            },{

                              'label':'组织负责人',
                              'name':'org-principal'
                            },
                            {
                              'label':'角色下所属人',
                              'name':'role-belong'
                            },{
                              'label':'岗位下所属人',
                              'name':'post-belong'
                            },{

                              'label':'用户组所属人',
                              'name':'group-belong'
                            }] "
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >

            <ibps-list v-if="data && data.length >0" class="ibps-pr-10">
              <ibps-list-item
                v-for="(d,index) in data"
                :key="index"
                @click.native="handleFlowClick({taskId:d.taskId})"
              >
                <ibps-list-item-meta>
                  <template slot="avatar">
                    <template v-if="d.remindTimes === 0">
                      <el-avatar :src="getPhoto(d.instCreatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ d.creator }}</el-avatar>
                    </template>
                    <template v-else>
                      <el-badge :value="d.remindTimes" :max="99" class="item">
                        <el-avatar :src="getPhoto(d.instCreatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ d.creator }}</el-avatar>
                      </el-badge>
                    </template>
                  </template>
                  <el-link slot="title" type="primary" :underline="false">{{ d.subject|removeHtmlTag }}</el-link>
                  <template slot="description">{{ d.createTime|dateFormat }}</template>
                </ibps-list-item-meta>
              </ibps-list-item>
            </ibps-list>
            <el-alert
              v-else
              :title="$t('common.noData')"
              :closable="false"
              type="warning"
            />
          </el-tab-pane>

        </el-tabs>
      </el-scrollbar>
    </div>
  </el-card>
</template>
