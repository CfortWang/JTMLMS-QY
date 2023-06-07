<template>
  <div>
    <!--列表属性-->
    <attr-list
      :data="template"
      @input="handleAttrs"
    />
    <!--第三方接口数据处理-->
    <thirdparty-setting
      v-if="datasetType==='thirdparty'"
      :data="template"
      @input="handleAttrs"
    />
    <!--查询字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="queryDefaultValue"
      :dataset-type="datasetType"
      title="查询字段"
      prop="query_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <query-column
          :data="scope.data"
          :fields="fields"
          :dataset-type="datasetType"
        />
      </template>
    </column>
    <!--显示字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="displayDefaultValue"
      :dataset-type="datasetType"
      title="显示字段"
      prop="display_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <display-column
          :data="scope.data"
          :fields="fields"
          :dataset-type="datasetType"
        />
      </template>
    </column>
    <!--过滤条件-->
    <column
      :template="template"
      :fields="fields"
      :default-value="filterConditionDefaultValue"
      title="过滤条件"
      prop="filter_conditions"
      width="80%"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <filter-condition :data="scope.data" :fields="fields" />
      </template>
    </column>
    <!--排序字段-->
    <column
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
    </column>
    <!--返回字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="resultDefaultValue"
      :dataset-type="datasetType"
      title="返回字段"
      prop="result_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <result-column :data="scope.data" :dataset-type="datasetType" />
      </template>
    </column>
    <!--列表-功能按钮-->
    <button-template
      :template="buttons"
      :data="template"
      :types="functionListButtonTypes"
      :default-value="fucntionButtonDefaultValue"
      title="列表-功能按钮"
      call-module="list"
      prop="function_buttons"
      @input="handleButtons"
      @callbackField="handleAttrs"
    >
      <template slot="edit" slot-scope="scope">
        <editor-button
          :data="scope.data"
          :template="template"
          :form-key="formKey"
          type="function"
          @callback="handleAttrs"
        />
      </template>
    </button-template>
    <!--编辑页-功能按钮-->
    <button-template
      :template="buttons"
      :types="editButtonTypes"
      title="编辑页-功能按钮"
      call-module="list"
      prop="edit_buttons"
      @input="handleButtons"
    >
      <template slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" :form-key="formKey" type="edit" />
      </template>
    </button-template>
    <!-- 扩展属性 -->
    <ext-attrs
      :data="template"
      :fields="fields"
      @input="handleAttrs"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AttrList from '../components/attr-list'
import Column from '../components/column'
import ButtonTemplate from '../components/button'
import QueryColumn from '../editors/query-column'
import DisplayColumn from '../editors/display-column'
import FilterCondition from '../editors/filter-condition'
import SortColumn from '../editors/sort-column'
import ResultColumn from '../editors/result-column'
import EditorButton from '../editors/editor-button'
import ExtAttrs from '../components/ext-attrs'
import ThirdpartySetting from '../components/thirdparty-setting'

import { queryDefaultValue, displayDefaultValue, resultDefaultValue, filterConditionDefaultValue, sortDefaultValue,
  fucntionButtonDefaultValue, functionListButtonTypes, editButtonTypes } from '../constants/default-value'
import Utils from '../../utils'

export default {
  components: {
    AttrList,
    Column,
    ButtonTemplate,
    QueryColumn,
    DisplayColumn,
    FilterCondition,
    SortColumn,
    ResultColumn,
    EditorButton,
    ExtAttrs,
    ThirdpartySetting
  },
  props: {
    template: { // 模版
      type: [Object, Array],
      default: () => {}
    },
    datasetType: {
      type: String,
      default: 'table'
    },
    formKey: String
  },
  data() {
    return {
      dialogRightsVisible: false,
      queryDefaultValue,
      displayDefaultValue,
      resultDefaultValue,
      filterConditionDefaultValue,
      sortDefaultValue,
      fucntionButtonDefaultValue,
      functionListButtonTypes,
      editButtonTypes
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
      //, queryColumns: state => state.ibps.dataTemplate.queryColumns
    }),
    // queryColumns() {
    //   return Utils.getAllFields(this.queryColumns)
    // },
    fields() {
      return Utils.getAllFields(this.datasets)
    },
    buttons() {
      return this.template.buttons || {}
    }
  },
  methods: {
    handleAttrs(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      if (this.$utils.isEmpty(curTemplate.attrs)) {
        curTemplate.attrs = {}
      }
      if (key === 'export_columns') {
        curTemplate.export_columns = data
      } else {
        curTemplate.attrs[key] = data
      }
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
