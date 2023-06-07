<template>

  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <ibps-icon name="commenting" />
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        style="height: 100%;width:100%;"
        wrap-class="ibps-scrollbar-wrapper"
      >
        <ibps-marquee v-if="data && data.length >0" :data="data">
          <ibps-list class="ibps-pr-10">
            <ibps-list-item
              v-for="(d,index) in data"
              :key="index"
              @click.native="handleApprove(d.id)"
            >
              <ibps-list-item-meta>
                <div slot="avatar"><ibps-icon name="bolt" style="color:#5cb85c;margin: 5px 0 0 5px;" /></div>
                <el-link slot="title" type="primary" :underline="false">{{ d.title }}</el-link>
              </ibps-list-item-meta>
              <div slot="extra">
                <ibps-icon name="dot-circle-o" style="color:#36c6d3" />{{ d.userName }}
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
