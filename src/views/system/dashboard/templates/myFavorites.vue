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
            @click.native="handleFlowClick({defId:d.id})"
          >
            <ibps-list-item-meta>
              <el-link slot="title" type="primary" :underline="false">{{ d.name|removeHtmlTag }}</el-link>
            </ibps-list-item-meta>
            <div slot="extra">
              <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
              {{ d.status | filterStatus('favorites') }}
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
