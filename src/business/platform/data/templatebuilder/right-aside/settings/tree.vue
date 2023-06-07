<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">树形</div>
      <div class="panel-body">
        <el-form
          size="mini"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item>
            <template slot="label">初始化是否展开</template>
            <el-switch
              v-model="attrs.expand"
              active-value="Y"
              inactive-value="N"
              @change="(data)=>handleAttrs('expand',data)"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--查询字段-->
    <!-- <column
      :template="template"
      :fields="fields"
      :default-value="queryDefaultValue"
      title="查询字段"
      prop="query_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <query-column :data="scope"/>
      </div>
    </column> -->
    <!--显示字段-->
    <!-- <column-tree
      :template="template"
      :fields="fields"
      :default-value="displayDefaultValue"
      title="显示字段"
      prop="display_columns"
      @input="handleColumns"
    /> -->
    <!-- 树形显示字段 -->
    <tree-display-column
      :data.sync="displayColumns"
      :fields="fields"
    />
    <!--过滤条件-->
    <!-- <column
      :template="template"
      :fields="fields"
      :default-value="filterConditionDefaultValue"
      title="过滤条件"
      prop="filter_conditions"
      width="80%"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <filter-condition :data="scope.data" :fields="fields" />
      </div>
    </column> -->
    <!--排序字段-->
    <!-- <column
      :template="template"
      :fields="fields"
      :dataset-type="datasetType"
      :default-value="sortDefaultValue"
      title="排序字段"
      prop="sort_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <sort-column
          :data="scope.data"
          :fields="fields"
          :dataset-type="datasetType"
        />
      </template>
    </column> -->

    <!--返回字段-->
    <column
      v-if="dataTemplateType!=='default'"
      :template="template"
      :fields="fields"
      :default-value="resultDefaultValue"
      title="返回字段"
      prop="result_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <result-column :data="scope.data" />
      </div>
    </column>
    <!--树形-功能按钮-->
    <button-template
      :template="buttons"
      :types="functionTreeButtonTypes"
      :default-value="fucntionButtonDefaultValue"
      title="树形-功能按钮"
      call-module="tree"
      prop="function_buttons"
      @input="handleButtons"
    >
      <div slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="function" />
      </div>
    </button-template>

    <!--树形-右键菜单-->
    <button-template
      :template="buttons"
      :types="contextmenuButtonTypes"
      :default-value="fucntionButtonDefaultValue"
      title="树形-右键菜单"
      call-module="tree"
      prop="contextmenu_buttons"
      @input="handleButtons"
    >
      <div slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="function" />
      </div>
    </button-template>
    <!--编辑页-功能按钮-->
    <button-template
      :template="buttons"
      :types="editButtonTypes"
      title="编辑页-功能按钮"
      call-module="tree-edit"
      prop="edit_buttons"
      @input="handleButtons"
    >
      <template slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" :form-key="formKey" type="edit" />
      </template>
    </button-template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Column from '../components/column'
// import ColumnTree from '../components/column-tree'
import TreeDisplayColumn from '../components/tree-display-column'
import ButtonTemplate from '../components/button'
// import QueryColumn from '../editors/query-column'
// import FilterCondition from '../editors/filter-condition'
// import SortColumn from '../editors/sort-column'
import ResultColumn from '../editors/result-column'
import EditorButton from '../editors/editor-button'
import { queryDefaultValue, displayTreeDefaultValue, resultDefaultValue, sortDefaultValue,
  filterConditionDefaultValue, fucntionButtonDefaultValue, functionTreeButtonTypes,
  contextmenuButtonTypes, editButtonTypes } from '../constants/default-value'
import Utils from '../../utils'

export default {
  components: {
    Column,
    // ColumnTree,
    TreeDisplayColumn,
    ButtonTemplate,
    // QueryColumn,
    // FilterCondition,
    // SortColumn,
    ResultColumn,
    EditorButton
  },
  props: {
    datasetType: {
      type: String,
      default: 'table'
    },
    dataTemplateType: {
      type: String,
      default: 'default'
    },
    formKey: String,
    template: { // 模版
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      dialogRightsVisible: false,
      queryDefaultValue,
      displayTreeDefaultValue,
      resultDefaultValue,
      filterConditionDefaultValue,
      sortDefaultValue,
      fucntionButtonDefaultValue,
      functionTreeButtonTypes,
      contextmenuButtonTypes,
      editButtonTypes
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    fields() {
      return Utils.getAllFields(this.datasets)
    },
    attrs: {
      get() {
        return this.template.attrs || {}
      },
      set(value) {
      }
    },
    buttons() {
      return this.template.buttons || {}
    },
    displayColumns: {
      get() {
        return this.$utils.isNotEmpty(this.template.display_columns) ? this.template.display_columns : {}
      },
      set(val) {
        this.template.display_columns = val
        this.handleColumns('display_columns', val)
      }
    }
  },
  methods: {
    handleAttrs(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      if (this.$utils.isEmpty(curTemplate.attrs)) {
        curTemplate.attrs = {}
      }
      curTemplate.attrs[key] = data
      this.$emit('update', curTemplate)
    },
    handleColumns(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      curTemplate[key] = data
      this.$emit('update', curTemplate)
    },
    handleButtons(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      if (!curTemplate.buttons) {
        curTemplate.buttons = {}
      }
      curTemplate.buttons[key] = data
      this.$emit('update', curTemplate)
    },
    handleRights(key) {
      this.dialogRightsVisible = true
    }
  }
}
</script>
