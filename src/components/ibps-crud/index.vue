<template>
    <div class="container-component">
        <div ref="ibpsCrud" class="ibps-container-crud">
            <!-- 工具栏 -->
            <!-- 标题栏-->
            <div v-if="displayField && displayField!='N'&& displayField!='true'&& displayField!='Y'" class="jbd-title-cont">
                {{ displayField }}
            </div>
            <div
                v-if="toolbars || $slots.header"
                ref="ibpsCrudHeader"
                class="ibps-container-crud__header"
            >
                <div
                    v-if="toolbars"
                    :class="['ibps-toolbar--' +$ELEMENT.size]"
                    class="ibps-toolbar"
                >
                    <div
                        class="header"
                        style="overflow:scroll; height: 100%; background-color: #F9FFFF; border-bottom: 0px; border-top: 0px; overflow: hidden"
                    >
                        <!-- 换了位置 -->
                        <div
                            v-show="$utils.isNotEmpty(searchForm) && showToolbar"
                            ref="toolbarBox"
                            class="toolbar-box clear"
                            style="padding: 0px; border: 0px;"
                        >
                            <template v-if="$slots.searchForm" ref="searchForm">
                                <slot :loading="loading" name="searchForm" />
                            </template>
                            <template v-else>
                                <search-form
                                    v-if="searchForm"
                                    ref="searchForm"
                                    :forms="searchForm.forms||[]"
                                    size="mini"
                                    :fuzzy="searchForm.fuzzy"
                                    :inline="searchForm.inline"
                                    :label-width="searchForm.labelWidth"
                                    :item-width="searchForm.itemWidth"
                                    @search="handleActionEvent({key:'search'}, 'toolbar')"
                                >
                                    <template v-for="item in searchFormSlot" :slot="item.slotName">
                                        <slot :name="item.slotName" :item="item" />
                                    </template>

                                    <template v-if="searchFormSlot.length>0" slot="jbd-buttons">
                                        <ibps-toolbar
                                            :actions="toolbars"
                                            :socpe="thatSocpe"
                                            @action-event="handleActionEvent"
                                        />
                                    </template>
                                </search-form>
                            </template>
                        </div>
                        <!-- 按钮 -->
                        <div class="btns">
                            <div v-if="$slots.searchForm" class="buttons">
                                <ibps-toolbar
                                    :actions="toolbars"
                                    :socpe="thatSocpe"
                                    @action-event="handleActionEvent"
                                />
                            </div>
                            <div v-else-if="searchFormSlot.length<1" class="buttons">
                                <ibps-toolbar
                                    :actions="toolbars"
                                    :socpe="thatSocpe"
                                    @action-event="handleActionEvent"
                                />
                            </div>
                        </div>
                    </div>
                    <!-- 下拉隐藏-->
                    <!-- <div class="tools">
                        <slot name="rightTools" />
                        <el-button v-if="displayField" icon="ibps-icon-cog" class="ibps-crud__display-field" :underline="false" @click="displayFieldVisible=true">{{ $t('components.crud.displayField') }}</el-button>
                        <el-tooltip
                            v-if="$utils.isNotEmpty(searchForm)"
                            :content="showToolbar?$t('components.crud.collapse'):$t('components.crud.expand')"
                        >
                            <a class="expand" @click="handleCollapseExpandToolbar">
                                <i :class="showToolbar?'el-icon-caret-top':'el-icon-caret-bottom'" />
                            </a>
                        </el-tooltip>
                    </div> -->
                    <slot name="header" />
                </div>
            </div>

            <!--列表--><!--   @header-dragend="handleHeaderDragend" 拖拽事件取消 -->
            <el-table
                ref="elTable"
                v-loading="loading"
                class="elTable"
                v-bind="options"
                :row-key="pkKey"
                :data="ibpsData"
                :height="tableHeight"
                :header-cell-style="{color:'#000','font-size':'14px',padding:'6px 6px'}"
                :stripe="false"
                :row-class-name="tableRowClassName"
                @current-change="handleCurrentChange"
                @select="handleSelect"
                @select-all="handleSelectAll"
                @selection-change="handleSelectionChange"
                @sort-change="handleSortChange"
                @cell-mouse-enter="handleCellMouseEnter"
                @cell-mouse-leave="handleCellMouseLeave"
                @cell-click="handleCellClick"
                @cell-dblclick="handleCellDblclick"
                @row-click="handleRowClick"
                @row-contextmenu="handleRowContextmenu"
                @row-dblclick="handleRowDblclick"
                @header-click="handleHeaderClick"
                @header-dragend="handleHeaderDragend"
                @header-contextmenu="handleHeaderContextmenu"
            >
                <template slot="empty">
                    <slot v-if="$slots.empty" name="empty" />
                    <ibps-empty v-else />
                </template>
                <!--选择列 多选-->
                <el-table-column
                    v-if="(selectionRow || selectionRow === '') && selectionType === 'checkbox'"
                    v-bind="typeof selectionRow === 'Object'?selectionRow:null"
                    :label="handleAttribute(selectionRow.label, '')"
                    :reserve-selection="selectionRow.reserveSelectione||true"
                    type="selection"
                    show-overflow-tooltip
                />
                <!--选择列 单选-->
                <el-table-column
                    v-if="(selectionRow || selectionRow === '') && selectionType === 'radio'"
                    :label="selectionRow.label||''"
                    :width="selectionRow.width||55"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-radio v-model="selectionRadio" :label="getPkValue(scope.row)"><span>&nbsp;</span></el-radio>
                    </template>
                </el-table-column>

                <!-- 自定义表单名称-->
                <el-table-column
                    v-if="formName"
                    :width="180"
                    show-overflow-tooltip
                    label="表单名称"
                >
                    <template slot-scope="scope">
                        {{ formName }}
                    </template>
                </el-table-column>

                <!--索引列-->
                <el-table-column
                    v-if="indexRow || indexRow === ''"
                    v-bind="typeof indexRow === 'Object'?indexRow:null"
                    :label="handleAttribute(indexRow.label, $t('components.crud.index'))"
                    :width="60"
                    type="index"
                    :index="indexMethod"
                />
                <slot name="prepend-column" />
                <template v-for="(column, index) in tableColumns">
                    <el-table-column
                        v-if="showColumn(column)"
                        :key="index"
                        :prop="handleAttribute(column.prop, null)"
                        :label="handleAttribute(column.label, '')"
                        :width="handleAttribute(column.width,null)"
                        :min-width="handleAttribute(column.minWidth,null)"
                        :class-name="'vertical-' + handleAttribute(column.vertical, 'middle')"
                        v-bind="column"
                        show-overflow-tooltip
                    >
                        <template slot="header">
                            <slot :name="column.headerName" :column="column" />
                        </template>
                        <template slot-scope="scope">
                            <!--时间格式-->
                            <span v-if="column.dateFormat" class="ibps-table-column">
                                {{ scope.row[column.prop] | dateFormat(column.dateFormat,column.origDateFormat) }}
                            </span>
                            <!--通用过滤器-->
                            <span v-else-if="column.filter" class="ibps-table-column">
                                {{ handleColumnFilter(column.filter,scope.row[column.prop]) }}
                            </span>
                            <!-- 下拉组件-->
                            <span v-else-if="column.options" class="ibps-table-column">
                                <!--stringArray 字符串类型的数组,逗号分隔-->
                                <template v-if="column.dataType==='stringArray'">
                                    <span
                                        v-for="(value,i) in handleColumnDataConvert(scope.row[column.prop],column.separator)"
                                        :key="i"
                                    >
                                        {{ handleColumnOptions('label',column.options,value,column) }}<template v-if="handleColumnDataConvert(scope.row[column.prop],column.separator).length-1 !==i">,</template>
                                    </span>
                                </template>
                                <!--stringArray 字符串类型的数组-->
                                <template v-else-if="column.dataType==='objectList'">
                                    <span v-for="(value,j) in scope.row[column.prop]" :key="j">
                                        {{ value[column.tagLabel] }}
                                    </span>
                                </template>
                                <span v-else>{{ handleColumnOptions('label',column.options,scope.row[column.prop]) }}</span>

                            </span>
                            <!-- tags组件-->
                            <span v-else-if="column.tags" class="ibps-table-column">
                                <span v-if="$utils.isEmpty(scope.row[column.prop]) ">{{ column.defaultLabel||'' }}</span>
                                <!--stringArray 字符串类型的数组-->
                                <template v-else-if="column.dataType==='stringArray'">
                                    <el-tag
                                        v-for="(value,i) in handleColumnDataConvert(scope.row[column.prop],column.separator)"
                                        :key="i"
                                        :type="handleColumnOptions('type',column.tags,value,column)"
                                    >
                                        {{ handleColumnOptions('label',column.tags,value,column) }}
                                    </el-tag>
                                </template>
                                <!--stringArray 字符串类型的数组-->
                                <template v-else-if="column.dataType==='objectList'">
                                    <el-tag v-for="(value,j) in scope.row[column.prop]" :key="j">
                                        {{ value[column.tagLabel] }}
                                    </el-tag>
                                </template>
                                <template v-else>
                                    <el-tag :type="handleColumnOptions('type',column.tags,scope.row[column.prop],column)">{{ handleColumnOptions('label',column.tags,scope.row[column.prop],column) }}</el-tag>
                                </template>
                            </span>
                            <!-- link组件-->
                            <span v-else-if="column.link" class="ibps-table-column">
                                <el-link :type="column.type||'primary'" :underline="column.underline||false" @click="handleColumnLink(column,scope.row)">
                                    {{ scope.row[column.prop] |removeHtmlTag }}
                                </el-link>
                            </span>

                            <!-- 自定义slot组件############################################-->
                            <span v-else-if="column.slotName" class="ibps-table-column">
                                <slot :name="column.slotName" :row="scope.row" :value="scope.row[column.prop]" :column="column" :$index="scope.$index" />
                            </span>

                            <!--自定义组件-->
                            <render-custom-component
                                v-else-if="column.component && column.component.name"
                                v-model="scope.row[column.prop]"
                                :component-name="column.component.name"
                            />
                            <!--渲染组件-->
                            <render-component
                                v-else-if="column.component && column.component.render"
                                :render-function="column.component.render"
                                :scope="scope"
                            />
                            <template v-else>
                                {{ column.formatter ? column.formatter(scope.row, scope.column, _get(scope.row, column.prop), scope.$index) : _get(scope.row, column.prop) }}
                            </template>
                        </template>
                        <!--子列 -->
                        <template v-if="column.children">
                            <el-table-column
                                v-for="(column2, index2) in column.children"
                                :key="index2"
                                show-overflow-tooltip
                                :label="handleAttribute(column2.title, '')"
                                :prop="handleAttribute(column2.key, null)"
                                v-bind="column2"
                            >
                                <template slot-scope="scope">
                                    <!--过滤器-->
                                    <span v-if="column2.filter">
                                        {{ handleColumnFilter(column2.filter,scope.row[column2.prop]) }}
                                    </span>
                                    <!-- 下拉组件-->
                                    <span v-else-if="column2.options" class="table-column-options">
                                        <span>{{ handleColumnOptions('label',column2.options,scope.row[column2.prop]) }}</span>
                                    </span>
                                    <!-- tags组件-->
                                    <span v-else-if="column2.tags" class="table-column-tags">
                                        <el-tag :type="handleTags('type',column2.tags,scope.row[column2.prop])">{{ handleTags('label',column2.tags,scope.row[column2.prop]) }}</el-tag>
                                    </span>
                                    <!-- link组件-->
                                    <span v-else-if="column2.link">
                                        <a href="javascript:void(0)" class="table-column-link" @click="handleColumnLink(column2,scope.row)">{{ scope.row[column2.prop] }}</a>
                                    </span>
                                    <span v-else-if="column2.slotName">
                                        <slot :name="column2.slotName" :row="scope.row" :$index="scope.$index" />
                                    </span>
                                    <!--自定义组件-->
                                    <render-custom-component
                                        v-else-if="column2.component && column2.component.name"
                                        v-model="scope.row[column2.prop]"
                                        :component-name="column2.component.name"
                                    />
                                    <!--渲染组件-->
                                    <render-component
                                        v-else-if="column2.component && column2.component.render"
                                        :render-function="column2.component.render"
                                        :scope="scope"
                                    />
                                    <span v-if="contorlLength">
                                        <el-tooltip class="item" effect="dark" :content="column.formatter ? column.formatter(scope.row, scope.column, _get(scope.row, column.prop), scope.$index) : _get(scope.row, column.prop)" placement="bottom">
                                            <span>
                                                {{ column2.formatter ? column2.formatter(scope.row, scope.column2, _get(scope.row, column2.prop), scope.$index) : _get(scope.row, column2.prop)| ellipsis }}
                                            </span>
                                        </el-tooltip>
                                    </span>
                                    <template v-else>{{ column2.formatter ? column2.formatter(scope.row, scope.column2, _get(scope.row, column2.prop), scope.$index) : _get(scope.row, column2.prop) }}</template>
                                </template>
                            </el-table-column>
                            <!-- end 子列-->
                        </template>
                    </el-table-column>
                </template>
                <!--操作列begin-->
                <!--  $t('components.crud.manage')    handleAttribute(rowHandle.width, rowHandleDefaultWidth)     -->
                <el-table-column
                    v-if="rowHandle"
                    v-bind="rowHandle"
                    :label=" handleAttribute(rowHandle.columnHeader,'操作') "
                    :width="rowHandle.colWidth ? rowHandle.colWidth : (handleAttribute(rowHandle.width, rowHandleDefaultWidth) < 80 ? '80' : rowHandle.actions.length !== 0 && rowHandle.actions.length <= 3 ? 90 + 60 * (rowHandle.actions.length - 1) : 90 + 60 * 2)"
                    :fixed="handleAttribute(rowHandle.fixed, 'right')"
                    :align="handleAttribute(rowHandle.align, 'center')"
                >
                    <template v-slot:default="scope">
                        <slot name="selectCont" :row="scope.row" />
                        <template v-if="hasRowHandleActions(scope.row)">
                            <template v-if="rowHandle.effect ==='display'">
                                <ibps-toolbar
                                    :actions="rowHandleActions"
                                    :socpe="thatSocpe"
                                    :data="scope.row"
                                    position="manage"
                                    type="link"
                                    @action-event="handleActionEvent"
                                />
                                <template v-if="rowHandleMoreActions && rowHandleMoreActions.length === 1">
                                    <div class="el-divider el-divider--vertical" />
                                    <ibps-toolbar
                                        :actions="rowHandleMoreActions"
                                        :socpe="thatSocpe"
                                        :data="scope.row"
                                        position="manage"
                                        type="link"
                                        @action-event="handleActionEvent"
                                    />
                                </template>
                                <template v-if="rowHandleMoreActions && rowHandleMoreActions.length > 1">
                                    <div class="el-divider el-divider--vertical" />
                                    <el-dropdown placement="top">
                                        <!-- <i class="el-icon-caret-bottom el-dropdown-link" style="font-size:14px;">更多</i> -->
                                        <i class="ibps-icon ibps-icon-chevron-down" style="font-size:12px; color: #409eff; cursor: pointer;"> 更多</i>
                                        <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
                                            <ibps-toolbar
                                                :actions="rowHandleMoreActions"
                                                :socpe="thatSocpe"
                                                :data="scope.row"
                                                position="manage"
                                                type="linkHide"
                                                @action-event="handleActionEvent"
                                            />
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </template>
                            <!-- 下拉-->
                            <template v-else>
                                <el-dropdown>
                                    <i class="ibps-icon ibps-icon-chevron-circle-down" style="font-size:24px;" />
                                    <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
                                        <ibps-toolbar
                                            :actions="rowHandleActions"
                                            :socpe="thatSocpe"
                                            :data="scope.row"
                                            position="manage"
                                            @action-event="handleActionEvent"
                                        />
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <span>&nbsp;</span>
                            </template>
                        </template>
                    </template>
                </el-table-column>
            <!--操作列end-->
            </el-table>
            <!--分页 或底部 自定义底部-->
            <div
                v-if="isShowPagination"
                ref="ibpsCrudFooter"
                class="ibps-container-crud__footer"
            >
                <template v-if="$slots.footer">
                    <slot name="footer" />
                </template>
                <el-pagination
                    v-else
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :page-count="pagination[pageCountKey]"
                    :total="pagination[totalKey]"
                    v-bind="paginationOptions"
                    @size-change="handlePaginationSizeChange"
                    @current-change="handlePaginationCurrentChange"
                    @prev-click="handlePaginationPrevClick"
                    @next-click="handlePaginationNextClick"
                >
                    <template>
                        <span class="el-pagination__total">{{ pageInfo }}</span>
                    </template>
                </el-pagination>
            </div>
        </div>
        <!--显示字段-->
        <display-field-dialog
            :visible="displayFieldVisible"
            :fields="columns"
            :data="displayFields"
            @callback="handleDisplayField"
            @close="visible => displayFieldVisible = visible"
        />
    </div>
