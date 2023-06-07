<template>
  <ibps-container v-loading="loading" type="full" class="ibps-card-list-container">
    <!-- 分页和查询-->
    <div slot="header" class="ibps-card-list__header">
       <div
        v-if="toolbars || $slots.header"
        ref="ibpsCrudHeader"
        class="ibps-container-crud__header"
      >
        <div
            v-if="toolbars"
            :class="['ibps-toolbar--' +$ELEMENT.size]"
            class="ibps-toolbar person-office-head"
          >
          <div class="header">
              <div class="buttons">
                <ibps-toolbar
                  :actions="toolbars"
                  :socpe="thatSocpe"
                  @action-event="handleActionEvent"
                />
              </div>
              <div class="tools">
                <el-pagination
                  v-bind="paginationOptions"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  :page-count="pagination[pageCountKey]||3"
                  :total="pagination[totalKey]"
                  :small="handleAttribute(paginationOptions.small, true)"
                  @size-change="handlePaginationSizeChange"
                  @current-change="handlePaginationCurrentChange"
                  @prev-click="handlePaginationPrevClick"
                  @next-click="handlePaginationNextClick"
                >
                </el-pagination>
              </div>
          </div>
          <div
                v-show="$utils.isNotEmpty(searchForm) && showToolbar"
                ref="toolbarBox"
                class="toolbar-box clear"
              >
                <template v-if="$slots.searchForm" ref="searchForm">
                  <slot :loading="loading" name="searchForm" />
                </template>
                <template v-else>
                  <search-form
                    v-if="searchForm"
                    ref="searchForm"
                    :forms="searchForm.forms||[]"
                    :size="searchForm.size"
                    :fuzzy="searchForm.fuzzy"
                    :inline="searchForm.inline"
                    :label-width="searchForm.labelWidth"
                    :item-width="searchForm.itemWidth"
                    @search="handleActionEvent({key:'search'}, 'toolbar')"
                  >
                    <template v-for="item in searchFormSlot" :slot="item.slotName">
                      <slot :name="item.slotName" :item="item" />
                    </template>
                  </search-form>
                </template>
              </div>
              <slot name="header" />
          </div>
        </div>
    </div>
    <ibps-layout ref="layout">
      <div>
        <!--添加-->
        <!-- <div   v-if="key === 'add'"
          class=" ibps-card ibps-card-create"
          @click="handleActionEvent({key:'add'},'toolbar')"
        >
          <i class="el-icon-plus" />
          <span>{{ createText }}</span>
        </div> -->
         <div  style="display:none;">
          <i class="el-icon-plus" />
          <span>{{ createText }}</span>
        </div>
        <!--列表-->
        <ul class="ibps-card-list ibps-card-list--picture-card">
          <!-- eslint-disable-next-line -->
          <li  v-for="(data,index) in ibpsData"
            :key="data[pkKey]"
            :class="{
              'checked':selections?selections.indexOf(data[pkKey]) >-1:false
            }"
            class="ibps-card-list__item"
            @click="handleActionEvent({key:'edit'}, 'manage',data)"
          >
            <a class="ibps-card-list__item-title el-tooltip"   v-html="(data[columns[0].prop]).replace(/\s/g,'<br/>')">

              <!-- <label class="ibps-card-list__item-status-label">
                <i class="el-icon-check checked-status" />
              </label> -->
            </a>

            <div class="ibps-card-list__item-symbol">
              <slot :data="data" name="item-symbol">
                <i class="symbol-icon ibps-icon-table" />
              </slot>
            </div>
            <slot :data="data" name="item-left" />
            <div class="ibps-card-list__item-detail-name">
              <slot :data="data"  name="item-detail-name">
                <span>{{ data.name }}</span>  <!-- 节点名称 -->
              </slot>
            </div>
             <div class="ibps-card-list__item-detail-partyTypeName">
              <slot :data="data"  name="item-detail-partyTypeName">
                <span>所属人：{{ data.partyTypeName }}</span>  <!-- 所属人：所属人 -->
              </slot>
            </div>
            <div class="ibps-card-list__item-detail-taskName">
              <slot  :data="data" name="item-detail-taskName">
                 <span>{{ data.taskName }}</span>   <!-- 任务名称 -->
              </slot>
            </div>
            <div class="ibps-card-list__item-detail-completeTime">
              <slot  :data="data" name="item-detail-completeTime">
                 <span>{{ data.completeTime }}</span>   <!-- 处理时间 -->
              </slot>
            </div>
             <div class="ibps-card-list__item-detail-curNode">
              <slot  :data="data" name="item-detail-curNode">
                 <span>{{ data.curNode }}</span>   <!-- 参与的任务  节点 -->
              </slot>
            </div>
            <div class="ibps-card-list__item-detail-status">  <!-- 申请：我启动的  状态 -->
              <slot  :data="data" name="item-detail-status">
                 <span>{{ data.status }}</span>
              </slot>
            </div>
            <div class="ibps-card-list__item-detail-createTime">
              <slot  :data="data" name="item-detail-createTime">
                 <span>{{ data.createTime }}</span>   <!-- 创建时间 -->  <!-- 参与的任务 时间  -->  <!-- 办结的事务 时间  -->  <!-- 申请：我启动的   时间 --><!-- 申请：我结束的  时间 -->
              </slot>
            </div>
            <!-- <div class="ibps-card-list__item-action" @click.stop="void 0">
              <el-dropdown
                v-if="rowHandleActions"
                @command="(action)=> { handleActionEvent(action,'manage',data,index) }"
              >
                <i class="ibps-icon-cog" />
                <el-dropdown-menu slot="dropdown">
                  <template v-for="action in rowHandle.actions">
                    <el-dropdown-item
                      :key="action.key"
                      :command="action"
                      :icon="action.icon"
                      :divided="action.divided"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                  </template>

                </el-dropdown-menu>
              </el-dropdown>
            </div> -->
          </li>

        </ul>
      </div>
      <template v-if="$slots.east" slot="east" ref="east">
        <slot name="east" />
      </template>
    </ibps-layout>
  </ibps-container>
