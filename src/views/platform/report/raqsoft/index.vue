<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :loading="loading"
        :data="treeData"
        :options="treeOptions"
        :contextmenus="treeContextmenus"

        title="报表管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
      <ibps-container
        :margin-left="width+'px'"
        class="page"
      >
        <el-alert
          v-if="file===''"
          :closable="false"
          title="请选择左边报表进行操作！"
          type="warning"
          show-icon
          style="height:50px;"
        />
        <iframe
          v-else
          id="frameForm"
          ref="frameForm"
          :src="src"
          class="ibps-container-frame"
          frameborder="0"
        />
      </ibps-container>

      <el-dialog
        title="添加目录"
        :visible.sync="dialogVisible"
        :close-on-click-modal="clickModal"
        width="40%"
      >
        <el-form>
          <el-form-item label="目录名称:" prop="dirName">
            <el-input v-model="dirName" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDir">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 导入表单定义 -->
      <import-form
        :visible="uploadDialogVisible"
        :path="selectData.path"
        @callback="loadTreeData"
        @close="visible => uploadDialogVisible = false"
      />

    </div>
  </ibps-layout>
</template>
<script>
import axios from 'axios'
import utils from './utils'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
  components: {
    'import-form': () => import('./import')
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 230,
      height: document.clientHeight,
      id: '',
      title: '',
      // 树配置
      loading: false,
      dialogVisible: false,
      uploadDialogVisible: false,
      clickModal: false,
      treeOptions: { 'rootPId': '-1', showIcon: true },
      treeContextmenus: [
        { icon: 'add', label: '添加目录', value: 'addDir',
          rights: function(menu, data, isRoot) {
            return data.type === 'dir'
          }
        },
        {
          icon: 'remove', label: '删除目录', value: 'removeDir',
          rights: function(menu, data, isRoot) {
            return data.type === 'dir'
          }
        },
        {
          icon: 'add', label: '添加', value: 'add',
          rights: function(menu, data, isRoot) {
            return data.type === 'dir'
          }
        },
        { icon: 'remove', label: '删除', value: 'remove',
          rights: function(menu, data, isRoot) {
            return data.type === 'file'
          }
        }
      ],
      treeData: [],
      file: '',
      dirName: '',
      selectData: {}
    }
  },
  computed: {
    src() {
      return utils.reportUrl('/reportJsp/showReport.jsp?rpx=' + this.file)
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData() {
      this.loading = true
      const now = new Date().getTime()
      const url = utils.reportUrl('/display/tree?t=' + now)
      axios.get(url).then(response => {
        this.loading = false
        if (response.status === '200' || response.status === 200) {
          this.treeData = response.data
        } else {
          ActionUtils.error('请求报表资源错误！')
        }
      }).catch(err => {
        this.loading = false
        ActionUtils.error('请求报表资源错误！')
        console.error(err)
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        // const id = data.id
        switch (command) {
          // 组织负责人
          case 'add':// 添加
            this.uploadDialogVisible = true
            this.selectData = data
            break
          case 'addDir':// 添加目录
            this.handleAddDir(data)
            break
          case 'remove':// 删除
            this.handleRemove(data)
            break
          case 'removeDir':// 删除目录
            this.handleRemoveDir(data)
            break
          default:
            break
        }
      }
    },
    // 树点击
    handleNodeClick(data) {
      if (data.id === '0' || data.id === 0 || data.type === 'dir') {
        return
      } else {
        ActionUtils.warning('正在请求中，请稍候！')
        this.file = data.path
      }
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleAddDir(data) {
      this.dialogVisible = true
      this.selectData = data
      this.dirName = ''
    },
    handleRemove(data) {
      this.oprate(data.name, data.path, 'remove', true)
    },
    handleRemoveDir(data) {
      this.oprate(data.name, data.path, 'remove')
    },
    oprate(name, path, type, isClear = false) {
      this.loading = true
      const url = utils.reportUrl('/operate/file?name=' + name + '&operateType=' + type + '&reportPath=' + path)
      axios.get(url).then(response => {
        this.loading = false
        const data = response.data
        if ((response.status === 200 || response.status === '200') && this.$utils.isEmpty(data)) {
          ActionUtils.success('操作成功')
          this.loadTreeData()
          if (isClear) {
            this.file = ''
          }
        } else {
          ActionUtils.error(data.cause)
        }
      }).catch(error => {
        this.loading = false
        ActionUtils.error('操作请求错误！')
        console.error(error)
      })
    },
    saveDir() {
      if (this.$utils.isEmpty(this.dirName)) {
        ActionUtils.error('目录名称不能为空')
        return
      }
      if (this.dirName.length > 64) {
        ActionUtils.error('长度不能超过64')
        return
      }
      this.dialogVisible = false
      this.oprate(this.dirName, this.selectData.path, 'add')
      this.dirName = ''
      this.selectData = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>
