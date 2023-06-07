<template>
  <el-dialog
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    top="0"
    custom-class="tenant-admin-dialog is-fullscreen"
    width="80%"
    @close="closeDialog"
  >
    <el-tabs
      v-model="activeName"
      @tab-click="flush"
    >
      <el-tab-pane
        :label="this.$t('platform.saas.tenant.constants.title.pending')"
        name="pending"
      >
        <pending :id="id" ref="pending" />
      </el-tab-pane>
      <el-tab-pane
        :label="this.$t('platform.saas.tenant.constants.title.created')"
        name="created"
      >
        <created :id="id" ref="created" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>

import Created from './created'
import Pending from './pending'
export default {
  components: {
    Created,
    Pending
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String]
    },
    title: String
  },
  data() {
    return {
      activeName: 'pending',
      dialogVisible: this.visible
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    closeDialog() {
      this.$emit('close', false)
      this.activeName = 'pending'
    },
    flush(targetName) {
      if (targetName.name === 'pending') {
        this.$refs.pending.loadData()
      } else {
        this.$refs.created.loadData()
      }
    }
  }
}

</script>
