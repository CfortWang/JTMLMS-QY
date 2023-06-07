<template>
  <div>
    <el-table
      ref="table"
      :data="list"
      :tree-props="{children: props.childrenKey,hasChildren: 'hasChildren'}"
      row-key="id"
      default-expand-all
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="参数名" width="250">
        <template slot-scope="scope">
          <el-input
            v-if="!readonly"
            v-model="scope.row.name"
            :style="{'width':(230-(14*parseInt(scope.row.level) +30)) +'px'}"
            :disabled="scope.row.isAry || scope.row.level === 1"
            placeholder="参数名"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="必填" width="80">
        <template slot-scope="scope">
          <el-tooltip v-if="!readonly" effect="dark" content="是否必填" placement="top">
            <el-checkbox v-model="scope.row.isRequire" true-label="Y" false-label="N" :disabled="scope.row.isAry" />
          </el-tooltip>
          <span v-else>{{ scope.row.isRequire|optionsFilter(defaultOptions,'label') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" width="120">
        <template slot-scope="scope">
          <el-select v-if="!readonly" v-model="scope.row.dataType" placeholder="数据类型" @change="changeDataType(scope)">
            <el-option
              v-for="option in jsonDataTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <span v-else>{{ scope.row.dataType|optionsFilter(jsonDataTypeOptions,'label') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type==='bind'" label="绑定数据" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.bindType" multiple placeholder="请绑定类型" @change="changeBindType(scope)">
            <el-option
              v-for="option in bindTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="参考值">
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row.testValue" placeholder="参考值" />
          <span v-else>{{ scope.row.testValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值/表达式">
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row.defaultValue" placeholder="值/表达式" />
          <span v-else>{{ scope.row.defaultValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <template v-if="type==='bind'">
            <el-input v-model="scope.row.desc" placeholder="描述" type="textarea" :autosize="{minRows:1}" />
          </template>
          <template v-else>
            <el-input v-if="!readonly" v-model="scope.row.desc" placeholder="描述" type="textarea" :autosize="{minRows:1}" />
            <span v-else>{{ scope.row.desc }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="!readonly" width="80" label="操作">
        <template slot-scope="scope">
          <el-tooltip
            v-if="!scope.row.isAry && scope.row.level !==1 "
            content="移除"
            effect="dark"
            placement="top"
          >
            <el-link
              :underline="false"
              type="danger"
              icon="ibps-icon-delete"
              @click="removeRow(scope)"
            />
          </el-tooltip>
          <!---添加IBPS请求格式--->
          <el-tooltip
            v-if="scope.row.level ===1 "
            content="清空格式"
            effect="dark"
            placement="top"
          >
            <el-link
              :underline="false"
              type="danger"
              icon="ibps-icon-delete"
              @click="clearData(scope)"
            />
          </el-tooltip>
          <!---添加IBPS请求格式--->
          <el-tooltip
            v-if="scope.row.dataType ==='object' && scope.row.level ===1 "
            content="添加IBPS格式"
            effect="dark"
            placement="top"
          >
            <el-link
              :underline="false"
              type="primary"
              icon="ibps-icon-link"
              @click="addIbpsData(scope)"
            />
          </el-tooltip>
          <!---添加--->
          <!--添加儿子节点-->
          <template v-if="scope.row.dataType ==='object'">
            <el-tooltip
              v-if="(scope.row.level === 1 ||scope.row.isAry) && scope.row.dataType ==='object'"
              content="添加子节点"
              effect="dark"
              placement="top"
            >
              <el-link :underline="false" type="primary" icon="ibps-icon-add" @click="addSubRow(scope)" />
            </el-tooltip>
            <el-dropdown
              v-else
              @command="(command)=>{handleAddCommand(command,scope)}"
            >
              <el-tooltip
                :content="'添加子节点/兄弟节点'"
                effect="dark"
                placement="top"
              >
                <el-link :underline="false" type="primary" icon="ibps-icon-add" />
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sibling">兄弟节点</el-dropdown-item>
                <el-dropdown-item command="sub">子节点</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else-if="!scope.row.isAry &&scope.row.dataType !=='object'">
            <el-tooltip
              content="添加兄弟节点"
              effect="dark"
              placement="top"
            >
              <el-link :underline="false" type="primary" icon="ibps-icon-add" @click="addSiblingRow(scope)" />
            </el-tooltip>
          </template>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { defaultOptions, jsonDataTypeOptions, typeOptions, bindRequestTypeOptions, bindResponseTypeOptions, ibpsResponseOptions, ibpsRequestOptions } from '../constants'

export default {
  props: {
    data: Array,
    requestType: {
      type: String,
      default: 'request'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      props: {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      },
      list: [],
      defaultOptions,
      jsonDataTypeOptions,
      typeOptions,
      ibpsResponseOptions,
      ibpsRequestOptions
    }
  },
  computed: {
    hasBindType() {
      return this.type === 'bind'
    },
    bindTypeOptions() {
      if (this.requestType === 'request') {
        return bindRequestTypeOptions
      } else {
        return bindResponseTypeOptions
      }
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(val)) {
          this.list = []
          this.list.push(this.getDefaultData('root', true))
        } else {
          this.list = val
        }
      },
      immediate: true
    },
    list: {
      handler(val, oldVal) {
        this.$emit('update:data', val)
      },
      deep: true
    }
  },
  methods: {
    getDefaultData(name, isRoot) {
      const data = {
        'id': this.$utils.guid(),
        'name': name,
        'dataType': isRoot ? 'object' : 'string',
        'bindType': '',
        'isRequire': 'Y',
        'testValue': '',
        'defaultValue': '',
        'level': 1,
        'desc': ''
      }
      return data
    },

    handleAddCommand(command, scope) {
      if (command === 'sub') {
        this.addSubRow(scope)
      } else {
        this.addSiblingRow(scope)
      }
    },
    addSiblingRow({ row, $index }) {
      const curData = this.getCurData(row.id)
      this.addRow(curData.parentId, $index)
    },
    addSubRow({ row, $index }) {
      this.addRow(row.id, $index)
    },
    clearData({ row, $index }) {
      this.list = []
    },
    addIbpsData({ row, $index }) {
      if (this.requestType === 'request') {
        // IBPS请求格式设置
        this.list = JSON.parse(JSON.stringify(ibpsRequestOptions))
      } else if (this.requestType === 'response') {
        // IBPS响应格式设置
        this.list = JSON.parse(JSON.stringify(ibpsResponseOptions))
      }
    },
    addRow(parentId, $index, $data) {
      const data = $data || this.getDefaultData('')
      const traverse = (list) => {
        list.forEach(item => {
          if (item.id === parentId) {
            if (!item[this.props.childrenKey]) {
              item[this.props.childrenKey] = []
            }
            data.level = item.level + 1
            data.parentId = parentId
            item[this.props.childrenKey].push(data)
          }
          if (item[this.props.childrenKey] && item[this.props.childrenKey].length > 0) {
            return traverse(item[this.props.childrenKey])
          } else {
            return item
          }
        })
        return list
      }
      const treeData = JSON.parse(JSON.stringify(this.list))
      this.list = traverse(treeData)
    },
    removeRow({ row, $index }) {
      const parentId = row.parentId
      const parenData = this.getCurData(parentId)
      const children = parenData[this.props.childrenKey] || []
      const index = children.findIndex(d => d.id === row.id)

      const traverse = (list) => {
        list.forEach(item => {
          if (item.id === parentId) {
            item[this.props.childrenKey].splice(index, 1)
          }
          if (item[this.props.childrenKey] && item[this.props.childrenKey].length > 0) {
            return traverse(item[this.props.childrenKey])
          } else {
            return item
          }
        })
        return list
      }
      const treeData = JSON.parse(JSON.stringify(this.list))
      this.list = traverse(treeData)
    },
    getCurData(id) {
      let node = JSON.parse(JSON.stringify(this.list))
      let flag = false
      while (!flag) {
        const item = node.shift()
        if (item.id === id) {
          flag = true
          return item
        }
        if (item[this.props.childrenKey] && item[this.props.childrenKey].length > 0) {
          node = node.concat(item[this.props.childrenKey])
        }
      }
    },
    changeDataType({ row, $index }) {
      // 把儿子设置为空
      row[this.props.childrenKey] = []
      // 如果是数组添加一个属性
      if (row.dataType === 'array') {
        const data = this.getDefaultData('items')
        data.level = row.level + 1
        data.isRequire = 'N'
        data.isAry = true
        row[this.props.childrenKey].push(data)
      }
      this.list = JSON.parse(JSON.stringify(this.list))
    },
    changeBindType({ row, $index }) {
    }
  }
}
</script>
