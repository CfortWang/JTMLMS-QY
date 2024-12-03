<template>
    <div>
        <el-button type="primary" @click="openDialog">查看班次详情</el-button>
        <el-dialog
            title="班次详情"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <div class="containerDiv">
                <div>
                    <strong class="label">班次名称：</strong>{{ banci.name }}
                </div>
                <div>
                    <strong class="label">班次别名：</strong>{{ banci.alias }}
                </div>
                <div>
                    <strong class="label">是否可用：</strong>{{ banci.isEnabled === 'Y'? '是' : '否' }}
                </div>
                <div>
                    <strong class="label">对应颜色：</strong>
                    <div :style="{ background: banci.color, height: '20px', width: '50px', display: 'inline-block' }"></div>
                </div>
                <div>
                    <strong class="label">时间段：</strong>
                    {{ (banci.dateRange && banci.dateRange.length > 0)?
                        ('当天'+ banci.dateRange[0].startTime+ '至' + (banci.dateRange[0].isSecondDay === 'Y'? '第二天' : '当天') + banci.dateRange[0].endTime )
                        : ''
                    }}
                </div>
                <div class="position-row">
                    <strong class="label">岗位：</strong>
                    <ul class="position-list">
                        <li class="el-tag el-tag--primary el-tag--small el-tag--light positionItem" v-for="(position, index) in banci.positions" :key="index">{{ position }}</li>
                    </ul>
                </div>
                <div>
                    <strong class="label">说明：</strong>{{ banci.desc }}
                </div>
            </div>
            <div slot="footer">
                <el-button @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            dialogVisible: this.visible,
            banci: this.banciInfo
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        // 接收外部传入的班次对象，方便复用组件展示不同班次对象
        banciInfo: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        banciInfo (newVal) {
            // 当外部传入的班次对象变化时，更新内部展示的数据
            this.banci = newVal
        },
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = val
            },
            immediate: true
        }
    },
    methods: {
        openDialog () {
            this.dialogVisible = true
        },
        closeDialog () {
            this.$emit('closeBanciDialog', 'banci')
        }
    }
}
</script>
<style lang="scss" scoped>
 .containerDiv {
      padding: 20px;
      div {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          min-height: 30px;
      }
     .label {
          min-width: 80px;
          margin-right: 10px;
      }
     .position-row {
          display: flex;
          align-items: center;
         .position-list {
              display: flex;
              list-style: none;
              padding-left: 0;
              li {
                  margin-right: 10px;
              }
          }
      }
  }
</style>