</template>
<script>
import IbpsToolbar from '../ibps-toolbar/index.vue'
import base from './mixin/base'
import search from './mixin/search2'
import handleRow from './mixin/handleRow'
import data from './mixin/data'
import column from './mixin/column'
import pagination from './mixin/pagination'
import utils from './mixin/utils'
import SearchForm from './components/search-form'

export default {
  components: {
    IbpsToolbar, SearchForm
  },
  mixins: [
    base,
    search,
    data,
    column,
    handleRow,
    pagination,
    utils
  ],
  methods:{
      keepTextStyle(val){
        return  (val + '').replace(/\s/g,"<br/>");
    }
  }
}
</script>
<style  scoped>
.ibps-card-list__item{text-align: center;}
.ibps-card-list-container >>> .ibps-container-full__header{padding: 0px!important;}
.ibps-card-list__item >>> .ibps-card-list__item-symbol{top: 35px!important;left:53px!important;}
</style>
<style>
.person-office-head .header{padding: 5px 0px;height: 35px;}
.person-office-head .tools{display: inline-block;}
.person-office-head .el-button--small{color: #fff;font-size: 12px;padding: 9px 15px;border-radius: 3px;background-color: #409eff;border-color: #409eff;}
.person-office-head .el-button--small  span{height: 32px;line-height: 16px;min-width: 0;}
.ibps-card-list__item-detail-name,.ibps-card-list__item-detail-partyTypeName,.ibps-card-list__item-detail-createTime,
.ibps-card-list__item-detail-taskName,.ibps-card-list__item-detail-completeTime,.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-curNode,
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-status{
    font-size: 12px;
    height: 21px;
    width: 130px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-name{
    position: absolute;
    bottom:20px;
    left: 18px;
    }
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-partyTypeName{
    position: absolute;
    bottom: 2px;
    left: 18px;
   }
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-createTime{
    position: absolute;
    bottom: 2px;
    left: 18px;
   }
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-taskName{
    position: absolute;
    font-size: 12px;
    bottom: 20px;
    left: 18px;
   }
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-completeTime{
   position: absolute;
    bottom: 2px;
    left: 18px;
   }
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-curNode{
   position: absolute;
    bottom: 20px;
    left: 18px;
   }
.ibps-card-list-container .ibps-card-list--picture-card .ibps-card-list__item-detail-status{
   position: absolute;
    bottom: 20px;
    left: 18px;
   }
</style>
