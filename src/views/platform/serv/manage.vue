<template>
  <ibps-layout ref="layout">
    <!--  -->
    <div slot="west">
      <ibps-tree
        :width="width"
        :height="height"
        :data="treeData"
        :options="treeOptions"
        :contextmenus="treeContextmenus"
        title="服务管理"
        @action-event="handleTreeAction"
        @node-click="(data) =>{ handleNodeClick(data)}"
        @expand-collapse="handleExpandCollapse"
      />
    </div>

    <ibps-container
      :margin-left="width+'px'"
      class="page"
    >
      <edit
        :id="editId"
        ref="editForm"
        :button-visible="!readonly"
        :visible="formVisible"
        :testvisible="testVisible"
        :readonly="readonly"
        :random-num="randomNum"
        :parent-id="nodeData.id"
        @callback="loadTreeData"
        @close="visible => formVisible = visible"
      />

      <event-list
        :id="editId"
        :visible="eventVisible"
        :event-type="eventType"
        :event-type-label="eventType|optionsFilter(eventTypeOptions,'label')"
        :readonly="readonly"
        display-type="edit"
        @callback="loadTreeData"
        @close="visible => eventVisible = visible"
      />

      <el-alert
        v-show="!formVisible && !testVisible && !eventVisible"
        :closable="false"
        title="请选择左边菜单右键进行操作！"
        type="warning"
        show-icon
        style="height:50px;"
      />
    </ibps-container>

  </ibps-layout>
</template>
<script>
import { findTreeData, remove } from '@/api/platform/serv/service'
import ActionUtils from '@/utils/action'
import { eventTypeOptions } from './constants'
import { handleServiceTest } from './utils'
import FixHeight from '@/mixins/height'
import Edit from './edit'
import EventList from './event/list'

export default {
  components: {
    Edit,
    EventList
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      formVisible: false,
      eventVisible: false,
      testVisible: false,
      editId: '0', // 编辑dialog需要使用
      serviceType: '',
      eventTypeOptions: eventTypeOptions,
      eventType: '',
      readonly: false, // 是否只读
      loading: false,
      randomNum: '',
      // 树配置
      treeOptions: { 'rootPId': '-1' },
      treeContextmenus: [
        { icon: 'add',
          label: '添加',
          value: 'add',
          rights: function(menu, data, isRoot) {
            if (isRoot || data.isDir === 'Y') return true
            return false
          }
        }, { icon: 'bug',
          label: '测试(参考值)',
          value: 'debug',
          rights: function(menu, data, isRoot) {
            if (isRoot || data.isDir === 'Y') return false
            return true
          }
        }, { icon: 'bug',
          label: '测试(手输参数)',
          value: 'debug2',
          rights: function(menu, data, isRoot) {
            if (isRoot || data.isDir === 'Y') return false
            return true
          }
        }, { icon: 'edit',
          label: '编辑',
          value: 'edit',
          rights: function(menu, data, isRoot) {
            if (isRoot) return false
            // if (data.id === '1' || data.id === '2') return false
            return true
          }
        }, { icon: 'delete',
          label: '删除',
          value: 'remove',
          rights: function(menu, data, isRoot) {
            if (isRoot) return false
            // if (data.id === '1' || data.id === '2') return false
            return true
          }
        },
        { type: 'divided',
          rights: function(menu, data, isRoot) {
            if (isRoot || data.isDir === 'Y') return false
            return true
          }
        },
        {
          icon: 'setting',
          label: '设置前置事件',
          value: 'settingBefore',
          rights: function(menu, data, isRoot) {
            if (isRoot || data.isDir === 'Y') return false
            return true
          }
        },
        {
          icon: 'setting',
          label: '设置后置事件',
          value: 'settingAfter',
          rights: function(menu, data, isRoot) {
            if (isRoot || data.isDir === 'Y') return false
            return true
          }
        }
      ],
      treeData: [],
      nodeData: {}
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    // 加载数据
    loadTreeData() {
      findTreeData().then(response => {
        const data = response.data
        this.treeData = data
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        if (command === 'add') { // 添加
          this.serviceType = data.type
          this.nodeData = data
          this.handTreeEdit()
        } else if (command === 'debug') { // 测试(参考值)
          this.handTreeTest(data)
        } else if (command === 'debug2') { // 测试（手输参数）
          this.handTreeTest2(data)
        } else if (command === 'edit') { // 编辑
          this.handleNodeClick(data, false)
        } else if (command === 'remove') {
          this.handleTreeRemove(data.id)
        } else if (command === 'settingBefore') {
          this.handSettingEvent(data, 'before')
        } else if (command === 'settingAfter') {
          this.handSettingEvent(data, 'after')
        }
      }
    },
    handleNodeClick(data, readonly = true) {
      if (data.id === '0') {
        this.formVisible = false
        this.eventVisible = false
        this.testVisible = false
        return
      }
      this.readonly = readonly
      this.nodeData = data
      this.editId = data.id
      this.formVisible = true
      this.eventVisible = false
      this.testVisible = false
      this.randomNum = '' + (Math.random() * 10000)
    },
    handleExpandCollapse(isExpand, readonly = false) {
      this.width = isExpand ? 200 : 50
    },
    handTreeEdit(editId, readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
      this.formVisible = true
      this.eventVisible = false
      this.testVisible = false
      this.randomNum = '' + (Math.random() * 10000)
    },
    handTreeTest(data) {
      this.loading = true
      handleServiceTest(data)
      this.loading = false
    },
    handTreeTest2(data, readonly = true) {
      this.readonly = readonly
      this.nodeData = data
      this.editId = data.id
      this.formVisible = true
      this.eventVisible = false
      this.testVisible = true
      this.randomNum = '' + (Math.random() * 10000)
    },
    handSettingEvent(data, eventType) {
      this.eventType = eventType
      this.nodeData = data
      this.editId = data.id || ''
      this.formVisible = false
      this.eventVisible = true
      this.testVisible = false
    },
    handleTreeRemove(ids) {
      ActionUtils.removeRecord(ids).then((ids) => {
      // 获取数据
        remove({ ids: ids }).then(response => {
          ActionUtils.removeSuccessMessage()
          this.loadTreeData()
          this.editId = ''
          this.formVisible = false
          this.eventVisible = false
          this.testVisible = false
        }).catch(() => {

        })
      })
    },
    callback(data) {
      this.loadTreeData()
    }
  }
}
</script>
