<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        style="height: 100%;width:100%;"
        wrap-class="ibps-scrollbar-wrapper"
      >
        <ibps-list v-if="data && data.length >0" class="ibps-pr-10">
          <ibps-list-item
            v-for="(d,index) in data"
            :key="index"
            @click.native="handleFlowClick({instanceId:d.procInstId})"
          >
            <ibps-list-item-meta>
              <el-avatar slot="avatar" :src="getPhoto(d.creatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ d.creator }}</el-avatar>
              <el-link slot="title" type="primary" :underline="false">{{ d.subject|removeHtmlTag }}</el-link>
              <template slot="description">{{ d.createTime|dateFormat }}</template>
            </ibps-list-item-meta>
            <div slot="extra">
              <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
              {{ d.status | filterStatus('already') }}
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
