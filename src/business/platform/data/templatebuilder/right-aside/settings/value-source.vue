<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">值来源</div>
      <div class="panel-body" />
    </div>
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
    <!--过滤条件-->
    <column
      :template="template"
      :fields="fields"
      :default-value="filterConditionDefaultValue"
      :dataset-type="datasetType"
      title="过滤条件"
      prop="filter_conditions"
      width="80%"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <filter-condition :data="scope.data" :fields="fields" :dataset-type="datasetType" />
      </template>
    </column>

    <!--返回字段-->
    <column
      :template="template"
      :fields="fields"
      :dataset-type="datasetType"
      :default-value="resultDefaultValue"
      title="返回字段"
      prop="result_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <result-column :data="scope.data" :dataset-type="datasetType" />
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Column from '../components/column'
import QueryColumn from '../editors/query-column'
import FilterCondition from '../editors/filter-condition'
import SortColumn from '../editors/sort-column'
import ResultColumn from '../editors/result-column'
import ThirdpartySetting from '../components/thirdparty-setting'
import { queryDefaultValue, resultDefaultValue, filterConditionDefaultValue, sortDefaultValue } from '../constants/default-value'
import Utils from '../../utils'

export default {
  components: {
    Column,
    QueryColumn,
    FilterCondition,
    SortColumn,
    ResultColumn,
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
    }
  },
  data() {
    return {
      dialogRightsVisible: false,
      queryDefaultValue,
      filterConditionDefaultValue,
      sortDefaultValue,
      resultDefaultValue
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    fields() {
      return Utils.getAllFields(this.datasets)
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
    handleRights(key) {
      this.dialogRightsVisible = true
    },
    handleRightsConfirm(data) {

    }
  }
}
</script>