</template>

<script>
import base from './mixin/base'
import handleRow from './mixin/handleRow'
import data from './mixin/data'
import search from './mixin/search'
import column from './mixin/column'
import pagination from './mixin/pagination'
import displayField from './mixin/displayField'
import utils from './mixin/utils'

import RenderComponent from './components/render-component.vue'
import RenderCustomComponent from './components/render-custom-component.vue'
import SearchForm from './components/search-form'
import DisplayFieldDialog from './components/display-field'

export default {
    name: 'ibps-crud',
    filters: { // 定义过滤器
        ellipsis (value) {
            if (!value) return ''
            if (value.length > 7) {
                return value.slice(0, 7) + '..'
            }
            return value
        }
    },
    components: {
        RenderComponent,
        RenderCustomComponent,
        SearchForm,
        DisplayFieldDialog
    },
    mixins: [
        base,
        data,
        search,
        column,
        handleRow,
        pagination,
        displayField,
        utils
    ],
    props: ['contorlLength'],
    updated () {
        this.changeBtnPosition()
    },
    methods: {
        // 将模版对话框中的按钮调整至form表单内 紧跟input后面
        changeBtnPosition () {
            const form = document.querySelectorAll('div[template-type-name="ibps-data-template-list"] .ibps-container-crud__header .ibps-crud-search-form')
            const btns = document.querySelectorAll('div[template-type-name="ibps-data-template-list"] .ibps-container-crud__header .btns')
            const size = form.length === btns.length ? form.length : 0
            for (let i = 0; i < size; i++) {
                form[i].append(btns[i])
            }
        }
    }
}
</script>
<style>
    .el-table th{
        background-color: #84d5cf !important;
        font-size: 12px  !important;
        color: #000000;
        border: 0px;
    }
    .jbd-title-cont{
        text-align: center;
        font-weight: bold;
        background-color: rgb(249, 255, 255);
        width: 100%;
        font-size: 18px;
        padding-top:6px;
    }
    .el-table .caret-wrapper{
        top: -5px;
        position: absolute;
    }
    .el-table .sort-caret.ascending{
        border-bottom-color: #909399;
    }
    .el-table .sort-caret.descending{
        border-top-color: #909399;
    }
    .el-table td{
        padding: 4px 0 !important;
        color: #000000;
        font-size: 12px  !important;
    }
    .el-table .warning-row {
        background: #e0f0ee;
        color: #000000;
    }

    .el-table .success-row {
        background: #F9FFFF;
        color: #000000;
    }
    .el-table .el-table-column--selection {
        text-align: center;
    }
    .el-table .vertical-top {
        vertical-align: top;
    }
    .el-table .vertical-middle {
        vertical-align: middle;
    }
    .el-table .vertical-bottom {
        vertical-align: bottom;
    }
    .ibps-crud-search-form{
        display: flex;
        flex-wrap: wrap;
    }
    /* 表单组件渲染时计算表单高度受转换元素影响（附件、人员、部门等） */
    .elTable .el-table__body-wrapper{
        overflow-y: auto;
    }
</style>
